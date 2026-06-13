'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function ConteudoSucesso() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Captura os dados dinâmicos enviados pelas telas anteriores
  const clienteNome = searchParams.get('nome') || 'Cliente';
  const dataAgendada = searchParams.get('data') || 'Data';
  const horarioAgendado = searchParams.get('horario') || 'Horário';
  const servicosAgendados = searchParams.get('servicos') || 'Serviços selecionados';
  const salaoNome = searchParams.get('salaoNome') || 'Estabelecimento';

  return (
    <div style={{ backgroundColor: '#020617', color: 'white', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px', fontFamily: 'sans-serif' }}>
      
      {/* Ícone de Sucesso */}
      <div style={{ width: '64px', height: '64px', borderRadius: '50%', border: '2px solid #22c55e', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
        <span style={{ color: '#22c55e', fontSize: '32px' }}>✓</span>
      </div>

      <h1 style={{ fontSize: '42px', fontWeight: 'bold', marginBottom: '16px', textAlign: 'center' }}>
        Agendamento<br />Realizado!
      </h1>
      
      <p style={{ color: '#94a3b8', textAlign: 'center', marginBottom: '32px', maxWidth: '400px' }}>
        Olá, {clienteNome}! Seu horário foi reservado e gravado com sucesso.
      </p>

      {/* Card de Resumo Dinâmico */}
      <div style={{ backgroundColor: '#0f172a', borderRadius: '12px', padding: '24px', width: '100%', maxWidth: '450px', border: '1px solid #1e293b', marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          <span style={{ color: '#64748b', fontSize: '14px' }}>Protocolo</span>
          <span style={{ color: 'white', fontWeight: 'bold' }}>#PRO-{Math.floor(100000 + Math.random() * 900000)}</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
          <div>
            <span style={{ color: '#a855f7', fontSize: '12px', fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>LOCAL</span>
            <span style={{ fontWeight: '600', color: 'white' }}>{salaoNome}</span>
          </div>
          <div>
            <span style={{ color: '#a855f7', fontSize: '12px', fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>DATA E HORA</span>
            <span style={{ textTransform: 'capitalize', color: 'white' }}>{dataAgendada} às {horarioAgendado}</span>
          </div>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <span style={{ color: '#a855f7', fontSize: '12px', fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>SERVIÇOS SELECIONADOS</span>
          <span style={{ fontWeight: '600', color: '#e2e8f0', fontSize: '14px', lineHeight: '1.4' }}>{servicosAgendados}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', borderTop: '1px solid #1e293b', paddingTop: '15px', color: '#94a3b8', fontSize: '14px' }}>
          <span>💬</span>
          <p>Enviamos as orientações para o seu WhatsApp.</p>
        </div>
      </div>

      {/* Botão para Voltar à Página Inicial */}
      <button
        onClick={() => router.push('/')}
        style={{
          padding: '12px 32px',
          backgroundColor: '#1e293b',
          color: 'white',
          border: '1px solid #334155',
          borderRadius: '6px',
          cursor: 'pointer',
          fontWeight: 'bold',
          fontSize: '15px',
          transition: '0.2s'
        }}
      >
        Voltar para a Página Inicial
      </button>

    </div>
  );
}

export default function AgendamentoSucessoPage() {
  return (
    <Suspense fallback={<p style={{ color: '#94a3b8', textAlign: 'center' }}>Carregando confirmação...</p>}>
      <ConteudoSucesso />
    </Suspense>
  );
}