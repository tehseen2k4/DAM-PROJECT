'use client';

import { useState } from 'react';
import { generateMonthlyBill } from '@/actions/hostels';
import { useRouter } from 'next/navigation';

export default function OwnerOccupiedBeds({ 
  occupiedBeds 
}: { 
  occupiedBeds: any[]; 
 }) {
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const router = useRouter();

  async function handleSendBill(allocationId: number, amount: number) {
    if (!confirm(`Are you sure you want to generate and send a monthly bill of PKR ${amount} for this student?`)) {
      return;
    }
    setLoadingId(allocationId);
    const res = await generateMonthlyBill(allocationId, amount);
    if (res.success) {
      alert('Monthly bill invoice generated and posted successfully!');
      router.refresh();
    } else {
      alert(res.error || 'Failed to generate bill.');
    }
    setLoadingId(null);
  }

  return (
    <div className="bg-slate-900 border border-white/5 rounded-3xl overflow-hidden shadow-xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-950 border-b border-white/5">
            <tr>
              <th className="p-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Bed & Location</th>
              <th className="p-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Student Resident</th>
              <th className="p-5 text-[10px] font-black uppercase tracking-widest text-slate-400">University & Age</th>
              <th className="p-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Rent Fee</th>
              <th className="p-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {occupiedBeds.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-12 text-center text-slate-500 font-semibold">
                  No beds are currently occupied in your hostels.
                </td>
              </tr>
            ) : (
              occupiedBeds.map((bed: any) => {
                const rentAmount = bed.AllocatedAmount || bed.RoomPrice || bed.MonthlyRent || 5000;
                const isPendingVerification = bed.LatestPaymentStatus === 'Pending Verification';

                return (
                  <tr key={bed.BedID} className="hover:bg-white/5 transition-colors">
                    <td className="p-5">
                      <p className="text-white font-bold text-sm">{bed.HostelName}</p>
                      <p className="text-slate-500 text-xs">Room {bed.RoomNumber} ({bed.RoomType}) • Bed {bed.BedNumber}</p>
                    </td>
                    <td className="p-5">
                      <p className="text-white font-bold text-sm">{bed.StudentName || 'Unknown Student'}</p>
                      <p className="text-slate-500 text-xs">{bed.StudentEmail || 'No Email'}</p>
                    </td>
                    <td className="p-5">
                      <p className="text-slate-300 font-semibold text-xs">{bed.StudentUniversity || 'N/A'}</p>
                      <p className="text-slate-500 text-[10px]">Age: {bed.StudentAge || 'N/A'} • Gender: {bed.StudentGender || 'N/A'}</p>
                    </td>
                    <td className="p-5 text-white font-bold text-sm">
                      Rs. {rentAmount}
                    </td>
                    <td className="p-5 text-right">
                      {isPendingVerification ? (
                        <span className="inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-amber-500/10 text-amber-400 border border-amber-500/20 animate-pulse">
                          Pending Verification
                        </span>
                      ) : bed.AllocationID ? (
                        <button
                          onClick={() => handleSendBill(bed.AllocationID, rentAmount)}
                          disabled={loadingId === bed.AllocationID}
                          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black uppercase tracking-widest transition-all active:scale-95 disabled:opacity-50 shadow-lg shadow-emerald-950/20"
                        >
                          {loadingId === bed.AllocationID ? 'Sending...' : 'Send Bill'}
                        </button>
                      ) : (
                        <span className="text-slate-600 text-xs">No Active Allocation</span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
