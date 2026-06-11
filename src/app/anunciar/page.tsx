"use client";

import Navbar from "@/components/navbar";
import { useState } from "react";
import Link from "next/link";
import { saveSalonRequest } from "@/lib/storage";
import { formatPhoneNumber } from "@/lib/notifications";

export default function RegisterProfessional() {
  const [step, setStep] = useState(1);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    salonName: "",
    city: "",
    category: "Cabeleireiro",
    address: "",
    ownerName: "",
    phone: "",
    email: "",
    password: "",
    imageUrls: [] as string[],
  });

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    Promise.all(
      files.map((file) => {
        return new Promise<string | null>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => {
            resolve(typeof reader.result === "string" ? reader.result : null);
          };
          reader.readAsDataURL(file);
        });
      })
    ).then((images) => {
      const urls = images.filter(Boolean) as string[];
      setFormData({ ...formData, imageUrls: urls });
    });
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newRequest = {
      id: Date.now().toString(),
      name: formData.salonName,
      category: formData.category,
      city: formData.city,
      address: formData.address,
      description: `Bem-vindo ao ${formData.salonName}! Especialistas em beleza e bem-estar.`,
      imageUrl: formData.imageUrls[0],
      imageUrls: formData.imageUrls,
      services: [
        { id: "s1", name: "Corte Masculino", price: "45,00", duration: "40" },
        { id: "s2", name: "Barba Tradicional", price: "35,00", duration: "30" }
      ],
      email: formData.email,
      phone: formData.phone,
      contactName: formData.ownerName,
      password: formData.password,
      status: "pending" as const,
      submittedAt: Date.now(),
    };
    
    saveSalonRequest(newRequest);
    setSuccess(true);
  };

  if (success) {
    return (
      <main className="bg-black min-h-screen text-white">
        <Navbar />
        <div className="max-w-3xl mx-auto px-4 pt-40 pb-20 text-center">
          <div className="w-24 h-24 bg-blue-500/20 text-blue-500 rounded-full flex items-center justify-center text-5xl mx-auto mb-8">
            📋
          </div>
          <h1 className="text-4xl md:text-6xl font-black mb-6">Pedido Enviado! 🎉</h1>
          <p className="text-xl text-gray-400 mb-4">
            Seu salão <strong>{formData.salonName}</strong> foi enviado para aprovação.
          </p>
          <p className="text-gray-500 mb-12">
            Em breve um administrador analisará seu cadastro e você receberá uma confirmação.
          </p>
          <Link href="/" className="px-8 py-4 bg-primary text-black font-black rounded-2xl hover:opacity-90 transition-all inline-block">
            Ir para Home
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-black min-h-screen text-white">
      <Navbar />
      
      <div className="relative pt-32 pb-20 px-4">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-primary/10 blur-[150px] -z-10" />
        
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tighter">
              Traga seu negócio para o <span className="text-primary">ServiçosPro</span>
            </h1>
            <p className="text-gray-400 text-lg">
              Receba agendamentos online e organize sua agenda agora mesmo.
            </p>
          </div>

          <div className="glass border border-white/10 rounded-[2.5rem] p-8 md:p-12">
             <form onSubmit={handleRegister} className="space-y-6">
                {step === 1 ? (
                  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                    <h3 className="text-xl font-bold border-b border-white/5 pb-4 mb-8">Informações do Salão</h3>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-400 ml-1">Nome do Estabelecimento</label>
                      <input 
                        required
                        type="text" 
                        placeholder="Ex: Studio D´Luxo"
                        value={formData.salonName}
                        onChange={(e) => setFormData({...formData, salonName: e.target.value})}
                        className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl focus:border-primary outline-none text-white transition-all"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-400 ml-1">Cidade</label>
                        <input 
                          required
                          type="text" 
                          placeholder="Sua cidade"
                          value={formData.city}
                          onChange={(e) => setFormData({...formData, city: e.target.value})}
                          className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl focus:border-primary outline-none text-white transition-all"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-400 ml-1">Categoria Principal</label>
                        <select 
                          value={formData.category}
                          onChange={(e) => setFormData({...formData, category: e.target.value})}
                          className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl focus:border-primary outline-none text-white transition-all appearance-none cursor-pointer"
                        >
                          <option value="Cabeleireiro" className="bg-black">Cabeleireiro</option>
                          <option value="Barba" className="bg-black">Barbearia</option>
                          <option value="Estética" className="bg-black">Estética</option>
                          <option value="Manicure" className="bg-black">Manicure</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-400 ml-1">Endereço Completo</label>
                      <input 
                        required
                        type="text" 
                        placeholder="Rua, número, bairro..."
                        value={formData.address}
                        onChange={(e) => setFormData({...formData, address: e.target.value})}
                        className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl focus:border-primary outline-none text-white transition-all"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-400 ml-1">Fotos do Salão</label>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handlePhotoChange}
                        className="w-full text-gray-200 file:border-0 file:bg-white/10 file:text-white file:px-4 file:py-3 file:rounded-2xl bg-white/5 border border-white/10 rounded-2xl text-sm"
                      />
                      {formData.imageUrls.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
                          {formData.imageUrls.map((url, index) => (
                            <img key={index} src={url} alt={`Foto ${index + 1}`} className="h-48 w-full object-cover rounded-3xl border border-white/10" />
                          ))}
                        </div>
                      )}
                    </div>

                    <button 
                      type="button"
                      onClick={() => setStep(2)}
                      className="w-full py-5 bg-white text-black font-black rounded-2xl hover:bg-gray-200 transition-all text-lg mt-8"
                    >
                      Próximo Passo
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                    <h3 className="text-xl font-bold border-b border-white/5 pb-4 mb-4">Seus Dados de Acesso</h3>
                    <button type="button" onClick={() => setStep(1)} className="text-primary text-sm font-bold hover:underline mb-8 block">
                      ← Voltar para dados do salão
                    </button>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-400 ml-1">Nome do Responsável</label>
                      <input 
                        required
                        type="text" 
                        placeholder="Seu nome completo"
                        value={formData.ownerName}
                        onChange={(e) => setFormData({...formData, ownerName: e.target.value})}
                        className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl focus:border-primary outline-none text-white transition-all"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-400 ml-1">WhatsApp / Celular</label>
                      <input 
                        required
                        type="tel" 
                        placeholder="(00) 00000-0000"
                        value={formatPhoneNumber(formData.phone)}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl focus:border-primary outline-none text-white transition-all"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-400 ml-1">E-mail Profissional</label>
                      <input 
                        required
                        type="email" 
                        placeholder="contato@seusalao.com"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl focus:border-primary outline-none text-white transition-all"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-400 ml-1">Criar Senha</label>
                      <input 
                        required
                        type="password" 
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl focus:border-primary outline-none text-white transition-all"
                      />
                    </div>

                    <button 
                      type="submit"
                      className="w-full py-5 premium-gradient text-white font-black rounded-2xl shadow-[0_10px_30px_rgba(168,85,247,0.4)] hover:scale-[1.02] transition-all text-lg mt-8"
                    >
                      Finalizar e Acessar Agora
                    </button>
                  </div>
                )}
             </form>
          </div>
        </div>
      </div>
    </main>
  );
}
