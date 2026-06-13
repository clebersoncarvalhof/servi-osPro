"use client";

import Navbar from "@/components/navbar";
import { useState, useEffect } from "react";
import { getPendingSalons, updateStatusAction } from "./actions";

interface Salon {
  id: string;
  name: string;
  category: string;
  city: string;
  address: string;
  businessHours: string | null;
  status: string;
  createdAt: Date;
  owner: {
    name: string | null;
    email: string;
  };
  services: Array<{ name: string }>;
}

export default function AdminPage() {
  const [salons, setSalons] = useState<Salon[]>([]);
  const [password, setPassword] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [authError, setAuthError] = useState("");
  const [loadingId, setLoadingId] = useState<string | null>(null); // ✨ Estado para mostrar carregamento visual

  useEffect(() => {
    const authorized = localStorage.getItem("servicos_pro_admin_authenticated") === "true";
    setIsAuthorized(authorized);
    if (authorized) {
      carregarDadosDoBanco();
    }
  }, []);

  const carregarDadosDoBanco = async () => {
    const response = await getPendingSalons();
    if (response.success) {
      setSalons(response.data as any);
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "admin123") {
      localStorage.setItem("servicos_pro_admin_authenticated", "true");
      setIsAuthorized(true);
      setAuthError("");
      carregarDadosDoBanco();
    } else {
      setAuthError("Senha incorreta. Tente novamente.");
    }
  };

  // ✨ FUNÇÃO ATIVA: Atualiza o banco de dados em tempo real e remove da tela
  const handleUpdateStatus = async (id: string, status: "APPROVED" | "REJECTED") => {
    if (status === "REJECTED" && !confirm("Deseja realmente recusar esta solicitação?")) return;
    
    setLoadingId(id); // Ativa animação de carregando no salão clicado
    const result = await updateStatusAction(id, status);
    setLoadingId(null);

    if (result.success) {
      // Remove o salão da lista visual na hora
      setSalons((current) => current.filter((s) => s.id !== id));
      alert(`Estabelecimento ${status === "APPROVED" ? "aprovado" : "recusado"} com sucesso!`);
    } else {
      alert("Não foi possível atualizar o status no banco de dados. Tente novamente.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("servicos_pro_admin_authenticated");
    setIsAuthorized(false);
    setPassword("");
  };

  return (
    <main className="bg-black min-h-screen text-white">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 pt-32 pb-20">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
          <div>
            <h1 className="text-4xl font-black tracking-tighter">Gestão da Plataforma</h1>
            <p className="text-gray-400">Administre todos os estabelecimentos cadastrados no <strong>ServiçosPro</strong>.</p>
          </div>
          <div className="bg-blue-500/10 border border-blue-500/20 px-6 py-3 rounded-2xl text-blue-400 font-bold">
             Painel do Administrador
          </div>
        </div>

        {!isAuthorized ? (
          <div className="glass border border-white/10 rounded-[3rem] p-10 max-w-xl mx-auto bg-white/5 backdrop-blur-md">
            <h2 className="text-2xl font-black mb-6">Acesso Restrito</h2>
            <p className="text-gray-400 mb-6">Digite a senha de administrador para gerenciar salões.</p>
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Senha do administrador"
                className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl focus:border-blue-500 outline-none text-white transition-all"
              />
              {authError && <p className="text-red-500 text-sm">{authError}</p>}
              <button type="submit" className="w-full py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all">
                Entrar
              </button>
            </form>
          </div>
        ) : (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
              <h2 className="text-2xl font-bold">Solicitações Recentes ({salons.length})</h2>
              <button onClick={handleLogout} className="px-4 py-2 bg-white/10 hover:bg-white/20 text-sm font-bold rounded-xl transition-all">
                Sair do Painel
              </button>
            </div>

            {salons.length === 0 ? (
              <div className="border border-white/10 rounded-[2rem] p-12 text-center bg-white/5">
                <span className="text-4xl block mb-4">✨</span>
                <h3 className="text-xl font-bold text-gray-300">Tudo limpo por aqui!</h3>
                <p className="text-gray-500 mt-1">Nenhum salão aguardando aprovação no momento.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {salons.map((salon) => (
                  <div key={salon.id} className={`border border-white/10 bg-white/5 rounded-[2rem] p-6 flex flex-col md:flex-row justify-between gap-6 items-start md:items-center transition-all ${loadingId === salon.id ? "opacity-50 pointer-events-none" : ""}`}>
                    <div className="space-y-2 flex-1">
                      <h3 className="text-2xl font-black text-white">{salon.name}</h3>
                      <p className="text-sm text-gray-400">{salon.category} • {salon.city}</p>
                      <p className="text-xs text-gray-500">{salon.address}</p>
                      <div className="pt-2 border-t border-white/5 text-sm text-gray-400 space-y-1">
                        <p><strong>Dono:</strong> {salon.owner?.name || "Não informado"} ({salon.owner?.email})</p>
                        <p><strong>Horários:</strong> {salon.businessHours || "Não informado"}</p>
                        <p><strong>Serviços:</strong> {salon.services?.map(s => s.name).join(", ") || "Nenhum serviço cadastrado"}</p>
                      </div>
                    </div>
                    <div className="flex gap-3 w-full md:w-auto">
                      <button 
                        type="button"
                        disabled={loadingId === salon.id}
                        onClick={() => handleUpdateStatus(salon.id, "REJECTED")}
                        className="px-4 py-2 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-xl border border-red-500/20 transition-all font-bold text-sm disabled:opacity-50"
                      >
                        Recusar
                      </button>
                      <button 
                        type="button"
                        disabled={loadingId === salon.id}
                        onClick={() => handleUpdateStatus(salon.id, "APPROVED")}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-all font-bold text-sm disabled:opacity-50"
                      >
                        {loadingId === salon.id ? "Processando..." : "Aprovar"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
