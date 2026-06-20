"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function AnunciarPage() {
  const router = useRouter()
  const [nome, setNome] = useState("")
  const [cidade, setCidade] = useState("")

  function handleAnunciar(e: React.FormEvent) {
    e.preventDefault()
    alert("Próximo passo: Programar a nova Server Action de cadastro de salão.")
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-[#050507] text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#121214] border border-zinc-800 rounded-xl p-6 space-y-6">
        <div className="space-y-1 text-center">
          <h1 className="text-xl font-bold">Cadastre seu Estabelecimento</h1>
          <p className="text-xs text-zinc-500">Aumente seus agendamentos com o ServiçosPró</p>
        </div>

        <form onSubmit={handleAnunciar} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs text-zinc-400">Nome do Salão / Barbearia</label>
            <input 
              type="text" 
              required
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-purple-500" 
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-zinc-400">Cidade</label>
            <input 
              type="text" 
              required
              value={cidade}
              onChange={(e) => setCidade(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-purple-500" 
            />
          </div>

          <button type="submit" className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg text-xs tracking-wide transition-colors">
            Enviar Cadastro para Análise
          </button>
        </form>
      </div>
    </div>
  )
}
