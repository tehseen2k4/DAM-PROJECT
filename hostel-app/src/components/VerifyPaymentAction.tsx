'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { verifyPayment, cancelAllocation, checkoutAllocation } from '@/actions/payments';

export default function VerifyPaymentAction({ 
  paymentId, 
  status, 
  allocationId, 
  allocationStatus 
}: { 
  paymentId: number, 
  status: string, 
  allocationId: number, 
  allocationStatus: string 
}) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  if (allocationStatus === 'Cancelled' || status === 'Failed') {
    return (
      <span className="px-2.5 py-1 rounded-md bg-white/5 text-slate-500 text-[10px] font-black uppercase tracking-widest border border-white/5">
        Cancelled
      </span>
    );
  }

  async function handleCheckout() {
    if (!confirm("Are you sure? This will check the student out and permanently free up their bed.")) return;
    
    setLoading(true);
    const res = await checkoutAllocation(allocationId);
    if (res.success) {
      router.refresh();
    } else {
      alert("Failed to checkout student.");
    }
    setLoading(false);
  }

  if (allocationStatus === 'Completed') {
    return (
      <span className="px-2.5 py-1 rounded-md bg-indigo-500/10 text-indigo-400 text-[10px] font-black uppercase tracking-widest border border-indigo-500/20">
        Checked Out
      </span>
    );
  }

  if (status === 'Paid') {
    return (
      <div className="flex gap-2 justify-end items-center">
        <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase tracking-widest border border-emerald-500/20">
          Verified
        </span>
        <button 
          onClick={handleCheckout}
          disabled={loading}
          className="px-3 py-1.5 rounded-lg bg-slate-950 border border-white/10 text-slate-400 text-[10px] font-black uppercase tracking-widest hover:bg-white/5 hover:text-white transition-colors disabled:opacity-50"
        >
          Checkout
        </button>
      </div>
    );
  }

  async function handleVerify() {
    setLoading(true);
    const res = await verifyPayment(paymentId);
    if (res.success) {
      router.refresh();
    } else {
      alert("Failed to verify payment.");
    }
    setLoading(false);
  }

  async function handleReject() {
    if (!confirm("Are you sure? This will immediately cancel the student's booking and make the bed available again.")) return;
    
    setLoading(true);
    const res = await cancelAllocation(allocationId, paymentId);
    if (res.success) {
      router.refresh();
    } else {
      alert("Failed to cancel booking.");
    }
    setLoading(false);
  }

  return (
    <div className="flex gap-2 justify-end">
      <button 
        onClick={handleReject}
        disabled={loading}
        className="px-3.5 py-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[10px] font-black uppercase tracking-widest hover:bg-rose-500/20 transition-colors disabled:opacity-50"
      >
        Reject
      </button>
      <button 
        onClick={handleVerify}
        disabled={loading}
        className="px-3.5 py-1.5 rounded-lg bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-indigo-500 transition-colors disabled:opacity-50"
      >
        {loading ? 'Processing...' : 'Verify'}
      </button>
    </div>
  );
}
