"use client";

import Navbar from "@/components/navbar";
import { useState, useEffect } from "react";
import { getSalons, saveSalon, Salon, getBookings, Booking } from "@/lib/storage";

interface Service {
  id: string;
  name: string;
  price: string;
  duration: string;
}

export default function ProfessionalDashboard() {
  const [activeTab, setActiveTab] = useState("agenda");
  const [salon, setSalon] = useState<Salon | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  
  const [services, setServices] = useState<Service[]>([]);
  const [newService, setNewService] = useState({ name: "", price: "", duration: "" });
  const [isAddingMode, setIsAddingMode] = useState(false);

  useEffect(() => {
    const allSalons = getSalons();
    const salonId = typeof window !== "undefined" ? localStorage.getItem("servicos_pro_current_salon_id") : null;
    const selectedSalon = salonId ? allSalons.find((s) => s.id === salonId) : null;
    const activeSalon = selectedSalon || allSalons[0];

    if (activeSalon) {
      setSalon(activeSalon);
      setServices(activeSalon.services || []);
      const allBookings = getBookings();
      const salonBookings = allBookings.filter((b) => b.salonId === activeSalon.id);
      setBookings(salonBookings.sort((a, b) => b.timestamp - a.timestamp));
    }
  }, []);

  const formatPrice = (price: any) => {
    if (typeof price === 'number') return price.toFixed(2);
    if (typeof price === 'string') {
      const num = parseFloat(price.replace(',', '.'));
      return isNaN(num) ? price : num.toFixed(2);
    }
    return price;
  };

  const handleUpdateStorage = (updatedServices: any[]) => {
    if (salon) {
      const updatedSalon = { ...salon, services: updatedServices };
      saveSalon(updatedSalon);
      setSalon(updatedSalon);
    }
  };

  const handleAddService = (e: React.FormEvent) => {
    e.preventDefault();
    const serviceWithId = { ...newService, id: Date.now().toString() };
    const updatedServices = [...services, serviceWithId];
    setServices(updatedServices);
    handleUpdateStorage(updatedServices);
    setNewService({ name: "", price: "", duration: "" });
    setIsAddingMode(false);
  };

  const handleUpdateImage = (url: string) => {
    if (salon) {
      const updatedSalon = { ...salon, imageUrl: url };
      saveSalon(updatedSalon);
      setSalon(updatedSalon);
    }
  };

  const handleDeleteService = (id: string) => {
    const updatedServices = services.filter(s => s.id !== id);
    setServices(updatedServices);
    handleUpdateStorage(updatedServices);
  };

  if (!salon) return <div className="bg-black min-h-screen"></div>;

  return (
    <main className="bg-black min-h-screen text-white">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 pt-32 pb-20">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
          <div>
            <h1 className="text-4xl font-black tracking-tighter">Painel do Profissional</h1>
            <p className="text-gray-400">Gerencie seu salão <strong>{salon.name}</strong> em tempo real.</p>
          </div>
          <div className="flex items-center gap-4">
             <div className="text-right hidden sm:block">
                <div className="font-bold">Profissional Logado</div>
                <div className="text-xs text-primary font-bold uppercase tracking-widest">{salon.category}</div>
             </div>
             <div className="w-14 h-14 bg-primary/20 rounded-2xl flex items-center justify-center font-black border-2 border-primary/40 text-xl shadow-[0_0_20px_rgba(168,85,247,0.2)]">
                {salon.name[0]}
             </div>
          </div>
        </div>

        <div className="flex gap-4 p-1.5 bg-white/5 border border-white/10 rounded-3xl w-fit mb-12">
           <button onClick={() => setActiveTab("agenda")} className={`px-8 py-3 rounded-2xl text-sm font-black transition-all ${activeTab === "agenda" ? "bg-white text-black shadow-xl" : "text-gray-400 hover:text-white"}`}>Minha Agenda</button>
           <button onClick={() => setActiveTab("servicos")} className={`px-8 py-3 rounded-2xl text-sm font-black transition-all ${activeTab === "servicos" ? "bg-white text-black shadow-xl" : "text-gray-400 hover:text-white"}`}>Meus Serviços</button>
        </div>

        {activeTab === "agenda" && (
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
              <div className="lg:col-span-2 space-y-8">
                 <div className="flex items-center justify-between">
                    <h2 className="text-3xl font-black tracking-tight">Próximos Agendamentos</h2>
                    <span className="px-4 py-1.5 bg-primary/10 text-primary text-xs font-black rounded-full border border-primary/20 uppercase tracking-widest">
                       {bookings.length} Agendados
                    </span>
                 </div>
                 <div className="space-y-4">
                   {bookings.map((appt) => (
                      <div key={appt.id} className="glass border border-white/5 rounded-[2.5rem] p-8 flex flex-col md:flex-row md:items-center justify-between group hover:border-primary/50 transition-all duration-500 bg-white/[0.02]">
                         <div className="flex items-center gap-6 mb-4 md:mb-0">
                            <div className="w-16 h-16 bg-white/5 rounded-[1.5rem] flex items-center justify-center font-black text-2xl group-hover:bg-primary/20 group-hover:text-primary transition-all duration-500">{appt.clientName[0]}</div>
                            <div>
                               <h4 className="font-black text-xl tracking-tight">{appt.clientName}</h4>
                               <p className="text-gray-500 flex items-center gap-2"><span className="text-primary font-bold">{appt.serviceName}</span><span>•</span><span>{appt.clientPhone}</span></p>
                            </div>
                         </div>
                         <div className="flex items-center gap-6">
                            <div className="text-right">
                               <div className="text-2xl font-black">{appt.time}</div>
                               <div className="text-xs font-bold text-gray-500 uppercase tracking-tighter">{appt.date}</div>
                            </div>
                            <span className="px-4 py-2 bg-green-500/10 text-green-500 rounded-xl text-[10px] font-black uppercase tracking-widest border border-green-500/20">Confirmado</span>
                         </div>
                      </div>
                   ))}
                 </div>
              </div>
              <div className="space-y-6">
                <div className="p-10 glass border border-white/10 rounded-[3rem] bg-gradient-to-br from-white/[0.05] to-transparent">
                  <h3 className="text-2xl font-black mb-8 tracking-tighter">Performance</h3>
                  <div className="space-y-6">
                    <div className="p-8 bg-white/5 rounded-[2.5rem] border border-white/5">
                      <div className="text-sm text-gray-500 font-bold uppercase tracking-widest mb-2">Total Agendamentos</div>
                      <div className="text-4xl font-black text-primary">{bookings.length}</div>
                    </div>
                    
                    <div className="p-8 bg-white/5 rounded-[2.5rem] border border-white/5">
                        <div className="text-sm text-gray-500 font-bold uppercase tracking-widest mb-4">Foto de Perfil</div>
                        <div className="space-y-4">
                           {(salon.imageUrls?.[0] || salon.imageUrl) && (
                              <img src={salon.imageUrls?.[0] || salon.imageUrl} className="w-full h-32 object-cover rounded-2xl mb-2" alt="Capa" />
                           )}
                           <input 
                              type="text" 
                              placeholder="Link da foto ou arquivo /public" 
                              defaultValue={salon.imageUrls?.[0] || salon.imageUrl}
                              onBlur={(e) => handleUpdateImage(e.target.value)}
                              className="w-full p-4 bg-black border border-white/10 rounded-2xl text-xs outline-none focus:border-primary"
                           />
                           <p className="text-[10px] text-gray-600">Salve o link ou nome da foto para atualizar seu perfil.</p>
                        </div>
                    </div>
                  </div>
                </div>
              </div>
           </div>
        )}

        {activeTab === "servicos" && (
           <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
              <div className="flex items-center justify-between mb-12">
                 <h2 className="text-3xl font-black tracking-tight">Catálogo de Serviços</h2>
                 <button onClick={() => setIsAddingMode(true)} className="px-8 py-4 premium-gradient text-white font-black rounded-2xl hover:scale-105 transition-all shadow-[0_10px_30px_rgba(168,85,247,0.3)]">+ Novo Serviço</button>
              </div>
              {isAddingMode && (
                <div className="glass border-2 border-primary/30 bg-primary/5 rounded-[3rem] p-10 mb-16 animate-in zoom-in-95 duration-500">
                  <h3 className="text-2xl font-black mb-8">Novo Serviço</h3>
                  <form onSubmit={handleAddService} className="grid grid-cols-1 md:grid-cols-3 gap-8">
                     <div className="space-y-3">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Nome</label>
                        <input required type="text" placeholder="Ex: Corte" value={newService.name} onChange={(e) => setNewService({...newService, name: e.target.value})} className="w-full p-5 bg-black border border-white/10 rounded-2xl focus:border-primary outline-none transition-all" />
                     </div>
                     <div className="space-y-3">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Preço (R$)</label>
                        <input required type="text" placeholder="0.00" value={newService.price} onChange={(e) => setNewService({...newService, price: e.target.value})} className="w-full p-5 bg-black border border-white/10 rounded-2xl focus:border-primary outline-none transition-all" />
                     </div>
                     <div className="space-y-3">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Tempo</label>
                        <input required type="text" placeholder="Ex: 40 min" value={newService.duration} onChange={(e) => setNewService({...newService, duration: e.target.value})} className="w-full p-5 bg-black border border-white/10 rounded-2xl focus:border-primary outline-none transition-all" />
                     </div>
                     <div className="md:col-span-3 flex gap-6 mt-4">
                        <button type="submit" className="flex-1 py-5 bg-white text-black font-black rounded-2xl hover:bg-gray-200 transition-all text-lg shadow-xl">Salvar</button>
                        <button type="button" onClick={() => setIsAddingMode(false)} className="px-12 py-5 glass border border-white/10 text-white font-black rounded-2xl hover:bg-white/5 transition-all">Cancelar</button>
                     </div>
                  </form>
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                 {services.map((service) => (
                   <div key={service.id} className="glass border border-white/10 rounded-[3rem] p-10 hover:border-primary/50 transition-all duration-500 relative group bg-white/[0.02]">
                      <div className="flex justify-between items-start mb-6">
                        <div>
                          <h4 className="text-2xl font-black mb-1">{service.name}</h4>
                          <p className="text-gray-500 font-bold">{service.duration} min</p>
                        </div>
                        <button onClick={() => handleDeleteService(service.id)} className="opacity-0 group-hover:opacity-100 p-3 hover:bg-red-500/10 text-red-500 rounded-2xl transition-all">🗑️</button>
                      </div>
                      <div className="text-4xl font-black text-white">R$ {formatPrice(service.price)}</div>
                   </div>
                 ))}
              </div>
           </div>
        )}
      </div>
    </main>
  );
}
