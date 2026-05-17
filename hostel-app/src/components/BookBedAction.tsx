'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createStudentAndBook } from '@/actions/public';

export default function BookBedAction({ bed }: { bed: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const fullName = formData.get('fullName') as string;
    const email = formData.get('email') as string;
    const gender = formData.get('gender') as string;

    const result = await createStudentAndBook(bed.BedID, fullName, email, gender);

    if (result.success) {
      setIsOpen(false);
      router.refresh();
      // In a real app, we might route to a success page or dashboard here
      alert("Success! Your bed has been securely booked.");
    } else {
      setError(result.error || "An unknown error occurred.");
    }
    setLoading(false);
  }

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="text-[10px] font-black uppercase tracking-widest bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition-colors shadow-md w-full"
      >
        Book Now
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-[2rem] w-full max-w-md p-8 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
            
            <div className="mb-8">
              <h3 className="text-2xl font-black text-slate-900 font-outfit">Book Bed {bed.BedNumber}</h3>
              <p className="text-slate-500 text-sm mt-1">Please enter your details to securely reserve this bed.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 rounded-xl bg-rose-50 text-rose-600 text-sm font-medium border border-rose-100">
                  {error}
                </div>
              )}
              
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Full Name</label>
                <input 
                  type="text" 
                  name="fullName"
                  required
                  className="w-full h-12 px-4 rounded-xl border border-slate-200 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 outline-none transition-all"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Email Address</label>
                <input 
                  type="email" 
                  name="email"
                  required
                  className="w-full h-12 px-4 rounded-xl border border-slate-200 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 outline-none transition-all"
                  placeholder="john@university.edu"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Gender</label>
                <select 
                  name="gender"
                  required
                  className="w-full h-12 px-4 rounded-xl border border-slate-200 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 outline-none transition-all bg-white"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>

              <div className="pt-4">
                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full h-14 rounded-xl bg-indigo-600 text-white font-black uppercase tracking-widest shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 transition-all disabled:opacity-50"
                >
                  {loading ? 'Processing Transaction...' : 'Confirm Booking - $500'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
