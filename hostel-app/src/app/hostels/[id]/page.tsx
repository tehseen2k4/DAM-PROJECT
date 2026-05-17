import { getRoomsByHostel, getHostelById } from "@/actions/rooms";
import { auth, signOut } from "@/auth";
import { redirect, notFound } from "next/navigation";
import Link from 'next/link';
import InventoryActions from "@/components/InventoryActions";
import RoomCardActions from "@/components/RoomCardActions";

export default async function HostelDetails({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) redirect("/auth/signin");
  if ((session.user as any).role !== 'Owner' && (session.user as any).role !== 'Admin') redirect("/auth/signin");

  const { id } = await params;
  const hostelId = parseInt(id);

  const [hostelRes, roomsRes] = await Promise.all([
    getHostelById(hostelId),
    getRoomsByHostel(hostelId)
  ]);

  if (!hostelRes.data) notFound();

  const hostel = hostelRes.data;
  const rooms = roomsRes.data || [];
  const displayName = (session.user as any).displayName || session.user?.name || 'Owner';

  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-indigo-500 selection:text-white">
      {/* Background Glow */}
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-950/20 via-slate-950 to-slate-950" />

      {/* Sidebar Navigation */}
      <div className="fixed inset-y-0 left-0 w-72 bg-slate-900 border-r border-white/5 flex flex-col z-40">
        {/* Logo */}
        <div className="p-6 border-b border-white/5">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            </div>
            <span className="text-xl font-black text-white tracking-tight">Stay<span className="text-indigo-400">Sync</span></span>
          </Link>
        </div>

        {/* User Info */}
        <div className="p-6 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
              <span className="text-indigo-400 font-black text-sm">{displayName?.[0]?.toUpperCase()}</span>
            </div>
            <div>
              <p className="text-white font-bold text-sm truncate max-w-[150px]">{displayName}</p>
              <p className="text-indigo-400 text-[10px] font-black uppercase tracking-widest">Hostel Owner</p>
            </div>
          </div>
        </div>

        {/* Sidebar Links */}
        <nav className="flex-1 p-4 space-y-1">
          <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-indigo-500/10 text-indigo-400 font-bold text-sm transition-all hover:bg-indigo-500/15">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            Back to Dashboard
          </Link>
        </nav>

        {/* Sign Out Action */}
        <div className="p-4 border-t border-white/5">
          <form action={async () => {
            'use server';
            await signOut({ redirectTo: '/auth/signin' });
          }}>
            <button type="submit" className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 font-bold text-sm transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
              Sign Out
            </button>
          </form>
        </div>
      </div>

      {/* Main Dashboard Portal Container */}
      <main className="pl-72 min-h-screen">
        <div className="p-8 max-w-6xl mx-auto space-y-12">
          
          {/* Header section styled exactly like the dashboard */}
          <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-8 border-b border-white/5 relative overflow-hidden">
              <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-500/20 bg-indigo-500/5 text-indigo-400 text-[10px] font-black tracking-widest uppercase">
                      Live Inventory Bridge
                  </div>
                  <h1 className="text-4xl font-black tracking-tight text-white font-outfit leading-none">{hostel.HostelName}</h1>
                  <p className="text-slate-400 text-sm font-semibold max-w-xl">
                      Visualizing the current database state for rooms and bed occupancy. 
                      Data-driven management for high-availability student housing.
                  </p>
                  
                  <div className="flex gap-2 flex-wrap pt-2">
                    {hostel.HasWifi && <span className="px-3 py-1 bg-slate-900 text-indigo-400 border border-white/5 rounded-lg text-[10px] font-black uppercase tracking-widest">WiFi: Rs.{hostel.WifiPrice}</span>}
                    {hostel.HasAC && <span className="px-3 py-1 bg-slate-900 text-indigo-400 border border-white/5 rounded-lg text-[10px] font-black uppercase tracking-widest">AC: Rs.{hostel.ACPrice}</span>}
                    {hostel.HasLaundry && <span className="px-3 py-1 bg-slate-900 text-indigo-400 border border-white/5 rounded-lg text-[10px] font-black uppercase tracking-widest">Laundry: Rs.{hostel.LaundryPrice}</span>}
                    {hostel.HasFood && <span className="px-3 py-1 bg-slate-900 text-indigo-400 border border-white/5 rounded-lg text-[10px] font-black uppercase tracking-widest">Food: Rs.{hostel.FoodPrice}</span>}
                  </div>
              </div>
              
              <div className="flex items-center gap-4">
                <InventoryActions hostelId={hostelId} />
              </div>
          </header>

          {/* Room Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rooms.map((room: any) => (
                  <div key={room.RoomID} className="group p-6 rounded-3xl bg-slate-900 border border-white/5 shadow-sm hover:border-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/5 transition-all">
                      <div className="flex items-start justify-between mb-6">
                          <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                  <h3 className="text-xl font-black text-white font-outfit leading-none">Room {room.RoomNumber}</h3>
                                  <span className="px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-400 text-[9px] font-black uppercase tracking-widest self-start mt-0.5">{room.RoomType}</span>
                              </div>
                              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Floor {room.FloorNumber} • Capacity {room.Capacity}</p>
                              <p className="text-xs font-black text-indigo-400 pt-1">Rs. {room.RoomPrice || hostel.MonthlyRent || 5000} / Bed</p>
                          </div>
                          <RoomCardActions room={room} />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                          {room.Beds.map((bed: any) => (
                              <div 
                                  key={bed.BedID}
                                  className={`p-3.5 rounded-2xl border transition-all ${
                                      bed.Status === 'Available' 
                                      ? 'bg-emerald-500/5 border-emerald-500/20 hover:bg-emerald-500/10' 
                                      : bed.Status === 'Occupied'
                                      ? 'bg-rose-500/5 border-rose-500/10 opacity-60'
                                      : 'bg-amber-500/5 border-amber-500/20'
                                  }`}
                              >
                                  <div className="flex items-center justify-between mb-2">
                                      <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">Bed {bed.BedNumber}</span>
                                      <div className={`w-1.5 h-1.5 rounded-full ${
                                          bed.Status === 'Available' ? 'bg-emerald-500' : bed.Status === 'Occupied' ? 'bg-rose-500' : 'bg-amber-500'
                                      }`} />
                                  </div>
                                  <p className={`text-xs font-black uppercase tracking-widest ${
                                      bed.Status === 'Available' ? 'text-emerald-400' : bed.Status === 'Occupied' ? 'text-rose-400' : 'text-amber-400'
                                  }`}>
                                      {bed.Status}
                                  </p>
                              </div>
                          ))}
                      </div>
                  </div>
              ))}
          </div>

        </div>
      </main>
    </div>
  );
}
