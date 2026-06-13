'use client';

import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useState, Suspense } from 'react';

function FormularioIdentificacao() {
  const { id } = useParams(); 
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const data = searchParams.get('data') || '';
  const horario = searchParams.get('horario') || '';
  const servicos = searchParams.get('servicos') || '';
  const salaoNome = searchParams.get('salaoNome') || '';

  const [nome, setNome] = useState('');
  const [celular, setCelular] = useState('');
  const [carregando, setCarregando] = useState(false);

  // Formata o celular automaticamente como (XX) XXXXX-XXXX
  const lidarComCelularChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let valor = e.target.value.replace(/\D/g, "");
    if (valor.length <= 11) {
      valor = valor.replace(/^(\d{2})(\d)/g, "($1) $2");
      valor = valor.replace(/(\d{5})(\d)/, "$1-$2");
    }
    setCelular(valor.substring(0, 15));
  };

  const finalizarAgendamento = async (e: React.FormEvent) => {
    e.preventDefault();
    setCarregando(true);

    try {
      // Avança passando todas as informações recolhidas para a tela de sucesso
      router.push(
        `/salon/${id}/agendamento-sucesso?` +
        `nome=${encodeURIComponent(nome)}` +
        `&data=${encodeURIComponent(data)}` +
        `&horario=${encodeURIComponent(horario)}` +
        `&servicos=${encodeURIComponent(servicos)}` +
        `&salaoNome=${encodeURIComponent(salaoNome)}`
      );
    } catch (error) {
      console.error(error);
      alert('Erro ao confirmar agendamento.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#0f172a', borderRadius: '12px', padding: '32px', width: '100%', maxWidth: '400px', border: '1px solid #1e293b' }}>
      <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px' }}>Quase lá!</h2>
      <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '20px' }}>Insira seus dados para finalizar.</p>

      {/* Resumo do agendamento */}
      <div style={{ backgroundColor: '#020617', padding: '12px', borderRadius: '6px', marginBottom: '20px', fontSize: '14px', border: '1px solid #1e293b' }}>
        <p style={{ color: '#94a3b8' }}>📍 <strong>Local:</strong> {salaoNome}</p>
        <p style={{ color: '#94a3b8', marginTop: '4px' }}>✂️ <strong>Serviços:</strong> {servicos}</p>
        <p style={{ color: '#94a3b8', marginTop: '4px' }}>⏰ <strong>Horário:</strong> {data} às {horario}</p>
      </div>

      <form onSubmit={finalizarAgendamento} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '14px', color: '#a855f7', fontWeight: 'bold', marginBottom: '6px' }}>
            NOME COMPLETO
          </label>
          <input 
            type="text" 
            value={nome} 
            onChange={(e) => setNome(e.target.value)} 
            placeholder="Digite seu nome" 
            required 
            style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #1e293b', backgroundColor: '#020617', color: 'white', outline: 'none' }} 
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '14px', color: '#a855f7', fontWeight: 'bold', marginBottom: '6px' }}>
            CELULAR (WHATSAPP)
          </label>
          <input 
            type="text" 
            value={celular} 
            onChange={lidarComCelularChange} 
            placeholder="(00) 00000-0000" 
            required 
            style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #1e293b', backgroundColor: '#020617', color: 'white', outline: 'none' }} 
          />
        </div>

        <button 
          type="submit" 
          disabled={carregando} 
          style={{ width: '100%', padding: '14px', backgroundColor: carregando ? '#6b21a8' : '#9333ea', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px', marginTop: '8px' }}
        >
          {carregando ? 'Confirmando...' : 'Confirmar Agendamento'}
        </button>
      </form>
    </div>
  );
}

export default function IdentificacaoPage() {
  return (
    <div style={{ backgroundColor: '#020617', color: 'white', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px', fontFamily: 'sans-serif' }}>
      <Suspense fallback={<p style={{ color: '#94a3b8' }}>Carregando formulário...</p>}>
        <FormularioIdentificacao />
      </Suspense>
    </div>
  );
}