"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

// 1. Buscar todos os salões do banco
export async function getSaloes() {
  try {
    const saloes = await prisma.salon.findMany({
      orderBy: { createdAt: 'desc' }
    })
    return { success: true, data: saloes }
  } catch (error) {
    console.error("Erro ao buscar salões:", error)
    return { success: false, data: [], error: "Erro ao carregar salões do banco." }
  }
}

// 2. Mudar status (Ativo / Em Manutenção)
export async function alternarStatusSalaon(id: string, statusAtual: string) {
  try {
    const novoStatus = statusAtual === "MANUTENCAO" ? "ACTIVE" : "MANUTENCAO"
    
    await prisma.salon.update({
      where: { id },
      data: { status: novoStatus }
    })
    
    revalidatePath("/admin")
    return { success: true }
  } catch (error) {
    console.error("Erro ao alternar status:", error)
    return { success: false, error: "Não foi possível alterar o status." }
  }
}

// 3. Alternar Destaque (Carrossel)
export async function alternarDestaqueSalon(id: string, destaqueAtual: boolean) {
  try {
    await prisma.salon.update({
      where: { id },
      data: { featured: !destaqueAtual }
    })
    
    revalidatePath("/admin")
    return { success: true }
  } catch (error) {
    console.error("Erro ao alternar destaque:", error)
    return { success: false, error: "Não foi possível alterar o destaque." }
  }
}

// 4. Atualizar dados básicos do salão (Editar)
export async function editarSalon(id: string, name: string, address: string) {
  try {
    await prisma.salon.update({
      where: { id },
      data: { name, address }
    })
    
    revalidatePath("/admin")
    return { success: true }
  } catch (error) {
    console.error("Erro ao editar salão:", error)
    return { success: false, error: "Não foi possível salvar as alterações." }
  }
}

// 5. Excluir salão do sistema
export async function excluirSalon(id: string) {
  try {
    await prisma.salon.delete({
      where: { id }
    })
    
    revalidatePath("/admin")
    return { success: true }
  } catch (error) {
    console.error("Erro ao excluir salão:", error)
    return { success: false, error: "Não foi possível deletar o estabelecimento." }
  }
}

// 6. Buscar os agendamentos de um salão específico (Para a Agenda)
export async function getAgendamentosPorSalao(salonId: string) {
  try {
    const agendamentos = await prisma.booking.findMany({
      where: { salonId },
      include: {
        client: { select: { name: true, email: true } },
        service: { select: { name: true, price: true } },
        professional: { select: { name: true } }
      },
      orderBy: { dateTime: 'asc' }
    })
    return { success: true, data: agendamentos }
  } catch (error) {
    console.error("Erro ao buscar agenda:", error)
    return { success: false, data: [], error: "Não foi possível carregar a agenda." }
  }
}

// 7. Verificar horários já ocupados para um salão em um dia específico
export async function getHorariosOcupados(salonId: string, dataSelecionada: string) {
  try {
    const inicioDia = new Date(`${dataSelecionada}T00:00:00`)
    const fimDia = new Date(`${dataSelecionada}T23:59:59`)

    const agendamentos = await prisma.booking.findMany({
      where: {
        salonId,
        dateTime: {
          gte: inicioDia,
          lte: fimDia
        },
        status: { not: "CANCELED" }
      },
      select: { dateTime: true }
    })

    const horasOcupadas = agendamentos.map(b => {
      const data = new Date(b.dateTime)
      return data.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
    })

    return { success: true, ocupados: horasOcupadas }
  } catch (error) {
    console.error("Erro ao validar horários:", error)
    return { success: false, ocupados: [], error: "Erro ao checar disponibilidade." }
  }
}
// 8. Salvar um novo agendamento no banco de dados
export async function criarAgendamento(data: {
  salonId: string;
  dia: string;
  hora: string;
  nome: string;
  telefone: string;
}) {
  try {
    // 1. Encontra ou cria um usuário genérico baseado no telefone informado
    // Isso é temporário até você integrar um sistema completo de login (Auth)
    const emailTemporario = `cliente-${data.telefone}@sistema.com`
    
    let usuario = await prisma.user.findUnique({
      where: { email: emailTemporario }
    })

    if (!usuario) {
      usuario = await prisma.user.create({
        data: {
          name: data.nome,
          email: emailTemporario,
          password: "senha_temporaria_semente", // String padrão requerida pelo seu schema
          role: "CLIENT"
        }
      })
    }

    // 2. Busca o primeiro serviço disponível do salão para vincular ao agendamento
    // (Ajuste no futuro para receber o ID do serviço real selecionado)
    const servico = await prisma.service.findFirst({
      where: { salonId: data.salonId }
    })

    if (!servico) {
      return { success: false, error: "Este salão não possui serviços cadastrados para vincular." }
    }

    // 3. Combina a string do dia (YYYY-MM-DD) e hora (HH:MM) em um objeto Date válido do JavaScript
    const dataHoraCombinada = new Date(`${data.dia}T${data.hora}:00`)

    // 4. Cria o agendamento baseado estritamente nas propriedades do seu schema.prisma
    await prisma.booking.create({
      data: {
        dateTime: dataHoraCombinada,
        status: "PENDING",
        clientId: usuario.id,
        salonId: data.salonId,
        serviceId: servico.id,
        notes: `Telefone de contato: ${data.telefone}`
      }
    })

    // Invalida o cache do painel para que a nova linha apareça na tabela de agendamentos
    revalidatePath("/admin")
    return { success: true }
  } catch (error) {
    console.error("Erro ao criar agendamento:", error)
    return { success: false, error: "Erro interno ao salvar no banco de dados." }
  }
}
// Atualizar o status de um agendamento (PENDING, CONFIRMED, COMPLETED, CANCELED)
export async function atualizarStatusAgendamento(bookingId: string, novoStatus: string) {
  try {
    await prisma.booking.update({
      where: { id: bookingId },
      data: { status: novoStatus }
    })

    revalidatePath("/admin/agenda")
    return { success: true }
  } catch (error) {
    console.error("Erro ao atualizar status do agendamento:", error)
    return { success: false, error: "Não foi possível alterar o status do agendamento." }
  }
}
// 10. Validar login do Administrador Master (Armazenado temporariamente em variáveis de ambiente)
export async function loginAdminMaster(password: string) {
  try {
    // Substitua 'admin123' pela senha master desejada para o seu painel
    const senhaMasterValida = "admin123"
    
    if (password === senhaMasterValida) {
      return { success: true }
    }
    return { success: false, error: "Senha administrativa incorreta." }
  } catch (error) {
    return { success: false, error: "Erro no processo de autenticação." }
  }
}

// 11. Redefinir/Alterar a senha de um salão (Dono/User) caso percam o acesso
export async function redefinirSenhaSalao(ownerId: string, novaSenhaInformada: string) {
  try {
    if (!novaSenhaInformada || novaSenhaInformada.trim().length < 4) {
      return { success: false, error: "A nova senha precisa ter pelo menos 4 caracteres." }
    }

    await prisma.user.update({
      where: { id: ownerId },
      data: { password: novaSenhaInformada.trim() }
    })

    return { success: true }
  } catch (error) {
    console.error("Erro ao redefinir senha:", error)
    return { success: false, error: "Não foi possível atualizar a senha no banco de dados." }
  }
}
// 12. Alterar a senha Master do administrador direto pelo Painel
export async function alterarSenhaMasterPainel(novaSenhaMaster: string) {
  try {
    if (!novaSenhaMaster || novaSenhaMaster.trim().length < 4) {
      return { success: false, error: "A senha master precisa de pelo menos 4 caracteres." }
    }

    // Atualiza ou cria o usuário master no banco de dados
    await prisma.user.upsert({
      where: { email: "admin@master.com" },
      update: { password: novaSenhaMaster.trim() },
      create: {
        name: "Admin Master",
        email: "admin@master.com",
        password: novaSenhaMaster.trim(),
        role: "ADMIN"
      }
    })

    return { success: true }
  } catch (error) {
    console.error("Erro ao alterar senha master:", error)
    return { success: false, error: "Erro ao gravar nova senha master no banco." }
  }
}

// 13. Modificar o login anterior para checar primeiro no banco de dados
export async function loginAdminMasterAtualizado(password: string) {
  try {
    // Busca se já existe uma senha personalizada salva no banco
    const usuarioMaster = await prisma.user.findUnique({
      where: { email: "admin@master.com" }
    })

    // Se achou no banco, valida contra ela. Se não achou, usa 'admin123' como padrão de fábrica.
    const senhaValida = usuarioMaster ? usuarioMaster.password : "admin123"

    if (password === senhaValida) {
      return { success: true }
    }
    return { success: false, error: "Senha administrativa incorreta." }
  } catch (error) {
    return { success: false, error: "Erro no processo de autenticação." }
  }
}
