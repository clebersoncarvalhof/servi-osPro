"use client";

import Link from "next/link";
import { useState, useEffect, type MouseEvent } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const loggedIn = localStorage.getItem("servicos_pro_logged_in") === "true";
    setIsLoggedIn(loggedIn);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("servicos_pro_logged_in");
    setIsLoggedIn(false);
    router.push("/");
  };

  const scrollToCategories = (e: MouseEvent<HTMLAnchorElement>) => {
    if (pathname === "/") {
      e.preventDefault();
      document.getElementById("categorias")?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav className="fixed top-0 w-full z-50 glass-dark border-b border-white/5 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center gap-2">
            <div className="p-2 transition-all duration-300 relative group text-2xl">
              💈
            </div>
            <span className="text-2xl font-bold tracking-tighter text-white">
              Serviços<span className="text-primary font-black">Pro</span>
            </span>
          </Link>

          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <button type="button" onClick={() => router.push("/")} className="text-gray-300 hover:text-white transition-colors font-medium">Início</button>
              <Link href="/#categorias" onClick={scrollToCategories} className="text-gray-300 hover:text-white transition-colors font-medium">Explorar</Link>
              <Link href="/admin" className="text-gray-300 hover:text-white transition-colors font-medium">Admin</Link>
              <Link href="/anunciar" className="px-5 py-2.5 bg-primary/10 border border-primary/20 text-primary rounded-full hover:bg-primary hover:text-white transition-all duration-300 font-bold">Sou Profissional</Link>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {isLoggedIn ? (
              <div className="flex items-center gap-4">
                 <button 
                  onClick={handleLogout}
                  className="px-6 py-2.5 bg-white/5 border border-white/10 text-white font-bold rounded-full hover:bg-red-500 hover:border-red-500 transition-all duration-300"
                 >
                   Sair da Conta
                 </button>
              </div>
            ) : (
              <Link href="/login" className="px-8 py-2.5 bg-white text-black font-black rounded-full hover:scale-105 transition-all duration-300 shadow-[0_5px_15px_rgba(255,255,255,0.1)]">
                Entrar
              </Link>
            )}
            <button className="md:hidden text-white text-2xl" onClick={() => setIsOpen(!isOpen)}>
              ☰
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-black/95 backdrop-blur-2xl border-b border-white/10 p-6 space-y-6 animate-in slide-in-from-top-4">
          <button type="button" onClick={() => { router.push("/"); setIsOpen(false); }} className="block text-white text-lg font-bold text-left">Início</button>
          <Link href="/#categorias" onClick={(e) => { scrollToCategories(e); setIsOpen(false); }} className="block text-white text-lg font-bold">Explorar</Link>
          <Link href="/admin" onClick={() => setIsOpen(false)} className="block text-gray-300 text-lg font-bold">Admin</Link>
          <Link href="/anunciar" onClick={() => setIsOpen(false)} className="block text-primary text-lg font-bold">Sou Profissional</Link>
          {isLoggedIn ? (
            <button onClick={() => { handleLogout(); setIsOpen(false); }} className="w-full py-4 bg-red-500/20 text-red-500 rounded-2xl font-black">Sair da Conta</button>
          ) : (
            <Link href="/login" onClick={() => setIsOpen(false)} className="block w-full py-4 bg-white text-black text-center rounded-2xl font-black">Entrar</Link>
          )}
        </div>
      )}
    </nav>
  );
}
