import React from "react";
import { Plus, Calendar, Edit, Trash2 } from "lucide-react";
import DataTable from "../../ui/DataTable";
import { routes, stoppages, assignedVehicles } from "../../../mock/transportData";

const RouteTimeTable = () => {
  const mockTimetable = [
    { id: 1, route: "City Center via Main St", stoppage: "Central Market", vehicle: "UP-32-AB-1234", arrivalTime: "07:30 AM", departureTime: "07:35 AM" },
    { id: 2, route: "City Center via Main St", stoppage: "North Gate Park", vehicle: "UP-32-AB-1234", arrivalTime: "07:45 AM", departureTime: "07:50 AM" }
  ];

  const columns = [
    { header: "Route", accessor: "route", render: (row) => <span className="font-bold text-slate-900">{row.route}</span> },
    { header: "Stoppage", accessor: "stoppage", render: (row) => <span className="font-medium text-slate-600">{row.stoppage}</span> },
    { header: "Vehicle", accessor: "vehicle", render: (row) => <span className="font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded text-[10px] uppercase">{row.vehicle}</span> },
    { header: "Arrival Time", accessor: "arrivalTime", render: (row) => <span className="text-slate-500 font-medium text-xs">{row.arrivalTime}</span> },
    { header: "Departure Time", accessor: "departureTime", render: (row) => <span className="text-slate-500 font-medium text-xs">{row.departureTime}</span> },
  ];

  const actions = [
    { icon: Edit, label: "Edit", onClick: () => {} },
    { icon: Trash2, label: "Delete", onClick: () => {} },
  ];

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
      {/* TimeTable Form */}
      <div className="xl:col-span-1">
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 sticky top-8">
          <h3 className="font-black text-slate-900 tracking-tight flex items-center gap-2 mb-6">
             <Calendar size={18} className="text-slate-600" /> Route TimeTable
          </h3>
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
             <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Route *</label>
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
             <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Stoppage *</label>
                <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium appearance-none">
                   <option value="">Select Stoppage</option>
                   {stoppages.map(s => <option key={s.id} value={s.stoppageName}>{s.stoppageName}</option>)}
                </select>
             </div>
             <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                   <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Arrival Time *</label>
                   <input type="time" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium" />
                </div>
                <div className="space-y-2">
                   <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Departure Time *</label>
                   <input type="time" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium" />
                </div>
             </div>
             <button type="submit" className="w-full py-4 bg-slate-800 text-white rounded-2xl font-bold hover:bg-slate-900 transition-all text-sm shadow-lg flex items-center justify-center gap-2 mt-4">
                <Plus size={18} /> Save TimeTable
             </button>
          </form>
        </div>
      </div>

      {/* TimeTable List */}
      <div className="xl:col-span-2">
         <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
               <h3 className="font-black text-slate-900 tracking-tight">TimeTable List</h3>
            </div>
            <DataTable columns={columns} data={mockTimetable} actions={actions} />
         </div>
      </div>
    </div>
  );
};

export default RouteTimeTable;
