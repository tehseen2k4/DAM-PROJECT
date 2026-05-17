export default function Footer() {
  return (
    <footer className="w-full border-t border-border bg-slate-50 py-12 px-6">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            </div>
            <span className="text-xl font-black tracking-tighter text-foreground font-outfit">Stay<span className="text-primary">Sync</span></span>
          </div>
          <p className="text-sm font-medium text-slate-500 leading-relaxed">
            Revolutionizing the way student housing is managed with data-driven insights and premium experience.
          </p>
        </div>

        <div>
          <h4 className="text-xs font-black uppercase tracking-widest text-slate-900 mb-6">Product</h4>
          <ul className="space-y-4">
            <li><a href="#" className="text-sm font-medium text-slate-500 hover:text-primary transition-colors">Features</a></li>
            <li><a href="#" className="text-sm font-medium text-slate-500 hover:text-primary transition-colors">Integrations</a></li>
            <li><a href="#" className="text-sm font-medium text-slate-500 hover:text-primary transition-colors">Pricing</a></li>
          </ul>
        </div>

        <div>
           <h4 className="text-xs font-black uppercase tracking-widest text-slate-900 mb-6">Resources</h4>
           <ul className="space-y-4">
            <li><a href="#" className="text-sm font-medium text-slate-500 hover:text-primary transition-colors">Documentation</a></li>
            <li><a href="#" className="text-sm font-medium text-slate-500 hover:text-primary transition-colors">Support</a></li>
            <li><a href="#" className="text-sm font-medium text-slate-500 hover:text-primary transition-colors">Privacy</a></li>
          </ul>
        </div>

        <div>
            <h4 className="text-xs font-black uppercase tracking-widest text-slate-900 mb-6">Stay Connected</h4>
            <p className="text-sm font-medium text-slate-500 mb-6 font-medium">Join our newsletter for the latest updates in DAM.</p>
            <div className="flex gap-2">
                <input 
                    type="email" 
                    placeholder="Email" 
                    className="flex-1 bg-white border border-border px-4 py-2 rounded-lg text-sm focus:outline-none focus:border-primary transition-colors"
                />
                <button className="h-10 px-4 bg-slate-900 text-white font-bold rounded-lg text-xs hover:bg-slate-800 transition-colors">Join</button>
            </div>
        </div>
      </div>

      <div className="container mx-auto mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">© 2026 StaySync Cloud. All rights reserved.</p>
        <div className="flex gap-6">
            <span className="text-xs font-black text-primary uppercase tracking-tighter cursor-pointer">Built for Database Administration & Management</span>
        </div>
      </div>
    </footer>
  );
}
