'use client';

import { useState } from 'react';
import { createRoom } from '@/actions/rooms';
import { useRouter } from 'next/navigation';

export default function SingleRoomModal({ hostelId, onClose }: { hostelId: number, onClose: () => void }) {
  const [roomNumber, setRoomNumber] = useState('');
  const [capacity, setCapacity] = useState('4');
  const [floorNumber, setFloorNumber] = useState('0');
  const [roomType, setRoomType] = useState('Standard');
  const [roomPrice, setRoomPrice] = useState('5000');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Dynamically suggest price based on category
  const handleTypeChange = (val: string) => {
    setRoomType(val);
    if (val === 'Standard') setRoomPrice('5000');
    else if (val === 'Premium') setRoomPrice('8000');
    else if (val === 'Deluxe') setRoomPrice('12000');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const result = await createRoom(
        hostelId, 
        roomNumber, 
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
             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="M12 2v20"/><path d="m17 5-5-3-5 3"/><path d="m17 19-5 3-5-3"/><path d="m2 12 5-3 5 3-5 3-5-3Z"/><path d="m12 12 5-3 5 3-5 3-5-3Z"/></svg>
          </div>
          <h2 className="text-2xl font-black text-white font-outfit tracking-tight">Add Single Room</h2>
          <p className="text-slate-400 text-xs font-semibold">Add a specific category room to this hostel.</p>
        </header>

        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 col-span-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Room Number</label>
                <input
                  type="text"
                  required
                  value={roomNumber}
                  onChange={(e) => setRoomNumber(e.target.value)}
                  className="w-full bg-slate-950 border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500/50 transition-colors placeholder-slate-600"
                  placeholder="e.g. 204A"
                />
            </div>
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
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Capacity (Beds)</label>
                <input
                  type="number"
                  required
                  value={capacity}
                  onChange={(e) => setCapacity(e.target.value)}
                  className="w-full bg-slate-950 border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500/50 transition-colors"
                />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Room Category</label>
            <select 
              value={roomType}
              onChange={(e) => handleTypeChange(e.target.value)}
              className="w-full bg-slate-950 border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500/50 transition-colors"
            >
              <option value="Standard">Standard (Regular)</option>
              <option value="Premium">Gold (Premium)</option>
              <option value="Deluxe">Deluxe (High-end)</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Room Rent Price (PKR per bed)</label>
            <input
              type="number"
              required
              value={roomPrice}
              onChange={(e) => setRoomPrice(e.target.value)}
              className="w-full bg-slate-950 border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500/50 transition-colors"
            />
          </div>

          <div className="flex gap-3 pt-4 border-t border-white/5">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3.5 rounded-xl bg-white/5 text-slate-400 font-bold hover:bg-white/10 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-3.5 rounded-xl bg-indigo-600 text-white font-black hover:bg-indigo-500 transition-all disabled:opacity-50"
            >
              {loading ? 'Adding...' : 'Add Room'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
