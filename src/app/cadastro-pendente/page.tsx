"use client";

import Navbar from "@/components/navbar";
import Link from "next/link";

export default function PendingRegistrationPage() {
  return (
    <main className="bg-black min-h-screen text-white">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 pt-40 pb-20 text-center">
        <div className="w-24 h-24 bg-blue-500/20 text-blue-500 rounded-full flex items-center justify-center text-5xl mx-auto mb-8">
          📋
        </div>
        <h1 className="text-4xl md:text-6xl font-black mb-6">Cadastro Enviado! 🎉</h1>
        <p className="text-xl text-gray-400 mb-4">
          Seu cadastro foi enviado com sucesso para aprovação.
        </p>
        <p className="text-gray-500 mb-12">
          Um administrador analisará seu pedido em breve. Você será notificado assim que houver uma resposta.
        </p>
        <Link href="/" className="px-8 py-4 bg-primary text-black font-black rounded-2xl hover:opacity-90 transition-all inline-block">
          Voltar ao Início
        </Link>
      </div>
    </main>
  );
}
