"use client";

import Navbar from "@/components/navbar";
import { getSalons, Salon, saveBooking, getBookings } from "@/lib/storage";
import { formatPhoneNumber, formatWhatsAppLink, getBookingConfirmationMessage } from "@/lib/notifications";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import Link from "next/link";

function SalonProfileContent() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const [salon, setSalon] = useState<Salon | null>(null);

  const [selectedService, setSelectedService] = useState<any>(null);
  const [bookingStep, setBookingStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [clientData, setClientData] = useState({ name: "", phone: "" });
  
  const [isOccupied, setIsOccupied] = useState(false);
  const [existingBookings, setExistingBookings] = useState<any[]>([]);

  useEffect(() => {
    const allSalons = getSalons();
    const found = allSalons.find((s) => s.id === id);
    setSalon(found || null);
    setExistingBookings(getBookings());
  }, [id]);

  const handleTimeSelect = (time: string) => {
    if (!selectedDate) {
      setSelectedTime(time);
      return;
    }

    // Verifica se horário está ocupado
    const isTaken = existingBookings.some(b => b.salonId === id && b.date === selectedDate && b.time === time);
    
    if (isTaken) {
      setIsOccupied(true);
      setTimeout(() => setIsOccupied(false), 2000);
      return;
    }

    setSelectedTime(time);
  };

  const formatPrice = (price: any) => {
    if (typeof price === 'number') return price.toFixed(2);
    if (typeof price === 'string') {
      const num = parseFloat(price.replace(',', '.'));
      return isNaN(num) ? price : num.toFixed(2);
    }
    return price;
  };

  const handleFinishBooking = () => {
    const newBooking = {
      id: Date.now().toString(),
      salonId: id,
      salonName: salon?.name || "",
      serviceName: selectedService.name,
      clientName: clientData.name,
      clientPhone: clientData.phone,
      date: selectedDate || "",
      time: selectedTime || "",
      timestamp: Date.now()
    };
    saveBooking(newBooking);
    
    // Enviar mensagem de confirmação via WhatsApp
    const phone = clientData.phone.replace(/\D/g, "");
    const dateTime = `${selectedDate} às ${selectedTime}`;
    const message = getBookingConfirmationMessage(clientData.name, selectedService.name, salon?.name || "", dateTime);
    const whatsappLink = formatWhatsAppLink(phone, message);
    
    // Abrir WhatsApp em nova aba para enviar confirmação
    setTimeout(() => {
      window.open(whatsappLink, "_blank");
    }, 500);
    
    router.push("/agendamento-sucesso");
  };

  // Se não encontrou o salão, mostrar página vazia (não flicka)
  if (!salon) {
    return (
      <main className="bg-black min-h-screen"></main>
    );
  }

  const dates = ["12 de Junho", "13 de Junho", "14 de Junho", "15 de Junho"];
  const times = ["09:00", "09:30", "10:00", "10:30", "11:00", "14:00", "14:30", "15:00", "15:30", "16:00", "17:00"];

  return (
    <main className="bg-black min-h-screen text-white">
      <Navbar />
      
      <div className="relative h-[40vh] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />
        
        {(salon.imageUrls?.[0] || salon.imageUrl) ? (
           <img 
            src={salon.imageUrls?.[0] || salon.imageUrl} 
            alt={salon.name} 
            className="absolute inset-0 w-full h-full object-cover"
           />
        ) : (
          <div className="absolute inset-0 bg-gray-900 flex items-center justify-center text-white/5 font-black text-9xl">
            {salon.name[0]}
          </div>
        )}
        <div className="absolute bottom-0 left-0 w-full p-8 z-20 max-w-7xl mx-auto left-1/2 -translate-x-1/2">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 bg-primary text-black font-bold text-xs rounded-full uppercase tracking-widest">
                {salon.category}
              </span>
              <span className="text-yellow-500 font-bold">★ {salon.rating}</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter">{salon.name}</h1>
            <p className="text-gray-400 mt-2 flex items-center gap-2 text-lg">
               📍 {salon.address} - {salon.city}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16 grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-12">
          <section>
            <h2 className="text-3xl font-black tracking-tight mb-6">Sobre o Salão</h2>
            <p className="text-gray-400 leading-relaxed text-xl">{salon.description}</p>
          </section>

          <section>
            <h2 className="text-3xl font-black tracking-tight mb-8">Serviços Disponíveis</h2>
            <div className="space-y-4">
              {salon.services?.map((service) => (
                <div key={service.id} className={`p-8 glass border rounded-[2.5rem] transition-all duration-300 flex items-center justify-between group ${selectedService?.id === service.id ? "border-primary bg-primary/5" : "border-white/5 hover:border-primary/30"}`}>
                  <div>
                    <h3 className="text-2xl font-bold group-hover:text-primary transition-colors">{service.name}</h3>
                    <p className="text-gray-500 font-medium mt-1">{service.duration} min de duração</p>
                  </div>
                  <div className="flex items-center gap-8">
                    <span className="text-2xl font-black text-white">R$ {formatPrice(service.price)}</span>
                    <button onClick={() => { setSelectedService(service); setBookingStep(1); setSelectedTime(null); }} className={`px-8 py-4 rounded-2xl font-black transition-all ${selectedService?.id === service.id ? "bg-primary text-white scale-105" : "bg-white/5 border border-white/10 text-white hover:bg-white hover:text-black"}`}>
                      {selectedService?.id === service.id ? "Selecionado" : "Ver Horários"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-28 glass border border-white/10 rounded-[3rem] p-10 space-y-8 min-h-[500px] flex flex-col">
            <div className="mb-4">
              <h3 className="text-2xl font-black mb-1">Agendamento</h3>
              <p className="text-gray-500 text-sm font-medium">
                {!selectedService ? "Escolha um serviço para ver horários" : `Passo ${bookingStep} de 3 - ${selectedService.name}`}
              </p>
            </div>

            {!selectedService ? (
               <div className="flex-1 flex flex-col items-center justify-center text-center opacity-30 mt-12">
                  <span className="text-7xl mb-6">🗓️</span>
                  <p className="font-bold">Selecione um serviço ao lado <br/> para começar</p>
               </div>
            ) : (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
                {isOccupied && (
                   <div className="bg-red-500/10 border-2 border-red-500 text-red-500 p-6 rounded-3xl animate-pulse flex flex-col items-center gap-3">
                      <span className="text-4xl">🚫</span>
                      <div className="font-black text-center">HORÁRIO OCUPADO!</div>
                      <p className="text-sm text-center font-bold">Por favor escolha outro horário disponível.</p>
                   </div>
                )}

                {bookingStep === 1 && (
                  <div className="space-y-8">
                    <div className="space-y-4">
                      <div className="text-sm font-black text-gray-400 uppercase tracking-widest">1. Escolha a Data</div>
                      <div className="grid grid-cols-2 gap-3">
                        {dates.map((date) => (
                          <button key={date} onClick={() => { setSelectedDate(date); setSelectedTime(null); }} className={`py-4 rounded-2xl border-2 transition-all font-bold text-sm ${selectedDate === date ? "bg-primary border-primary text-white" : "bg-white/5 border-white/5 hover:border-white/20"}`}>
                            {date}
                          </button>
                        ))}
                      </div>
                    </div>

                    {selectedDate && (
                      <div className="space-y-4 animate-in fade-in slide-in-from-top-4">
                        <div className="text-sm font-black text-gray-400 uppercase tracking-widest">2. Escolha o Horário</div>
                        <div className="grid grid-cols-3 gap-2">
                            {times.map((time) => {
                               const isTaken = existingBookings.some(b => b.salonId === id && b.date === selectedDate && b.time === time);
                               return (
                                <button key={time} onClick={() => handleTimeSelect(time)} className={`py-3 rounded-xl border-2 transition-all font-bold text-sm h-12 flex items-center justify-center ${selectedTime === time ? "bg-primary border-primary text-white" : isTaken ? "bg-red-500/5 border-red-500/10 text-red-500/40 line-through opacity-50 cursor-not-allowed" : "bg-white/5 border-white/5 hover:border-white/20"}`}>
                                  {time}
                                </button>
                               );
                            })}
                        </div>
                      </div>
                    )}
                    <button disabled={!selectedDate || !selectedTime} onClick={() => setBookingStep(2)} className="w-full py-5 bg-white text-black font-black rounded-2xl mt-4 disabled:opacity-20 transition-all text-lg shadow-xl">
                      Continuar Agendamento
                    </button>
                  </div>
                )}

                {bookingStep === 2 && (
                  <div className="space-y-10">
                     <button onClick={() => setBookingStep(1)} className="text-gray-500 font-bold hover:text-white transition-colors text-sm underline decoration-primary underline-offset-4">← Mudar data ou horário</button>
                     <div className="space-y-6">
                        <div className="text-sm font-black text-gray-400 uppercase tracking-widest">Suas Informações</div>
                        <input type="text" placeholder="Seu nome" value={clientData.name} onChange={(e) => setClientData({...clientData, name: e.target.value})} className="w-full p-5 bg-white/5 border border-white/10 rounded-2xl focus:border-primary outline-none" />
                        <input type="tel" placeholder="(00) 00000-0000" value={formatPhoneNumber(clientData.phone)} onChange={(e) => setClientData({...clientData, phone: e.target.value})} className="w-full p-5 bg-white/5 border border-white/10 rounded-2xl focus:border-primary outline-none" />
                     </div>
                     <button disabled={!clientData.name || !clientData.phone} onClick={() => setBookingStep(3)} className="w-full py-5 bg-white text-black font-black rounded-2xl disabled:opacity-20 transition-all text-lg shadow-xl">
                       Revisar Detalhes
                     </button>
                  </div>
                )}

                {bookingStep === 3 && (
                  <div className="space-y-8">
                    <button onClick={() => setBookingStep(2)} className="text-gray-500 font-bold hover:text-white transition-colors text-sm underline decoration-primary underline-offset-4">← Voltar para dados</button>
                    <div className="space-y-6 p-6 bg-white/5 rounded-[2.5rem] border border-white/10">
                       <div className="flex justify-between items-center">
                          <span className="text-gray-500 text-sm font-bold uppercase">Serviço</span>
                          <span className="font-black text-primary">{selectedService.name}</span>
                       </div>
                       <div className="flex justify-between items-center">
                          <span className="text-gray-500 text-sm font-bold uppercase">Preço</span>
                          <span className="font-black">R$ {formatPrice(selectedService.price)}</span>
                       </div>
                       <div className="flex justify-between items-center">
                          <span className="text-gray-500 text-sm font-bold uppercase">Hora</span>
                          <span className="font-black text-xl">{selectedTime}</span>
                       </div>
                    </div>
                    <button onClick={handleFinishBooking} className="w-full py-6 premium-gradient text-white font-black rounded-[2rem] shadow-[0_15px_40px_rgba(168,85,247,0.4)] hover:scale-[1.03] active:scale-95 transition-all text-xl">
                      Confirmar Agora ✨
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

export default function SalonProfile() {
  return (
    <Suspense fallback={<div className="bg-black min-h-screen" />}>
      <SalonProfileContent />
    </Suspense>
  );
}
