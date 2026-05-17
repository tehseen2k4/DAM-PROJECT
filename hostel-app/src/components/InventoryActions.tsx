'use client';

import { useState } from 'react';
import BatchRoomModal from './BatchRoomModal';
import SingleRoomModal from './SingleRoomModal';
import DeleteAllRoomsConfirm from './DeleteAllRoomsConfirm';

export default function InventoryActions({ hostelId }: { hostelId: number }) {
  const [showBatchModal, setShowBatchModal] = useState(false);
  const [showSingleModal, setShowSingleModal] = useState(false);
  const [showDeleteAll, setShowDeleteAll] = useState(false);

  return (
    <div className="flex items-center gap-4">
      <button 
        onClick={() => setShowBatchModal(true)}
        className="h-14 px-8 rounded-2xl bg-indigo-600 text-white font-black text-sm uppercase tracking-widest shadow-xl shadow-indigo-600/20 hover:bg-indigo-700 hover:-translate-y-0.5 transition-all active:scale-[0.98]"
      >
        Batch Add
      </button>

      <button 
        onClick={() => setShowSingleModal(true)}
        className="h-14 px-8 rounded-2xl bg-white border border-slate-200 text-slate-900 font-black text-sm uppercase tracking-widest hover:bg-slate-50 transition-all active:scale-[0.98]"
      >
        + Add Room
      </button>

      <button 
        onClick={() => setShowDeleteAll(true)}
        className="h-14 px-6 rounded-2xl bg-rose-50 text-rose-500 font-black text-xs uppercase tracking-widest hover:bg-rose-100 transition-all active:scale-[0.98]"
      >
        Clear All
      </button>

      {showBatchModal && (
        <BatchRoomModal 
            hostelId={hostelId} 
            onClose={() => setShowBatchModal(false)} 
        />
      )}

      {showSingleModal && (
        <SingleRoomModal 
            hostelId={hostelId} 
            onClose={() => setShowSingleModal(false)} 
        />
      )}

      {showDeleteAll && (
        <DeleteAllRoomsConfirm 
            hostelId={hostelId} 
            onClose={() => setShowDeleteAll(false)} 
        />
      )}
    </div>
  );
}
