"use client";

import { useState } from "react";
import { CheckCircle2, ShoppingBag, Clock } from "lucide-react";

interface Service {
  id: string;
  name: string;
  price: number;
  duration: number;
}

interface ListaServicosProps {
  services: Service[];
}

export default function ListaServicos({ services }: ListaServicosProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Liga e desliga a seleção do serviço no clique
  const toggleService = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Filtra os serviços que o usuário escolheu
  const servicosSelecionados = services.filter((s) => selectedIds.includes(s.id));

  // Calcula os totais em tempo real
  const precoTotal = servicosSelecionados.reduce((acc, curr) => acc + curr.price, 0);
  const duracaoTotal = servicosSelecionados.reduce((acc, curr) => acc + curr.duration, 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* LISTAGEM DE SERVIÇOS */}
      <div className="md:col-span-2 bg-card border border-border p-6 rounded-2xl shadow-sm space-y-4">
        <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-primary" /> Serviços Disponíveis
        </h2>
        <p className="text-xs text-muted-foreground -mt-2">Você pode selecionar quantos serviços desejar para o seu agendamento.</p>
        
        <div className="divide-y divide-border/60">
          {services.map((servico) => {
            const isSelected = selectedIds.includes(servico.id);
            return (
              <div 
                key={servico.id} 
                onClick={() => toggleService(servico.id)}
                className={`py-4 flex items-center justify-between cursor-pointer px-3 rounded-xl transition-all border my-1 first:pt-4 ${
                  isSelected 
                    ? "bg-primary/5 border-primary" 
                    : "border-transparent hover:bg-muted/40"
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      checked={isSelected}
                      readOnly
                      className="w-4 h-4 rounded text-primary border-border focus:ring-primary bg-input"
                    />
                    <h3 className="font-bold text-base">{servico.name}</h3>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 ml-6">⏱️ Duração: {servico.duration} min</p>
                </div>
                <div className="text-right">
                  <span className="font-bold text-foreground text-base">
                    {servico.price === 0 ? "A combinar" : `R$ ${servico.price.toFixed(2)}`}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* RESUMO DO AGENDAMENTO (CARRINHO FLUTUANTE) */}
      <div className="space-y-4">
        <div className="bg-card border border-border p-6 rounded-2xl shadow-sm space-y-4 sticky top-20">
          <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 border-b border-border pb-2">
            <ShoppingBag className="w-4 h-4" /> Resumo do Agendamento
          </h3>

          {selectedIds.length === 0 ? (
            <p className="text-xs text-muted-foreground italic leading-relaxed py-4 text-center">
              Nenhum serviço selecionado ainda. Clique nos serviços ao lado para montar seu pacote.
            </p>
          ) : (
            <div className="space-y-4 animate-in fade-in-50 duration-200">
              {/* Itens escolhidos resumidos */}
              <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                {servicosSelecionados.map((s) => (
                  <div key={s.id} className="flex justify-between items-center text-xs text-foreground">
                    <span className="line-clamp-1">✓ {s.name}</span>
                    <span className="font-medium text-muted-foreground">R$ {s.price.toFixed(2)}</span>
                  </div>
                ))}
              </div>

              {/* Indicadores de Tempo e Valor Somados */}
              <div className="pt-3 border-t border-border space-y-2">
                <div className="flex justify-between items-center text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> Tempo estimado:</span>
                  <span className="font-bold text-foreground">{duracaoTotal} minutos</span>
                </div>
                <div className="flex justify-between items-center text-sm border-t border-border/40 pt-2">
                  <span className="font-bold">Valor Total:</span>
                  <span className="font-black text-primary text-xl">R$ {precoTotal.toFixed(2)}</span>
                </div>
              </div>

              <button 
                onClick={() => alert(`Avançando para escolher data/hora dos ${selectedIds.length} serviços!`)}
                className="w-full bg-primary text-primary-foreground text-sm font-bold py-3 px-4 rounded-xl hover:opacity-90 active:scale-[0.98] transition-all"
              >
                Prosseguir para Horários
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
