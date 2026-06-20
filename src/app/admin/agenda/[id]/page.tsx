"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { getAgendamentosPorSalao, atualizarStatusAgendamento } from "../../actions"

interface AgendaProps {
  params: { id: string }
}

export default function AgendaAdminPage({ params }: AgendaProps) {
  const salonId = params.id

  const [agendamentos, setAgendamentos] = useState<any[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState<string | null>(null)

  async function carregarAgenda() {
    setCarregando(true)
    const resposta = await getAgendamentosPorSalao(salonId)
    if (resposta.success) {
      setAgendamentos(resposta.data)
      setErro(null)
    } else {
      setErro(resposta.error || "Erro ao carregar compromissos.")
    }
    setCarregando(false)
  }

  useEffect(() => {
    carregarAgenda()
  }, [salonId])

  async function handleMudarStatus(bookingId: string, novoStatus: string) {
    const resposta = await atualizarStatusAgendamento(bookingId, novoStatus)
    if (resposta.success) {
      setAgendamentos(prev => 
        prev.map(b => b.id === bookingId ? { ...b, status: novoStatus } : b)
      )
    } else {
      alert(resposta.error)
    }
  }

  return (
    <div className="min-h-screen bg-[#09090b] text-white p-8">
      <div className="mb-6 flex flex-col gap-2">
        <Link href="/admin" className="text-xs text-purple-400 hover:underline">
          ← Voltar para Painel Admin
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">Compromissos Agendados</h1>
        <p className="text-sm text-zinc-500">ID do Salão: {salonId}</p>
      </div>

      <div className="bg-[#121214] rounded-xl border border-zinc-800 p-6">
        {erro && <p className="text-red-400 bg-red-500/10 p-4 rounded-lg mb-4 text-sm">{erro}</p>}

        {carregando ? (
          <div className="text-center py-12 text-zinc-500 text-sm">Buscando horários marcados...</div>
        ) : agendamentos.length === 0 ? (
          <div className="text-center py-12 text-zinc-500 text-sm border border-dashed border-zinc-800 rounded-lg">
            Nenhum agendamento encontrado para este estabelecimento.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-800 text-zinc-400 text-sm font-medium">
                  <th className="py-3 px-4">Data / Horário</th>
                  <th className="py-3 px-4">Cliente</th>
                  <th className="py-3 px-4">Serviço</th>
                  <th className="py-3 px-4">Profissional</th>
                  <th className="py-3 px-4">Status (Ações do Salão)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/50 text-sm text-zinc-300">
                {agendamentos.map((booking: any) => {
                  const dataFormatada = new Date(booking.dateTime).toLocaleString("pt-BR", {
                    dateStyle: "short",
                    timeStyle: "short"
                  })

                  return (
                    <tr key={booking.id} className="hover:bg-zinc-800/10 transition-colors">
                      <td className="py-4 px-4 font-medium text-purple-400">{dataFormatada}</td>
                      <td className="py-4 px-4">
                        <div>{booking.client?.name || "Sem Nome"}</div>
                        <div className="text-xs text-zinc-500">{booking.client?.email}</div>
                      </td>
                      <td className="py-4 px-4">
                        <div>{booking.service?.name}</div>
                        <div className="text-xs text-zinc-500">
                          R$ {booking.service?.price?.toFixed(2)}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-zinc-400">
                        {booking.professional?.name || "Qualquer disponível"}
                      </td>
                      <td className="py-4 px-4">
                        <select
                          value={booking.status}
                          onChange={(e) => handleMudarStatus(booking.id, e.target.value)}
                          className={`px-3 py-1.5 rounded-lg border text-xs font-semibold focus:outline-none bg-zinc-900 cursor-pointer transition-colors ${
                            booking.status === "CONFIRMED"
                              ? "text-green-400 border-green-500/30"
                              : booking.status === "COMPLETED"
                              ? "text-blue-400 border-blue-500/30"
                              : booking.status === "CANCELED"
                              ? "text-red-400 border-red-500/30"
                              : "text-amber-400 border-amber-500/30"
                          }`}
                        >
                          <option value="PENDING" className="text-amber-400 bg-[#121214]">⏳ Pendente</option>
                          <option value="CONFIRMED" className="text-green-400 bg-[#121214]">✅ Confirmado</option>
                          <option value="COMPLETED" className="text-blue-400 bg-[#121214]">🏁 Concluído</option>
                          <option value="CANCELED" className="text-red-400 bg-[#121214]">❌ Cancelado</option>
                        </select>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
