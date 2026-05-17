'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { reportIssueAsStudent } from '@/actions/student';

export default function ReportIssueModal({ allocation, studentId }: { allocation: any, studentId: number }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const fd = new FormData(e.currentTarget);
    const res = await reportIssueAsStudent(
      allocation.HostelID,
      allocation.RoomID,
      studentId,
      fd.get('category') as string,
      fd.get('description') as string,
      fd.get('priority') as string
    );

    if (res.success) {
      setOpen(false);
      router.refresh();
    } else {
      setError(res.error || 'Failed to submit report.');
    }
    setLoading(false);
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-black uppercase tracking-widest hover:bg-amber-500/20 transition-colors"
      >
        + Report Issue
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="bg-slate-900 border border-white/10 rounded-3xl w-full max-w-md p-8 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-black text-white">Report an Issue</h3>
              <button onClick={() => setOpen(false)} className="w-8 h-8 rounded-full bg-white/5 text-slate-400 hover:text-white flex items-center justify-center transition-colors">×</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && <div className="p-3 rounded-xl bg-rose-500/10 text-rose-400 text-sm border border-rose-500/20">{error}</div>}

              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Category</label>
                <select name="category" required className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500/50 transition-colors">
                  <option value="Plumbing">Plumbing</option>
                  <option value="Electrical">Electrical</option>
                  <option value="Furniture">Furniture</option>
                  <option value="Cleaning">Cleaning</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Priority</label>
                <select name="priority" required className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500/50 transition-colors">
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Description</label>
                <textarea name="description" required rows={3} className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500/50 transition-colors resize-none" placeholder="Describe the issue in detail..." />
              </div>

              <button type="submit" disabled={loading} className="w-full py-3 rounded-xl bg-amber-500 text-slate-900 font-black text-sm hover:bg-amber-400 transition-colors disabled:opacity-50">
                {loading ? 'Submitting...' : 'Submit Report'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
