'use client';

import { useState } from 'react';
import AddHostelModal from './AddHostelModal';

export default function DashboardActions({ ownerId }: { ownerId: number }) {
  const [showAddModal, setShowAddModal] = useState(false);

  return (
    <>
      <button 
        onClick={() => setShowAddModal(true)}
        className="group flex items-center gap-3 px-8 py-4 rounded-2xl bg-primary hover:bg-indigo-700 text-white font-black transition-all shadow-xl shadow-primary/20 hover:-translate-y-0.5 active:scale-95"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
        Register New Hostel
      </button>

      {showAddModal && (
        <AddHostelModal ownerId={ownerId} onClose={() => setShowAddModal(false)} />
      )}
    </>
  );
}
