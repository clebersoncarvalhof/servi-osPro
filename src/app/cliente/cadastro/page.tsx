"use client";

import { useState } from "react";
import Navbar from "@/components/navbar";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { saveUser } from "@/lib/storage";

export default function ClientRegister() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [error, setError] = useState("");
  const router = useRouter();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.password) {
      setError("Preencha nome, e-mail e senha para continuar.");
      return;
    }

    const newUser = {
      id: Date.now().toString(),
      name: formData.name,
      email: formData.email,
      password: formData.password,
      phone: formData.phone,
    };

    saveUser(newUser);
    localStorage.setItem("servicos_pro_logged_in", "true");
    localStorage.setItem("servicos_pro_current_user_type", "client");
    localStorage.setItem("servicos_pro_current_client_id", newUser.id);
    router.push("/dashboard/cliente");
  };

  return (
    <main className="bg-black min-h-screen text-white">
      <Navbar />
      <div className="relative pt-40 pb-20 px-4">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-96 bg-primary/10 blur-[150px] -z-10" />
        <div className="max-w-md mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-black mb-4 tracking-tighter">Cadastro de Cliente</h1>
            <p className="text-gray-400">Crie sua conta para agendar facilmente em qualquer salão.</p>
          </div>
          <div className="glass border border-white/10 rounded-[2.5rem] p-8 md:p-10">
            <form onSubmit={handleRegister} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-400 ml-1">Nome Completo</label>
                <input
                  required
                  type="text"
                  placeholder="Seu nome"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl focus:border-primary outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-400 ml-1">E-mail</label>
                <input
                  required
                  type="email"
                  placeholder="exemplo@gmail.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl focus:border-primary outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-400 ml-1">WhatsApp</label>
                <input
                  type="tel"
                  placeholder="(00) 00000-0000"
                  value={formatPhoneNumber(formData.phone)}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl focus:border-primary outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-400 ml-1">Senha</label>
                <input
                  required
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl focus:border-primary outline-none transition-all"
                />
              </div>
              {error && <p className="text-red-500 text-sm text-center">{error}</p>}
              <button type="submit" className="w-full py-5 premium-gradient text-white font-black rounded-2xl shadow-[0_10px_30px_rgba(168,85,247,0.3)] hover:scale-[1.02] transition-all text-lg">
                Criar Conta de Cliente
              </button>
            </form>
            <div className="mt-8 pt-8 border-t border-white/5 text-center">
              <p className="text-gray-500">
                Já tem conta? <Link href="/login" className="text-primary font-bold hover:underline">Entrar</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
