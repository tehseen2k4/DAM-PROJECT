'use client';

import Link from 'next/link';
import { useState } from 'react';
import { joinWaitlist } from '@/actions/student';

export default function PublicHostelCard({ hostel, studentId }: { hostel: any, studentId?: number }) {
  const isSoldOut = hostel.AvailableBeds === 0;
  const [waitlistLoading, setWaitlistLoading] = useState(false);
  const [waitlistDone, setWaitlistDone] = useState(false);

  async function handleAction(e: React.MouseEvent) {
    if (!studentId) {
      e.preventDefault();
      window.location.href = '/auth/student-signin';
      return;
    }
  }

  async function handleWaitlist(e: React.MouseEvent) {
    e.stopPropagation();
    if (!studentId) {
      window.location.href = '/auth/student-signin';
      return;
    }
    setWaitlistLoading(true);
    const res = await joinWaitlist(hostel.HostelID, studentId);
    if (res.success) setWaitlistDone(true);
    else alert(res.error || 'Failed to join waitlist.');
    setWaitlistLoading(false);
  }

  return (
    <div className={`group relative h-[380px] overflow-hidden rounded-[2.5rem] bg-slate-900 border border-white/5 transition-all hover:scale-[1.02] hover:border-indigo-500/30 hover:shadow-2xl hover:shadow-indigo-500/5 ${isSoldOut ? 'opacity-80' : ''}`}>
      <Link 
        href={studentId ? "/student/dashboard" : "/auth/student-signin"} 
        onClick={handleAction}
        className="absolute inset-0 z-0" 
      />
      
      <div className="relative h-full w-full p-8 pointer-events-none flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between mb-4">
            <span className="inline-block px-2 py-0.5 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-black uppercase tracking-widest text-indigo-400">
              {hostel.GenderType} Hostel
            </span>
            <span className="text-xs font-bold text-slate-400">
              PKR {hostel.MonthlyRent || 5000}/mo
            </span>
          </div>

          <h3 className="text-3xl font-black text-white font-outfit leading-tight mb-1">
            {hostel.HostelName}
          </h3>
          <p className="text-slate-500 font-medium text-sm">
            By {hostel.OwnerName || 'Verified Partner'}
          </p>
          {hostel.City && (
            <p className="text-slate-400 text-xs font-semibold flex items-center gap-1.5 mt-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
              {hostel.City}
            </p>
          )}
        </div>

        <div className="space-y-6">
          {/* Amenities */}
          <div className="flex gap-2 flex-wrap">
            {hostel.HasWifi && <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/5 text-slate-400 text-[9px] font-black uppercase tracking-widest">WiFi</span>}
            {hostel.HasAC && <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/5 text-slate-400 text-[9px] font-black uppercase tracking-widest">AC</span>}
            {hostel.HasLaundry && <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/5 text-slate-400 text-[9px] font-black uppercase tracking-widest">Laundry</span>}
          </div>
          
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full flex-shrink-0 ${isSoldOut ? 'bg-rose-500' : 'bg-emerald-500 animate-pulse'}`} />
            <div>
              <p className={`text-xl font-black ${isSoldOut ? 'text-rose-400' : 'text-emerald-400'}`}>
                {isSoldOut ? 'Sold Out' : `${hostel.AvailableBeds} Beds`}
              </p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Available Slots</p>
            </div>
          </div>

          <div className="pointer-events-auto">
            {isSoldOut ? (
              <button
                onClick={handleWaitlist}
                disabled={waitlistLoading || waitlistDone}
                className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase tracking-widest hover:bg-amber-500/10 hover:border-amber-500/20 hover:text-amber-400 transition-all disabled:opacity-60"
              >
                {waitlistDone ? '✓ On Waitlist' : waitlistLoading ? 'Joining...' : 'Join Waitlist'}
              </button>
            ) : (
              <div className="w-full py-4 rounded-2xl bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest transition-all hover:bg-indigo-500 shadow-xl shadow-indigo-600/10 hover:shadow-indigo-600/20 flex items-center justify-center cursor-pointer">
                Check Details
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
