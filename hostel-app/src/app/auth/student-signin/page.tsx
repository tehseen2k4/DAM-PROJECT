'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function StudentSignIn() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await signIn('credentials', {
      username,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError('Invalid credentials. Try: student1 / student123');
      setLoading(false);
    } else {
      router.push('/student/dashboard');
      router.refresh();
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-emerald-900/20 via-slate-950 to-slate-950" />

      <div className="w-full max-w-md">
        <Link href="/auth/signin" className="inline-flex items-center gap-2 text-slate-500 hover:text-white text-sm font-bold mb-8 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          Back
        </Link>

        <div className="bg-slate-900/60 backdrop-blur-xl border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-8">
            <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight">Student Portal</h1>
            <p className="text-emerald-100/70 text-sm font-medium mt-1">Sign in to manage your stay</p>
          </div>

          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm font-bold text-center">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-700 focus:outline-none focus:border-emerald-500/50 transition-colors"
                  placeholder="student1"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-700 focus:outline-none focus:border-emerald-500/50 transition-colors"
                  placeholder="••••••••"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black py-4 rounded-2xl shadow-lg shadow-emerald-500/20 transition-all active:scale-[0.98] disabled:opacity-50"
              >
                {loading ? 'Signing In...' : 'Enter Student Portal'}
              </button>
            </form>

            <p className="text-center text-slate-600 text-xs mt-6">
              No account? <Link href="/" className="text-emerald-400 font-bold hover:text-emerald-300">Book as Guest →</Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
