"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ResetAdminPage() {
  const [resetCode, setResetCode] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const RESET_CODE = "reset2026"; // Código de segurança simples

  const handleReset = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (resetCode !== RESET_CODE) {
      setError("Código de reset inválido.");
      setMessage("");
      return;
    }

    if (typeof window !== "undefined") {
      localStorage.removeItem("servicos_pro_admin_password");
      localStorage.removeItem("servicos_pro_admin_authenticated");
    }

    setError("");
    setMessage("✅ Senha resetada com sucesso! A senha padrão agora é: servicospro");
    setResetCode("");

    setTimeout(() => {
      router.push("/admin");
    }, 2000);
  };

  return (
    <main className="bg-black min-h-screen flex items-center justify-center px-4">
      <div className="glass border border-white/10 rounded-[2.5rem] p-8 max-w-md w-full">
        <h1 className="text-3xl font-black text-white mb-2 tracking-tighter">Reset de Senha</h1>
        <p className="text-gray-400 mb-8">Redefina a senha do administrador para a padrão.</p>

        <form onSubmit={handleReset} className="space-y-4">
          <div>
            <label className="text-sm font-bold text-gray-400 ml-1 block mb-2">Código de Reset</label>
            <input
              type="password"
              value={resetCode}
              onChange={(e) => setResetCode(e.target.value)}
              placeholder="Digite o código de segurança"
              className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl focus:border-primary outline-none text-white transition-all"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}
          {message && <p className="text-green-500 text-sm">{message}</p>}

          <button
            type="submit"
            className="w-full py-4 bg-primary text-black font-bold rounded-2xl hover:opacity-90 transition-all"
          >
            Resetar Senha
          </button>
        </form>

        <p className="text-xs text-gray-500 mt-6 text-center">
          Contato para código: Entre em contato com o suporte.
        </p>
      </div>
    </main>
  );
}
