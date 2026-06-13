'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { getSalons, Salon } from "@/lib/storage";

interface Servico {
  id: string;
  nome: string;
  preco: string;
}

export default function SalaoDetalhesPage() {
  const { id } = useParams();
  const router = useRouter();
  
  const [salaoData, setSalaoData] = useState<Salon | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [servicosSelecionados, setServicosSelecionados] = useState<string[]>([]);
  const [dataSelecionada, setDataSelecionada] = useState('');
  const [horarioSelecionado, setHorarioSelecionado] = useState('');
  const [proximasDatas, setProximasDatas] = useState<{ original: string; formatada: string }[]>([]);

  // Carrega os dados reais do estabelecimento clicado usando o ID da URL
  useEffect(() => {
    const listaSalons = getSalons();
    const salaoEncontrado = listaSalons.find(s => String(s.id) === String(id));
    
    if (salaoEncontrado) {
      setSalaoData(salaoEncontrado);
    }
    setCarregando(false);
  }, [id]);

  // Lista dinâmica de serviços
  const servicos: Servico[] = [
    { id: 's1', nome: "Corte de Cabelo Masculino", preco: "R$ 45,00" },
    { id: 's2', nome: "Barba Completa", preco: "R$ 35,00" },
    { id: 's3', nome: "Sobrancelha", preco: "R$ 15,00" }
  ];

  const horariosDisponiveis = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'];

  // Gera as 7 datas
  useEffect(() => {
    const datas = [];
    const hoje = new Date();
    for (let i = 0; i < 7; i++) {
      const novaData = new Date(hoje);
      novaData.setDate(hoje.getDate() + i);
      const ano = novaData.getFullYear();
      const mes = String(novaData.getMonth() + 1).padStart(2, '0');
      const dia = String(novaData.getDate()).padStart(2, '0');
      datas.push({
        original: `${ano}-${mes}-${dia}`,
        formatada: novaData.toLocaleDateString('pt-BR', { weekday: 'short', day: 'numeric', month: 'short' })
      });
    }
    setProximasDatas(datas);
    if (datas.length > 0) setDataSelecionada(datas[0].original);
  }, []);

  const alternarServico = (idServico: string) => {
    if (servicosSelecionados.includes(idServico)) {
      setServicosSelecionados(servicosSelecionados.filter(sid => sid !== idServico));
    } else {
      setServicosSelecionados([...servicosSelecionados, idServico]);
    }
  };

  const avancarParaIdentificacao = () => {
    if (servicosSelecionados.length === 0) {
      alert('Por favor, selecione pelo menos 1 serviço.');
      return;
    }
    if (!horarioSelecionado) {
      alert('Por favor, escolha o horário.');
      return;
    }

    const nomesServicos = servicos
      .filter(s => servicosSelecionados.includes(s.id))
      .map(s => s.nome)
      .join(', ');

    const dataFormatadaExibicao = proximasDatas.find(d => d.original === dataSelecionada)?.formatada || dataSelecionada;
    const nomeAtual = salaoData ? salaoData.name : "Estabelecimento";

    router.push(
      `/salon/${id}/identificacao?` +
      `data=${encodeURIComponent(dataFormatadaExibicao)}` +
      `&horario=${encodeURIComponent(horarioSelecionado)}` +
      `&servicos=${encodeURIComponent(nomesServicos)}` +
      `&salaoNome=${encodeURIComponent(nomeAtual)}`
    );
  };

  if (carregando) {
    return <div style={{ backgroundColor: '#020617', color: 'white', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Carregando dados...</div>;
  }

  if (!salaoData) {
    return <div style={{ backgroundColor: '#020617', color: 'white', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Estabelecimento não encontrado.</div>;
  }

  return (
    <div style={{ backgroundColor: '#020617', color: 'white', minHeight: '100vh', padding: '40px', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
        
        {/* COLUNA ESQUERDA */}
        <div style={{ backgroundColor: '#0f172a', padding: '32px', borderRadius: '12px', border: '1px solid #1e293b' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <span style={{ backgroundColor: '#a855f720', border: '1px solid #a855f740', color: '#a855f7', fontSize: '10px', fontWeight: 'bold', padding: '4px 8px', borderRadius: '6px', textTransform: 'uppercase' }}>{salaoData.category}</span>
            <span style={{ color: '#eab308', fontWeight: 'bold' }}>★ {salaoData.rating}</span>
          </div>
          <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '8px' }}>{salaoData.name}</h1>
          <p style={{ color: '#94a3b8', marginBottom: '24px', fontSize: '14px' }}>📍 {salaoData.address} - {salaoData.city}</p>
          
          <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px', color: '#a855f7' }}>Nossos Serviços</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {servicos.map((servico) => {
              const selecionado = servicosSelecionados.includes(servico.id);
              return (
                <div
                  key={servico.id}
                  onClick={() => alternarServico(servico.id)}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '16px',
                    borderRadius: '8px',
                    border: selecionado ? '2px solid #9333ea' : '1px solid #1e293b',
                    backgroundColor: selecionado ? '#1e1b4b' : '#020617',
                    cursor: 'pointer',
                    transition: '0.2s'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <input type="checkbox" checked={selecionado} readOnly style={{ accentColor: '#9333ea' }} />
                    <span>{servico.nome}</span>
                  </div>
                  <span style={{ fontWeight: 'bold', color: '#a855f7' }}>{servico.preco}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* COLUNA DIREITA */}
        <div style={{ backgroundColor: '#0f172a', padding: '32px', borderRadius: '12px', border: '1px solid #1e293b' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px' }}>Agendar Horário</h2>
          
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '12px', marginBottom: '20px' }}>
            {proximasDatas.map((dt) => (
              <button
                key={dt.original}
                onClick={() => { setDataSelecionada(dt.original); setHorarioSelecionado(''); }}
                style={{ padding: '10px 14px', borderRadius: '6px', border: '1px solid #1e293b', backgroundColor: dataSelecionada === dt.original ? '#9333ea' : '#020617', color: 'white', cursor: 'pointer' }}
              >
                {dt.formatada}
              </button>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '32px' }}>
            {horariosDisponiveis.map((horario) => (
              <button
                key={horario}
                onClick={() => setHorarioSelecionado(horario)}
                style={{ padding: '12px', borderRadius: '6px', border: '1px solid #1e293b', backgroundColor: horarioSelecionado === horario ? '#9333ea' : '#020617', color: 'white', cursor: 'pointer' }}
              >
                {horario}
              </button>
            ))}
          </div>

          <button onClick={avancarParaIdentificacao} style={{ width: '100%', padding: '16px', backgroundColor: '#22c55e', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
            Avançar para Identificação
          </button>
        </div>

      </div>
    </div>
  );
}
