"use client";

import { useState } from "react";
import Navbar from "@/components/navbar";
import Link from "next/link";
import { useRouter } from "next/navigation";

const INITIAL_APPOINTMENTS = [
  { id: "1", salon: "Studio D´Luxo", service: "Corte Masculino", date: "12 de Junho", time: "14:00", price: "45,00" },
  { id: "2", salon: "Barber King", service: "Barba Tradicional", date: "18 de Junho", time: "10:30", price: "40,00" },
];

export default function ClientDashboard() {
  const [appointments, setAppointments] = useState(INITIAL_APPOINTMENTS);
  const [notification, setNotification] = useState<string | null>(null);
  const router = useRouter();
  const nextAppointment = appointments[0];
  const historyAppointments = appointments.slice(1);

  const handleReschedule = (id: string) => {
    const appointment = appointments.find((item) => item.id === id);
    if (!appointment) return;
    setNotification(`Reagendar agendamento de ${appointment.salon} confirmado! Escolha um novo horário na página inicial.`);
    router.push("/");
  };

  const handleCancel = (id: string) => {
    setAppointments((current) => current.filter((item) => item.id !== id));
    setNotification("Agendamento cancelado com sucesso.");
  };

  const handleLogout = () => {
    localStorage.removeItem("servicos_pro_logged_in");
    router.push("/");
  };

  return (
    <main className="bg-black min-h-screen text-white">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 pt-32 pb-20">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
          <div>
            <h1 className="text-4xl font-black tracking-tighter">Meus Agendamentos</h1>
            <p className="text-gray-400">Olá, Cleberson! Acompanhe seus horários marcados.</p>
          </div>
          <Link href="/" className="px-8 py-4 bg-primary text-white font-bold rounded-2xl hover:opacity-90 transition-all">
             + Novo Agendamento
          </Link>
        </div>

        {notification && (
          <div className="mb-8 rounded-3xl border border-primary/30 bg-primary/5 p-6 text-primary font-bold">
            {notification}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left: Appointments */}
          <div className="lg:col-span-2 space-y-8">
             <section>
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                   🚀 Próximos Horários
                </h3>
                {nextAppointment ? (
                  <div className="glass border border-primary/30 bg-primary/5 rounded-[2.5rem] p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                     <div className="flex items-center gap-6">
                        <div className="w-20 h-20 bg-black/40 rounded-3xl flex items-center justify-center text-3xl border border-white/5">
                           💇‍♂️
                        </div>
                        <div>
                           <div className="text-sm font-bold text-primary uppercase tracking-widest mb-1">{nextAppointment.service}</div>
                           <h4 className="text-2xl font-bold">{nextAppointment.salon}</h4>
                           <p className="text-gray-400">{nextAppointment.date} às {nextAppointment.time}</p>
                        </div>
                     </div>
                     <div className="flex gap-4 w-full md:w-auto">
                        <button onClick={() => handleReschedule(nextAppointment.id)} className="flex-1 md:flex-none px-6 py-3 glass border border-white/10 rounded-xl font-bold hover:bg-white/5 transition-all text-sm">
                          Reagendar
                        </button>
                        <button onClick={() => handleCancel(nextAppointment.id)} className="flex-1 md:flex-none px-6 py-3 bg-red-500/10 text-red-500 rounded-xl font-bold hover:bg-red-500 hover:text-white transition-all text-sm">
                          Cancelar
                        </button>
                     </div>
                  </div>
                ) : (
                  <div className="glass border border-primary/30 bg-primary/5 rounded-[2.5rem] p-8 text-center text-gray-300">
                    Nenhum agendamento recente. Faça um novo agendamento para ver seus horários aqui.
                  </div>
                )}
             </section>

             <section>
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                   📅 Histórico Recente
                </h3>
                <div className="space-y-4">
                   {historyAppointments.length > 0 ? (
                     historyAppointments.map((item) => (
                      <div key={item.id} className="glass border border-white/5 rounded-3xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 group hover:border-white/20 transition-all">
                         <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-xl">
                               ✨
                            </div>
                            <div>
                               <h4 className="font-bold">{item.salon}</h4>
                               <p className="text-gray-500 text-sm">{item.service} • {item.date} às {item.time}</p>
                            </div>
                         </div>
                         <div className="flex flex-col items-start md:items-end gap-3">
                            <div className="font-black">R$ {item.price}</div>
                            <div className="flex gap-3">
                              <button onClick={() => handleReschedule(item.id)} className="text-xs px-4 py-2 border border-white/10 rounded-2xl text-white font-bold hover:bg-white/5 transition-all">
                                Reagendar
                              </button>
                              <button onClick={() => handleCancel(item.id)} className="text-xs px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 font-bold hover:bg-red-500 hover:text-white transition-all">
                                Cancelar
                              </button>
                            </div>
                         </div>
                      </div>
                     ))
                   ) : (
                     <div className="glass border border-white/5 rounded-3xl p-6 text-gray-400 text-center">
                       Nenhum histórico disponível no momento.
                     </div>
                   )}
                </div>
             </section>
          </div>

          {/* Right: Profile Info */}
          <div className="lg:col-span-1 space-y-6">
             <div className="glass border border-white/10 rounded-[2.5rem] p-8 text-center">
                <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center text-4xl mx-auto mb-4 border border-white/10">
                   👤
                </div>
                <h3 className="text-xl font-bold">Cleberson Silva</h3>
                <p className="text-gray-500 text-sm mb-6">Membro desde Março 2026</p>
                
                <div className="grid grid-cols-2 gap-4 mb-8">
                   <div className="p-4 bg-white/5 rounded-2xl">
                      <div className="text-2xl font-black">08</div>
                      <div className="text-[10px] text-gray-500 uppercase font-bold tracking-tighter">Agendamentos</div>
                   </div>
                   <div className="p-4 bg-white/5 rounded-2xl">
                      <div className="text-2xl font-black">01</div>
                      <div className="text-[10px] text-gray-500 uppercase font-bold tracking-tighter">Fidelidade</div>
                   </div>
                </div>

                <button className="w-full py-4 bg-white/5 border border-white/10 text-white font-bold rounded-2xl hover:bg-white/10 transition-all mb-4">
                   Editar Perfil
                </button>
                <button onClick={handleLogout} className="w-full py-4 text-red-500 font-bold hover:underline transition-all">
                   Sair da Conta
                </button>
             </div>

             <div className="glass border border-white/5 p-8 rounded-[2.5rem] bg-gradient-to-br from-purple-900/20 to-transparent">
                <h4 className="font-bold mb-2">Programa de Pontos 💎</h4>
                <p className="text-xs text-gray-400 mb-4">Você está a 2 agendamentos de ganhar um desconto de 50%!</p>
                <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                   <div className="bg-primary h-full w-[80%]" />
                </div>
             </div>
          </div>
        </div>
      </div>
    </main>
  );
}
