"use client";

import Navbar from "@/components/navbar";
import { useState, useEffect } from "react";
import { getAllSalonsData, getAllBookingsData, updateStatusAction, toggleFeaturedAction, changeSalonPasswordAction } from "./actions";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<"solicitacoes" | "agendamentos" | "senhas">("solicitacoes");
  const [salons, setSalons] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [password, setPassword] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [authError, setAuthError] = useState("");
  
  // Estados para alteração de senha
  const [selectedOwnerId, setSelectedOwnerId] = useState("");
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    const authorized = localStorage.getItem("servicos_pro_admin_authenticated") === "true";
    setIsAuthorized(authorized);
    if (authorized) {
      carregarDados();
    }
  }, []);

  const carregarDados = async () => {
    const resSalons = await getAllSalonsData();
    const resBookings = await getAllBookingsData();
    if (resSalons.success) setSalons(resSalons.data);
    if (resBookings.success) setBookings(resBookings.data);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "admin123") {
      localStorage.setItem("servicos_pro_admin_authenticated", "true");
      setIsAuthorized(true);
      setAuthError("");
      carregarDados();
    } else {
      setAuthError("Senha incorreta.");
    }
  };

  const handleStatus = async (id: string, status: string) => {
    const res = await updateStatusAction(id, status);
    if (res.success) carregarDados();
  };

  const handleToggleFeatured = async (id: string, current: boolean) => {
    const res = await toggleFeaturedAction(id, current);
    if (res.success) carregarDados();
  };

  const handlePasswordChangeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOwnerId || !newPassword) return alert("Selecione o usuário e digite a nova senha.");
    const res = await changeSalonPasswordAction(selectedOwnerId, newPassword);
    if (res.success) {
      alert("Senha alterada com sucesso!");
      setNewPassword("");
      setSelectedOwnerId("");
    } else {
      alert("Erro ao alterar senha.");
    }
  };

  return (
    <main className="bg-black min-h-screen text-white">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 pt-32 pb-20">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-black tracking-tighter">Gestão Avançada</h1>
            <p className="text-gray-400">Controle total da plataforma ServiçosPro.</p>
          </div>
        </div>

        {!isAuthorized ? (
          <div className="glass border border-white/10 rounded-[3rem] p-10 max-w-xl mx-auto bg-white/5">
            <h2 className="text-2xl font-black mb-4">Acesso Restrito</h2>
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Senha mestre do admin" className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl outline-none" />
              {authError && <p className="text-red-500 text-sm">{authError}</p>}
              <button type="submit" className="w-full py-4 bg-blue-600 font-bold rounded-2xl">Entrar</button>
            </form>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Menu de Abas */}
            <div className="flex gap-4 border-b border-white/10 pb-2">
              <button onClick={() => setActiveTab("solicitacoes")} className={`pb-2 px-4 font-bold transition-all ${activeTab === "solicitacoes" ? "text-blue-400 border-b-2 border-blue-400" : "text-gray-400"}`}>Solicitações & Destaques</button>
              <button onClick={() => setActiveTab("agendamentos")} className={`pb-2 px-4 font-bold transition-all ${activeTab === "agendamentos" ? "text-blue-400 border-b-2 border-blue-400" : "text-gray-400"}`}>Agendamentos de Clientes</button>
              <button onClick={() => setActiveTab("senhas")} className={`pb-2 px-4 font-bold transition-all ${activeTab === "senhas" ? "text-blue-400 border-b-2 border-blue-400" : "text-gray-400"}`}>Alterar Senhas</button>
            </div>

            {/* ABA 1: SOLICITAÇÕES E DESTAQUE NA PÁGINA PRINCIPAL */}
            {activeTab === "solicitacoes" && (
              <div className="grid grid-cols-1 gap-4">
                {salons.map((salon) => (
                  <div key={salon.id} className="border border-white/10 bg-white/5 rounded-2xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                      <h3 className="text-xl font-bold">{salon.name} <span className="text-xs text-gray-500">({salon.status})</span></h3>
                      <p className="text-sm text-gray-400">{salon.category} • {salon.city}</p>
                      <p className="text-xs text-blue-400 mt-1">Dono: {salon.owner?.name} ({salon.owner?.email})</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleToggleFeatured(salon.id, salon.featured || false)} className={`px-4 py-2 text-xs font-bold rounded-xl border transition-all ${salon.featured ? "bg-amber-500 text-black border-amber-500" : "border-white/10 text-gray-400"}`}>
                        {salon.featured ? "⭐ Destacado na Home" : "Colocar na Home"}
                      </button>
                      {salon.status === "PENDING" && (
                        <>
                          <button onClick={() => handleStatus(salon.id, "REJECTED")} className="px-4 py-2 bg-red-500/10 text-red-400 rounded-xl text-xs font-bold">Recusar</button>
                          <button onClick={() => handleStatus(salon.id, "APPROVED")} className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold">Aprovar</button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ABA 2: AGENDAMENTOS DOS CLIENTES */}
            {activeTab === "agendamentos" && (
              <div className="grid grid-cols-1 gap-4">
                {bookings.length === 0 ? (
                  <p className="text-gray-500 p-4">Nenhum agendamento realizado no sistema ainda.</p>
                ) : (
                  bookings.map((b) => (
                    <div key={b.id} className="border border-white/10 bg-white/5 rounded-2xl p-4 flex justify-between items-center">
                      <div>
                        <p className="font-bold text-white">Cliente: {b.client?.name || "Visitante"}</p>
                        <p className="text-sm text-gray-400">Salão: {b.salon?.name} • Serviço: {b.service?.name}</p>
                      </div>
                      <div className="text-right">
                        <span className="px-3 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-bold rounded-full">
                          {new Date(b.dateTime).toLocaleDateString("pt-BR")} às {new Date(b.dateTime).toLocaleTimeString("pt-BR", {hour: '2-digit', minute:'2-digit'})}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* ABA 3: ALTERAR SENHA DE PROFISSIONAIS */}
            {activeTab === "senhas" && (
              <div className="glass border border-white/10 rounded-2xl p-6 bg-white/5 max-w-xl">
                <h3 className="text-lg font-bold mb-4">Mudar Senha de Estabelecimento</h3>
                <form onSubmit={handlePasswordChangeSubmit} className="space-y-4">
                  <select value={selectedOwnerId} onChange={(e) => setSelectedOwnerId(e.target.value)} className="w-full p-4 bg-black border border-white/10 rounded-xl text-white outline-none">
                    <option value="">Selecione o profissional/salão...</option>
                    {salons.map((s) => (
                      <option key={s.id} value={s.owner?.id}>{s.name} ({s.owner?.email})</option>
                    ))}
                  </select>
                  <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Digite a nova senha para este usuário" className="w-full p-4 bg-white/5 border border-white/10 rounded-xl outline-none" />
                  <button type="submit" className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all">Atualizar Senha no Banco 🚀</button>
                </form>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
