'use client';

import { useState } from 'react';
import { createHostel } from '@/actions/hostels';
import { useRouter } from 'next/navigation';

export default function AddHostelModal({ ownerId, onClose }: { ownerId: number; onClose: () => void }) {
  const [name, setName] = useState('');
  const [gender, setGender] = useState('Male');
  const [city, setCity] = useState('Lahore');
  const [address, setAddress] = useState('');
  const [hasWifi, setHasWifi] = useState(true);
  const [hasAC, setHasAC] = useState(false);
  const [hasLaundry, setHasLaundry] = useState(false);
  const [hasFood, setHasFood] = useState(false);
  
  const [wifiPrice, setWifiPrice] = useState('0');
  const [acPrice, setAcPrice] = useState('0');
  const [laundryPrice, setLaundryPrice] = useState('0');
  const [foodPrice, setFoodPrice] = useState('0');

  const [monthlyRent, setMonthlyRent] = useState('5000');
  const [includedServices, setIncludedServices] = useState('Security, Water, Electricity');
  
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const result = await createHostel(
      name, 
      gender, 
      ownerId,
      city,
      address,
      hasWifi,
      hasAC,
      hasLaundry,
      parseFloat(monthlyRent) || 5000,
      includedServices,
      hasFood,
      parseFloat(wifiPrice) || 0,
      parseFloat(acPrice) || 0,
      parseFloat(laundryPrice) || 0,
      parseFloat(foodPrice) || 0
    );
    
    if (result.success) {
      router.refresh();
      onClose();
    } else {
      alert(result.error);
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-[#020617]/80 backdrop-blur-sm overflow-y-auto">
      <div className="w-full max-w-lg bg-slate-900 border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200 my-8">
        <header className="p-8 border-b border-white/5 bg-slate-950/40">
          <h2 className="text-2xl font-black text-white">Add New Hostel</h2>
          <p className="text-slate-400 text-sm font-medium">Expand your stay portfolio by adding a verified property.</p>
        </header>

        <form onSubmit={handleSubmit} className="p-8 space-y-5 max-h-[75vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 col-span-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Hostel Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Apex Boys Hostel"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-950 border border-white/5 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500/50 transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Gender Restriction</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full bg-slate-950 border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500/50 transition-colors"
              >
                <option value="Male">Male Only</option>
                <option value="Female">Female Only</option>
                <option value="Mixed">Mixed</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Monthly Rent Base (PKR)</label>
              <input
                type="number"
                required
                value={monthlyRent}
                onChange={(e) => setMonthlyRent(e.target.value)}
                className="w-full bg-slate-950 border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500/50 transition-colors"
              />
            </div>

            <div className="space-y-2 col-span-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">City</label>
              <input
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-slate-950 border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500/50 transition-colors"
              />
            </div>

            <div className="space-y-2 col-span-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Detailed Address</label>
              <input
                type="text"
                required
                placeholder="Street address, sector, area"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full bg-slate-950 border border-white/5 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500/50 transition-colors"
              />
            </div>

            <div className="space-y-2 col-span-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Included Services</label>
              <input
                type="text"
                required
                value={includedServices}
                onChange={(e) => setIncludedServices(e.target.value)}
                className="w-full bg-slate-950 border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500/50 transition-colors"
              />
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Amenities & Monthly Add-on Pricing (PKR)</label>
            
            <div className="space-y-3">
              {/* WiFi */}
              <div className="flex items-center gap-4 bg-slate-950 p-3 rounded-xl border border-white/5">
                <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-bold text-white w-24">
                  <input type="checkbox" checked={hasWifi} onChange={(e) => setHasWifi(e.target.checked)} className="rounded border-slate-700 text-indigo-600 focus:ring-indigo-600/40 bg-slate-900" />
                  WiFi
                </label>
                {hasWifi && (
                  <input 
                    type="number" 
                    placeholder="Monthly price" 
                    value={wifiPrice}
                    onChange={(e) => setWifiPrice(e.target.value)}
                    className="flex-1 bg-slate-900 border border-white/5 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500/50"
                  />
                )}
              </div>

              {/* AC */}
              <div className="flex items-center gap-4 bg-slate-950 p-3 rounded-xl border border-white/5">
                <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-bold text-white w-24">
                  <input type="checkbox" checked={hasAC} onChange={(e) => setHasAC(e.target.checked)} className="rounded border-slate-700 text-indigo-600 focus:ring-indigo-600/40 bg-slate-900" />
                  AC
                </label>
                {hasAC && (
                  <input 
                    type="number" 
                    placeholder="Monthly price" 
                    value={acPrice}
                    onChange={(e) => setAcPrice(e.target.value)}
                    className="flex-1 bg-slate-900 border border-white/5 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500/50"
                  />
                )}
              </div>

              {/* Laundry */}
              <div className="flex items-center gap-4 bg-slate-950 p-3 rounded-xl border border-white/5">
                <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-bold text-white w-24">
                  <input type="checkbox" checked={hasLaundry} onChange={(e) => setHasLaundry(e.target.checked)} className="rounded border-slate-700 text-indigo-600 focus:ring-indigo-600/40 bg-slate-900" />
                  Laundry
                </label>
                {hasLaundry && (
                  <input 
                    type="number" 
                    placeholder="Monthly price" 
                    value={laundryPrice}
                    onChange={(e) => setLaundryPrice(e.target.value)}
                    className="flex-1 bg-slate-900 border border-white/5 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500/50"
                  />
                )}
              </div>

              {/* Food */}
              <div className="flex items-center gap-4 bg-slate-950 p-3 rounded-xl border border-white/5">
                <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-bold text-white w-24">
                  <input type="checkbox" checked={hasFood} onChange={(e) => setHasFood(e.target.checked)} className="rounded border-slate-700 text-indigo-600 focus:ring-indigo-600/40 bg-slate-900" />
                  Food
                </label>
                {hasFood && (
                  <input 
                    type="number" 
                    placeholder="Monthly price" 
                    value={foodPrice}
                    onChange={(e) => setFoodPrice(e.target.value)}
                    className="flex-1 bg-slate-900 border border-white/5 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500/50"
                  />
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-6 border-t border-white/5">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-4 rounded-2xl bg-white/5 text-slate-400 font-bold hover:bg-white/10 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-4 rounded-2xl bg-indigo-600 text-white font-black hover:bg-indigo-500 shadow-lg shadow-indigo-500/20 transition-all active:scale-95 disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Hostel'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
