'use client';

import { useState } from 'react';
import { deleteHostel } from '@/actions/hostels';
import { useRouter } from 'next/navigation';

export default function DeleteHostelConfirm({ hostel, onClose }: { hostel: any; onClose: () => void }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setLoading(true);
    const result = await deleteHostel(hostel.HostelID);
    
    if (result.success) {
      router.refresh();
      onClose();
    } else {
      alert(result.error);
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-[#020617]/80 backdrop-blur-sm">
      <div className="w-full max-w-md bg-slate-900 border border-rose-500/20 rounded-[2rem] overflow-hidden shadow-2xl">
        <header className="p-8 border-b border-rose-500/5 bg-rose-500/5">
          <h2 className="text-2xl font-black text-white">Delete Property?</h2>
          <p className="text-rose-400/60 text-sm font-medium">This action cannot be undone.</p>
        </header>

        <div className="p-8 space-y-6">
          <p className="text-slate-400 font-medium">
            Are you sure you want to remove <span className="text-white font-bold">{hostel.HostelName}</span>? 
            The system will check for existing records (integrity check) before proceeding.
          </p>

          <div className="flex gap-4">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-4 rounded-2xl bg-white/5 text-slate-400 font-bold hover:bg-white/10 transition-colors"
            >
              Keep it
            </button>
            <button
              onClick={handleDelete}
              disabled={loading}
              className="flex-1 px-6 py-4 rounded-2xl bg-rose-600 text-white font-black hover:bg-rose-500 shadow-lg shadow-rose-900/40 transition-all active:scale-95 disabled:opacity-50"
            >
              {loading ? 'Deleting...' : 'Confirm Delete'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
