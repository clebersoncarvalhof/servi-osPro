"use client";

import { useState } from "react";
import Navbar from "@/components/navbar";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getSalonByEmail, getUserByEmail } from "@/lib/storage";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    const salon = getSalonByEmail(email);
    if (salon) {
      if (password !== salon.password) {
        setError("E-mail ou senha do salão incorretos.");
        return;
      }

      localStorage.setItem("servicos_pro_logged_in", "true");
      localStorage.setItem("servicos_pro_current_salon_id", salon.id);
      localStorage.setItem("servicos_pro_current_user_type", "salon");
      router.push("/dashboard/profissional");
      return;
    }

    const user = getUserByEmail(email);
    if (user) {
      if (password !== user.password) {
        setError("E-mail ou senha do cliente incorretos.");
        return;
      }

      localStorage.setItem("servicos_pro_logged_in", "true");
      localStorage.removeItem("servicos_pro_current_salon_id");
      localStorage.setItem("servicos_pro_current_user_type", "client");
      localStorage.setItem("servicos_pro_current_client_id", user.id);
      router.push("/dashboard/cliente");
      return;
    }

    setError("Nenhuma conta encontrada para este e-mail.");
  };

  return (
    <main className="bg-black min-h-screen text-white">
      <Navbar />
      
      <div className="relative pt-40 pb-20 px-4">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-96 bg-primary/10 blur-[150px] -z-10" />
        
        <div className="max-w-md mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-black mb-4 tracking-tighter">Entrar na Conta</h1>
            <p className="text-gray-400">Acesse sua conta de cliente ou salão.</p>
          </div>

          <div className="glass border border-white/10 rounded-[2.5rem] p-8 md:p-10">
             <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-400 ml-1">E-mail</label>
                  <input 
                    required
                    type="email" 
                    placeholder="exemplo@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl focus:border-primary outline-none transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center px-1">
                    <label className="text-sm font-bold text-gray-400">Senha</label>
                    <Link href="#" className="text-xs text-primary hover:underline">Esqueceu a senha?</Link>
                  </div>
                  <input 
                    required
                    type="password" 
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl focus:border-primary outline-none transition-all"
                  />
                </div>

                {error && <p className="text-red-500 text-sm text-center font-medium">{error}</p>}

                <button 
                  type="submit"
                  className="w-full py-5 premium-gradient text-white font-black rounded-2xl shadow-[0_10px_30px_rgba(168,85,247,0.3)] hover:scale-[1.02] transition-all text-lg"
                >
                  Entrar Agora
                </button>
             </form>

             <div className="mt-8 pt-8 border-t border-white/5 text-center">
                <p className="text-gray-500">
                  Não tem uma conta? <br />
                  <Link href="/cadastro" className="text-primary font-bold hover:underline">Cadastre-se como Profissional</Link>
                  <br />
                  <Link href="/cliente/cadastro" className="text-primary font-bold hover:underline">Cadastre-se como Cliente</Link>
                </p>
             </div>
          </div>
        </div>
      </div>
    </main>
  );
}
