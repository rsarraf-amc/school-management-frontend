import { Github, Twitter, Linkedin, Mail, ArrowRight } from 'lucide-react'; 

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-slate-950 text-slate-400 border-t border-slate-800/60 overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-6 pt-20 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">
          
          {/* Brand & Mission - Takes up more space on large screens */}
          <div className="lg:col-span-4 space-y-6">
            <div className="flex items-center gap-3">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                <div className="relative p-2 bg-slate-900 rounded-lg border border-slate-700">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-blue-400">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
                  </svg>
                </div>
              </div>
              <span className="font-bold text-2xl tracking-tight text-white">
                School<span className="text-blue-500">MS</span>
              </span>
            </div>
            <p className="text-base leading-relaxed max-w-sm">
              Empowering the next generation of educators through seamless digital transformation. One platform, infinite possibilities.
            </p>
            <div className="flex gap-4">
              {[Twitter, Github, Linkedin].map((Icon, i) => (
                <a key={i} href="#" className="p-2 rounded-full bg-slate-900 border border-slate-800 hover:border-blue-500/50 hover:text-white transition-all">
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links & Resources */}
          <div className="lg:col-span-4 grid grid-cols-2 gap-8">
            <div>
              <h4 className="text-white font-semibold mb-6 tracking-wide uppercase text-xs">Platform</h4>
              <ul className="space-y-4 text-sm">
                {['Features', 'Pricing', 'Case Studies', 'Security'].map((item) => (
                  <li key={item}>
                    <a href="#" className="hover:text-blue-400 transition-colors duration-200">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-6 tracking-wide uppercase text-xs">Support</h4>
              <ul className="space-y-4 text-sm">
                {['Documentation', 'API Reference', 'Community', 'Status'].map((item) => (
                  <li key={item}>
                    <a href="#" className="hover:text-blue-400 transition-colors duration-200">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Newsletter */}
          <div className="lg:col-span-4">
            <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 backdrop-blur-sm">
              <h4 className="text-white font-semibold mb-2">Join our newsletter</h4>
              <p className="text-sm mb-6 text-slate-500">Get the latest updates on school management trends.</p>
              <form className="relative group">
                <input
                  type="email"
                  placeholder="admin@school.com"
                  className="w-full pl-4 pr-12 py-3 rounded-xl bg-slate-950 border border-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-600"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors"
                >
                  <ArrowRight size={18} />
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-20 pt-8 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-xs text-slate-500 order-2 md:order-1">
            © {currentYear} School Management System. Built with precision for modern education.
          </p>
          <div className="flex gap-8 text-xs order-1 md:order-2">
            <a href="#" className="hover:text-white transition">Privacy Policy</a>
            <a href="#" className="hover:text-white transition">Terms of Service</a>
            <a href="#" className="hover:text-white transition">Cookie Settings</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;