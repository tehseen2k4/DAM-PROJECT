'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { bookBedForStudent } from '@/actions/student';

export default function StudentBookBedAction({ 
  bed, 
  studentId,
  useWifi = false,
  useAC = false,
  useLaundry = false,
  useFood = false,
  totalPrice = 0
}: { 
  bed: any; 
  studentId: number;
  useWifi?: boolean;
  useAC?: boolean;
  useLaundry?: boolean;
  useFood?: boolean;
  totalPrice?: number;
}) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleBook() {
    const confirmBooking = window.confirm(`Confirm booking for Bed Slot ${bed.BedNumber}? Your monthly total rent will be Rs. ${totalPrice}. This will issue an active verification invoice.`);
    if (!confirmBooking) return;

    setLoading(true);
    const result = await bookBedForStudent(bed.BedID, studentId, useWifi, useAC, useLaundry, useFood);

    if (result.success) {
      alert("Success! Your booking has been securely allocated and invoice issued. Please check your Dashboard overview for verification status.");
      router.refresh();
      window.location.reload();
    } else {
      alert(result.error || "Failed to book bed.");
    }
    setLoading(false);
  }

  return (
    <button 
      onClick={handleBook}
      disabled={loading}
      className="w-full mt-2 py-2.5 px-3 bg-emerald-600 text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500 shadow-md shadow-emerald-600/10 transition-all disabled:opacity-50"
    >
      {loading ? 'Booking...' : 'Book Bed'}
    </button>
  );
}
