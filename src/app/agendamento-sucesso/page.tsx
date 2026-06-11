"use client";

import Navbar from "@/components/navbar";
import Link from "next/link";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function BookingSuccess() {
  // Hook do Next.js para pegar os dados reais vindos da URL
  const searchParams = useSearchParams();

  // Captura cada informação ou define um valor padrão caso não exista
  const nomeCliente = searchParams.get("nome") || "Cliente";
  const telefoneCliente = searchParams.get("telefone") || "11999999999";
  const servico = searchParams.get("servico") || "Serviço Selecionado";
  const dataHora = searchParams.get("dataHora") || "Horário Agendado";
  const local = searchParams.get("local") || "Studio D´Luxo";
  const protocolo = searchParams.get("protocolo") || "#PRO-" + Math.floor(100000 + Math.random() * 900000);

  useEffect(() => {
    // Só dispara se houver dados reais na URL para não abrir em acessos diretos inválidos
    if (!searchParams.get("nome")) return;

    const telefoneLimpo = telefoneCliente.replace(/\D/g, "");

    const mensagemTexto = 'Olá, *' + nomeCliente + '*!\n\n' +
                          'Seu agendamento no *' + local + '* foi realizado com sucesso! 🎉\n\n' +
                          '📌 *Serviço:* ' + servico + '\n' +
                          '📅 *Data e Hora:* ' + dataHora + '\n' +
                          '🆔 *Protocolo:* ' + protocolo + '\n\n' +
                          'Te esperamos lá! 💈';

    const textoMensagem = encodeURIComponent(mensagemTexto);
    const url = 'https://whatsapp.com' + telefoneLimpo + '&text=' + textoMensagem;

    if (typeof window !== 'undefined') {
      window.open(url, '_blank');
    }
  }, [searchParams, nomeCliente, telefoneCliente, local, servico, dataHora, protocolo]);

  return (
    <main className="bg-black min-h-screen text-white">
      <Navbar />
      
      <div className="max-w-3xl mx-auto px-4 pt-40 pb-20 text-center">
        <div className="w-24 h-24 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center text-5xl mx-auto mb-8 animate-bounce">
          ✓
        </div>
        
        <h1 className="text-4xl md:text-6xl font-black mb-6">Agendamento Realizado!</h1>
        <p className="text-xl text-gray-400 mb-12">
          Seu horário foi reservado com sucesso. Você receberá um lembrete em breve.
        </p>
        
        <div className="glass border border-white/10 rounded-[2rem] p-8 mb-12 text-left space-y-6">
           <div className="flex justify-between items-center border-b border-white/5 pb-4">
              <span className="text-gray-500">Protocolo</span>
              <span className="font-mono font-bold">{protocolo}</span>
           </div>
           <div className="grid grid-cols-2 gap-8">
              <div>
                <div className="text-xs text-primary font-bold uppercase tracking-widest mb-1">Local</div>
                <div className="font-bold">{local}</div>
              </div>
              <div>
                <div className="text-xs text-primary font-bold uppercase tracking-widest mb-1">Data e Hora</div>
                <div className="font-bold">{dataHora}</div>
              </div>
           </div>
           
           {/* Caixa informativa do serviço */}
           <div className="border-t border-white/5 pt-4">
              <div className="text-xs text-primary font-bold uppercase tracking-widest mb-1">Serviço Selecionado</div>
              <div className="font-bold text-gray-300">{servico}</div>
           </div>

           <div className="pt-4 flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-2xl">
                📱
              </div>
              <p className="text-sm text-gray-400">
                Enviamos a confirmação para o WhatsApp de *{nomeCliente}*.
              </p>
           </div>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <Link href="/" className="px-10 py-5 bg-white text-black font-black rounded-2xl hover:bg-gray-200 transition-all">
            Ir para Meus Agendamentos
          </Link>
          <Link href="/" className="px-10 py-5 glass border border-white/10 text-white font-bold rounded-2xl hover:bg-white/5 transition-all">
            Voltar ao Início
          </Link>
        </div>
      </div>
    </main>
  );
}

