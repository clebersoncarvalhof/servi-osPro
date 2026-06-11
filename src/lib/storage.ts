/**
 * Utilitário para persistência local usando localStorage
 */

import { SALONS as MOCK_SALONS } from "./mock-data";

export interface Salon {
  id: string;
  name: string;
  category: string;
  city: string;
  address: string;
  rating: number;
  status: string;
  featured?: boolean;
  description: string;
  imageUrl?: string;
  imageUrls?: string[];
  services: any[];
  businessHours?: string;
  email?: string;
  password?: string;
}

export const getSalonByEmail = (email: string): Salon | undefined => {
  if (typeof window === "undefined") return undefined;
  const salons = getSalons();
  return salons.find((salon) => salon.email?.toLowerCase() === email.toLowerCase());
};

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export interface Booking {
  id: string;
  salonId: string;
  salonName: string;
  serviceName: string;
  clientName: string;
  clientPhone: string;
  date: string; // "12 de Junho"
  time: string; // "14:00"
  timestamp: number;
}

export interface SalonRequest {
  id: string;
  name: string;
  category: string;
  city: string;
  address: string;
  description: string;
  imageUrl?: string;
  imageUrls?: string[];
  services: any[];
  businessHours?: string;
  email: string;
  phone: string;
  contactName: string;
  password: string;
  status: "pending" | "approved" | "rejected";
  submittedAt: number;
  rejectionReason?: string;
}

const SALONS_KEY = "servicos_pro_salons";
const USERS_KEY = "servicos_pro_users";
const BOOKINGS_KEY = "servicos_pro_bookings";
const SALON_REQUESTS_KEY = "servicos_pro_salon_requests";
const ADMIN_PASSWORD_KEY = "servicos_pro_admin_password";
const DEFAULT_ADMIN_PASSWORD = "servicospro";

export const getAdminPassword = (): string => {
  if (typeof window === "undefined") return DEFAULT_ADMIN_PASSWORD;
  return (
    localStorage.getItem(ADMIN_PASSWORD_KEY) ||
    process.env.NEXT_PUBLIC_ADMIN_PASSWORD ||
    DEFAULT_ADMIN_PASSWORD
  );
};

export const setAdminPassword = (password: string) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(ADMIN_PASSWORD_KEY, password);
};

export const updateSalonPassword = (salonId: string, password: string) => {
  if (typeof window === "undefined") return;
  const salons = getSalons();
  const index = salons.findIndex((salon) => salon.id === salonId);
  if (index >= 0) {
    salons[index] = { ...salons[index], password };
    localStorage.setItem(SALONS_KEY, JSON.stringify(salons));
  }
};

export const getSalons = (): Salon[] => {
  if (typeof window === "undefined") return MOCK_SALONS;
  const stored = localStorage.getItem(SALONS_KEY);
  if (!stored) {
    localStorage.setItem(SALONS_KEY, JSON.stringify(MOCK_SALONS));
    return MOCK_SALONS;
  }
  return JSON.parse(stored);
};

export const saveSalon = (salon: Salon) => {
  const salons = getSalons();
  const index = salons.findIndex(s => s.id === salon.id);
  if (index >= 0) {
    salons[index] = salon;
  } else {
    salons.push(salon);
  }
  localStorage.setItem(SALONS_KEY, JSON.stringify(salons));
};

export const deleteSalon = (id: string) => {
  const salons = getSalons().filter(s => s.id !== id);
  localStorage.setItem(SALONS_KEY, JSON.stringify(salons));
};

// Gerenciamento de Agendamentos (Bookings)
export const getUsers = (): User[] => {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(USERS_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const getUserByEmail = (email: string): User | undefined => {
  return getUsers().find((user) => user.email?.toLowerCase() === email.toLowerCase());
};

export const saveUser = (user: User) => {
  const users = getUsers();
  const index = users.findIndex((existing) => existing.email.toLowerCase() === user.email.toLowerCase());
  if (index >= 0) {
    users[index] = user;
  } else {
    users.push(user);
  }
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const getBookings = (): Booking[] => {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(BOOKINGS_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const saveBooking = (booking: Booking) => {
  const bookings = getBookings();
  bookings.push(booking);
  localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));
};

export const isSlotOccupied = (salonId: string, date: string, time: string): boolean => {
  const bookings = getBookings();
  return bookings.some(b => b.salonId === salonId && b.date === date && b.time === time);
};

// Gerenciamento de Pedidos de Cadastro
export const getSalonRequests = (): SalonRequest[] => {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(SALON_REQUESTS_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const saveSalonRequest = (request: SalonRequest) => {
  const requests = getSalonRequests();
  const index = requests.findIndex(r => r.id === request.id);
  if (index >= 0) {
    requests[index] = request;
  } else {
    requests.push(request);
  }
  localStorage.setItem(SALON_REQUESTS_KEY, JSON.stringify(requests));
};

export const deleteSalonRequest = (id: string) => {
  const requests = getSalonRequests().filter(r => r.id !== id);
  localStorage.setItem(SALON_REQUESTS_KEY, JSON.stringify(requests));
};

export const approveSalonRequest = (requestId: string): Salon | null => {
  const requests = getSalonRequests();
  const request = requests.find(r => r.id === requestId);
  
  if (!request) return null;

  const newSalon: Salon = {
    id: request.id,
    name: request.name,
    category: request.category,
    city: request.city,
    address: request.address,
    rating: 5.0,
    status: "Aberto",
    featured: false,
    description: request.description,
    imageUrl: request.imageUrl,
    imageUrls: request.imageUrls,
    services: request.services,
    businessHours: request.businessHours,
    email: request.email,
    password: request.password,
  };

  saveSalon(newSalon);
  request.status = "approved";
  saveSalonRequest(request);

  return newSalon;
};

export const rejectSalonRequest = (requestId: string, reason: string) => {
  const requests = getSalonRequests();
  const request = requests.find(r => r.id === requestId);
  
  if (request) {
    request.status = "rejected";
    request.rejectionReason = reason;
    saveSalonRequest(request);
  }
};
