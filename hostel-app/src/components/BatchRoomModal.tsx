'use client';

import { useState } from 'react';
import { batchCreateRooms } from '@/actions/rooms';
import { useRouter } from 'next/navigation';

export default function BatchRoomModal({ hostelId, onClose }: { hostelId: number, onClose: () => void }) {
  const [startRoom, setStartRoom] = useState('101');
  const [endRoom, setEndRoom] = useState('110');
  const [capacity, setCapacity] = useState('4');
  const [floorNumber, setFloorNumber] = useState('1');
  const [roomType, setRoomType] = useState('Standard');
  const [roomPrice, setRoomPrice] = useState('5000');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleTypeChange = (val: string) => {
    setRoomType(val);
    if (val === 'Standard') setRoomPrice('5000');
    else if (val === 'Premium') setRoomPrice('8000');
    else if (val === 'Deluxe') setRoomPrice('12000');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const result = await batchCreateRooms(
        hostelId, 
        parseInt(startRoom), 
        parseInt(endRoom), 
        parseInt(capacity),
        parseInt(floorNumber),
        roomType,
        parseFloat(roomPrice) || 5000
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="w-full max-w-md bg-slate-900 border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
        <header className="p-8 text-center space-y-2 border-b border-white/5 bg-slate-950/40">
          <div className="mx-auto w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-indigo-500/20">
             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-white"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><line x1="9" y1="3" x2="9" y2="21"/><line x1="15" y1="3" x2="15" y2="21"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/></svg>
          </div>
          <h2 className="text-2xl font-black text-white font-outfit tracking-tight">Batch Setup Rooms</h2>
          <p className="text-slate-400 text-xs font-semibold">Generate multiple rooms and beds instantly in SQL.</p>
        </header>

        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Floor #</label>
                <input
                  type="number"
                  required
                  value={floorNumber}
                  onChange={(e) => setFloorNumber(e.target.value)}
                  className="w-full bg-slate-950 border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500/50 transition-colors"
                />
            </div>
            <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Room Category</label>
                <select
                  value={roomType}
                  onChange={(e) => handleTypeChange(e.target.value)}
                  className="w-full bg-slate-950 border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500/50 transition-colors"
                >
                  <option value="Standard">Standard</option>
                  <option value="Premium">Gold (Premium)</option>
                  <option value="Deluxe">Deluxe (High-end)</option>
                </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Start Room #</label>
                <input
                  type="number"
                  required
                  value={startRoom}
                  onChange={(e) => setStartRoom(e.target.value)}
                  className="w-full bg-slate-950 border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500/50 transition-colors"
                />
            </div>
            <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">End Room #</label>
                <input
                  type="number"
                  required
                  value={endRoom}
                  onChange={(e) => setEndRoom(e.target.value)}
                  className="w-full bg-slate-950 border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500/50 transition-colors"
                />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Beds Per Room</label>
            <input
              type="number"
              required
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              className="w-full bg-slate-950 border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500/50 transition-colors"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Rent Price per Bed (PKR)</label>
            <input
              type="number"
              required
              value={roomPrice}
              onChange={(e) => setRoomPrice(e.target.value)}
              className="w-full bg-slate-950 border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500/50 transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-2xl bg-indigo-600 text-white font-black text-base hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-950/20 active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? 'Processing SQL...' : 'Generate Inventory'}
          </button>

          <div className="text-center pt-2">
            <button 
              type="button" 
              onClick={onClose}
              className="text-xs font-black text-slate-500 hover:text-slate-400 transition-colors uppercase tracking-widest"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
