"use client"

import { useState } from "react"
import { getHorariosOcupados, criarAgendamento } from "@/app/admin/actions"

const SALAO_MOCK = {
  name: "CLEBERSON CRISTIANO DE CARVALHO",
  description: "fffffffff",
  address: "Capão Bonito-SP - Rua Ribeiro, 96",
  phone: "15997628408",
  businessHours: "Horário não informado"
}

const SERVICOS_MOCK = [
  { id: "1", name: "Corte de Cabelo", duration: 30 },
  { id: "2", name: "Sobrancelha", duration: 30 },
  { id: "3", name: "Unhas", duration: 30 }
]

const HORARIOS_PADRAO = ["08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30"]

export default function SalonPage({ params }: { params: { id: string } }) {
  const [servicos, setServicos] = useState<string[]>([])
  const [exibir, setExibir] = useState(false)
  const [dia, setDia] = useState("")
  const [hora, setHora] = useState("")
  const [ocupados, setOcupados] = useState<string[]>([])
  const [carregando, setCarregando] = useState(false)
  const [nome, setNome] = useState("")
  const [tel, setTel] = useState("")

  const listaDias = []
  for (let i = 0; i < 7; i++) {
    const d = new Date()
    d.setDate(d.getDate() + i)
    listaDias.push({
      iso: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`,
      texto: d.toLocaleDateString("pt-BR", { weekday: "short", day: "numeric", month: "short" })
    })
  }

  async function selecionarDia(isoDate: string) {
    setDia(isoDate)
    setHora("")
    setCarregando(true)
    const res = await getHorariosOcupados(params.id, isoDate)
    if (res.success && res.ocupados) setOcupados(res.ocupados)
    setCarregando(false)
  }

  async function finalizar() {
    const res = await criarAgendamento({ salonId: params.id, dia, hora, nome, telefone: tel })
    if (res.success) {
      alert("✅ Gravado com sucesso no banco de dados!")
      setNome(""); setTel(""); setHora("")
    } else {
      alert(`❌ Falha: ${res.error}`)
    }
  }

  const formularioValido = dia && hora && nome.trim().length >= 3 && tel.trim().length >= 8

  return (
    <div className="min-h-screen bg-[#09090b] text-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="bg-[#121214] border border-zinc-800 rounded-xl p-6 space-y-2">
          <h1 className="text-xl font-bold uppercase">{SALAO_MOCK.name}</h1>
          <p className="text-zinc-500 text-xs">{SALAO_MOCK.description}</p>
          <p className="text-xs text-zinc-400 pt-2 border-t border-zinc-800">📍 {SALAO_MOCK.address} | 📞 {SALAO_MOCK.phone}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          <div className="lg:col-span-2 bg-[#121214] border border-zinc-800 rounded-xl p-6 space-y-4">
            <h2 className="text-sm font-semibold text-zinc-200">Serviços Disponíveis</h2>
            <div className="space-y-2">
              {SERVICOS_MOCK.map((s) => {
                const m = servicos.includes(s.id)
                return (
                  <div key={s.id} onClick={() => setServicos(m ? servicos.filter(id => id !== s.id) : [...servicos, s.id])} className={`flex justify-between p-4 rounded-xl border cursor-pointer ${m ? "bg-purple-600/10 border-purple-500" : "bg-zinc-950 border-zinc-800"}`}>
                    <div className="flex items-center gap-3">
                      <input type="checkbox" checked={m} readOnly className="accent-purple-500" />
                      <div><p className="text-sm font-semibold">{s.name}</p><p className="text-xs text-zinc-500">{s.duration} min</p></div>
                    </div>
                    <span className="text-xs text-zinc-400">A combinar</span>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="bg-[#121214] border border-zinc-800 rounded-xl p-6 space-y-4">
            <h3 className="text-xs font-semibold uppercase text-purple-400">Resumo</h3>
            <div className="text-xs text-zinc-400 flex justify-between"><span>Selecionados:</span><span>{servicos.length}</span></div>
            <button onClick={() => setExibir(true)} disabled={servicos.length === 0} className="w-full py-3 bg-purple-600 hover:bg-purple-700 disabled:opacity-40 text-white rounded-xl text-xs font-medium">
              Prosseguir para Horários
            </button>
          </div>
        </div>

        {exibir && (
          <div className="bg-[#121214] border border-zinc-800 rounded-xl p-6 space-y-6">
            <div>
              <h3 className="text-xs font-semibold text-zinc-200 mb-2">1. Escolha o Dia</h3>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {listaDias.map((d) => (
                  <button key={d.iso} type="button" onClick={() => selecionarDia(d.iso)} className={`px-4 py-2 rounded-lg border text-xs font-medium ${dia === d.iso ? "bg-purple-600 border-purple-500 text-white" : "bg-zinc-900 border-zinc-800 text-zinc-400"}`}>{d.texto}</button>
                ))}
              </div>
            </div>

            {dia && (
              <div className="space-y-2">
                <h3 className="text-xs font-semibold text-zinc-200">2. Horários Disponíveis</h3>
                {carregando ? <p className="text-xs text-zinc-500">Buscando...</p> : (
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {HORARIOS_PADRAO.map((h) => {
                      const o = ocupados.includes(h), s = hora === h
                      return (
                        <button key={h} type="button" disabled={o} onClick={() => setHora(h)} className={`py-2 rounded-lg border text-xs font-medium ${o ? "bg-zinc-950 border-zinc-900 text-zinc-600 line-through cursor-not-allowed" : s ? "bg-purple-600 border-purple-500 text-white" : "bg-zinc-900 border-zinc-800 text-zinc-300"}`}>{h} {o && "(Ocupado)"}</button>
                      )
                    })}
                  </div>
                )}
              </div>
            )}

            {hora && (
              <div className="pt-4 border-t border-zinc-800 space-y-3">
                <h3 className="text-xs font-semibold text-zinc-200">3. Seus Dados de Contato</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1"><label className="text-xs text-zinc-400">Nome Completo *</label><input type="text" placeholder="Nome" value={nome} onChange={(e) => setNome(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500" /></div>
                  <div className="space-y-1"><label className="text-xs text-zinc-400">WhatsApp *</label><input type="text" placeholder="WhatsApp" value={tel} onChange={(e) => setTel(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500" /></div>
                </div>
                <div className="pt-4 flex flex-col sm:flex-row justify-between items-center gap-2">
                  <p className="text-xs text-zinc-500">{!formularioValido && "⚠️ Preencha nome e WhatsApp para confirmar."}</p>
                  <button type="button" disabled={!formularioValido} className="w-full sm:w-auto px-6 py-2.5 bg-green-600 hover:bg-green-700 disabled:opacity-30 disabled:cursor-not-allowed text-white rounded-xl text-xs font-medium" onClick={finalizar}>Confirmar Agendamento Final</button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
