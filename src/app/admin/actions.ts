"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// Função para buscar todos os salões pendentes do banco SQLite
export async function getPendingSalons() {
  try {
    const salons = await prisma.salon.findMany({
      where: { status: "PENDING" },
      include: {
        owner: true,
        services: true,
      },
      orderBy: { createdAt: "desc" },
    });
    return { success: true, data: salons };
  } catch (error) {
    console.error("Erro ao buscar salões:", error);
    return { success: false, data: [] };
  }
}

// Função para aprovar ou recusar o salão clicado
export async function updateStatusAction(salonId: string, status: "APPROVED" | "REJECTED") {
  try {
    await prisma.salon.update({
      where: { id: salonId },
      data: { status },
    });
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Erro ao atualizar status:", error);
    return { success: false };
  }
}
