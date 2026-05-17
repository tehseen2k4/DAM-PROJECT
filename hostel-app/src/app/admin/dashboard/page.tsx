import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { signOut } from "@/auth";
import { getAdminDashboard } from "@/actions/student";
import { getRecentAllocations } from "@/actions/payments";
import { getMaintenanceTickets } from "@/actions/maintenance";
import Link from "next/link";
import ResolveTicketAction from "@/components/ResolveTicketAction";

export default async function AdminDashboardPage() {
  const session = await auth();

  if (!session) redirect("/auth/admin-signin");
  if ((session.user as any).role !== 'Admin') redirect("/auth/signin");

  const displayName = (session.user as any).displayName || session.user?.name || 'Admin';

  const [adminData, maintenanceResult] = await Promise.all([
    getAdminDashboard(),
    getMaintenanceTickets(undefined) // All tickets
  ]);

  const stats = adminData.data?.stats;

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-72 bg-slate-900/80 border-r border-white/5 flex flex-col z-40 backdrop-blur-xl">
        <div className="p-6 border-b border-white/5">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-rose-600 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/></svg>
            </div>
            <span className="text-xl font-black text-white tracking-tight">Stay<span className="text-rose-400">Sync</span></span>
          </div>
          <div className="mt-3 px-2 py-1 rounded-lg bg-rose-500/10 border border-rose-500/20 inline-block">
            <p className="text-rose-400 text-[10px] font-black uppercase tracking-widest">Admin Control Panel</p>
          </div>
        </div>

        <div className="p-6 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
              <span className="text-rose-400 font-black text-sm">{displayName[0]?.toUpperCase()}</span>
            </div>
            <div>
              <p className="text-white font-bold text-sm">{displayName}</p>
              <p className="text-rose-400 text-[10px] font-black uppercase tracking-widest">Platform Admin</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {[
            { label: 'System Overview', href: '#overview', icon: 'M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z' },
            { label: 'All Hostels', href: '#hostels', icon: 'M3 12h18M3 6h18M3 18h18' },
            { label: 'All Bookings', href: '#bookings', icon: 'M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z' },
            { label: 'Maintenance', href: '#maintenance', icon: 'M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z' },
          ].map(item => (
            <a key={item.href} href={item.href} className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:text-white hover:bg-white/5 font-bold text-sm transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={item.icon}/></svg>
              {item.label}
            </a>
          ))}
        </nav>

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

      {/* Main */}
      <main className="pl-72">
        <div className="p-8">
          <div className="mb-12">
            <p className="text-rose-400 text-xs font-black uppercase tracking-widest mb-2">Platform Admin</p>
            <h1 className="text-4xl font-black text-white tracking-tight">System Overview</h1>
            <p className="text-slate-500 mt-2">Full platform visibility across all owners and students.</p>
          </div>

          {/* Stats Grid */}
          <div id="overview" className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            {[
              { label: 'Total Hostels', value: stats?.hostels || 0, color: 'indigo' },
              { label: 'Registered Students', value: stats?.students || 0, color: 'emerald' },
              { label: 'Active Stays', value: stats?.activeAllocations || 0, color: 'amber' },
              { label: 'Total Revenue', value: `Rs. ${(stats?.totalRevenue || 0).toLocaleString()}`, color: 'rose' },
            ].map(stat => (
              <div key={stat.label} className="bg-slate-900 border border-white/5 rounded-2xl p-6">
                <p className="text-slate-500 text-xs font-black uppercase tracking-widest mb-2">{stat.label}</p>
                <p className="text-3xl font-black text-white">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* All Hostels */}
          <div id="hostels" className="mb-12">
            <h2 className="text-xl font-black text-white mb-6">Registered Properties (Platform-Wide)</h2>
            <div className="bg-slate-900 rounded-2xl border border-white/5 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="border-b border-white/5">
                    <tr>
                      <th className="p-5 text-[10px] font-black uppercase tracking-widest text-slate-500">Hostel Name</th>
                      <th className="p-5 text-[10px] font-black uppercase tracking-widest text-slate-500">Location</th>
                      <th className="p-5 text-[10px] font-black uppercase tracking-widest text-slate-500">Rent</th>
                      <th className="p-5 text-[10px] font-black uppercase tracking-widest text-slate-500">Amenities</th>
                      <th className="p-5 text-[10px] font-black uppercase tracking-widest text-slate-500">Beds Left</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {adminData.data?.hostels.map((h: any) => (
                      <tr key={h.HostelID} className="hover:bg-white/5 transition-colors">
                        <td className="p-5">
                          <p className="text-white font-bold text-sm">{h.HostelName}</p>
                          <p className="text-slate-500 text-xs">By {h.OwnerName || 'Independent Partner'}</p>
                        </td>
                        <td className="p-5">
                          <p className="text-white font-medium text-sm">{h.City}</p>
                          <p className="text-slate-500 text-xs truncate max-w-[200px]">{h.Address || 'No Address Specified'}</p>
                        </td>
                        <td className="p-5 text-white font-bold text-sm">Rs. {h.MonthlyRent || 5000}</td>
                        <td className="p-5">
                          <div className="flex gap-1">
                            {h.HasWifi && <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[9px] font-black uppercase">WiFi</span>}
                            {h.HasAC && <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[9px] font-black uppercase">AC</span>}
                            {h.HasLaundry && <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[9px] font-black uppercase">Laundry</span>}
                          </div>
                        </td>
                        <td className="p-5">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest ${h.AvailableBeds > 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                            {h.AvailableBeds} Beds
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* All Bookings */}
          <div id="bookings" className="mb-12">
            <h2 className="text-xl font-black text-white mb-6">All Recent Bookings (Platform-Wide)</h2>
            <div className="bg-slate-900 rounded-2xl border border-white/5 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="border-b border-white/5">
                    <tr>
                      <th className="p-5 text-[10px] font-black uppercase tracking-widest text-slate-500">Student</th>
                      <th className="p-5 text-[10px] font-black uppercase tracking-widest text-slate-500">Hostel / Location</th>
                      <th className="p-5 text-[10px] font-black uppercase tracking-widest text-slate-500">Date</th>
                      <th className="p-5 text-[10px] font-black uppercase tracking-widest text-slate-500">Amount</th>
                      <th className="p-5 text-[10px] font-black uppercase tracking-widest text-slate-500">Payment</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {adminData.data?.allocations.map((a: any) => (
                      <tr key={a.PaymentID} className="hover:bg-white/5 transition-colors">
                        <td className="p-5">
                          <p className="text-white font-bold text-sm">{a.StudentName}</p>
                          <p className="text-slate-500 text-xs">{a.StudentEmail}</p>
                        </td>
                        <td className="p-5">
                          <p className="text-white font-bold text-sm">{a.HostelName}</p>
                          <p className="text-slate-500 text-xs">Room {a.RoomNumber} • Bed {a.BedNumber}</p>
                        </td>
                        <td className="p-5 text-slate-400 text-sm">{new Date(a.AllocationDate).toLocaleDateString()}</td>
                        <td className="p-5 text-white font-bold text-sm">Rs. {a.Amount}</td>
                        <td className="p-5">
                          <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-widest
                            ${a.PaymentStatus === 'Paid' ? 'bg-emerald-500/10 text-emerald-400' : 
                              a.PaymentStatus === 'Pending' ? 'bg-amber-500/10 text-amber-400' : 
                              'bg-slate-500/10 text-slate-500'}`}>
                            {a.PaymentStatus}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Maintenance Hub */}
          <div id="maintenance">
            <h2 className="text-xl font-black text-white mb-6">All Maintenance Tickets</h2>
            <div className="bg-slate-900 rounded-2xl border border-white/5 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="border-b border-white/5">
                    <tr>
                      <th className="p-5 text-[10px] font-black uppercase tracking-widest text-slate-500">Issue / Location</th>
                      <th className="p-5 text-[10px] font-black uppercase tracking-widest text-slate-500">Description</th>
                      <th className="p-5 text-[10px] font-black uppercase tracking-widest text-slate-500">Priority</th>
                      <th className="p-5 text-[10px] font-black uppercase tracking-widest text-slate-500 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {maintenanceResult.data?.map((ticket: any) => (
                      <tr key={ticket.TicketID} className="hover:bg-white/5 transition-colors">
                        <td className="p-5">
                          <div className="flex items-center gap-2 mb-1">
                            {ticket.PriorityLevel === 'Critical' && <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse inline-block" />}
                            <p className="text-white font-bold text-sm">{ticket.IssueCategory}</p>
                          </div>
                          <p className="text-slate-500 text-xs">{ticket.HostelName} • Room {ticket.RoomNumber}</p>
                        </td>
                        <td className="p-5 text-slate-400 text-sm max-w-xs truncate">{ticket.Description}</td>
                        <td className="p-5">
                          <span className={`text-[10px] font-black uppercase tracking-widest
                            ${ticket.PriorityLevel === 'Critical' ? 'text-red-400' : ticket.PriorityLevel === 'High' ? 'text-orange-400' : 'text-slate-500'}`}>
                            {ticket.PriorityLevel}
                          </span>
                        </td>
                        <td className="p-5 text-right">
                          <ResolveTicketAction ticketId={ticket.TicketID} status={ticket.Status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
