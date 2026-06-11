"use client";

import Navbar from "@/components/navbar";
import { getSalons, getBookings, deleteSalon, saveSalon, Salon, Booking, getAdminPassword, setAdminPassword, getSalonRequests, approveSalonRequest, rejectSalonRequest, deleteSalonRequest, SalonRequest, updateSalonPassword } from "@/lib/storage";
import { formatWhatsAppLink, getReminderMessage, getAppointmentTimeMessage } from "@/lib/notifications";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function AdminPage() {
  const [salons, setSalons] = useState<Salon[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [salonRequests, setSalonRequests] = useState<SalonRequest[]>([]);
  const [openSalonId, setOpenSalonId] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [authError, setAuthError] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [editingSalonId, setEditingSalonId] = useState<string | null>(null);
  const [salonNewPassword, setSalonNewPassword] = useState("");
  const [salonConfirmPassword, setSalonConfirmPassword] = useState("");
  const [salonPasswordError, setSalonPasswordError] = useState("");
  const [salonPasswordMessage, setSalonPasswordMessage] = useState("");
  const [rejectingRequestId, setRejectingRequestId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");

  useEffect(() => {
    const authorized = localStorage.getItem("servicos_pro_admin_authenticated") === "true";
    setIsAuthorized(authorized);
    if (authorized) {
      setSalons(getSalons());
      setBookings(getBookings());
      setSalonRequests(getSalonRequests());
    }
  }, []);

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Tem certeza que deseja excluir o salão "${name}"? Esta ação não pode ser desfeita.`)) {
      deleteSalon(id);
      setSalons(getSalons());
      setBookings((current) => current.filter((booking) => booking.salonId !== id));
      if (openSalonId === id) setOpenSalonId(null);
    }
  };

  const handleToggleAgenda = (id: string) => {
    setOpenSalonId((current) => (current === id ? null : id));
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const adminPassword = getAdminPassword();
    if (password === adminPassword) {
      localStorage.setItem("servicos_pro_admin_authenticated", "true");
      setIsAuthorized(true);
      setAuthError("");
      setSalons(getSalons());
      setBookings(getBookings());
    } else {
      setAuthError("Senha incorreta. Tente novamente.");
    }
  };

  const getWhatsAppLink = (booking: Booking, salonName: string) => {
    const phone = booking.clientPhone.replace(/\D/g, "");
    const dateTime = `${booking.date} às ${booking.time}`;
    const message = getReminderMessage(booking.clientName, salonName, dateTime);
    return formatWhatsAppLink(phone, message);
  };

  const getAppointmentWhatsAppLink = (booking: Booking, salonName: string) => {
    const phone = booking.clientPhone.replace(/\D/g, "");
    const dateTime = `${booking.date} às ${booking.time}`;
    const message = getAppointmentTimeMessage(booking.clientName, salonName, dateTime);
    return formatWhatsAppLink(phone, message);
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    const adminPassword = getAdminPassword();

    if (currentPassword !== adminPassword) {
      setPasswordError("Senha atual incorreta.");
      setPasswordMessage("");
      return;
    }

    if (!newPassword) {
      setPasswordError("Digite a nova senha.");
      setPasswordMessage("");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("As senhas não coincidem.");
      setPasswordMessage("");
      return;
    }

    setAdminPassword(newPassword);
    setPasswordError("");
    setPasswordMessage("Senha atualizada com sucesso.");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleToggleFeatured = (id: string) => {
    const salon = salons.find((item) => item.id === id);
    if (!salon) return;

    const featuredCount = salons.filter((item) => item.featured).length;
    if (!salon.featured && featuredCount >= 5) {
      alert("Já existem 5 salões em destaque. Remova o destaque de outro salão antes.");
      return;
    }

    const updatedSalon = { ...salon, featured: !salon.featured };
    saveSalon(updatedSalon);
    setSalons(getSalons());
  };

  const handleLogout = () => {
    localStorage.removeItem("servicos_pro_admin_authenticated");
    setIsAuthorized(false);
    setPassword("");
    setPasswordMessage("");
    setPasswordError("");
  };

  const featuredCount = salons.filter((item) => item.featured).length;

  const handleStartSalonPasswordEdit = (id: string) => {
    setEditingSalonId(id);
  };

  const handleSaveSalonPassword = (e: React.FormEvent, salon: Salon) => {
    e.preventDefault();

    if (!salonNewPassword) {
      setSalonPasswordError("Digite a nova senha.");
      setSalonPasswordMessage("");
      return;
    }

    if (salonNewPassword !== salonConfirmPassword) {
      setSalonPasswordError("As senhas não coincidem.");
      setSalonPasswordMessage("");
      return;
    }

    updateSalonPassword(salon.id, salonNewPassword);
    setSalonPasswordError("");
    setSalonPasswordMessage("Senha atualizada com sucesso.");
    setSalonNewPassword("");
    setSalonConfirmPassword("");
    setEditingSalonId(null);
  };

  const handleApproveRequest = (requestId: string) => {
    approveSalonRequest(requestId);
    setSalonRequests(getSalonRequests());
    setSalons(getSalons());
  };

  const handleRejectRequest = () => {
    if (!rejectingRequestId || !rejectionReason.trim()) {
      return;
    }
    rejectSalonRequest(rejectingRequestId, rejectionReason);
    setSalonRequests(getSalonRequests());
    setRejectingRequestId(null);
    setRejectionReason("");
  };

  const handleDeleteRequest = (requestId: string) => {
    if (confirm("Tem certeza que deseja excluir este pedido?")) {
      deleteSalonRequest(requestId);
      setSalonRequests(getSalonRequests());
    }
  };

  return (
    <main className="bg-black min-h-screen text-white">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 pt-32 pb-20">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
          <div>
            <h1 className="text-4xl font-black tracking-tighter">Gestão da Plataforma</h1>
            <p className="text-gray-400">Administre todos os estabelecimentos cadastrados no <strong>ServiçosPro</strong>.</p>
          </div>
          <div className="bg-primary/10 border border-primary/20 px-6 py-3 rounded-2xl text-primary font-bold">
             Painel do Administrador
          </div>
        </div>

        {!isAuthorized ? (
          <div className="glass border border-white/10 rounded-[3rem] p-10 max-w-xl mx-auto">
            <h2 className="text-2xl font-black mb-6">Acesso Restrito</h2>
            <p className="text-gray-400 mb-6">Digite a senha de administrador para gerenciar salões.</p>
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Senha do administrador"
                className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl focus:border-primary outline-none text-white transition-all"
              />
              {authError && <p className="text-red-500 text-sm">{authError}</p>}
              <button type="submit" className="w-full py-4 bg-primary text-black font-bold rounded-2xl hover:opacity-90 transition-all">Entrar</button>
            </form>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-8 gap-4">
              <div className="text-sm text-gray-400">Acesso autorizado como administrador.</div>
              <button onClick={handleLogout} className="px-6 py-3 bg-red-500/10 text-red-500 font-bold rounded-2xl hover:bg-red-500 hover:text-white transition-all">Logout</button>
            </div>
            <div className="glass border border-white/10 rounded-[2.5rem] p-8 mb-6 bg-white/[0.02]">
              <h2 className="text-2xl font-black mb-4">Alterar senha do administrador</h2>
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Senha atual"
                  className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl focus:border-primary outline-none text-white transition-all"
                />
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Nova senha"
                  className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl focus:border-primary outline-none text-white transition-all"
                />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirme a nova senha"
                  className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl focus:border-primary outline-none text-white transition-all"
                />
                {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>}
                {passwordMessage && <p className="text-green-500 text-sm">{passwordMessage}</p>}
                <button type="submit" className="w-full py-4 bg-primary text-black font-bold rounded-2xl hover:opacity-90 transition-all">Atualizar senha</button>
              </form>
            </div>

            {/* Seção de Pedidos de Cadastro */}
            <div className="glass border border-white/10 rounded-[2.5rem] p-8 mb-6 bg-white/[0.02]">
              <h2 className="text-2xl font-black mb-6">Pedidos de Cadastro Pendentes ({salonRequests.filter(r => r.status === "pending").length})</h2>
              
              {salonRequests.filter(r => r.status === "pending").length === 0 ? (
                <p className="text-gray-400">Nenhum pedido de cadastro pendente.</p>
              ) : (
                <div className="space-y-4">
                  {salonRequests.filter(r => r.status === "pending").map((request) => (
                    <div key={request.id} className="border border-white/10 rounded-2xl p-4 bg-black/40">
                      <div className="mb-4">
                        <h3 className="text-lg font-bold text-white mb-1">{request.name}</h3>
                        <p className="text-sm text-gray-400">
                          {request.category} • {request.city}
                        </p>
                        <p className="text-sm text-gray-500 mt-2">
                          <strong>Responsável:</strong> {request.contactName} • {request.phone}
                        </p>
                        <p className="text-sm text-gray-500">
                          <strong>E-mail:</strong> {request.email}
                        </p>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
                        <button
                          onClick={() => handleApproveRequest(request.id)}
                          className="px-4 py-2 bg-green-500 text-black font-bold rounded-xl hover:bg-green-400 transition-all text-sm"
                        >
                          ✓ Aprovar
                        </button>
                        <button
                          onClick={() => setRejectingRequestId(request.id)}
                          className="px-4 py-2 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 transition-all text-sm"
                        >
                          ✕ Rejeitar
                        </button>
                      </div>
                      
                      {rejectingRequestId === request.id && (
                        <div className="mt-4 p-3 bg-black/60 rounded-xl border border-red-500/20">
                          <textarea
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            placeholder="Motivo da rejeição..."
                            rows={2}
                            className="w-full p-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white outline-none"
                          />
                          <div className="flex gap-2 mt-2">
                            <button
                              onClick={handleRejectRequest}
                              className="px-3 py-1 bg-red-500 text-white text-sm font-bold rounded transition"
                            >
                              Confirmar Rejeição
                            </button>
                            <button
                              onClick={() => {
                                setRejectingRequestId(null);
                                setRejectionReason("");
                              }}
                              className="px-3 py-1 bg-white/10 text-white text-sm font-bold rounded transition"
                            >
                              Cancelar
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="glass border border-white/10 rounded-[2.5rem] p-8 mb-6 bg-white/[0.02]">
              <h2 className="text-2xl font-black mb-6">Histórico de Pedidos</h2>
              
              {salonRequests.filter(r => r.status !== "pending").length === 0 ? (
                <p className="text-gray-400">Nenhum histórico de pedidos.</p>
              ) : (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {salonRequests.filter(r => r.status !== "pending").map((request) => (
                    <div key={request.id} className="flex items-center justify-between text-sm p-2 border border-white/5 rounded-lg">
                      <div>
                        <span className="font-bold text-white">{request.name}</span>
                        <span className={`ml-3 px-2 py-0.5 rounded text-xs font-bold ${request.status === "approved" ? "bg-green-500/20 text-green-300" : "bg-red-500/20 text-red-300"}`}>
                          {request.status === "approved" ? "✓ Aprovado" : "✕ Rejeitado"}
                        </span>
                      </div>
                      <button
                        onClick={() => handleDeleteRequest(request.id)}
                        className="text-red-400 hover:text-red-300 text-xs"
                      >
                        Excluir
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 gap-6">
          {salons.map((salon) => {
            const salonBookings = bookings.filter((booking) => booking.salonId === salon.id);
            const isOpen = openSalonId === salon.id;
            return (
              <div key={salon.id} className="space-y-4">
                <div className="glass border border-white/10 rounded-[2.5rem] p-8 flex flex-col md:flex-row md:items-center justify-between bg-white/[0.02] hover:border-primary/30 transition-all">
                  <div className="flex items-center gap-6 mb-4 md:mb-0">
                    <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center font-black text-2xl overflow-hidden">
                      {(salon.imageUrls?.[0] || salon.imageUrl) ? (
                        <img src={salon.imageUrls?.[0] || salon.imageUrl} alt={salon.name} className="w-full h-full object-cover" />
                      ) : (
                        salon.name[0]
                      )}
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-3 mb-2">
                        <h3 className="text-2xl font-black tracking-tight">{salon.name}</h3>
                        {salon.featured && (
                          <span className="px-3 py-1 bg-yellow-500/10 text-yellow-300 border border-yellow-500/20 rounded-full text-xs font-black uppercase tracking-widest">
                            Destaque
                          </span>
                        )}
                      </div>
                      <p className="text-gray-500 text-sm">
                        {salon.category} • {salon.city}
                      </p>
                      <p className="text-xs text-gray-400 mt-2">Agenda: {salonBookings.length} agendamento{salonBookings.length === 1 ? "" : "s"}</p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                    <Link 
                      href={`/salon/${salon.id}`} 
                      className="px-6 py-3 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 transition-all text-sm text-center"
                    >
                      Ver Perfil
                    </Link>
                    <button 
                      type="button"
                      onClick={() => handleToggleFeatured(salon.id)}
                      disabled={!salon.featured && featuredCount >= 5}
                      className={`px-6 py-3 rounded-xl font-bold text-sm transition-all ${salon.featured ? "bg-yellow-500 text-black hover:bg-yellow-400" : "bg-white/10 text-white hover:bg-white/20 border border-white/20"} ${!salon.featured && featuredCount >= 5 ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      {salon.featured ? "Remover Destaque" : "Destacar Salão"}
                    </button>
                    <button 
                      type="button"
                      onClick={() => handleToggleAgenda(salon.id)}
                      className="px-6 py-3 bg-primary/10 text-primary font-bold rounded-xl hover:bg-primary hover:text-black transition-all text-sm"
                    >
                      {isOpen ? "Fechar Agenda" : "Consultar Agenda"}
                    </button>
                    <button 
                      type="button"
                      onClick={() => handleStartSalonPasswordEdit(salon.id)}
                      className="px-6 py-3 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 transition-all text-sm border border-white/20"
                    >
                      Alterar Senha
                    </button>
                    <button 
                      onClick={() => handleDelete(salon.id, salon.name)}
                      className="px-6 py-3 bg-red-500/10 text-red-500 font-bold rounded-xl hover:bg-red-500 hover:text-white transition-all text-sm border border-red-500/20"
                    >
                      Excluir Salão
                    </button>
                  </div>
                </div>
                {editingSalonId === salon.id && (
                  <div className="glass border border-white/10 rounded-[2.5rem] p-6 bg-white/[0.02]">
                    <h4 className="text-xl font-black mb-4">Alterar senha de {salon.name}</h4>
                    <form onSubmit={(e) => handleSaveSalonPassword(e, salon)} className="space-y-4">
                      <input
                        type="password"
                        value={salonNewPassword}
                        onChange={(e) => setSalonNewPassword(e.target.value)}
                        placeholder="Nova senha"
                        className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl focus:border-primary outline-none text-white transition-all"
                      />
                      <input
                        type="password"
                        value={salonConfirmPassword}
                        onChange={(e) => setSalonConfirmPassword(e.target.value)}
                        placeholder="Confirme a nova senha"
                        className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl focus:border-primary outline-none text-white transition-all"
                      />
                      {salonPasswordError && <p className="text-red-500 text-sm">{salonPasswordError}</p>}
                      {salonPasswordMessage && <p className="text-green-500 text-sm">{salonPasswordMessage}</p>}
                      <button type="submit" className="w-full py-4 bg-primary text-black font-bold rounded-2xl hover:opacity-90 transition-all">Salvar nova senha</button>
                    </form>
                  </div>
                )}
                {isOpen && (
                  <div className="glass border border-white/10 rounded-[2.5rem] p-6 bg-white/[0.02]">
                    <h4 className="text-xl font-black mb-4">Agenda de {salon.name}</h4>
                    {salonBookings.length === 0 ? (
                      <p className="text-gray-400">Nenhum agendamento registrado para este salão.</p>
                    ) : (
                      <div className="space-y-4">
                        {salonBookings.map((booking) => (
                          <div key={booking.id} className="border border-white/10 rounded-3xl p-4 bg-black/40">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                              <div>
                                <div className="text-sm text-gray-400 uppercase tracking-widest mb-1">{booking.serviceName}</div>
                                <h5 className="font-bold text-white">{booking.clientName}</h5>
                                <p className="text-gray-400 text-sm">{booking.clientPhone}</p>
                              </div>
                              <div className="text-right text-sm text-gray-300">
                                <div>{booking.date}</div>
                                <div>{booking.time}</div>
                              </div>
                            </div>
                            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:justify-end">
                              <a
                                href={getWhatsAppLink(booking, salon.name)}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center justify-center rounded-2xl bg-green-500 px-4 py-3 text-sm font-bold text-black hover:bg-green-400 transition"
                              >
                                Enviar lembrete WhatsApp
                              </a>
                              <a
                                href={getAppointmentWhatsAppLink(booking, salon.name)}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center justify-center rounded-2xl bg-blue-500 px-4 py-3 text-sm font-bold text-black hover:bg-blue-400 transition"
                              >
                                Enviar mensagem na hora do atendimento
                              </a>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {salons.length === 0 && (
            <div className="py-40 text-center glass rounded-[3rem] border-2 border-dashed border-white/5 opacity-50">
               <p className="text-xl font-bold">Nenhum salão cadastrado.</p>
            </div>
          )}
        </div>
      </>
        )}
      </div>
    </main>
  );
}
