'use client';

import { useState, useMemo } from 'react';
import StudentHostelDetailsModal from './StudentHostelDetailsModal';

export default function StudentBrowseHostels({ 
  initialHostels, 
  studentId 
}: { 
  initialHostels: any[]; 
  studentId: number; 
}) {
  const [selectedHostel, setSelectedHostel] = useState<any | null>(null);

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [cityFilter, setCityFilter] = useState('All');
  const [wifiFilter, setWifiFilter] = useState(false);
  const [acFilter, setAcFilter] = useState(false);
  const [laundryFilter, setLaundryFilter] = useState(false);
  const [foodFilter, setFoodFilter] = useState(false);
  const [maxRent, setMaxRent] = useState('');

  // Extract unique cities
  const cities = useMemo(() => {
    const set = new Set<string>();
    initialHostels.forEach(h => {
      if (h.City) set.add(h.City);
    });
    return ['All', ...Array.from(set)];
  }, [initialHostels]);

  // Client-side filtering for blistering speed
  const filteredHostels = useMemo(() => {
    return initialHostels.filter(h => {
      // Search text match
      if (searchQuery) {
        const text = `${h.HostelName} ${h.City} ${h.Address}`.toLowerCase();
        if (!text.includes(searchQuery.toLowerCase())) return false;
      }
      // City match
      if (cityFilter !== 'All' && h.City !== cityFilter) return false;
      // WiFi match
      if (wifiFilter && !h.HasWifi) return false;
      // AC match
      if (acFilter && !h.HasAC) return false;
      // Laundry match
      if (laundryFilter && !h.HasLaundry) return false;
      // Food match
      if (foodFilter && !h.HasFood) return false;
      // Max rent match
      if (maxRent) {
        const rentVal = parseFloat(maxRent);
        if (h.MonthlyRent && h.MonthlyRent > rentVal) return false;
      }
      return true;
    });
  }, [initialHostels, searchQuery, cityFilter, wifiFilter, acFilter, laundryFilter, foodFilter, maxRent]);

  return (
    <div className="space-y-8">
      {/* Premium Filter Dashboard */}
      <div className="bg-slate-900 border border-white/5 rounded-3xl p-6 space-y-4 shadow-xl">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Text Input */}
          <div className="flex-1 bg-slate-950/50 border border-white/10 rounded-xl px-4 py-3 flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            <input 
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.currentTarget.value)}
              placeholder="Search by hostel name, region..."
              className="bg-transparent border-none text-white text-sm font-semibold outline-none w-full focus:ring-0 placeholder:text-slate-700"
            />
          </div>

          {/* City Selection */}
          <div className="bg-slate-950/50 border border-white/10 rounded-xl px-4 py-3 flex items-center gap-2 min-w-[160px]">
            <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest">City:</span>
            <select 
              value={cityFilter}
              onChange={e => setCityFilter(e.target.value)}
              className="bg-transparent border-none text-white text-sm font-bold outline-none cursor-pointer focus:ring-0"
            >
              {cities.map(c => <option key={c} value={c} className="bg-slate-950 text-white">{c}</option>)}
            </select>
          </div>

          {/* Budget Limit */}
          <div className="bg-slate-950/50 border border-white/10 rounded-xl px-4 py-3 flex items-center gap-2 min-w-[160px]">
            <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Max Rent:</span>
            <input 
              type="number" 
              value={maxRent}
              onChange={e => setMaxRent(e.target.value)}
              placeholder="PKR Limit"
              className="bg-transparent border-none text-white text-sm font-bold outline-none w-full focus:ring-0 placeholder:text-slate-700"
            />
          </div>
        </div>

        {/* Amenities Row */}
        <div className="pt-3 border-t border-white/5 flex flex-wrap items-center gap-6">
          <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Filter Amenities:</span>
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input 
              type="checkbox" 
              checked={wifiFilter}
              onChange={e => setWifiFilter(e.target.checked)}
              className="rounded border-white/10 bg-slate-950 text-indigo-600 focus:ring-indigo-600/40"
            />
            <span className="text-xs font-bold text-slate-300">WiFi Internet</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input 
              type="checkbox" 
              checked={acFilter}
              onChange={e => setAcFilter(e.target.checked)}
              className="rounded border-white/10 bg-slate-950 text-indigo-600 focus:ring-indigo-600/40"
            />
            <span className="text-xs font-bold text-slate-300">Air Conditioning</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input 
              type="checkbox" 
              checked={laundryFilter}
              onChange={e => setLaundryFilter(e.target.checked)}
              className="rounded border-white/10 bg-slate-950 text-indigo-600 focus:ring-indigo-600/40"
            />
            <span className="text-xs font-bold text-slate-300">Laundry Service</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input 
              type="checkbox" 
              checked={foodFilter}
              onChange={e => setFoodFilter(e.target.checked)}
              className="rounded border-white/10 bg-slate-950 text-indigo-600 focus:ring-indigo-600/40"
            />
            <span className="text-xs font-bold text-slate-300">Food Menu</span>
          </label>
        </div>
      </div>

      {/* Hostels List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredHostels.map((h: any) => {
          const isSoldOut = h.AvailableBeds === 0;
          return (
            <div 
              key={h.HostelID}
              className={`group relative h-[380px] overflow-hidden rounded-[2.5rem] bg-slate-900 border border-white/5 flex flex-col justify-between p-6 shadow-sm hover:scale-[1.01] hover:border-indigo-500/30 transition-all ${isSoldOut ? 'opacity-85' : ''}`}
            >
              <div>
                <div className="flex items-start justify-between mb-3">
                  <span className="inline-block px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20 text-[9px] font-black uppercase tracking-widest text-indigo-400">
                    {h.GenderType} Managed
                  </span>
                  <span className="text-xs font-black text-slate-400">PKR {h.MonthlyRent || 5000}/mo</span>
                </div>

                <h3 className="text-2xl font-black text-white font-outfit leading-tight mb-1">{h.HostelName}</h3>
                <p className="text-slate-500 text-xs font-semibold">{h.Address || 'Primary Address'}, {h.City}</p>
              </div>

              <div className="space-y-4">
                <div className="flex gap-1.5 flex-wrap">
                  {h.HasWifi && <span className="px-1.5 py-0.5 bg-white/5 border border-white/5 text-[9px] font-black text-slate-400 rounded">WiFi (Rs.{h.WifiPrice})</span>}
                  {h.HasAC && <span className="px-1.5 py-0.5 bg-white/5 border border-white/5 text-[9px] font-black text-slate-400 rounded">AC (Rs.{h.ACPrice})</span>}
                  {h.HasLaundry && <span className="px-1.5 py-0.5 bg-white/5 border border-white/5 text-[9px] font-black text-slate-400 rounded">Laundry (Rs.{h.LaundryPrice})</span>}
                  {h.HasFood && <span className="px-1.5 py-0.5 bg-white/5 border border-white/5 text-[9px] font-black text-slate-400 rounded">Food (Rs.{h.FoodPrice})</span>}
                </div>

                <div className="flex items-center gap-2 border-t border-white/5 pt-3">
                  <div className={`w-2.5 h-2.5 rounded-full ${isSoldOut ? 'bg-rose-500' : 'bg-emerald-500 animate-pulse'}`} />
                  <div>
                    <p className={`text-md font-black ${isSoldOut ? 'text-rose-400' : 'text-emerald-400'}`}>
                      {isSoldOut ? 'Sold Out' : `${h.AvailableBeds} Beds Vacant`}
                    </p>
                  </div>
                </div>


                <button 
                  onClick={() => setSelectedHostel(h)}
                  className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-indigo-600/10 transition-all flex items-center justify-center gap-1.5"
                >
                  Explore Rooms & Book
                </button>
              </div>
            </div>
          );
        })}

        {filteredHostels.length === 0 && (
          <div className="col-span-full py-16 text-center bg-slate-900 border border-white/5 border-dashed rounded-[2.5rem]">
            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-600 mx-auto mb-3"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>
            <p className="text-slate-400 font-bold">No hostels match your active filter parameters.</p>
            <p className="text-slate-500 text-xs mt-1">Try broadening your search or resetting checkmarks.</p>
          </div>
        )}
      </div>

      {/* Details Overlay Modal */}
      {selectedHostel && (
        <StudentHostelDetailsModal 
          hostel={selectedHostel}
          studentId={studentId}
          onClose={() => setSelectedHostel(null)}
        />
      )}
    </div>
  );
}
