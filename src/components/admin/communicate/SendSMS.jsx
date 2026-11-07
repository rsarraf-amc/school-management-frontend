import React from "react";
import { Send, MessageSquare, Edit, Trash2 } from "lucide-react";
import DataTable from "../../ui/DataTable";
import { smsLogs } from "../../../mock/communicateData";

const SendSMS = () => {
  const columns = [
    { header: "Date / Time", accessor: "date", render: (row) => <span className="text-slate-500 font-medium text-xs">{row.date}</span> },
    { header: "Title", accessor: "title", render: (row) => <span className="font-bold text-slate-900">{row.title}</span> },
    { header: "Recipient Type", accessor: "recipientType", render: (row) => <span className="text-slate-500 font-medium text-xs">{row.recipientType}</span> },
    { header: "Group", accessor: "group", render: (row) => <span className="text-slate-500 font-medium text-xs">{row.group}</span> },
    { header: "Count", accessor: "count", render: (row) => <span className="font-bold text-slate-700">{row.count}</span> },
    { 
      header: "Status", 
      accessor: "status", 
      render: (row) => (
        <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest ${
          row.status === "Delivered" ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
        }`}>
          {row.status}
        </span>
      )
    },
  ];

  const actions = [
    { icon: Edit, label: "View Details", onClick: () => {} },
    { icon: Trash2, label: "Delete Log", onClick: () => {} },
  ];

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
      {/* Send SMS Form */}
      <div className="xl:col-span-1">
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 sticky top-8">
          <h3 className="font-black text-slate-900 tracking-tight flex items-center gap-2 mb-6">
             <MessageSquare size={18} className="text-emerald-600" /> Compose SMS
          </h3>
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
             <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">SMS Title *</label>
                <input type="text" placeholder="e.g. Exam Schedule" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-emerald-500/20" />
             </div>
             <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Send To *</label>
                <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium appearance-none">
                   <option value="">Select Recipient Type</option>
                   <option value="Student">All Students</option>
                   <option value="Parent">All Parents</option>
                   <option value="Teacher">All Teachers</option>
                   <option value="Class">Specific Class</option>
                </select>
             </div>
             <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Message *</label>
                <textarea rows="5" placeholder="Enter your SMS content here..." className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium resize-none focus:ring-2 focus:ring-emerald-500/20"></textarea>
                <div className="flex justify-between px-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Characters: 0 / 160</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">SMS Count: 1</span>
                </div>
             </div>
             <button type="submit" className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 transition-all text-sm shadow-lg shadow-emerald-100 flex items-center justify-center gap-2 mt-4">
                <Send size={18} /> Dispatch SMS
             </button>
          </form>
        </div>
      </div>

      {/* SMS Logs List */}
      <div className="xl:col-span-2">
         <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
               <h3 className="font-black text-slate-900 tracking-tight">SMS Dispatch Log</h3>
            </div>
            <DataTable columns={columns} data={smsLogs} actions={actions} />
         </div>
      </div>
    </div>
  );
};

export default SendSMS;
