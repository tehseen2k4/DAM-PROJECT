import { auth } from "@/auth";
import { getPublicHostels } from "@/actions/public";
import Footer from "@/components/Footer";
import Link from "next/link";
import PublicHostelCard from "@/components/PublicHostelCard";
import { signOut } from "@/auth";

export default async function LandingPage({
  searchParams,
}: {
  searchParams: Promise<{
    gender?: string;
    q?: string;
    city?: string;
    wifi?: string;
    ac?: string;
    laundry?: string;
    maxRent?: string;
  }>;
}) {
  const session = await auth();
  const studentId = session ? (session.user as any).studentId : undefined;
  const role = session ? (session.user as any).role : null;
  const displayName = session ? ((session.user as any).displayName || session.user?.name) : null;

  // Resolve searchParams promise
  const params = await searchParams;
  const genderFilter = params.gender || 'All';
  const searchQuery = params.q || '';
  const cityFilter = params.city || 'All';
  const wifiFilter = params.wifi === 'true';
  const acFilter = params.ac === 'true';
  const laundryFilter = params.laundry === 'true';
  const maxRentFilter = params.maxRent ? parseInt(params.maxRent) : undefined;

  const result = await getPublicHostels(
    genderFilter,
    searchQuery,
    cityFilter,
    wifiFilter,
    acFilter,
    laundryFilter,
    maxRentFilter
  );

  const cities = ['All', 'Lahore', 'Karachi', 'Islamabad', 'Peshawar', 'Rawalpindi'];

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-white selection:bg-indigo-500 selection:text-white">
      {/* Background Glow */}
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-950/30 via-slate-950 to-slate-950" />

      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-slate-950/80 backdrop-blur-md">
        <div className="container mx-auto flex h-20 items-center justify-between px-6 max-w-7xl">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 shadow-lg shadow-indigo-600/30 group-hover:scale-105 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            </div>
            <span className="text-2xl font-black tracking-tighter text-white">Stay<span className="text-indigo-400">Sync</span></span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-xs font-black text-indigo-400 uppercase tracking-widest border-b-2 border-indigo-500 pb-1">Browse Hostels</Link>
            <a href="#about-platform" className="text-xs font-black text-slate-400 hover:text-white uppercase tracking-widest transition-colors">Our Advantage</a>
          </nav>

          <div className="flex items-center gap-3">
            {session ? (
              <div className="flex items-center gap-4">
                <Link 
                  href={role === 'Student' ? "/student/dashboard" : role === 'Owner' ? "/dashboard" : "/admin/dashboard"}
                  className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 font-bold text-sm hover:bg-indigo-500/20 transition-all"
                >
                  <span className="w-6 h-6 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-black text-xs">
                    {displayName?.[0]?.toUpperCase()}
                  </span>
                  My Dashboard
                </Link>
                <form action={async () => {
                  'use server';
                  await signOut({ redirectTo: '/' });
                }}>
                  <button type="submit" className="px-4 py-2 rounded-xl border border-white/10 text-slate-400 hover:text-rose-400 hover:border-rose-500/20 text-xs font-black uppercase tracking-widest transition-all">
                    Sign Out
                  </button>
                </form>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/auth/signin" className="px-4 py-2 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-white transition-all">
                  Log In
                </Link>
                <Link href="/auth/signup" className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-black uppercase tracking-widest shadow-lg shadow-indigo-600/20 hover:bg-indigo-500 hover:scale-105 transition-all">
                  Sign Up Now
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Banner for Students */}
        <section className="relative overflow-hidden pt-24 pb-20">
          <div className="container mx-auto px-6 max-w-6xl text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-indigo-500/20 bg-indigo-500/5 text-indigo-400 text-xs font-black tracking-widest uppercase">
              🎓 Built Exclusively for Students
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-black tracking-tight text-white leading-none max-w-4xl mx-auto">
              Find and Secure Your <br />
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent italic">Ideal Student Dorm.</span>
            </h1>
            
            <p className="text-lg text-slate-400 font-medium max-w-2xl mx-auto leading-relaxed">
              Explore verified off-campus properties, view exact pricing models, select and lock available bed spaces seamlessly from your dashboard.
            </p>

            {/* Quick Search Panel */}
            <div className="max-w-4xl mx-auto pt-8">
              <form method="GET" action="/" className="bg-slate-900/60 backdrop-blur-xl p-5 rounded-[2rem] border border-white/5 shadow-2xl space-y-4">
                <div className="flex flex-col md:flex-row gap-3">
                  {/* Search query */}
                  <div className="flex-1 px-4 py-3 bg-slate-950/50 rounded-xl flex items-center gap-3 border border-white/5 focus-within:border-indigo-500/30 transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                    <input 
                      type="text" 
                      name="q"
                      defaultValue={searchQuery}
                      placeholder="Type region, hostel name..." 
                      className="w-full bg-transparent border-none text-white font-medium text-sm focus:ring-0 placeholder:text-slate-700 outline-none"
                    />
                  </div>

                  {/* City Dropdown */}
                  <div className="px-4 py-3 bg-slate-950/50 rounded-xl flex items-center gap-2 border border-white/5 min-w-[160px]">
                    <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest">City:</span>
                    <select name="city" defaultValue={cityFilter} className="bg-transparent border-none text-white font-bold text-sm focus:ring-0 outline-none cursor-pointer">
                      {cities.map(c => <option key={c} value={c} className="bg-slate-950 text-white">{c}</option>)}
                    </select>
                  </div>

                  <button type="submit" className="h-12 px-6 rounded-xl bg-indigo-600 text-white text-xs font-black uppercase tracking-widest hover:bg-indigo-500 transition-all">
                    Search Availability
                  </button>
                </div>

                {/* Amenities checklist and budget */}
                <div className="pt-3 border-t border-white/5 flex flex-wrap gap-4 items-center justify-between">
                  <div className="flex flex-wrap gap-4 items-center">
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 mr-2">Amenities Required:</span>
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input type="checkbox" name="wifi" value="true" defaultChecked={wifiFilter} className="rounded border-white/10 bg-slate-950 text-indigo-500 focus:ring-indigo-500/40" />
                      <span className="text-xs font-bold text-slate-400">WiFi Included</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input type="checkbox" name="ac" value="true" defaultChecked={acFilter} className="rounded border-white/10 bg-slate-950 text-indigo-500 focus:ring-indigo-500/40" />
                      <span className="text-xs font-bold text-slate-400">AC System</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input type="checkbox" name="laundry" value="true" defaultChecked={laundryFilter} className="rounded border-white/10 bg-slate-950 text-indigo-500 focus:ring-indigo-500/40" />
                      <span className="text-xs font-bold text-slate-400">Laundry</span>
                    </label>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">Max Budget:</span>
                    <input 
                      type="number" 
                      name="maxRent" 
                      defaultValue={maxRentFilter || ''} 
                      placeholder="PKR Limit"
                      className="w-28 px-3 py-1 bg-slate-950 border border-white/10 rounded-lg text-xs font-bold text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              </form>
            </div>
          </div>
        </section>

        {/* Live Hostels Grid (Open Access Catalog) */}
        <section id="hostels" className="py-20 border-t border-white/5">
          <div className="container mx-auto px-6 max-w-7xl">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
              <div>
                <span className="text-emerald-400 text-xs font-black uppercase tracking-widest mb-1 block">Live Inventory</span>
                <h2 className="text-3xl lg:text-4xl font-black text-white tracking-tight font-outfit">Verified Hostels Catalog</h2>
                <p className="text-slate-500 text-sm font-semibold mt-1">Browse open properties. Sign in to view floor rooms and lock allocations.</p>
              </div>

              {/* Gender selector */}
              <div className="flex gap-1.5 flex-wrap">
                {['All', 'Male', 'Female', 'Mixed'].map(f => {
                  const queryObj: any = { gender: f };
                  if (searchQuery) queryObj.q = searchQuery;
                  if (cityFilter !== 'All') queryObj.city = cityFilter;
                  if (wifiFilter) queryObj.wifi = 'true';
                  if (acFilter) queryObj.ac = 'true';
                  if (laundryFilter) queryObj.laundry = 'true';
                  if (maxRentFilter) queryObj.maxRent = maxRentFilter.toString();

                  const queryString = new URLSearchParams(queryObj).toString();

                  return (
                    <Link 
                      key={f} 
                      href={`/?${queryString}`} 
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border transition-all ${genderFilter === f ? 'bg-indigo-600 border-indigo-600 text-white shadow-md' : 'bg-white/5 border-white/5 text-slate-400 hover:text-white hover:border-white/20'}`}
                    >
                      {f}
                    </Link>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
              {result.success && result.data?.map((hostel: any) => (
                <PublicHostelCard key={hostel.HostelID} hostel={hostel} studentId={studentId} />
              ))}
              
              {result.success && result.data?.length === 0 && (
                <div className="col-span-full py-20 text-center bg-slate-900 border border-dashed border-white/10 rounded-[2.5rem]">
                  <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-600 mx-auto mb-3"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>
                  <p className="text-slate-400 font-bold">No hostels matched your active query filters.</p>
                  <p className="text-slate-500 text-xs mt-1">Try relaxing some checkbox filters or searching a different city.</p>
                  <Link href="/" className="inline-block mt-6 px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-indigo-500">Reset Filters</Link>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Advantage / How It Works */}
        <section id="about-platform" className="py-24 border-t border-white/5">
          <div className="container mx-auto px-6 max-w-6xl">
            <header className="text-center mb-16 space-y-2">
              <h2 className="text-3xl lg:text-4xl font-black text-white font-outfit">Platform Advantage</h2>
              <p className="text-slate-500 text-sm font-semibold max-w-md mx-auto">Leveraging database consistency and absolute security to protect students.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { title: 'Secure Check Details', desc: 'Browse available listings publicly. Log in securely to check interior rooms, bed maps, and settle payments.', icon: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10' },
                { title: 'In-Dashboard Bookings', desc: 'No complex third-party tools. Perform room selection, invoice audit, and issue complaints entirely from your secure student panel.', icon: 'M13 2L3 14h9l-1 8 10-12h-9l1-8z' },
                { title: 'Database Integrity', desc: 'Driven by multi-user locking procedures. One bed can never be double-booked, ensuring a secure and hassle-free relocation.', icon: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2' },
              ].map(f => (
                <div key={f.title} className="p-8 rounded-[2rem] bg-slate-900 border border-white/5 hover:border-indigo-500/20 transition-all group">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center mb-6 group-hover:bg-indigo-600 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-400 group-hover:text-white transition-colors"><path d={f.icon}/></svg>
                  </div>
                  <h3 className="text-lg font-black text-white mb-2 font-outfit">{f.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed font-semibold">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
