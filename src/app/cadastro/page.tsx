"use client";

import { useState } from "react";
import Navbar from "@/components/navbar";
import { useRouter } from "next/navigation";
import { saveSalonRequest } from "@/lib/storage";
// Função para formatar o telefone enquanto o usuário digita
const formatPhoneNumber = (value: string) => {
  if (!value) return "";
  const phone = value.replace(/\D/g, "");
  if (phone.length <= 10) {
    return phone.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
  }
  return phone.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
};

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    salonName: "",
    phone: "",
    password: ""
  });
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [serviceText, setServiceText] = useState("Corte Masculino | 45 | 40\nBarba | 30 | 30");
  const [businessHours, setBusinessHours] = useState("Seg-Sex: 09:00 - 19:00\nSáb: 09:00 - 14:00");
  const router = useRouter();

  const parseServices = (text: string) => {
    return text
      .split("\n")
      .map((row, index) => row.trim())
      .filter(Boolean)
      .map((row, index) => {
        const [name, price, duration] = row.split("|").map(part => part.trim());
        return {
          id: `service-${index + 1}`,
          name: name || `Serviço ${index + 1}`,
          price: Number(price) || 0,
          duration: Number(duration) || 30,
        };
      });
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();

    const newRequest = {
      id: Date.now().toString(),
      name: formData.salonName || formData.name,
      category: "Cabelo",
      city: "Sua Cidade",
      address: "Endereço a definir",
      description: `Bem-vindo ao ${formData.salonName}! Somos profissionais dedicados à sua beleza.`,
      imageUrl: photoPreview || undefined,
      services: parseServices(serviceText),
      businessHours,
      email: formData.email,
      phone: formData.phone,
      contactName: formData.name,
      password: formData.password,
      status: "pending" as const,
      submittedAt: Date.now(),
    };
    saveSalonRequest(newRequest);
    router.push("/cadastro-pendente");
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setPhotoPreview(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <main className="bg-black min-h-screen text-white">
      <Navbar />
      
      <div className="relative pt-32 pb-20 px-4">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-primary/10 blur-[150px] -z-10" />
        
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tighter">Cadastrar Salão</h1>
            <p className="text-gray-400">Cadastre seu salão e adicione fotos, serviços e horários de funcionamento.</p>
          </div>

          <div className="glass border border-white/10 rounded-[2.5rem] p-8 md:p-12">
             <form onSubmit={handleRegister} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-400 ml-1">Nome Completo</label>
                    <input 
                      required 
                      type="text" 
                      placeholder="Seu nome" 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
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
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl focus:border-primary outline-none transition-all" 
                    />
                  </div>
                </div>

                <div className="space-y-2 animate-in fade-in slide-in-from-top-4">
                  <label className="text-sm font-bold text-gray-400 ml-1">Nome do Salão</label>
                  <input 
                    required 
                    type="text" 
                    placeholder="Ex: Studio D´Luxo" 
                    value={formData.salonName}
                    onChange={(e) => setFormData({...formData, salonName: e.target.value})}
                    className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl focus:border-primary outline-none transition-all" 
                  />
                </div>

                <div className="grid grid-cols-1 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-400 ml-1">Foto do Salão</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="w-full text-gray-200 file:border-0 file:bg-white/10 file:text-white file:px-4 file:py-3 file:rounded-2xl bg-white/5 border border-white/10 rounded-2xl text-sm"
                    />
                    {photoPreview && (
                      <img src={photoPreview} alt="Preview do salão" className="mt-3 h-40 w-full object-cover rounded-3xl border border-white/10" />
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-400 ml-1">Serviços</label>
                    <textarea
                      value={serviceText}
                      onChange={(e) => setServiceText(e.target.value)}
                      rows={5}
                      className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl focus:border-primary outline-none transition-all text-sm"
                      placeholder="Cada linha: Nome do Serviço | Preço | Duração em minutos"
                    />
                    <p className="text-xs text-gray-500">Ex: Corte Masculino | 45 | 40</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-400 ml-1">Horário de Funcionamento</label>
                    <textarea
                      value={businessHours}
                      onChange={(e) => setBusinessHours(e.target.value)}
                      rows={4}
                      className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl focus:border-primary outline-none transition-all text-sm"
                      placeholder="Seg-Sex: 09:00 - 19:00\nSáb: 09:00 - 14:00"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-400 ml-1">WhatsApp</label>
                    <input 
                      required 
                      type="tel" 
                      placeholder="(00) 00000-0000" 
                      value={formatPhoneNumber(formData.phone)}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
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
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl focus:border-primary outline-none transition-all" 
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full py-5 premium-gradient text-white font-black rounded-2xl shadow-[0_10px_30px_rgba(168,85,247,0.3)] hover:scale-[1.02] transition-all text-lg mt-8"
                >
                  Cadastrar Salão
                </button>
             </form>
          </div>
        </div>
      </div>
    </main>
  );
}
