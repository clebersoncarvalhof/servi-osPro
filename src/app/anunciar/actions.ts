"use server";

import { prisma } from "../../lib/prisma";
import { revalidatePath } from "next/cache";
import bcrypt from "bcrypt";

// 1. Busca salões pendentes e aprovados
export async function getAllSalonsData() {
  try {
    const salons = await prisma.salon.findMany({
      include: {
        owner: true,
        services: true,
      },
      orderBy: { createdAt: "desc" },
    });
    return { success: true, data: salons };
  } catch (error) {
    console.error(error);
    return { success: false, data: [] };
  }
}

// 2. Busca todos os agendamentos realizados na plataforma
export async function getAllBookingsData() {
  try {
    const bookings = await prisma.booking.findMany({
      include: {
        client: true,
        salon: true,
        service: true,
      },
      orderBy: { dateTime: "asc" },
    });
    return { success: true, data: bookings };
  } catch (error) {
    console.error(error);
    return { success: false, data: [] };
  }
}

// 3. Atualiza o Status de Aprovação
export async function updateStatusAction(salonId: string, status: string) {
  try {
    await prisma.salon.update({
      where: { id: salonId },
      data: { status },
    });
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}

// 4. Ativa/Desativa o salão na Página Principal (Destaque)
export async function toggleFeaturedAction(salonId: string, currentFeatured: boolean) {
  try {
    await prisma.salon.update({
      where: { id: salonId },
      data: { featured: !currentFeatured },
    });
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}

// 5. Altera a senha de qualquer profissional diretamente pelo admin
export async function changeSalonPasswordAction(ownerId: string, passwordNova: string) {
  try {
    const hashedPassword = await bcrypt.hash(passwordNova, 10);
    await prisma.user.update({
      where: { id: ownerId },
      data: { password: hashedPassword },
    });
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}
