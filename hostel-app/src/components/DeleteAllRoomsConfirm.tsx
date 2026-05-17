'use client';

import { useState } from 'react';
import { deleteAllRooms } from '@/actions/rooms';
import { useRouter } from 'next/navigation';

export default function DeleteAllRoomsConfirm({ hostelId, onClose }: { hostelId: number, onClose: () => void }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDeleteAll = async () => {
    setLoading(true);
    const result = await deleteAllRooms(hostelId);
    if (result.success) {
      router.refresh();
      onClose();
    } else {
      alert(result.error);
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-rose-950/20 backdrop-blur-md animate-in fade-in duration-300">
      <div className="w-full max-w-sm bg-white border border-rose-100 rounded-[2.5rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
        <div className="p-10 text-center space-y-6">
          <div className="mx-auto w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center mb-6">
             <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-rose-500"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-2xl font-black text-slate-900 font-outfit tracking-tight text-rose-600">DANGER ZONE.</h3>
            <p className="text-slate-500 font-medium">Are you sure you want to delete <b>ALL rooms</b> in this hostel? This action is permanent and only possible if all rooms are empty.</p>
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={handleDeleteAll}
              disabled={loading}
              className="w-full py-4 rounded-2xl bg-rose-500 text-white font-black hover:bg-rose-600 transition-all shadow-lg shadow-rose-200 active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? 'Clearing Storage...' : 'Clear All Rooms'}
            </button>
            <button
              onClick={onClose}
              className="w-full py-4 rounded-2xl bg-slate-50 text-slate-400 font-bold hover:bg-slate-100 transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
