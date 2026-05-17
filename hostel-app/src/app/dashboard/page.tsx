import { getHostels, getOccupiedBeds } from "@/actions/hostels";
import { getRecentAllocations } from "@/actions/payments";
import { getMaintenanceTickets } from "@/actions/maintenance";
import HostelCard from "@/components/HostelCard";
import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";
import DashboardActions from "@/components/DashboardActions";
import VerifyPaymentAction from "@/components/VerifyPaymentAction";
import ResolveTicketAction from "@/components/ResolveTicketAction";
import OwnerOccupiedBeds from "@/components/OwnerOccupiedBeds";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await auth();

  if (!session) redirect("/auth/owner-signin");
  if ((session.user as any).role !== 'Owner' && (session.user as any).role !== 'Admin') redirect("/auth/signin");

  const ownerId = (session.user as any).ownerId;
  const role = (session.user as any).role;
  const displayName = (session.user as any).displayName || session.user?.name || 'Owner';

  const [result, allocationsResult, maintenanceResult, occupiedBedsResult] = await Promise.all([
    getHostels(ownerId, role),
    getRecentAllocations(ownerId),
    getMaintenanceTickets(ownerId),
    getOccupiedBeds(ownerId, role)
  ]);

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

        {/* Sidebar Navigation Links */}
        <nav className="flex-1 p-4 space-y-1">
          <a href="#overview" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-indigo-500/10 text-indigo-400 font-bold text-sm transition-all hover:bg-indigo-500/15">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18"/><path d="M3 7v1a3 0 0 0 6 0V7m0 1a3 0 0 0 6 0V7m0 1a3 0 0 0 6 0V7H3l.5-2h17l.5 2"/></svg>
            My Hostels
          </a>
          <a href="#residents" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:text-white hover:bg-white/5 font-bold text-sm transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            Active Residents
          </a>
          <a href="#invoices" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:text-white hover:bg-white/5 font-bold text-sm transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="12" x="2" y="6" rx="2"/><circle cx="12" cy="12" r="2"/><path d="M6 12h.01M18 12h.01"/></svg>
            Invoice Hub
          </a>
          <a href="#maintenance" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:text-white hover:bg-white/5 font-bold text-sm transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
            Maintenance Support
          </a>
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
        <div className="p-8 max-w-6xl mx-auto space-y-16">
          {/* Welcome Section */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 border-b border-white/5 pb-8">
            <div className="space-y-2">
              <span className="text-indigo-400 text-xs font-black uppercase tracking-widest mb-1 block">Owner Workspace</span>
              <h1 className="text-4xl font-black text-white tracking-tight">Welcome, <span className="text-indigo-400">{displayName?.split(' ')[0]}.</span></h1>
              <p className="text-slate-400 text-sm font-semibold max-w-xl leading-relaxed">
                Create hostels, set bed prices per room category, track student dossiers, and manage invoicing.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <DashboardActions ownerId={(session.user as any).ownerId} />
              
              <div className="flex items-center gap-3 p-3.5 rounded-2xl border border-white/5 bg-slate-900/60 backdrop-blur-xl">
                <div className="relative">
                  <div className={`w-2.5 h-2.5 rounded-full ${result.success ? 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)] animate-pulse' : 'bg-rose-500'}`} />
                </div>
                <div>
                  <p className="text-[8px] text-slate-500 font-black uppercase tracking-widest">SQL Server</p>
                  <p className={`text-xs font-bold ${result.success ? 'text-emerald-400' : 'text-rose-500'}`}>
                    {result.success ? 'Connected' : 'Disconnected'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Properties Catalog */}
          <section id="overview" className="space-y-6 scroll-mt-24">
            <div className="space-y-1">
              <span className="text-indigo-400 text-xs font-black uppercase tracking-widest">Real Estate Portfolio</span>
              <h2 className="text-2xl font-black text-white font-outfit tracking-tight">Active Hostel Catalog</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {result.success && result.data?.map((hostel: any) => (
                <HostelCard key={hostel.HostelID} hostel={hostel} />
              ))}
              
              {result.success && result.data?.length === 0 && (
                <div className="col-span-full py-20 bg-slate-900 border border-dashed border-white/10 rounded-[2.5rem] flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center mb-6 text-slate-400">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-1">No Hostels Registered</h3>
                  <p className="text-slate-500 text-sm font-semibold mb-6">Start your stay portfolio by adding your first verified property.</p>
                  <DashboardActions ownerId={(session.user as any).ownerId} />
                </div>
              )}
            </div>
          </section>

          {/* Occupied Beds & Billing Manager */}
          <section id="residents" className="space-y-6 scroll-mt-24">
            <div className="space-y-1">
              <span className="text-indigo-400 text-xs font-black uppercase tracking-widest">Occupied Inventory</span>
              <h2 className="text-2xl font-black text-white font-outfit tracking-tight">Active Residents & Billing Manager</h2>
              <p className="text-slate-500 text-xs font-semibold">Inspect all active residents, view their dossiers (university/age/gender), and generate/send monthly dues invoices.</p>
            </div>

            <OwnerOccupiedBeds occupiedBeds={occupiedBedsResult.data || []} />
          </section>

          {/* Payment Verification Hub */}
          <section id="invoices" className="space-y-6 scroll-mt-24">
            <div className="space-y-1">
              <span className="text-indigo-400 text-xs font-black uppercase tracking-widest">Invoices Verification</span>
              <h2 className="text-2xl font-black text-white font-outfit tracking-tight">Invoice Receipts & Settle Hub</h2>
              <p className="text-slate-500 text-xs font-semibold">Verify invoice receipts uploaded by students or reject failed wire transactions instantly.</p>
            </div>

            <div className="bg-slate-900 border border-white/5 rounded-3xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-950 border-b border-white/5">
                    <tr>
                      <th className="p-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Student Resident</th>
                      <th className="p-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Hostel & Room</th>
                      <th className="p-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Invoice Date</th>
                      <th className="p-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Amount</th>
                      <th className="p-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Verification Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {allocationsResult.data?.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="p-12 text-center text-slate-500 font-semibold">No recent bookings found.</td>
                      </tr>
                    ) : (
                      allocationsResult.data?.map((allocation: any) => (
                        <tr key={allocation.PaymentID} className="hover:bg-white/5 transition-colors">
                          <td className="p-5">
                            <p className="text-white font-bold text-sm">{allocation.StudentName}</p>
                            <p className="text-slate-500 text-xs">{allocation.StudentEmail}</p>
                          </td>
                          <td className="p-5">
                            <p className="text-white font-bold text-sm">{allocation.HostelName}</p>
                            <p className="text-slate-500 text-xs">Room {allocation.RoomNumber} • Bed {allocation.BedNumber}</p>
                          </td>
                          <td className="p-5 text-slate-400 text-xs font-semibold">
                            {new Date(allocation.AllocationDate).toLocaleDateString()}
                          </td>
                          <td className="p-5 text-white font-bold text-sm">
                            Rs. {allocation.Amount}
                          </td>
                          <td className="p-5 text-right">
                            <VerifyPaymentAction 
                              paymentId={allocation.PaymentID} 
                              status={allocation.PaymentStatus} 
                              allocationId={allocation.AllocationID}
                              allocationStatus={allocation.AllocationStatus}
                            />
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* Maintenance Hub */}
          <section id="maintenance" className="space-y-6 scroll-mt-24">
            <div className="space-y-1">
              <span className="text-amber-400 text-xs font-black uppercase tracking-widest">Maintenance Control</span>
              <h2 className="text-2xl font-black text-white font-outfit tracking-tight">Active Maintenance Hub</h2>
              <p className="text-slate-500 text-xs font-semibold">Track complaints reported by students. Rooms automatically lock down when issues are active.</p>
            </div>

            <div className="bg-slate-900 border border-white/5 rounded-3xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-950 border-b border-white/5">
                    <tr>
                      <th className="p-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Issue Category / Location</th>
                      <th className="p-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Complaint Details</th>
                      <th className="p-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Priority Level</th>
                      <th className="p-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Status Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {maintenanceResult.data?.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="p-12 text-center text-slate-500 font-semibold">No active maintenance complaints. All rooms are fully functional!</td>
                      </tr>
                    ) : (
                      maintenanceResult.data?.map((ticket: any) => (
                        <tr key={ticket.TicketID} className="hover:bg-white/5 transition-colors">
                          <td className="p-5">
                            <div className="flex items-center gap-3 mb-1">
                              {ticket.PriorityLevel === 'Critical' && (
                                <span className="flex h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>
                              )}
                              <p className="text-white font-bold text-sm">{ticket.IssueCategory}</p>
                            </div>
                            <p className="text-slate-500 text-xs">{ticket.HostelName} • Room {ticket.RoomNumber}</p>
                          </td>
                          <td className="p-5">
                            <p className="text-white text-xs max-w-xs truncate">{ticket.Description}</p>
                            <p className="text-slate-500 text-[10px] mt-1 font-semibold">Reported: {new Date(ticket.ReportedDate).toLocaleDateString()}</p>
                          </td>
                          <td className="p-5">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest border
                              ${ticket.PriorityLevel === 'Critical' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 
                                ticket.PriorityLevel === 'High' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' : 
                                'bg-slate-500/10 text-slate-400 border-white/5'}`}>
                              {ticket.PriorityLevel}
                            </span>
                          </td>
                          <td className="p-5 text-right">
                            <ResolveTicketAction ticketId={ticket.TicketID} status={ticket.Status} />
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
