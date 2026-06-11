/**
 * Utilitário para simulação de notificações (WhatsApp e Email)
 */

export interface NotificationPayload {
  to: string;
  clientName: string;
  salonName: string;
  serviceName: string;
  dateTime: string;
  type: 'WHATSAPP' | 'EMAIL';
}

export const sendReminder = async (payload: NotificationPayload): Promise<boolean> => {
  console.log(`[SIMULAÇÃO] Enviando lembrete via ${payload.type}...`);
  console.log(`Destinatário: ${payload.to}`);
  console.log(`Mensagem: Olá ${payload.clientName}, lembramos do seu agendamento de ${payload.serviceName} no ${payload.salonName} marcado para ${payload.dateTime}.`);
  
  // Simulando delay de rede
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`[SUCESSO] Lembrete enviado via ${payload.type}!`);
      resolve(true);
    }, 1500);
  });
};

export const formatWhatsAppLink = (phone: string, message: string) => {
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${phone}?text=${encodedMessage}`;
};

export const getReminderMessage = (clientName: string, salonName: string, dateTime: string) => {
  return `Olá ${clientName}! Confirmamos seu agendamento no ${salonName} para o dia ${dateTime}. Estamos te esperando!`;
};

export const getAppointmentTimeMessage = (clientName: string, salonName: string, dateTime: string) => {
  return `Olá ${clientName}! Seu atendimento no ${salonName} está começando agora (${dateTime}). Estamos prontos para você!`;
};

export const getBookingConfirmationMessage = (clientName: string, serviceName: string, salonName: string, dateTime: string) => {
  return `🎉 Olá ${clientName}! Seu agendamento foi confirmado! 📅 Serviço: ${serviceName} 📍 Local: ${salonName} ⏰ Data e Hora: ${dateTime} Obrigado por nos escolher!`;
};

export const formatPhoneNumber = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length < 11) return phone;
  const match = cleaned.match(/^(\d{2})(\d{5})(\d{4})$/);
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  return phone;
};
