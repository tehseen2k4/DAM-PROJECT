'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useState } from 'react';
import AuthModal from './AuthModal';

export default function Header() {
  const { data: session } = useSession();
  const [showAuth, setShowAuth] = useState(false);

  return (
    <>
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-white/80 backdrop-blur-md">
      <div className="container mx-auto flex h-20 items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          </div>
          <span className="text-2xl font-black tracking-tighter text-foreground font-outfit">Stay<span className="text-primary">Sync</span></span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-sm font-bold text-slate-900 border-b-2 border-primary tracking-widest">Find Hostels</Link>
          <Link href="#how-it-works" className="text-sm font-bold text-slate-500 hover:text-primary transition-colors tracking-widest">How it Works</Link>
          <button 
            onClick={() => setShowAuth(true)}
            className="text-sm font-black text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-widest"
          >
            Join as Owner
          </button>
        </nav>

        <div className="flex items-center gap-4">
          {session ? (
            <div className="flex items-center gap-4">
                <Link 
                    href="/dashboard" 
                    target="_blank"
                    className="hidden sm:flex h-11 px-6 items-center rounded-xl bg-slate-900 text-white font-black text-xs uppercase tracking-widest shadow-xl shadow-slate-900/20 hover:-translate-y-0.5 transition-all"
                >
                    Dashboard ↗
                </Link>
                <button 
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="h-11 px-6 rounded-xl border border-border text-slate-900 font-bold text-sm hover:bg-slate-50 transition-all"
                >
                    Logout
                </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
                <button 
                    onClick={() => setShowAuth(true)}
                    className="h-11 px-6 rounded-xl text-slate-900 font-bold text-sm hover:text-primary transition-colors"
                >
                    Sign In
                </button>
                <Link 
                    href="/auth/signin" 
                    className="h-11 px-8 rounded-xl bg-primary text-white font-black text-sm shadow-xl shadow-primary/20 hover:bg-indigo-700 transition-all hover:-translate-y-0.5"
                >
                    Book Now
                </Link>
            </div>
          )}
        </div>
      </div>
    </header>

    {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </>
  );
}
