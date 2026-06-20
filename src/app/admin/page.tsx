"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { getSaloes, alternarStatusSalaon, alternarDestaqueSalon, editarSalon, excluirSalon, loginAdminMasterAtualizado, redefinirSenhaSalao, alterarSenhaMasterPainel } from "./actions"

export default function AdminPage() {
  const [saloes, setSaloes] = useState<any[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState<string | null>(null)
  const [estaLogado, setEstaLogado] = useState(false)
  const [senhaInput, setSenhaInput] = useState("")
  const [erroLogin, setErroLogin] = useState<string | null>(null)

  useEffect(() => {
    if (localStorage.getItem("admin_autenticado") === "true") {
      setEstaLogado(true)
      carregarDados()
    } else { setCarregando(false) }
  }, [])

  async function carregarDados() {
    setCarregando(true)
    const res = await getSaloes()
    if (res.success) { setSaloes(res.data); setErro(null) }
    else { setErro(res.error || "Erro desconhecido") }
    setCarregando(false)
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setErroLogin(null)
    const res = await loginAdminMasterAtualizado(senhaInput)
    if (res.success) {
      localStorage.setItem("admin_autenticado", "true")
      setEstaLogado(true)
      carregarDados()
    } else { setErroLogin(res.error || "Senha inválida") }
  }

  async function handleTrocarSenhaMaster() {
    const novaSenha = prompt("Digite a nova Senha Master para acessar este Painel:")
    if (novaSenha === null) return
    const res = await alterarSenhaMasterPainel(novaSenha)
    if (res.success) alert(`✅ Senha Master alterada com sucesso! Use a nova senha no próximo acesso.`)
    else alert(`❌ Erro: ${res.error}`)
  }

  async function handleResetarSenha(ownerId: string, nomeSalao: string) {
    const novaSenha = prompt(`Digite a nova senha para o salão "${nomeSalao}":`)
    if (novaSenha === null) return
    const res = await redefinirSenhaSalao(ownerId, novaSenha)
    if (res.success) alert(`✅ Senha alterada para: ${novaSenha}`)
    else alert(`❌ Erro: ${res.error}`)
  }

  async function handleStatus(id: string, atual: string) {
    if ((await alternarStatusSalaon(id, atual)).success) carregarDados()
  }

  async function handleDestaque(id: string, atual: boolean) {
    if ((await alternarDestaqueSalon(id, atual)).success) carregarDados()
  }

  async function handleEditar(id: string, nome: string, endereco: string) {
    const n = prompt("Novo nome:", nome), e = prompt("Novo endereço:", endereco)
    if (n && e && (await editarSalon(id, n, e)).success) carregarDados()
  }

  async function handleExcluir(id: string, name: string) {
    if (confirm(`Excluir permanentemente "${name}"?`) && (await excluirSalon(id)).success) carregarDados()
  }

  if (!estaLogado) {
    return (
      <div className="min-h-screen bg-[#050507] flex items-center justify-center p-4">
        <form onSubmit={handleLogin} className="w-full max-w-sm bg-[#121214] border border-zinc-800 rounded-xl p-6 space-y-4 shadow-2xl">
          <div className="text-center space-y-1">
            <h1 className="text-xl font-bold text-white">Acesso Restrito</h1>
            <p className="text-xs text-zinc-500">Insira a credencial master do ServiçosPró</p>
          </div>
          <input type="password" placeholder="Senha master" value={senhaInput} onChange={(e) => setSenhaInput(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500" />
          {erroLogin && <p className="text-red-400 text-xs">{erroLogin}</p>}
          <button type="submit" className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-semibold">Entrar no Painel</button>
        </form>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#09090b] text-white p-8">
      <div className="flex justify-between items-start mb-8">
        <div>
          <span className="text-sm font-semibold text-purple-500 uppercase">Painel Master</span>
          <h1 className="text-3xl font-bold">Administração do Sistema</h1>
        </div>
        <div className="flex gap-2">
          {/* Novo botão para alterar a senha administrativa */}
          <button onClick={handleTrocarSenhaMaster} className="text-xs bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-amber-400 px-3 py-1.5 rounded-lg transition-colors">
            ⚙️ Mudar Senha Master
          </button>
          <button onClick={() => { localStorage.removeItem("admin_autenticado"); setEstaLogado(false) }} className="text-xs bg-zinc-900 border border-zinc-800 text-zinc-400 px-3 py-1.5 rounded-lg">🔒 Sair</button>
        </div>
      </div>

      <div className="bg-[#121214] rounded-xl border border-zinc-800 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-medium text-zinc-200">Salões ({saloes.length})</h2>
          <button onClick={carregarDados} className="text-xs bg-zinc-800 hover:bg-zinc-700 px-3 py-1.5 rounded-md border border-zinc-700">Atualizar</button>
        </div>

        {erro && <p className="text-red-400 bg-red-500/10 p-4 rounded-lg mb-4 text-sm">{erro}</p>}

        {carregando ? <div className="text-center py-12 text-zinc-500 text-sm">Carregando...</div> : saloes.length === 0 ? <div className="text-center py-12 text-zinc-500 text-sm border border-dashed border-zinc-800 rounded-lg">Nenhum salão cadastrado.</div> : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-zinc-800 text-zinc-400 text-xs font-medium uppercase">
                  <th className="py-3 px-4">Salão</th>
                  <th className="py-3 px-4">Contato</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/50 text-zinc-300">
                {saloes.map((salao: any) => {
                  const m = salao.status === "MANUTENCAO", d = !!salao.featured
                  return (
                    <tr key={salao.id} className="hover:bg-zinc-800/10">
                      <td className="py-4 px-4 font-medium text-white"><div>{salao.name}</div><div className="text-xs text-zinc-500 font-normal">{salao.address}</div></td>
                      <td className="py-4 px-4 text-zinc-400"><div>{salao.city}</div><div className="text-xs text-zinc-500">{salao.phone || "Sem tel"}</div></td>
                      <td className="py-4 px-4">
                        <div className="flex gap-2">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${m ? "bg-amber-500/10 text-amber-400 border-amber-500/20" : "bg-green-500/10 text-green-400 border-green-500/20"}`}>{m ? "Manutenção" : "Ativo"}</span>
                          {d && <span className="bg-purple-500/10 text-purple-400 border border-purple-500/20 px-2 py-0.5 rounded-full text-xs font-medium">★ Destaque</span>}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-right flex justify-end gap-2">
                        <Link href={`/admin/agenda/${salao.id}`} className="px-2.5 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-md text-xs font-medium">📅 Agenda</Link>
                        <button onClick={() => handleResetarSenha(salao.ownerId, salao.name)} className="px-2.5 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-amber-400 border border-zinc-700 rounded-md text-xs font-medium">🔑 Senha</button>
                        <button onClick={() => handleDestaque(salao.id, salao.featured)} className={`px-2.5 py-1.5 rounded-md text-xs font-medium border ${d ? "bg-purple-500/20 text-purple-300 border-purple-500/40" : "bg-zinc-800 border-zinc-700 text-zinc-400"}`}>{d ? "★ Destacado" : "☆ Destacar"}</button>
                        <button onClick={() => handleEditar(salao.id, salao.name, salao.address)} className="px-2.5 py-1.5 bg-zinc-800 border border-zinc-700 rounded-md text-xs font-medium">Editar</button>
                        <button onClick={() => handleStatus(salao.id, salao.status)} className="px-2.5 py-1.5 bg-zinc-800 border border-zinc-700 rounded-md text-xs font-medium">{m ? "Ativar" : "Pausar"}</button>
                        <button onClick={() => handleExcluir(salao.id, salao.name)} className="px-2.5 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-md text-xs font-medium">Excluir</button>
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
