import { useState } from "react";
import { Bell, Shield, Mail, Phone, Clock, Save, Search, Settings2, Info } from "lucide-react";

export default function FrontOfficeSettings() {
  const [searchQuery, setSearchQuery] = useState("");

  const sections = [
    {
      id: "working-hours",
      title: "Working Hours Configuration",
      description: "Define the official operational hours for the reception desk.",
      icon: Clock,
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Office Open Time</label>
            <input type="time" defaultValue="08:00" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500/50 transition-all" />
          </div>
          <div className="space-y-1.5">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Office Close Time</label>
            <input type="time" defaultValue="16:00" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500/50 transition-all" />
          </div>
        </div>
      )
    },
    {
      id: "visitor-id",
      title: "Visitor ID Requirements",
      description: "Set security policies for visitors entering the school premises.",
      icon: Shield,
      content: (
        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer group p-3 rounded-xl border border-transparent hover:border-slate-100 hover:bg-slate-50/50 transition-all">
            <input type="checkbox" defaultChecked className="w-5 h-5 rounded-lg text-indigo-600 border-slate-300 focus:ring-indigo-500 transition-all cursor-pointer" />
            <span className="text-sm font-bold text-slate-600 group-hover:text-slate-900 transition-colors">Require Photo ID for campus entry</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer group p-3 rounded-xl border border-transparent hover:border-slate-100 hover:bg-slate-50/50 transition-all">
            <input type="checkbox" defaultChecked className="w-5 h-5 rounded-lg text-indigo-600 border-slate-300 focus:ring-indigo-500 transition-all cursor-pointer" />
            <span className="text-sm font-bold text-slate-600 group-hover:text-slate-900 transition-colors">Capture visitor photograph digitally</span>
          </label>
        </div>
      )
    },
    {
      id: "notifications",
      title: "Notifications & Alerts",
      description: "Manage how staff receive updates for front office activities.",
      icon: Bell,
      content: (
        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer group p-3 rounded-xl border border-transparent hover:border-slate-100 hover:bg-slate-50/50 transition-all">
            <input type="checkbox" defaultChecked className="w-5 h-5 rounded-lg text-indigo-600 border-slate-300 focus:ring-indigo-500 transition-all cursor-pointer" />
            <span className="text-sm font-bold text-slate-600 flex items-center gap-2 group-hover:text-slate-900"><Mail size={16} className="text-slate-400" /> Email Admin on new Complaints</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer group p-3 rounded-xl border border-transparent hover:border-slate-100 hover:bg-slate-50/50 transition-all">
            <input type="checkbox" className="w-5 h-5 rounded-lg text-indigo-600 border-slate-300 focus:ring-indigo-500 transition-all cursor-pointer" />
            <span className="text-sm font-bold text-slate-600 flex items-center gap-2 group-hover:text-slate-900"><Phone size={16} className="text-slate-400" /> SMS alerts for VIP Visitors</span>
          </label>
        </div>
      )
    }
  ];

  const filteredSections = sections.filter(section => 
    section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    section.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      {/* Settings Header */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-indigo-50 rounded-2xl text-indigo-600">
            <Settings2 size={24} className="stroke-[2.5]" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-800 tracking-tight">Setup Front Office</h2>
            <p className="text-sm text-slate-500 font-medium">Configure global preferences and policies.</p>
          </div>
        </div>

        <div className="relative group max-w-sm w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Find a setting..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/50 transition-all placeholder:text-slate-400"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Content */}
        <div className="lg:col-span-8 space-y-6">
          {filteredSections.length > 0 ? (
            filteredSections.map((section) => {
              const Icon = section.icon;
              return (
                <div key={section.id} className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden group hover:shadow-md transition-all duration-300">
                  <div className="px-8 py-6 border-b border-slate-50 flex items-center gap-4 bg-slate-50/30">
                    <div className="p-2.5 bg-white rounded-xl shadow-sm text-indigo-600 group-hover:scale-110 transition-transform">
                      <Icon size={20} className="stroke-[2.5]" />
                    </div>
                    <div>
                      <h3 className="font-black text-slate-800 tracking-tight">{section.title}</h3>
                      <p className="text-xs text-slate-500 font-medium">{section.description}</p>
                    </div>
                  </div>
                  <div className="p-8">
                    {section.content}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="bg-white rounded-3xl border-2 border-dashed border-slate-200 p-12 text-center">
              <div className="bg-slate-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-400">
                <Search size={32} />
              </div>
              <h3 className="text-lg font-black text-slate-800 tracking-tight">No settings found</h3>
              <p className="text-sm text-slate-500 font-medium mt-1">Try searching for something else like "Working Hours".</p>
            </div>
          )}

          <div className="flex justify-end pt-4">
            <button className="flex items-center gap-2 bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black hover:bg-indigo-700 transition-all text-sm shadow-xl shadow-indigo-200 active:scale-95 group">
              <Save size={18} className="group-hover:rotate-12 transition-transform" />
              Save All Changes
            </button>
          </div>
        </div>

        {/* Right Info Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-3xl p-8 text-white shadow-xl shadow-indigo-100 relative overflow-hidden">
            <div className="relative z-10">
              <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl w-fit mb-6">
                <Info size={24} />
              </div>
              <h3 className="text-lg font-extrabold mb-2 tracking-tight">Need Help?</h3>
              <p className="text-indigo-100 text-sm leading-relaxed font-medium mb-6">
                These settings impact the entire Front Office module including Admissions, Visitor Log, and Communications.
              </p>
              <button className="w-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 py-3 rounded-xl text-sm font-bold transition-all">
                View Documentation
              </button>
            </div>
            {/* Decorative circles */}
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl"></div>
          </div>

          <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-xl shadow-slate-200 relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-sm font-black mb-4 uppercase tracking-[0.2em] text-slate-400">System Status</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400">Database Sync</span>
                  <span className="text-[10px] font-black bg-emerald-500/10 text-emerald-400 px-2.5 py-1 rounded-full border border-emerald-500/20">Active</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400">Storage Usage</span>
                  <span className="text-xs font-black text-slate-200">24.5 GB / 100 GB</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-indigo-500 h-full w-[24.5%]"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
