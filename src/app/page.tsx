import { prisma } from "@/lib/prisma";
import CarrosselDestaque from "@/components/CarrosselDestaque";
import Link from "next/link";
import { Scissors, Sparkles, Smile, Search, Calendar, CheckCircle } from "lucide-react";

export const revalidate = 0;

interface Props {
  searchParams: Promise<{ categoria?: string }>;
}

export default async function HomePage({ searchParams }: Props) {
  const { categoria } = await searchParams;

  const categoriasPrincipais = [
    { id: "Cabeleireiro", label: "Cabeleireiro", icon: <Scissors className="w-3.5 h-3.5" /> },
    { id: "Barba", label: "Barba", icon: <Sparkles className="w-3.5 h-3.5" /> },
    { id: "Unhas", label: "Unhas", icon: <Smile className="w-3.5 h-3.5" /> },
  ];

  const filtroBusca: any = {};
  if (categoria) {
    filtroBusca.category = categoria;
  }

  const saloesDestaque = await prisma.salon.findMany({
    where: { 
      ...filtroBusca, 
      featured: true 
    },
    orderBy: { 
      createdAt: "desc" 
    },
  });

  return (
    <div className="min-h-screen bg-[#050507] text-zinc-100 antialiased selection:bg-purple-500/30">
      
      {/* SEÇÃO HERO COMPACTA COM FILTROS ACOPLADOS */}
      <div className="relative overflow-hidden min-h-[340px] flex flex-col justify-center items-center py-12 px-4 border-b border-zinc-900/30">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://unsplash.com" 
            alt="Editorial beleza de luxo" 
            className="w-full h-full object-cover object-center filter brightness-[0.12] contrast-[1.05] saturate-50"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050507]/40 to-[#050507]" />
        </div>

        <div className="max-w-4xl mx-auto text-center space-y-5 relative z-10 w-full">
          <h1 className="text-3xl sm:text-5xl font-light tracking-tight leading-none text-white uppercase">
            A Alta Estética <span className="font-serif italic font-normal text-zinc-400">Ao Seu Alcance</span>
          </h1>
          
          <p className="text-xs sm:text-sm text-zinc-500 max-w-md mx-auto font-light tracking-wide">
            Reserve experiências exclusivas com os maiores talentos de beleza.
          </p>

          <div className="pt-4 flex flex-col items-center gap-3">
            <span className="text-[9px] font-black uppercase tracking-[0.25em] text-zinc-600 block">Coleções Disponíveis</span>
            <div className="flex flex-wrap justify-center gap-2 max-w-xl">
              <Link
                href="/"
                className={`px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all border ${
                  !categoria
                    ? "bg-white text-black border-white shadow-lg"
                    : "bg-black/40 text-zinc-400 border-zinc-800 backdrop-blur-sm hover:border-zinc-600 hover:text-white"
                }`}
              >
                Todos
              </Link>

              {categoriasPrincipais.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/?categoria=${cat.id}`}
                  className={`flex items-center gap-1 px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all border ${
                    categoria === cat.id
                      ? "bg-white text-black border-white shadow-lg"
                      : "bg-black/40 text-zinc-400 border-zinc-800 backdrop-blur-sm hover:border-zinc-600 hover:text-white"
                  }`}
                >
                  {cat.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ÁREA DO CONTEÚDO PRINCIPAL */}
      <div className="max-w-[1400px] mx-auto px-6 py-12 space-y-24">
        
        {/* CARROSSEL DE DESTAQUES */}
        <section className="space-y-8">
          <div className="flex flex-col gap-1 pb-4 border-b border-zinc-900">
            <h2 className="text-xl font-light uppercase tracking-[0.15em] text-white">
              Espaço <span className="font-serif italic font-normal text-zinc-400">Destaque</span>
            </h2>
            <p className="text-[10px] uppercase tracking-widest text-zinc-500">
              Espaços exclusivos selecionados em rotação contínua através do painel.
            </p>
          </div>

          {saloesDestaque.length === 0 ? (
            <div className="text-center py-16 border border-zinc-900 border-dashed rounded-xl bg-[#09090b]/40">
              <p className="text-xs text-zinc-500 tracking-wider font-light uppercase">
                Nenhum salão ativou o destaque para esta categoria no painel de administração.
              </p>
            </div>
          ) : (
            <div className="w-full">
              <CarrosselDestaque saloes={saloesDestaque} />
            </div>
          )}
        </section>

        {/* SEÇÃO COMO FUNCIONA */}
        <section className="space-y-12">
          <div className="flex flex-col gap-1 pb-4 border-b border-zinc-900">
            <h2 className="text-xl font-light uppercase tracking-[0.15em] text-white">
              Como <span className="font-serif italic font-normal text-zinc-400">Funciona</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#0c0c0e] border border-zinc-900 rounded-xl p-6 space-y-4 hover:border-purple-500/30 transition-all group">
              <div className="w-10 h-10 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-lg flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-colors">
                <Search className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-200">1. Encontre o Espaço</h3>
                <p className="text-xs text-zinc-500 font-light leading-relaxed">
                  Explore os salões de elite da sua região e filtre pelas coleções disponíveis diretamente na nossa Home.
                </p>
              </div>
            </div>

            <div className="bg-[#0c0c0e] border border-zinc-900 rounded-xl p-6 space-y-4 hover:border-purple-500/30 transition-all group">
              <div className="w-10 h-10 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-lg flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-colors">
                <Calendar className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-200">2. Escolha o Horário</h3>
                <p className="text-xs text-zinc-500 font-light leading-relaxed">
                  Selecione os procedimentos desejados e navegue pelos próximos 7 dias com bloqueio automático de horários ocupados.
                </p>
              </div>
            </div>

            <div className="bg-[#0c0c0e] border border-zinc-900 rounded-xl p-6 space-y-4 hover:border-purple-500/30 transition-all group">
              <div className="w-10 h-10 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-lg flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-colors">
                <CheckCircle className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-200">3. Confirmação Direta</h3>
                <p className="text-xs text-zinc-500 font-light leading-relaxed">
                  Insira seus dados de contato básicos e envie o agendamento em tempo real direto para o painel de controle do estabelecimento.
                </p>
              </div>
            </div>
          </div>
        </section>
        {/* SUGESTÃO 2: GRID DE CATEGORIAS VISUAIS */}
        <section className="space-y-8">
          <div className="flex flex-col gap-1 pb-4 border-b border-zinc-900">
            <h2 className="text-xl font-light uppercase tracking-[0.15em] text-white">
              Nossas <span className="font-serif italic font-normal text-zinc-400">Especialidades</span>
            </h2>
            <p className="text-[10px] uppercase tracking-widest text-zinc-500">
              Selecione uma categoria visual abaixo para encontrar espaços focados no que você precisa.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card Categoria 1: Cabeleireiro */}
            <Link href="/?categoria=Cabeleireiro" className="group relative overflow-hidden h-64 rounded-xl border border-zinc-900/60 block">
              <img 
                src="https://unsplash.com" 
                alt="Cabeleireiro" 
                className="w-full h-full object-cover brightness-[0.4] group-hover:scale-105 group-hover:brightness-[0.5] transition-all duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-6 left-6 space-y-1">
                <h3 className="text-base font-semibold tracking-wide uppercase text-white">Cabelo & Visagismo</h3>
                <p className="text-[11px] text-zinc-400 font-light">Cortes, coloração e tratamentos de alta performance.</p>
              </div>
            </Link>

            {/* Card Categoria 2: Barba */}
            <Link href="/?categoria=Barba" className="group relative overflow-hidden h-64 rounded-xl border border-zinc-900/60 block">
              <img 
                src="https://unsplash.com" 
                alt="Barbearia" 
                className="w-full h-full object-cover brightness-[0.4] group-hover:scale-105 group-hover:brightness-[0.5] transition-all duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-6 left-6 space-y-1">
                <h3 className="text-base font-semibold tracking-wide uppercase text-white">Barba & Navalha</h3>
                <p className="text-[11px] text-zinc-400 font-light">Barboterapia e acabamentos cirúrgicos premium.</p>
              </div>
            </Link>

            {/* Card Categoria 3: Unhas */}
            <Link href="/?categoria=Unhas" className="group relative overflow-hidden h-64 rounded-xl border border-zinc-900/60 block">
              <img 
                src="https://unsplash.com" 
                alt="Unhas" 
                className="w-full h-full object-cover brightness-[0.4] group-hover:scale-105 group-hover:brightness-[0.5] transition-all duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-6 left-6 space-y-1">
                <h3 className="text-base font-semibold tracking-wide uppercase text-white">Nail Design & Estética</h3>
                <p className="text-[11px] text-zinc-400 font-light">Manicure, alongamento em gel e cuidados exclusivos.</p>
              </div>
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
}
