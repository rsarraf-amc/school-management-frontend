import React from "react";
import { UserPlus, Save } from "lucide-react";
import { routes, assignedVehicles } from "../../../mock/transportData";

const AssignStudentTransport = () => {
  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden max-w-4xl mx-auto">
      <div className="p-6 border-b border-slate-100 flex items-center gap-2 bg-amber-50/30">
        <UserPlus size={20} className="text-amber-600" />
        <h3 className="font-black text-slate-900 tracking-tight">Assign Student To Transport</h3>
      </div>
      
      <form className="p-8 space-y-8" onSubmit={(e) => e.preventDefault()}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Class *</label>
            <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium appearance-none">
              <option value="">Select Class</option>
              <option value="10">Class 10</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Section *</label>
            <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium appearance-none">
              <option value="">Select Section</option>
              <option value="A">A</option>
            </select>
          </div>
          <div className="space-y-2 md:col-span-2">
            <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Student *</label>
            <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium appearance-none">
              <option value="">Select Student</option>
              <option value="ADM-1001">Aarav Sharma (ADM-1001)</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Route List *</label>
            <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium appearance-none">
              <option value="">Select Route</option>
              {routes.map(r => <option key={r.id} value={r.routeTitle}>{r.routeTitle}</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Vehicle *</label>
            <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium appearance-none">
              <option value="">Select Vehicle</option>
              {assignedVehicles.map(v => <option key={v.id} value={v.vehicle}>{v.vehicle}</option>)}
            </select>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-100 flex justify-end">
          <button type="submit" className="px-8 py-4 bg-amber-600 text-white rounded-2xl font-bold hover:bg-amber-700 transition-all text-sm shadow-lg shadow-amber-100 flex items-center gap-2">
            <Save size={18} /> Assign Transport
          </button>
        </div>
      </form>
    </div>
  );
};

export default AssignStudentTransport;
