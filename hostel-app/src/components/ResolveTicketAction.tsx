'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { resolveMaintenanceTicket } from '@/actions/maintenance';

export default function ResolveTicketAction({ ticketId, status }: { ticketId: number, status: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  if (status === 'Resolved' || status === 'Cancelled') {
    return (
      <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase tracking-widest border border-emerald-500/20">
        {status}
      </span>
    );
  }

  async function handleResolve() {
    const notes = prompt("Enter resolution notes (e.g., 'Replaced the AC filter'):");
    if (notes === null) return; // User cancelled

    setLoading(true);
    const res = await resolveMaintenanceTicket(ticketId, notes);
    if (res.success) {
      router.refresh();
    } else {
      alert(res.error || "Failed to resolve ticket.");
    }
    setLoading(false);
  }

  return (
    <button 
      onClick={handleResolve}
      disabled={loading}
      className="px-3.5 py-1.5 rounded-lg bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500 transition-colors disabled:opacity-50 whitespace-nowrap shadow-lg shadow-emerald-950/20"
    >
      {loading ? 'Processing...' : 'Mark Resolved'}
    </button>
  );
}
