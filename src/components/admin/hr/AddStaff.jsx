import React, { useState } from "react";
import { User, Briefcase, DollarSign, Calendar, Upload, Save } from "lucide-react";
import { departments, designations } from "../../../mock/hrData";

const AddStaff = () => {
  const [activeTab, setActiveTab] = useState("basic");

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="flex border-b border-slate-100 overflow-x-auto">
         <button onClick={() => setActiveTab("basic")} className={`px-6 py-4 text-sm font-black uppercase tracking-widest whitespace-nowrap transition-all border-b-2 ${activeTab === "basic" ? "text-indigo-600 border-indigo-600" : "text-slate-500 border-transparent hover:text-slate-700 hover:border-slate-300"}`}>Basic Details</button>
         <button onClick={() => setActiveTab("payroll")} className={`px-6 py-4 text-sm font-black uppercase tracking-widest whitespace-nowrap transition-all border-b-2 ${activeTab === "payroll" ? "text-indigo-600 border-indigo-600" : "text-slate-500 border-transparent hover:text-slate-700 hover:border-slate-300"}`}>Payroll Details</button>
         <button onClick={() => setActiveTab("leaves")} className={`px-6 py-4 text-sm font-black uppercase tracking-widest whitespace-nowrap transition-all border-b-2 ${activeTab === "leaves" ? "text-indigo-600 border-indigo-600" : "text-slate-500 border-transparent hover:text-slate-700 hover:border-slate-300"}`}>Leaves</button>
      </div>

      <div className="p-8">
         <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
            
            {activeTab === "basic" && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center gap-2 mb-6 text-indigo-600">
                   <User size={20} />
                   <h3 className="text-lg font-black tracking-tight">Basic Information</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                   <div className="space-y-2">
                      <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Staff ID *</label>
                      <input type="text" placeholder="e.g. STF-004" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-indigo-500/20" />
                   </div>
                   <div className="space-y-2">
                      <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">First Name *</label>
                      <input type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-indigo-500/20" />
                   </div>
                   <div className="space-y-2">
                      <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Last Name</label>
                      <input type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-indigo-500/20" />
                   </div>
                   <div className="space-y-2">
                      <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Department *</label>
                      <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium appearance-none">
                         {departments.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
                      </select>
                   </div>
                   <div className="space-y-2">
                      <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Designation *</label>
                      <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium appearance-none">
                         {designations.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
                      </select>
                   </div>
                   <div className="space-y-2">
                      <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Email</label>
                      <input type="email" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-indigo-500/20" />
                   </div>
                   <div className="space-y-2">
                      <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Phone *</label>
                      <input type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-indigo-500/20" />
                   </div>
                   <div className="space-y-2">
                      <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Date of Joining</label>
                      <input type="date" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-indigo-500/20" />
                   </div>
                   <div className="space-y-2">
                      <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Gender</label>
                      <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium appearance-none">
                         <option value="Male">Male</option>
                         <option value="Female">Female</option>
                      </select>
                   </div>
                </div>
              </div>
            )}

            {activeTab === "payroll" && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center gap-2 mb-6 text-indigo-600">
                   <DollarSign size={20} />
                   <h3 className="text-lg font-black tracking-tight">Payroll Information</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="space-y-2">
                      <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">EPF No</label>
                      <input type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-indigo-500/20" />
                   </div>
                   <div className="space-y-2">
                      <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Basic Salary</label>
                      <input type="number" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-indigo-500/20" />
                   </div>
                   <div className="space-y-2">
                      <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Contract Type</label>
                      <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium appearance-none">
                         <option value="Permanent">Permanent</option>
                         <option value="Probation">Probation</option>
                         <option value="Contract">Contract</option>
                      </select>
                   </div>
                   <div className="space-y-2">
                      <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Bank Account Number</label>
                      <input type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-indigo-500/20" />
                   </div>
                </div>
              </div>
            )}

            {activeTab === "leaves" && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center gap-2 mb-6 text-indigo-600">
                   <Calendar size={20} />
                   <h3 className="text-lg font-black tracking-tight">Leave Allocations</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                   <div className="space-y-2">
                      <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Medical Leaves</label>
                      <input type="number" defaultValue={10} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-indigo-500/20" />
                   </div>
                   <div className="space-y-2">
                      <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Casual Leaves</label>
                      <input type="number" defaultValue={12} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-indigo-500/20" />
                   </div>
                   <div className="space-y-2">
                      <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Maternity/Paternity Leaves</label>
                      <input type="number" defaultValue={0} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-indigo-500/20" />
                   </div>
                </div>
              </div>
            )}

            <div className="pt-6 border-t border-slate-100 flex justify-end">
               <button type="submit" className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all text-sm shadow-lg shadow-indigo-100 flex items-center gap-2">
                  <Save size={18} /> Save Staff Member
               </button>
            </div>
         </form>
      </div>
    </div>
  );
};

export default AddStaff;
