'use client';

import { useState } from 'react';
import { updateRoom } from '@/actions/rooms';
import { useRouter } from 'next/navigation';

export default function EditRoomModal({ room, onClose }: { room: any, onClose: () => void }) {
  const [roomNumber, setRoomNumber] = useState(room.RoomNumber);
  const [capacity, setCapacity] = useState(room.Capacity.toString());
  const [floorNumber, setFloorNumber] = useState(room.FloorNumber.toString());
  const [roomType, setRoomType] = useState(room.RoomType);
  const [roomPrice, setRoomPrice] = useState(room.RoomPrice?.toString() || '5000');
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
    
    const result = await updateRoom(
        room.RoomID, 
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
             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
          </div>
          <h2 className="text-2xl font-black text-white font-outfit tracking-tight">Edit Room {room.RoomNumber}</h2>
          <p className="text-slate-400 text-xs font-semibold">Update room specifications and category pricing.</p>
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
                  className="w-full bg-slate-950 border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500/50 transition-colors"
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
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Capacity</label>
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
              <option value="Standard">Standard</option>
              <option value="Premium">Gold (Premium)</option>
              <option value="Deluxe">Deluxe (High-end)</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Room Price (PKR per bed)</label>
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
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
