'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';

export default function AuthModal({ onClose }: { onClose: () => void }) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // In a real SaaS, signup would have its own action. 
    // For now, we use the Credentials provider for demo.
    const result = await signIn('credentials', {
      username,
      password,
      redirect: false,
    });

    if (result?.ok) {
        // Success! Open dashboard in new tab and close modal
        window.open('/dashboard', '_blank');
        onClose();
    } else {
        alert("Invalid credentials. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-300">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
        <header className="p-10 text-center space-y-2 border-b border-slate-50">
          <div className="mx-auto w-12 h-12 bg-primary rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-primary/20">
             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          </div>
          <h2 className="text-3xl font-black text-slate-900 font-outfit tracking-tight">
            {isLogin ? 'Welcome Back.' : 'Partner with Us.'}
          </h2>
          <p className="text-slate-500 font-medium">Manage your properties with StaySync.</p>
        </header>

        <form onSubmit={handleSubmit} className="p-10 space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Username / Email</label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-slate-900 focus:outline-none focus:border-primary transition-all font-medium"
              placeholder="tehseen"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-slate-900 focus:outline-none focus:border-primary transition-all font-medium"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-5 rounded-[1.5rem] bg-slate-900 text-white font-black text-lg hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10 active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? 'Verifying...' : (isLogin ? 'Login to Dashboard' : 'Create Business Account')}
          </button>

          <footer className="pt-6 text-center space-y-4">
             <button 
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm font-bold text-primary hover:underline underline-offset-4"
             >
                {isLogin ? "Don't have an account? Sign up" : "Already a partner? Sign in"}
             </button>
             <div>
                <button 
                    type="button" 
                    onClick={onClose}
                    className="text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors uppercase tracking-widest"
                >
                    Maybe Later
                </button>
             </div>
          </footer>
        </form>
      </div>
    </div>
  );
}
