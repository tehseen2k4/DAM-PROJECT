'use client';

import Link from 'next/link';

export default function SignInChooser() {
  return (
    <main className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-slate-950 to-slate-950" />

      <div className="w-full max-w-lg space-y-8">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 shadow-xl shadow-indigo-600/30">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            </div>
            <span className="text-3xl font-black tracking-tighter text-white">Stay<span className="text-indigo-400">Sync</span></span>
          </div>
          <h1 className="text-4xl font-black text-white tracking-tight mb-3">Welcome Back.</h1>
          <p className="text-slate-500 font-medium">Choose your role to continue to your portal.</p>
        </div>

        <div className="grid gap-4">
          {/* Student */}
          <Link href="/auth/student-signin" className="group relative flex items-center gap-6 p-6 bg-white/5 border border-white/10 rounded-2xl hover:border-emerald-500/40 hover:bg-white/8 transition-all">
            <div className="w-14 h-14 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
            </div>
            <div className="flex-1">
              <p className="text-white font-black text-lg">Student Portal</p>
              <p className="text-slate-500 text-sm font-medium mt-0.5">Browse hostels, manage bookings & report issues</p>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform"><path d="m9 18 6-6-6-6"/></svg>
          </Link>

          {/* Owner */}
          <Link href="/auth/owner-signin" className="group relative flex items-center gap-6 p-6 bg-white/5 border border-white/10 rounded-2xl hover:border-indigo-500/40 hover:bg-white/8 transition-all">
            <div className="w-14 h-14 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            </div>
            <div className="flex-1">
              <p className="text-white font-black text-lg">Hostel Owner</p>
              <p className="text-slate-500 text-sm font-medium mt-0.5">Manage properties, rooms & payment verifications</p>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform"><path d="m9 18 6-6-6-6"/></svg>
          </Link>

          {/* Admin */}
          <Link href="/auth/admin-signin" className="group relative flex items-center gap-6 p-6 bg-white/5 border border-white/10 rounded-2xl hover:border-rose-500/40 hover:bg-white/8 transition-all">
            <div className="w-14 h-14 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f43f5e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/></svg>
            </div>
            <div className="flex-1">
              <p className="text-white font-black text-lg">Platform Admin</p>
              <p className="text-slate-500 text-sm font-medium mt-0.5">System-wide control, all owners & all data</p>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform"><path d="m9 18 6-6-6-6"/></svg>
          </Link>
        </div>

        <p className="text-center text-slate-600 text-xs">
          New student? <Link href="/" className="text-indigo-400 font-bold hover:text-indigo-300">Browse Hostels →</Link>
        </p>
      </div>
    </main>
  );
}
