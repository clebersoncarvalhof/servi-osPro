import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import { Building2, PlusCircle, ShieldAlert, LogIn } from "lucide-react";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ServiçosPró - Agendamentos Online",
  description: "Encontre e agende os melhores serviços da sua região.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className="dark">
      <body className={`${inter.className} min-h-screen bg-background text-foreground antialiased`}>
        {/* BARRA DE NAVEGAÇÃO GLOBAL (NAVBAR) */}
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
            {/* LOGO DO SITE */}
            <Link href="/" className="flex items-center gap-2 font-black text-xl tracking-tight hover:opacity-90 transition-opacity">
              <span className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white p-1.5 rounded-lg">
                <Building2 className="w-5 h-5" />
              </span>
              <span>Serviços<span className="text-primary">Pró</span></span>
            </Link>

            {/* LINKS DE NAVEGAÇÃO E ACESSO */}
            <nav className="flex items-center gap-4">
              <Link 
                href="/anunciar" 
                className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                <PlusCircle className="w-4 h-4" /> Anunciar Salão
              </Link>

              <Link 
                href="/admin" 
                className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                <ShieldAlert className="w-4 h-4" /> Painel Admin
              </Link>

              <div className="w-[1px] h-4 bg-border" />

              <Link 
                href="/login" 
                className="inline-flex items-center gap-1.5 bg-secondary text-secondary-foreground text-sm font-semibold py-1.5 px-3 rounded-lg hover:bg-secondary/80 transition-colors"
              >
                <LogIn className="w-4 h-4" /> Entrar
              </Link>
            </nav>
          </div>
        </header>

        {/* CONTEÚDO DINÂMICO DAS PÁGINAS */}
        <div className="relative flex flex-col min-h-screen">
          {children}
        </div>
      </body>
    </html>
  );
}
