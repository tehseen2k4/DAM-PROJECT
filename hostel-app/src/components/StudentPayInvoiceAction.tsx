'use client';

import { useState } from 'react';
import { payPendingInvoice } from '@/actions/payments';
import { useRouter } from 'next/navigation';

export default function StudentPayInvoiceAction({ 
  paymentId, 
  status 
}: { 
  paymentId: number; 
  status: string; 
}) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handlePay() {
    setLoading(true);
    const res = await payPendingInvoice(paymentId);
    if (res.success) {
      router.refresh();
    } else {
      alert(res.error || 'Failed to submit payment.');
    }
    setLoading(false);
  }

  if (status === 'Pending') {
    return (
      <button
        onClick={handlePay}
        disabled={loading}
        className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 disabled:opacity-50"
      >
        {loading ? 'Processing...' : 'Pay Dues'}
      </button>
    );
  }

  if (status === 'Pending Verification') {
    return (
      <span className="px-2.5 py-1 rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-[10px] font-black uppercase tracking-widest animate-pulse">
        Verifying...
      </span>
    );
  }

  if (status === 'Paid') {
    return (
      <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-black uppercase tracking-widest">
        Paid & Settled
      </span>
    );
  }

  return (
    <span className="px-2.5 py-1 rounded-md bg-rose-500/10 text-rose-400 border border-rose-500/20 text-[10px] font-black uppercase tracking-widest">
      {status}
    </span>
  );
}
