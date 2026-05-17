'use client';

import { useState, useEffect } from 'react';
import { getPublicHostelDetails } from '@/actions/public';
import StudentBookBedAction from './StudentBookBedAction';

export default function StudentHostelDetailsModal({ 
  hostel, 
  studentId, 
  onClose 
}: { 
  hostel: any; 
  studentId: number; 
  onClose: () => void; 
}) {
  const [loading, setLoading] = useState(true);
  const [rooms, setRooms] = useState<any[]>([]);
  const [error, setError] = useState('');

  // Interactive amenities selection
  const [useWifi, setUseWifi] = useState(false);
  const [useAC, setUseAC] = useState(false);
  const [useLaundry, setUseLaundry] = useState(false);
  const [useFood, setUseFood] = useState(false);

  useEffect(() => {
    async function loadDetails() {
      setLoading(true);
      const res = await getPublicHostelDetails(hostel.HostelID);
      if (res.success && res.data) {
        setRooms(res.data.rooms);
      } else {
        setError(res.error || 'Failed to load rooms details.');
      }
      setLoading(false);
    }
    loadDetails();
  }, [hostel.HostelID]);

  // Calculate chosen amenities add-on sum
  const getAddonsSum = () => {
    let sum = 0;
    if (useWifi && hostel.HasWifi) sum += (hostel.WifiPrice || 0);
    if (useAC && hostel.HasAC) sum += (hostel.ACPrice || 0);
    if (useLaundry && hostel.HasLaundry) sum += (hostel.LaundryPrice || 0);
    if (useFood && hostel.HasFood) sum += (hostel.FoodPrice || 0);
    return sum;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-white/10 rounded-[2.5rem] w-full max-w-4xl max-h-[85vh] overflow-hidden shadow-2xl relative flex flex-col">
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-colors z-10"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </button>

        {/* Modal Header */}
        <div className="bg-gradient-to-r from-indigo-900/40 via-purple-900/30 to-slate-900 p-8 border-b border-white/5 flex-shrink-0">
          <div className="space-y-3">
            <span className="inline-block px-2.5 py-0.5 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-black uppercase tracking-widest text-indigo-400">
              {hostel.GenderType} Managed
            </span>
            <h2 className="text-4xl font-black text-white font-outfit tracking-tight">{hostel.HostelName}</h2>
            <p className="text-slate-400 text-sm font-medium">Located at: {hostel.Address || 'Primary Location'}, {hostel.City}</p>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-8 overflow-y-auto flex-1 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="space-y-6 lg:col-span-1">
            {/* Price Badge */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 text-center">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Baseline Monthly Rent</p>
              <p className="text-3xl font-black text-white font-outfit">PKR {hostel.MonthlyRent || 5000}</p>
              <p className="text-xs font-semibold text-indigo-400 mt-1">All-Inclusive Standard Rate</p>
            </div>

            {/* Interactive Amenities Checklist */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-4">
              <div className="space-y-1">
                <h3 className="text-xs font-black text-white uppercase tracking-widest text-slate-400">Add-on Amenities</h3>
                <p className="text-[10px] text-slate-500 font-semibold">Select monthly services you would like to include.</p>
              </div>

              <div className="space-y-2">
                {/* Wifi */}
                {hostel.HasWifi ? (
                  <label className="flex items-center justify-between p-3 rounded-xl border border-white/5 bg-slate-950/40 text-sm font-bold text-slate-300 cursor-pointer hover:border-indigo-500/30 transition-all select-none">
                    <span className="flex items-center gap-2">
                      <input 
                        type="checkbox" 
                        checked={useWifi} 
                        onChange={(e) => setUseWifi(e.target.checked)} 
                        className="rounded border-slate-700 text-indigo-600 focus:ring-indigo-600/40 bg-slate-900" 
                      />
                      WiFi Access
                    </span>
                    <span className="text-xs text-indigo-400 font-black">Rs.{hostel.WifiPrice}</span>
                  </label>
                ) : (
                  <div className="flex items-center justify-between p-3 rounded-xl border border-white/5 bg-white/5 opacity-40 text-sm font-bold text-slate-500 line-through">
                    <span>WiFi Access</span>
                    <span className="text-xs">N/A</span>
                  </div>
                )}

                {/* AC */}
                {hostel.HasAC ? (
                  <label className="flex items-center justify-between p-3 rounded-xl border border-white/5 bg-slate-950/40 text-sm font-bold text-slate-300 cursor-pointer hover:border-indigo-500/30 transition-all select-none">
                    <span className="flex items-center gap-2">
                      <input 
                        type="checkbox" 
                        checked={useAC} 
                        onChange={(e) => setUseAC(e.target.checked)} 
                        className="rounded border-slate-700 text-indigo-600 focus:ring-indigo-600/40 bg-slate-900" 
                      />
                      Air Conditioning (AC)
                    </span>
                    <span className="text-xs text-indigo-400 font-black">Rs.{hostel.ACPrice}</span>
                  </label>
                ) : (
                  <div className="flex items-center justify-between p-3 rounded-xl border border-white/5 bg-white/5 opacity-40 text-sm font-bold text-slate-500 line-through">
                    <span>AC Service</span>
                    <span className="text-xs">N/A</span>
                  </div>
                )}

                {/* Laundry */}
                {hostel.HasLaundry ? (
                  <label className="flex items-center justify-between p-3 rounded-xl border border-white/5 bg-slate-950/40 text-sm font-bold text-slate-300 cursor-pointer hover:border-indigo-500/30 transition-all select-none">
                    <span className="flex items-center gap-2">
                      <input 
                        type="checkbox" 
                        checked={useLaundry} 
                        onChange={(e) => setUseLaundry(e.target.checked)} 
                        className="rounded border-slate-700 text-indigo-600 focus:ring-indigo-600/40 bg-slate-900" 
                      />
                      Laundry Service
                    </span>
                    <span className="text-xs text-indigo-400 font-black">Rs.{hostel.LaundryPrice}</span>
                  </label>
                ) : (
                  <div className="flex items-center justify-between p-3 rounded-xl border border-white/5 bg-white/5 opacity-40 text-sm font-bold text-slate-500 line-through">
                    <span>Laundry Service</span>
                    <span className="text-xs">N/A</span>
                  </div>
                )}

                {/* Food */}
                {hostel.HasFood ? (
                  <label className="flex items-center justify-between p-3 rounded-xl border border-white/5 bg-slate-950/40 text-sm font-bold text-slate-300 cursor-pointer hover:border-indigo-500/30 transition-all select-none">
                    <span className="flex items-center gap-2">
                      <input 
                        type="checkbox" 
                        checked={useFood} 
                        onChange={(e) => setUseFood(e.target.checked)} 
                        className="rounded border-slate-700 text-indigo-600 focus:ring-indigo-600/40 bg-slate-900" 
                      />
                      Food Menu (3 meals)
                    </span>
                    <span className="text-xs text-indigo-400 font-black">Rs.{hostel.FoodPrice}</span>
                  </label>
                ) : (
                  <div className="flex items-center justify-between p-3 rounded-xl border border-white/5 bg-white/5 opacity-40 text-sm font-bold text-slate-500 line-through">
                    <span>Food Menu</span>
                    <span className="text-xs">N/A</span>
                  </div>
                )}
              </div>
            </div>

            {/* Services included */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-3">
              <h3 className="text-xs font-black text-white uppercase tracking-widest text-slate-400">Included Services</h3>
              <div className="flex flex-wrap gap-1.5">
                {(hostel.IncludedServices || 'Security, Water, Electricity').split(',').map((serv: string) => (
                  <span key={serv.trim()} className="px-2.5 py-1 bg-indigo-950/40 border border-indigo-900/30 text-indigo-400 text-[10px] font-black uppercase tracking-widest rounded-lg">
                    {serv.trim()}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Rooms Grid */}
          <div className="lg:col-span-2 space-y-6">
            <h3 className="text-xs font-black text-white font-outfit uppercase tracking-widest text-slate-400 border-b border-white/5 pb-2">Available Rooms</h3>
            
            {loading ? (
              <div className="space-y-4">
                {[1, 2].map(i => (
                  <div key={i} className="h-28 rounded-3xl bg-white/5 animate-pulse border border-white/5" />
                ))}
              </div>
            ) : error ? (
              <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-center font-bold text-sm">
                {error}
              </div>
            ) : rooms.length === 0 ? (
              <div className="py-16 text-center bg-white/5 border border-dashed border-white/10 rounded-3xl">
                <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-600 mx-auto mb-3"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>
                <p className="text-slate-400 font-bold">This hostel has no vacant beds right now.</p>
                <p className="text-slate-500 text-xs mt-1">Please join the waiting list or check another property.</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-[45vh] overflow-y-auto pr-2">
                {rooms.map(room => {
                  const baseRent = room.RoomPrice || hostel.MonthlyRent || 5000;
                  const addonsPrice = getAddonsSum();
                  const totalCalculatedPrice = baseRent + addonsPrice;

                  return (
                    <div key={room.RoomID} className="bg-white/5 border border-white/10 rounded-3xl p-6 flex flex-col md:flex-row justify-between items-center gap-6 hover:border-indigo-500/30 hover:bg-white/8 transition-all">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-2xl font-black text-white font-outfit">Room {room.RoomNumber}</h4>
                          <span className="px-2 py-0.5 bg-indigo-500/10 text-indigo-400 text-[9px] font-black uppercase tracking-widest rounded-md">{room.RoomType}</span>
                        </div>
                        <p className="text-slate-400 text-xs mt-1">Floor {room.FloorNumber} • {room.Capacity} Bed Capacity</p>
                        
                        <div className="mt-3 space-y-1">
                          <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Pricing breakdown</p>
                          <p className="text-xs text-slate-400">Base Room Price: <span className="font-bold text-white">Rs. {baseRent}</span></p>
                          {addonsPrice > 0 && <p className="text-xs text-slate-400">Amenities Add-ons: <span className="font-bold text-indigo-400">+ Rs. {addonsPrice}</span></p>}
                          <p className="text-xs text-white font-black">Total Monthly Rent: <span className="text-emerald-400 font-black text-sm">Rs. {totalCalculatedPrice}</span></p>
                        </div>
                      </div>

                      <div className="flex gap-2 flex-wrap justify-end">
                        {room.AvailableBeds?.map((bed: any) => (
                          <div key={bed.BedID} className="p-3 bg-slate-950 border border-white/5 rounded-2xl text-center w-28 flex flex-col justify-between">
                            <div>
                              <span className="text-[8px] font-black uppercase text-slate-500 tracking-widest block mb-0.5">Bed Slot</span>
                              <span className="text-lg font-black text-emerald-400">{bed.BedNumber}</span>
                            </div>
                            <StudentBookBedAction 
                              bed={bed} 
                              studentId={studentId} 
                              useWifi={useWifi}
                              useAC={useAC}
                              useLaundry={useLaundry}
                              useFood={useFood}
                              totalPrice={totalCalculatedPrice}
                            />
                          </div>
                        ))}
                      </div>

                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
