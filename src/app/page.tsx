"use client";

import { useState, useRef, useEffect } from "react";
import Navbar from "@/components/navbar";
import Hero from "@/components/hero";
import { CATEGORIES } from "@/lib/mock-data";
import { getSalons, Salon } from "@/lib/storage";
import Link from "next/link";

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [salons, setSalons] = useState<Salon[]>([]);
  const salonSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSalons(getSalons());
  }, []);

  const filteredSalons = selectedCategory 
    ? salons.filter(s => s.category.toLowerCase() === selectedCategory.toLowerCase())
    : salons.filter((s) => s.featured).slice(0, 5);

  const handleCategoryClick = (categoryName: string) => {
    if (selectedCategory === categoryName) {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(categoryName);
      salonSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <main className="relative bg-black min-h-screen">
      <Navbar />
      <Hero />
      
      {/* Categories Section */}
      <section id="categorias" className="py-20 relative overflow-hidden scroll-mt-24">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-primary/5 blur-[150px] -z-10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
           <h2 className="text-3xl md:text-5xl font-black mb-12 tracking-tighter">Explore por Categoria</h2>
           <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
              {CATEGORIES.map((cat) => (
                <button 
                  key={cat.id} 
                  onClick={() => handleCategoryClick(cat.name)}
                  className={`p-8 md:p-10 glass border rounded-[2.5rem] hover:scale-105 transition-all duration-300 group flex flex-col items-center justify-center gap-4 ${
                    selectedCategory === cat.name ? "border-primary bg-primary/10 shadow-[0_0_40px_rgba(168,85,247,0.3)] scale-105" : "border-white/10 hover:border-primary/40"
                  }`}
                >
                  <div className="text-4xl md:text-5xl group-hover:scale-110 transition-transform duration-500">{cat.icon}</div>
                  <div className={`font-bold tracking-tight text-lg ${selectedCategory === cat.name ? "text-primary font-black" : "text-white"}`}>
                    {cat.name}
                  </div>
                </button>
              ))}
           </div>
        </div>
      </section>

      {/* Salon Section */}
      <section ref={salonSectionRef} className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
               <div className="w-8 h-1 bg-primary rounded-full" />
               <span className="text-primary font-bold uppercase tracking-widest text-xs">Estabelecimentos</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter">
              {selectedCategory ? `Salões de ${selectedCategory}` : "Salões em Destaque"}
            </h2>
          </div>
          {selectedCategory && (
            <button 
              onClick={() => setSelectedCategory(null)}
              className="px-8 py-4 glass border border-white/10 text-white font-bold rounded-2xl hover:bg-white/10 transition-all flex items-center gap-2"
            >
              <span>✕</span> Limpar Filtro
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredSalons.map((salon) => (
            <div 
              key={salon.id} 
              className="group relative glass border border-white/5 rounded-[3rem] overflow-hidden hover:border-primary/50 transition-all duration-500 bg-white/[0.02]"
            >
              <div className="h-72 bg-gray-900 relative overflow-hidden">
                 <div className="absolute top-6 left-6 z-10 bg-black/60 backdrop-blur-xl px-4 py-1.5 rounded-full text-xs font-black text-white border border-white/10 flex items-center gap-2">
                   <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                   {salon.status}
                 </div>
                 <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80 z-0" />
                 
                 {(salon.imageUrls?.[0] || salon.imageUrl) ? (
                   <img 
                    src={salon.imageUrls?.[0] || salon.imageUrl} 
                    alt={salon.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                   />
                 ) : (
                   <div className="absolute inset-0 flex items-center justify-center text-white/5 font-black text-8xl group-hover:scale-110 transition-transform duration-700">
                     {salon.name[0]}
                   </div>
                 )}
              </div>
              <div className="p-10">
                <div className="flex items-center justify-between mb-6">
                  <span className="px-3 py-1 bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest rounded-lg">
                    {salon.category}
                  </span>
                  <div className="flex items-center gap-1.5 text-yellow-500 text-sm font-black">
                    ★ <span className="text-white font-bold text-lg">{salon.rating}</span>
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-white mb-3 group-hover:text-primary transition-colors tracking-tight">
                  {salon.name}
                </h3>
                <p className="text-gray-500 text-sm mb-8 flex items-center gap-2 text-lg">
                   📍 {salon.address} - {salon.city}
                </p>
                <Link 
                  href={`/salon/${salon.id}`}
                  className="w-full py-5 bg-white text-black font-black rounded-2xl hover:bg-gray-200 transition-all flex items-center justify-center text-lg shadow-xl"
                >
                  Ver Serviços
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer className="py-24 border-t border-white/5 bg-black">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-12">
           <div className="text-center md:text-left">
              <div className="mb-4 font-black text-3xl tracking-tighter text-white">
                Serviços<span className="text-primary">Pro</span>
              </div>
              <p className="text-gray-500 max-w-xs">A plataforma oficial de beleza e bem-estar da sua cidade.</p>
           </div>
           <div className="flex flex-wrap justify-center gap-10 font-bold text-gray-400">
              <a href="#" className="hover:text-white transition-colors">Instagram</a>
              <a href="#" className="hover:text-white transition-colors">WhatsApp</a>
              <a href="#" className="hover:text-white transition-colors">Termos</a>
              <a href="#" className="hover:text-white transition-colors">Contato</a>
           </div>
        </div>
        <div className="mt-20 text-center text-xs text-gray-600 border-t border-white/5 pt-10">
           © 2026 ServiçosPro. Todos os direitos reservados.
        </div>
      </footer>
    </main>
  );
}
