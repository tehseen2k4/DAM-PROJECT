'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { registerStudent, registerOwner } from '@/actions/auth';

export default function SignUpPage() {
  const [role, setRole] = useState<'Student' | 'Owner' | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  // Form states
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  // Student specific
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState('Male');
  const [university, setUniversity] = useState('');
  const [age, setAge] = useState(18);

  // Owner specific
  const [businessName, setBusinessName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [ownerEmail, setOwnerEmail] = useState('');

  const handleStudentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await registerStudent(username, password, fullName, email, gender, university, age);
    if (res.success) {
      setSuccess(true);
      setTimeout(() => {
        router.push('/auth/student-signin');
      }, 2000);
    } else {
      setError(res.error || 'Failed to sign up.');
      setLoading(false);
    }
  };

  const handleOwnerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await registerOwner(username, password, businessName, contactPerson, ownerEmail);
    if (res.success) {
      setSuccess(true);
      setTimeout(() => {
        router.push('/auth/owner-signin');
      }, 2000);
    } else {
      setError(res.error || 'Failed to sign up.');
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-900/20 via-slate-950 to-slate-950" />

      <div className="w-full max-w-lg">
        <Link href="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-white text-sm font-bold mb-8 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          Back to Home
        </Link>

        <div className="bg-slate-900/60 backdrop-blur-xl border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-black text-white tracking-tight">Create Account</h1>
                <p className="text-indigo-100/70 text-sm font-medium mt-1">Start your journey with StaySync</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              </div>
            </div>
          </div>

          <div className="p-8">
            {success ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto text-emerald-400">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <h3 className="text-2xl font-black text-white">Registration Successful!</h3>
                <p className="text-slate-400">Redirecting to sign in portal...</p>
              </div>
            ) : role === null ? (
              <div className="space-y-6">
                <p className="text-slate-400 font-medium text-center">Which type of account would you like to create?</p>
                <div className="grid gap-4">
                  <button 
                    onClick={() => setRole('Student')}
                    className="group flex items-center gap-4 p-5 rounded-2xl bg-white/5 border border-white/10 text-left hover:border-emerald-500/30 hover:bg-white/8 transition-all"
                  >
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
                    </div>
                    <div>
                      <p className="text-white font-bold">Student Account</p>
                      <p className="text-slate-500 text-xs mt-0.5">Find & book rooms inside dashboard</p>
                    </div>
                  </button>

                  <button 
                    onClick={() => setRole('Owner')}
                    className="group flex items-center gap-4 p-5 rounded-2xl bg-white/5 border border-white/10 text-left hover:border-indigo-500/30 hover:bg-white/8 transition-all"
                  >
                    <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                    </div>
                    <div>
                      <p className="text-white font-bold">Hostel Owner</p>
                      <p className="text-slate-500 text-xs mt-0.5">Add hostels, manage room pricing & amenities</p>
                    </div>
                  </button>
                </div>
              </div>
            ) : role === 'Student' ? (
              <form onSubmit={handleStudentSubmit} className="space-y-4">
                <div className="flex justify-between items-center pb-2 border-b border-white/5">
                  <span className="text-xs font-black uppercase text-emerald-400 tracking-widest">Student Account Form</span>
                  <button type="button" onClick={() => setRole(null)} className="text-xs text-slate-500 hover:text-white font-bold">← Choose Role</button>
                </div>

                {error && (
                  <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm font-bold text-center">
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Username</label>
                    <input type="text" value={username} onChange={e => setUsername(e.target.value)} required className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder:text-slate-700 text-sm focus:outline-none focus:border-indigo-500" placeholder="student_alex" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Password</label>
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder:text-slate-700 text-sm focus:outline-none focus:border-indigo-500" placeholder="••••••••" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Full Name</label>
                  <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} required className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder:text-slate-700 text-sm focus:outline-none focus:border-indigo-500" placeholder="Alex Watson" />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email Address</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder:text-slate-700 text-sm focus:outline-none focus:border-indigo-500" placeholder="alex@university.edu" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">University</label>
                    <input type="text" value={university} onChange={e => setUniversity(e.target.value)} required className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder:text-slate-700 text-sm focus:outline-none focus:border-indigo-500" placeholder="FAST NUCES" />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Age</label>
                      <input type="number" value={age} onChange={e => setAge(parseInt(e.target.value))} required className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none" min="15" max="35" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Gender</label>
                      <select value={gender} onChange={e => setGender(e.target.value)} className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-2 py-2.5 text-white text-sm focus:outline-none cursor-pointer">
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                    </div>
                  </div>
                </div>

                <button type="submit" disabled={loading} className="w-full mt-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black py-3 rounded-xl transition-all shadow-lg shadow-emerald-600/10">
                  {loading ? 'Creating Student Account...' : 'Sign Up as Student'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleOwnerSubmit} className="space-y-4">
                <div className="flex justify-between items-center pb-2 border-b border-white/5">
                  <span className="text-xs font-black uppercase text-indigo-400 tracking-widest">Owner Account Form</span>
                  <button type="button" onClick={() => setRole(null)} className="text-xs text-slate-500 hover:text-white font-bold">← Choose Role</button>
                </div>

                {error && (
                  <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm font-bold text-center">
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Username</label>
                    <input type="text" value={username} onChange={e => setUsername(e.target.value)} required className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder:text-slate-700 text-sm focus:outline-none focus:border-indigo-500" placeholder="owner_jones" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Password</label>
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder:text-slate-700 text-sm focus:outline-none focus:border-indigo-500" placeholder="••••••••" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Business Name</label>
                  <input type="text" value={businessName} onChange={e => setBusinessName(e.target.value)} required className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder:text-slate-700 text-sm focus:outline-none focus:border-indigo-500" placeholder="Elite Hostels Network" />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Contact Person</label>
                  <input type="text" value={contactPerson} onChange={e => setContactPerson(e.target.value)} required className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder:text-slate-700 text-sm focus:outline-none focus:border-indigo-500" placeholder="John Jones" />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Contact Email</label>
                  <input type="email" value={ownerEmail} onChange={e => setOwnerEmail(e.target.value)} required className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder:text-slate-700 text-sm focus:outline-none focus:border-indigo-500" placeholder="john@elitehostels.com" />
                </div>

                <button type="submit" disabled={loading} className="w-full mt-4 bg-indigo-600 hover:bg-indigo-500 text-white font-black py-3 rounded-xl transition-all shadow-lg shadow-indigo-600/10">
                  {loading ? 'Creating Owner Account...' : 'Sign Up as Owner'}
                </button>
              </form>
            )}

            <div className="mt-6 pt-6 border-t border-white/5 text-center text-xs text-slate-600">
              Already have an account?{' '}
              <Link href="/auth/signin" className="text-indigo-400 font-bold hover:text-indigo-300">
                Log In →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
