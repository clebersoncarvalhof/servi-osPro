"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";

interface Salon {
  id: string;
  name: string;
  images: string | null;
  description: string | null;
  city: string;
  address: string;
}

interface CarrosselProps {
  saloes: Salon[];
  imagemPadrao: string;
}

export default function CarrosselDestaque({ saloes, imagemPadrao }: CarrosselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Efeito que faz o carrossel rodar sozinho a cada 4 segundos
  useEffect(() => {
    if (saloes.length <= 1) return;

    const interval = setInterval(() => {
      setActiveIndex((current) => {
        const nextIndex = current === saloes.length - 1 ? 0 : current + 1;
        
        // Faz a rolagem suave na tela para o próximo card
        if (containerRef.current) {
          const cardWidth = containerRef.current.offsetWidth;
          containerRef.current.scrollTo({
            left: nextIndex * cardWidth,
            behavior: "smooth",
          });
        }
        
        return nextIndex;
      });
    }, 4000); // 4000ms = 4 segundos

    return () => clearInterval(interval);
  }, [saloes.length]);

  return (
    <div className="relative w-full">
      {/* Container de Rolagem */}
      <div 
        ref={containerRef}
        className="flex w-full overflow-x-auto snap-x snap-mandatory pb-4 scrollbar-none gap-6 px-[5%] md:px-[15%]"
        onScroll={(e) => {
          // Atualiza o índice se o usuário arrastar manualmente
          const container = e.currentTarget;
          const index = Math.round(container.scrollLeft / container.offsetWidth);
          setActiveIndex(index);
        }}
      >
        {saloes.map((salao) => {
          const fotoCapa = salao.images && salao.images.startsWith("http") ? salao.images : imagemPadrao;
          return (
            <div key={salao.id} className="w-full min-w-full max-w-4xl snap-center">
              <div className="relative group overflow-hidden rounded-2xl bg-[#09090b] border border-zinc-900/60 min-h-[300px] md:min-h-[380px] flex flex-col md:flex-row items-stretch shadow-2xl transition-all duration-500 hover:border-zinc-800">
                
                {/* Imagem Editorial */}
                <div className="relative w-full md:w-7/12 h-48 md:h-auto overflow-hidden bg-zinc-950 shrink-0">
                  <img 
                    src={fotoCapa} 
                    alt={salao.name} 
                    className="w-full h-full object-cover filter brightness-[0.85] transition-all duration-700 group-hover:scale-102"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-transparent via-[#09090b]/80 to-[#09090b]" />
                </div>

                {/* Textos e Ação */}
                <div className="p-6 md:p-8 flex flex-col justify-between flex-1 relative z-10 bg-[#09090b]">
                  <div className="space-y-4">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest bg-purple-500/10 text-purple-400 border border-purple-500/20">
                      Atelier Selected
                    </span>
                    <h3 className="text-xl md:text-3xl font-light uppercase tracking-wide text-white font-sans leading-tight truncate">
                      {salao.name}
                    </h3>
                    <p className="text-xs text-zinc-500 font-light leading-relaxed max-w-md line-clamp-3">
                      {salao.description || "Espaço conceito projetado para oferecer o mais alto padrão em serviços de bem-estar, estética."}
                    </p>
                    <div className="flex items-center gap-1.5 text-[11px] text-zinc-400 font-medium tracking-wide pt-2">
                      <MapPin className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                      <span className="truncate"><strong className="text-zinc-300">{salao.city}</strong> — {salao.address}</span>
                    </div>
                  </div>

                  <div className="pt-6 md:pt-0 border-t border-zinc-900/60 md:border-transparent">
                    <Link 
                      href={`/salon/${salao.id}`} 
                      className="inline-flex items-center gap-2 bg-white text-black text-[11px] font-black uppercase tracking-widest px-5 py-2.5 rounded-full hover:bg-purple-500 hover:text-white transition-all duration-300 shadow-xl"
                    >
                      <span>Agendar</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>

              </div>
            </div>
          );
        })}
      </div>

      {/* Indicadores Visuais (Bolinhas) embaixo do carrossel */}
      {saloes.length > 1 && (
        <div className="flex justify-center gap-2 mt-2">
          {saloes.map((_, idx) => (
            <div 
              key={idx} 
              className={`h-1 rounded-full transition-all duration-300 ${idx === activeIndex ? "w-4 bg-purple-500" : "w-1 bg-zinc-800"}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
