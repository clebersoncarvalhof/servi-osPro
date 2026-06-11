"use client";

import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center pt-20 overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px]" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <div>
          <span className="inline-block px-4 py-1.5 mb-6 text-sm font-semibold tracking-wider text-primary uppercase bg-primary/10 border border-primary/20 rounded-full">
            Agendamento simples e rápido
          </span>
          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 tracking-tight leading-[1.1]">
            O seu próximo estilo está aqui!
          </h1>
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Encontre os melhores salões da sua cidade, conheça os serviços e agende seu horário em poucos segundos.
          </p>
        </div>

        <div className="mt-8 flex flex-col md:flex-row items-center justify-center gap-4">
          <Link href="/anunciar" className="inline-flex items-center justify-center px-8 py-4 bg-white text-black font-bold rounded-2xl hover:bg-gray-200 transition-all shadow-xl">
            Sou Profissional
          </Link>
          <Link href="/admin" className="inline-flex items-center justify-center px-8 py-4 border border-white/10 text-white font-bold rounded-2xl hover:bg-white/10 transition-all shadow-xl">
            Gerenciar Salões
          </Link>
        </div>
        <div className="mt-4 text-sm text-white/60">
          Exclua ou gerencie salões cadastrados diretamente pelo painel de administração.
        </div>
        
        <div className="mt-16 flex items-center justify-center gap-8 text-white/50 font-medium overflow-x-auto">
          <span>Cabeleireiros</span>
          <span>Barbeiros</span>
          <span>Manicures</span>
          <span>Estética</span>
        </div>
      </div>
    </section>
  );
}
