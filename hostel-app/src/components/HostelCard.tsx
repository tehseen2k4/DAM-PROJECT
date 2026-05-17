'use client';

import Link from 'next/link';
import { useState } from 'react';
import EditHostelModal from './EditHostelModal';
import DeleteHostelConfirm from './DeleteHostelConfirm';

export default function HostelCard({ hostel }: { hostel: any }) {
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  return (
    <>
      <div className="group relative h-[420px] overflow-hidden rounded-[2.5rem] bg-slate-900 border border-white/5 transition-all hover:scale-[1.02] hover:border-indigo-500/30 hover:shadow-2xl hover:shadow-indigo-500/5 flex flex-col">
        <Link 
          href={`/hostels/${hostel.HostelID}`}
          className="absolute inset-0 z-0"
        />
        
        {/* Quick Actions Overlay */}
        <div className="absolute top-6 right-6 z-20 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={(e) => { e.preventDefault(); setShowEdit(true); }}
            className="w-10 h-10 rounded-xl bg-slate-950 border border-white/10 text-white hover:bg-indigo-600 hover:text-white transition-colors flex items-center justify-center shadow-lg"
            title="Edit Property"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
          </button>
          <button 
            onClick={(e) => { e.preventDefault(); setShowDelete(true); }}
            className="w-10 h-10 rounded-xl bg-slate-950 border border-white/10 text-white hover:bg-rose-600 hover:text-white transition-colors flex items-center justify-center shadow-lg"
            title="Delete Property"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
          </button>
        </div>

        <div className="relative h-full w-full p-8 pointer-events-none flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <span className="inline-block px-2.5 py-0.5 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-[9px] font-black uppercase tracking-widest text-indigo-400">
                  {hostel.GenderType} Managed
                </span>
                <h3 className="text-2xl font-black text-white font-outfit leading-tight group-hover:text-indigo-400 transition-colors">
                  {hostel.HostelName}
                </h3>
                {hostel.City && (
                  <p className="text-slate-400 text-xs font-semibold flex items-center gap-1.5">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-500"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                    {hostel.City}
                  </p>
                )}
              </div>
              <div className="w-12 h-12 rounded-2xl bg-slate-950 flex items-center justify-center border border-white/5 flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-500 group-hover:text-indigo-400 transition-colors"><path d="M3 21h18"/><path d="M3 7v1a3 0 0 0 6 0V7m0 1a3 0 0 0 6 0V7m0 1a3 0 0 0 6 0V7H3l.5-2h17l.5 2"/></svg>
              </div>
            </div>

            {/* Amenity pricing breakdown */}
            <div className="space-y-1.5 pt-2">
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Amenity Add-ons</p>
              <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-400">
                <div className="flex items-center justify-between p-1.5 bg-slate-950/40 rounded-lg border border-white/5">
                  <span className={`${hostel.HasWifi ? 'text-indigo-400 font-bold' : 'text-slate-600'}`}>WiFi</span>
                  <span className="font-semibold">{hostel.HasWifi ? `Rs.${hostel.WifiPrice}` : 'N/A'}</span>
                </div>
                <div className="flex items-center justify-between p-1.5 bg-slate-950/40 rounded-lg border border-white/5">
                  <span className={`${hostel.HasAC ? 'text-indigo-400 font-bold' : 'text-slate-600'}`}>AC</span>
                  <span className="font-semibold">{hostel.HasAC ? `Rs.${hostel.ACPrice}` : 'N/A'}</span>
                </div>
                <div className="flex items-center justify-between p-1.5 bg-slate-950/40 rounded-lg border border-white/5">
                  <span className={`${hostel.HasLaundry ? 'text-indigo-400 font-bold' : 'text-slate-600'}`}>Laundry</span>
                  <span className="font-semibold">{hostel.HasLaundry ? `Rs.${hostel.LaundryPrice}` : 'N/A'}</span>
                </div>
                <div className="flex items-center justify-between p-1.5 bg-slate-950/40 rounded-lg border border-white/5">
                  <span className={`${hostel.HasFood ? 'text-indigo-400 font-bold' : 'text-slate-600'}`}>Food</span>
                  <span className="font-semibold">{hostel.HasFood ? `Rs.${hostel.FoodPrice}` : 'N/A'}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between text-slate-400 pt-3 border-t border-white/5">
              <div className="flex items-center gap-1.5">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-500"><rect width="20" height="12" x="2" y="6" rx="2"/><circle cx="12" cy="12" r="2"/><path d="M6 12h.01M18 12h.01"/></svg>
                <p className="text-[9px] font-black uppercase tracking-widest">Baseline Rent</p>
              </div>
              <p className="text-xs font-black text-white">PKR {hostel.MonthlyRent || 5000}</p>
            </div>
            
            <button className="w-full py-3.5 rounded-2xl bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest transition-all group-hover:bg-indigo-500 shadow-xl shadow-indigo-950/20">
              Manage Rooms
            </button>
          </div>
        </div>
      </div>

      {showEdit && (
        <EditHostelModal hostel={hostel} onClose={() => setShowEdit(false)} />
      )}
      {showDelete && (
        <DeleteHostelConfirm hostel={hostel} onClose={() => setShowDelete(false)} />
      )}
    </>
  );
}
