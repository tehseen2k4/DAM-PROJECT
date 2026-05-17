'use client';

import { signOut } from "next-auth/react";

export default function UserMenu({ name, role }: { name: string; role: string }) {
  return (
    <div className="flex items-center gap-6">
      <div className="text-right">
        <p className="text-sm font-black text-white leading-none mb-1">{name}</p>
        <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">{role} Portal</p>
      </div>
      
      <button 
        onClick={() => signOut()}
        className="group relative flex items-center justify-center w-10 h-10 rounded-xl bg-white/5 border border-white/10 hover:bg-rose-500/10 hover:border-rose-500/20 transition-all active:scale-95"
        title="Logout"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400 group-hover:text-rose-400"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
      </button>
    </div>
  );
}
