import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { signOut } from "@/auth";
import { getStudentDashboard } from "@/actions/student";
import { getPublicHostels } from "@/actions/public";
import Link from "next/link";
import ReportIssueModal from "@/components/ReportIssueModal";
import StudentBrowseHostels from "@/components/StudentBrowseHostels";
import StudentPayInvoiceAction from "@/components/StudentPayInvoiceAction";

export default async function StudentDashboardPage() {
  const session = await auth();

  if (!session) redirect("/auth/student-signin");
  if ((session.user as any).role !== 'Student') redirect("/auth/signin");

  const studentId = (session.user as any).studentId;
  const displayName = (session.user as any).displayName || session.user?.name;
  
  const [result, hostelsRes] = await Promise.all([
    getStudentDashboard(studentId),
    getPublicHostels('All')
  ]);

  const activeAllocation = result.data?.allocations.find((a: any) => a.AllocationStatus === 'Active');

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-72 bg-slate-900 border-r border-white/5 flex flex-col z-40">
        {/* Logo */}
        <div className="p-6 border-b border-white/5">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            </div>
            <span className="text-xl font-black text-white tracking-tight">Stay<span className="text-emerald-400">Sync</span></span>
          </Link>
        </div>

        {/* User Info */}
        <div className="p-6 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <span className="text-emerald-400 font-black text-sm">{displayName?.[0]?.toUpperCase()}</span>
            </div>
            <div>
              <p className="text-white font-bold text-sm truncate max-w-[150px]">{displayName}</p>
              <p className="text-emerald-400 text-[10px] font-black uppercase tracking-widest">Student</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1">
          <a href="#overview" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-emerald-500/10 text-emerald-400 font-bold text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>
            My Stay Overview
          </a>
          <a href="#book-stays" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:text-white hover:bg-white/5 font-bold text-sm transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m16.2 7.8 2.2 2.2-6.4 6.4H9.8v-2.2l6.4-6.4z"/></svg>
            Book Stays
          </a>
          <a href="#bookings" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:text-white hover:bg-white/5 font-bold text-sm transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
            My Invoices
          </a>
          <a href="#issues" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:text-white hover:bg-white/5 font-bold text-sm transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>
            Report Issue
          </a>
        </nav>

        {/* Signout */}
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

      {/* Main Content */}
      <main className="pl-72 min-h-screen bg-slate-950">
        <div className="p-8 max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-12 flex justify-between items-center">
            <div>
              <p className="text-emerald-400 text-xs font-black uppercase tracking-widest mb-2">Student Portal</p>
              <h1 className="text-4xl font-black text-white tracking-tight">Welcome back, <span className="text-emerald-400">{displayName?.split(' ')[0]}.</span></h1>
            </div>
            <Link href="/" className="px-5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs font-black uppercase tracking-widest text-slate-300 hover:text-white hover:bg-white/10 transition-all">
              ← Go to Landing Page
            </Link>
          </div>

          {/* Active Stay Card */}
          <div id="overview" className="mb-16">
            {activeAllocation ? (
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-3xl p-8 relative overflow-hidden shadow-xl shadow-emerald-950/20 animate-in fade-in duration-500">
                  <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
                  
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                    <div>
                      <p className="text-emerald-200 text-xs font-black uppercase tracking-widest mb-4">Your Active Booking</p>
                      <h2 className="text-4xl font-black text-white mb-2 font-outfit">{activeAllocation.HostelName}</h2>
                      
                      {activeAllocation.Address && (
                        <p className="text-emerald-100/80 text-sm font-medium flex items-center gap-1.5 mb-4">
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-200"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                          {activeAllocation.Address}, {activeAllocation.City}
                        </p>
                      )}

                      <p className="text-emerald-50/70 font-semibold text-sm">
                        Room {activeAllocation.RoomNumber} ({activeAllocation.RoomType}) • Bed Slot {activeAllocation.BedNumber} • Floor {activeAllocation.FloorNumber}
                      </p>
                    </div>

                    <div className="flex gap-4">
                      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center min-w-[120px]">
                        <p className="text-emerald-200 text-[9px] font-black uppercase tracking-widest">Rent Amount</p>
                        <p className="text-white font-black text-xl font-outfit">Rs. {activeAllocation.Amount}</p>
                        <p className="text-emerald-200/50 text-[9px] font-bold">per month</p>
                      </div>

                      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center min-w-[120px]">
                        <p className="text-emerald-200 text-[9px] font-black uppercase tracking-widest">Bill Status</p>
                        <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-black ${activeAllocation.PaymentStatus === 'Paid' ? 'bg-emerald-400 text-emerald-950 shadow-lg' : 'bg-amber-400 text-amber-950 shadow-lg'}`}>
                          {activeAllocation.PaymentStatus}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Subgrid showing details of stay */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Amenities */}
                  <div className="bg-slate-900 border border-white/5 rounded-3xl p-6 space-y-4">
                    <h3 className="text-md font-black text-white tracking-tight font-outfit uppercase tracking-widest text-slate-400 text-xs">Stay Amenities</h3>
                    <div className="grid grid-cols-3 gap-2">
                      <div className={`p-3 rounded-xl border text-center ${activeAllocation.HasWifi ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-white/5 border-white/5 text-slate-600 line-through'}`}>
                        <p className="text-xs font-black">WiFi</p>
                      </div>
                      <div className={`p-3 rounded-xl border text-center ${activeAllocation.HasAC ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-white/5 border-white/5 text-slate-600 line-through'}`}>
                        <p className="text-xs font-black">AC</p>
                      </div>
                      <div className={`p-3 rounded-xl border text-center ${activeAllocation.HasLaundry ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-white/5 border-white/5 text-slate-600 line-through'}`}>
                        <p className="text-xs font-black">Laundry</p>
                      </div>
                    </div>
                  </div>

                  {/* Included Services */}
                  <div className="bg-slate-900 border border-white/5 rounded-3xl p-6 space-y-4">
                    <h3 className="text-md font-black text-white tracking-tight font-outfit uppercase tracking-widest text-slate-400 text-xs">Included Services</h3>
                    <div className="flex flex-wrap gap-2">
                      {(activeAllocation.IncludedServices || 'Security, Water, Electricity').split(',').map((serv: string) => (
                        <span key={serv.trim()} className="px-3 py-1 bg-emerald-950/40 border border-emerald-900/30 text-emerald-400 text-xs font-bold rounded-lg">
                          {serv.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-slate-900 border border-white/5 rounded-3xl p-12 text-center">
                <p className="text-slate-400 font-semibold mb-4">You do not have an active booking on StaySync yet.</p>
                <a href="#book-stays" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 text-white font-black text-sm hover:bg-emerald-500 shadow-lg shadow-emerald-600/10 transition-colors">
                  Find a Hostel Room Below ↓
                </a>
              </div>
            )}
          </div>

          {/* Direct Booking Engine */}
          <div id="book-stays" className="mb-16 border-t border-white/5 pt-12 scroll-mt-6">
            <div className="mb-6 space-y-1">
              <h2 className="text-2xl font-black text-white font-outfit">Book Hostels & Rooms</h2>
              <p className="text-slate-500 text-sm font-semibold">Browse, filter, explore layouts, and book bed slots in real-time.</p>
            </div>
            <StudentBrowseHostels initialHostels={hostelsRes.data || []} studentId={studentId} />
          </div>

          {/* Booking History */}
          <div id="bookings" className="mb-16 border-t border-white/5 pt-12 scroll-mt-6">
            <h2 className="text-xl font-black text-white mb-6">Booking History & Invoices</h2>
            <div className="bg-slate-900 rounded-2xl border border-white/5 overflow-hidden">
              {result.data?.allocations.length === 0 ? (
                <p className="p-8 text-center text-slate-500">No bookings yet.</p>
              ) : (
                <table className="w-full text-left">
                  <thead className="border-b border-white/5">
                    <tr>
                      <th className="p-5 text-[10px] font-black uppercase tracking-widest text-slate-500">Hostel / Room</th>
                      <th className="p-5 text-[10px] font-black uppercase tracking-widest text-slate-500">Date</th>
                      <th className="p-5 text-[10px] font-black uppercase tracking-widest text-slate-500">Amount</th>
                      <th className="p-5 text-[10px] font-black uppercase tracking-widest text-slate-500">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {result.data?.allocations.map((a: any) => (
                      <tr key={a.PaymentID} className="hover:bg-white/5 transition-colors">
                        <td className="p-5">
                          <p className="text-white font-bold text-sm">{a.HostelName}</p>
                          <p className="text-slate-500 text-xs">Room {a.RoomNumber} • Bed {a.BedNumber}</p>
                        </td>
                        <td className="p-5 text-slate-400 text-sm">{new Date(a.AllocationDate).toLocaleDateString()}</td>
                        <td className="p-5 text-white font-bold text-sm">Rs. {a.Amount}</td>
                        <td className="p-5">
                          <StudentPayInvoiceAction paymentId={a.PaymentID} status={a.PaymentStatus} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* Report Issue */}
          <div id="issues" className="border-t border-white/5 pt-12 scroll-mt-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-black text-white">My Issue Reports</h2>
              {activeAllocation && <ReportIssueModal allocation={activeAllocation} studentId={studentId} />}
            </div>
            <div className="bg-slate-900 rounded-2xl border border-white/5 overflow-hidden">
              {result.data?.tickets.length === 0 ? (
                <p className="p-8 text-center text-slate-500">No issues reported yet.</p>
              ) : (
                <table className="w-full text-left">
                  <thead className="border-b border-white/5">
                    <tr>
                      <th className="p-5 text-[10px] font-black uppercase tracking-widest text-slate-500">Category</th>
                      <th className="p-5 text-[10px] font-black uppercase tracking-widest text-slate-500">Description</th>
                      <th className="p-5 text-[10px] font-black uppercase tracking-widest text-slate-500">Priority</th>
                      <th className="p-5 text-[10px] font-black uppercase tracking-widest text-slate-500">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {result.data?.tickets.map((t: any) => (
                      <tr key={t.TicketID} className="hover:bg-white/5 transition-colors">
                        <td className="p-5">
                          <p className="text-white font-bold text-sm">{t.IssueCategory}</p>
                          <p className="text-slate-500 text-xs">{t.HostelName} • Room {t.RoomNumber}</p>
                        </td>
                        <td className="p-5 text-slate-400 text-sm max-w-xs truncate">{t.Description}</td>
                        <td className="p-5">
                          <span className={`text-[10px] font-black uppercase tracking-widest
                            ${t.PriorityLevel === 'Critical' ? 'text-red-400' : t.PriorityLevel === 'High' ? 'text-orange-400' : 'text-slate-400'}`}>
                            {t.PriorityLevel}
                          </span>
                        </td>
                        <td className="p-5">
                          <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-widest
                            ${t.Status === 'Resolved' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                            {t.Status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
