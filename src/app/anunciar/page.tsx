"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerSalonWithUserAction } from "../admin/actions";

export default function AnunciarPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const disponivelServicos = [
    { id: "Corte de Cabelo", label: "Corte de Cabelo" },
    { id: "Barba", label: "Barba" },
    { id: "Unhas", label: "Unhas (Manicure/Pedicure)" },
    { id: "Sobrancelha", label: "Sobrancelha" },
    { id: "Coloração", label: "Coloração / Química" },
    { id: "Maquiagem", label: "Maquiagem" },
  ];

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    description: "",
    address: "",
    city: "",
    phone: "",
    imageUrl: "",
    instagramUrl: "",
    workingHours: "",
  });

  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  const handleServiceChange = (serviceId: string) => {
    setSelectedServices((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedServices.length === 0) {
      setError("Por favor, selecione pelo menos um serviço oferecido.");
      return;
    }
    
    setLoading(true);
    setError(null);

    try {
      const response = await registerSalonWithUserAction({
        ...formData,
        services: selectedServices,
      });

      if (response?.success) {
        alert("Cadastro realizado com sucesso! Aguarde a aprovação do administrador.");
        router.push("/login");
      } else {
        setError(response?.error || "Ocorreu um erro ao realizar o cadastro.");
      }
    } catch (err) {
      setError("Erro de conexão com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="w-full max-w-2xl space-y-8 bg-card p-8 rounded-lg border border-border">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-foreground">Anunciar Meu Salão</h2>
          <p className="text-sm text-muted-foreground mt-2">Crie sua conta de acesso e cadastre seu estabelecimento</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {error && (
            <div className="p-3 rounded bg-destructive/10 border border-destructive text-destructive text-sm text-center">
              {error}
            </div>
          )}

          <div className="border-b border-border pb-4">
            <h3 className="text-lg font-semibold text-foreground mb-4">1. Dados de Acesso (Login)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground block mb-1">E-mail (Seu Usuário)</label>
                <input
                  type="email"
                  required
                  placeholder="exemplo@email.com"
                  className="w-full p-2 rounded bg-input border border-border text-foreground focus:outline-none"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground block mb-1">Senha</label>
                <input
                  type="password"
                  required
                  placeholder="Mínimo 6 caracteres"
                  className="w-full p-2 rounded bg-input border border-border text-foreground focus:outline-none"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">2. Detalhes do Estabelecimento</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-foreground block mb-1">Nome do Salão</label>
                <input
                  type="text"
                  required
                  className="w-full p-2 rounded bg-input border border-border text-foreground focus:outline-none"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-sm font-medium text-foreground block mb-1">Descrição / Especialidades</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Fale um pouco sobre o salão..."
                  className="w-full p-2 rounded bg-input border border-border text-foreground focus:outline-none resize-none"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground block mb-1">Endereço Completo</label>
                <input
                  type="text"
                  required
                  placeholder="Rua, Número, Bairro"
                  className="w-full p-2 rounded bg-input border border-border text-foreground focus:outline-none"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground block mb-1">Cidade</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: São Paulo"
                  className="w-full p-2 rounded bg-input border border-border text-foreground focus:outline-none"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground block mb-1">Telefone / WhatsApp</label>
                <input
                  type="text"
                  required
                  placeholder="(11) 99999-9999"
                  className="w-full p-2 rounded bg-input border border-border text-foreground focus:outline-none"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground block mb-1">Horário de Funcionamento</label>
                <input
                  type="text"
                  placeholder="Terça a Sábado - 09h às 19h"
                  className="w-full p-2 rounded bg-input border border-border text-foreground focus:outline-none"
                  value={formData.workingHours}
                  onChange={(e) => setFormData({ ...formData, workingHours: e.target.value })}
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-sm font-medium text-foreground block mb-1">Link da Imagem de Capa</label>
                <input
                  type="url"
                  placeholder="https://exemplo.com"
                  className="w-full p-2 rounded bg-input border border-border text-foreground focus:outline-none"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-sm font-medium text-foreground block mb-1">Link do Instagram</label>
                <input
                  type="text"
                  placeholder="@seu_salao"
                  className="w-full p-2 rounded bg-input border border-border text-foreground focus:outline-none"
                  value={formData.instagramUrl}
                  onChange={(e) => setFormData({ ...formData, instagramUrl: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="border-t border-border pt-4">
            <h3 className="text-lg font-semibold text-foreground mb-3">3. Serviços Oferecidos</h3>
            <div className="grid grid-cols-2 gap-3">
              {disponivelServicos.map((servico) => (
                <label key={servico.id} className="flex items-center space-x-3 p-2 bg-input/50 rounded border border-border/60 cursor-pointer hover:bg-input transition">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded text-primary focus:ring-primary bg-input border-border"
                    checked={selectedServices.includes(servico.id)}
                    onChange={() => handleServiceChange(servico.id)}
                  />
                  <span className="text-sm font-medium text-foreground">{servico.label}</span>
                </label>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded bg-primary text-primary-foreground font-bold hover:opacity-90 transition disabled:opacity-50 text-lg"
          >
            {loading ? "Processando Cadastro..." : "Finalizar Conta e Cadastrar Salão"}
          </button>
        </form>
      </div>
    </div>
  );
}
