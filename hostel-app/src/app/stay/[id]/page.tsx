import { getPublicHostelDetails } from "@/actions/public";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { notFound } from "next/navigation";
import BookBedAction from "@/components/BookBedAction";

export default async function StayDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const hostelId = parseInt(id);

  const result = await getPublicHostelDetails(hostelId);

  if (!result.success || !result.data) {
    notFound();
  }

  const { hostel, rooms } = result.data;
  
  // Calculate total available beds
  const totalAvailableBeds = rooms.reduce((acc: number, room: any) => acc + room.AvailableBeds.length, 0);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Header />
      
      <main className="flex-1 pb-24">
        {/* Hero Section */}
        <div className="bg-white border-b border-slate-200 pt-12 pb-16">
            <div className="container mx-auto px-6 max-w-6xl">
                <div className="mb-8">
                    <Link href="/" className="inline-flex items-center text-sm font-bold tracking-widest uppercase text-slate-400 hover:text-indigo-600 transition-colors">
                        ← Back to Search
                    </Link>
                </div>
                
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-8">
                    <div className="space-y-4 max-w-2xl">
                        <span className="inline-block px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-black tracking-widest uppercase border border-indigo-100">
                            {hostel.GenderType} Verified Hostel
                        </span>
                        <h1 className="text-5xl lg:text-7xl font-black text-slate-900 font-outfit tracking-tighter leading-none">
                            {hostel.HostelName}
                        </h1>
                        <p className="text-lg text-slate-500 font-medium">Managed by {hostel.OwnerName || 'StaySync Partner'}</p>
                        
                        {hostel.Address && (
                          <p className="text-slate-600 font-medium flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-600"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                            {hostel.Address}, {hostel.City}
                          </p>
                        )}
                    </div>

                    <div className="flex gap-4">
                        <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 text-center min-w-[140px]">
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Baseline Rent</p>
                            <p className="text-2xl font-black text-slate-900 font-outfit">Rs. {hostel.MonthlyRent || 5000}</p>
                            <p className="text-xs font-bold text-slate-500 mt-1">per month</p>
                        </div>

                        <div className="bg-indigo-600 text-white rounded-3xl p-6 text-center min-w-[140px] shadow-xl shadow-indigo-600/20">
                            <p className="text-[10px] font-black uppercase tracking-widest text-indigo-200 mb-1">Available Beds</p>
                            <p className="text-3xl font-black font-outfit">{totalAvailableBeds}</p>
                            <p className="text-xs font-bold text-indigo-200 mt-1">Beds Left</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div className="container mx-auto px-6 max-w-6xl mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Amenities & Included Services Details */}
            <div className="lg:col-span-1 space-y-6">
                <div className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm space-y-6">
                    <h3 className="text-xl font-black text-slate-900 font-outfit tracking-tight">Hostel Amenities</h3>
                    <div className="grid grid-cols-1 gap-3">
                        <div className={`flex items-center gap-3 p-3 rounded-xl border ${hostel.HasWifi ? 'bg-emerald-50/50 border-emerald-100 text-emerald-800' : 'bg-slate-50 border-slate-100 text-slate-400 line-through'}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h.01"/><path d="M8.5 16.5a5 5 0 0 1 7 0"/><path d="M5 13a10 10 0 0 1 14 0"/><path d="M1.5 9.5a15 15 0 0 1 21 0"/></svg>
                            <span className="text-sm font-bold">High-Speed WiFi</span>
                        </div>

                        <div className={`flex items-center gap-3 p-3 rounded-xl border ${hostel.HasAC ? 'bg-emerald-50/50 border-emerald-100 text-emerald-800' : 'bg-slate-50 border-slate-100 text-slate-400 line-through'}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"/><path d="m17 5-5-3-5 3"/><path d="m17 19-5 3-5-3"/><path d="M2 12h20"/></svg>
                            <span className="text-sm font-bold">Air Conditioning (AC)</span>
                        </div>

                        <div className={`flex items-center gap-3 p-3 rounded-xl border ${hostel.HasLaundry ? 'bg-emerald-50/50 border-emerald-100 text-emerald-800' : 'bg-slate-50 border-slate-100 text-slate-400 line-through'}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 12a4 4 0 1 0 8 0 4 4 0 1 0-8 0"/><path d="M12 2v4"/><path d="M12 18v4"/><path d="M4 12h4"/><path d="M16 12h4"/></svg>
                            <span className="text-sm font-bold">Laundry Service</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm space-y-4">
                    <h3 className="text-xl font-black text-slate-900 font-outfit tracking-tight">Included Services</h3>
                    <p className="text-slate-500 text-sm font-medium leading-relaxed">
                        These services are completely free and included in the monthly rent baseline:
                    </p>
                    <div className="flex flex-wrap gap-2 pt-2">
                        {(hostel.IncludedServices || 'Security, Water, Electricity').split(',').map((serv: string) => (
                            <span key={serv.trim()} className="px-3 py-1.5 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold">
                                {serv.trim()}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Room Selection */}
            <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm space-y-2">
                    <h2 className="text-2xl font-black text-slate-900 font-outfit tracking-tight">Available Rooms</h2>
                    <p className="text-slate-500 font-medium text-sm">Select a room floor/type to view bed slots and book instantly.</p>
                </div>

                {rooms.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-[2.5rem] border border-dashed border-slate-300">
                        <h3 className="text-2xl font-black text-slate-900 mb-2">Sold Out</h3>
                        <p className="text-slate-500">There are no available beds in this hostel right now.</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {rooms.map((room: any) => (
                            <div key={room.RoomID} className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm flex flex-col md:flex-row gap-8 items-center transition-all hover:border-indigo-200 hover:shadow-lg">
                                <div className="flex-1 space-y-2">
                                    <div className="flex items-center gap-3">
                                        <h3 className="text-3xl font-black text-slate-900 font-outfit">Room {room.RoomNumber}</h3>
                                        <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-[10px] font-black uppercase tracking-widest rounded-md">{room.RoomType}</span>
                                    </div>
                                    <p className="text-sm text-slate-500 font-medium">Floor {room.FloorNumber} • {room.Capacity} Person Capacity</p>
                                </div>

                                <div className="flex-1 w-full flex flex-wrap gap-3 justify-center md:justify-end">
                                    {room.AvailableBeds.map((bed: any) => (
                                        <div key={bed.BedID} className="flex flex-col gap-2 items-center w-24">
                                            <div className="w-full px-2 py-3 bg-emerald-50 border border-emerald-100 rounded-xl text-center">
                                                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 block mb-1">Bed</span>
                                                <span className="text-xl font-black text-emerald-700">{bed.BedNumber}</span>
                                            </div>
                                            <BookBedAction bed={bed} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
