import React, { useState } from "react";
import { Repeat, Check, AlertCircle } from "lucide-react";
import DataTable from "../../ui/DataTable";
import FilterBar from "../../ui/FilterBar";
import FilterItem from "../../ui/FilterItem";
import { issueRecords } from "../../../mock/libraryData";

const IssueReturn = () => {
  const [memberId, setMemberId] = useState("");

  const columns = [
    { header: "Book Title", accessor: "bookTitle", render: (row) => <span className="font-bold text-slate-900">{row.bookTitle}</span> },
    { header: "Book No", accessor: "bookNo", render: (row) => <span className="text-slate-500 font-medium text-xs">{row.bookNo}</span> },
    { header: "Issue Date", accessor: "issueDate", render: (row) => <span className="text-slate-500 font-medium text-xs">{row.issueDate}</span> },
    { header: "Due Date", accessor: "dueDate", render: (row) => <span className="font-bold text-slate-700">{row.dueDate}</span> },
    { header: "Return Date", accessor: "returnDate", render: (row) => <span className="text-slate-500 font-medium text-xs">{row.returnDate || "-"}</span> },
    { header: "Status", accessor: "status", render: (row) => (
       <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest ${
          row.status === "Returned" ? "bg-emerald-50 text-emerald-600" : 
          row.status === "Overdue" ? "bg-rose-50 text-rose-600" :
          "bg-blue-50 text-blue-600"
       }`}>
          {row.status}
       </span>
    )},
  ];

  const actions = [
    { icon: Check, label: "Return Book", onClick: () => {} }
  ];

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
      {/* Issue Book Form */}
      <div className="xl:col-span-1">
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 sticky top-8">
          <h3 className="font-black text-slate-900 tracking-tight flex items-center gap-2 mb-6">
             <Repeat size={18} className="text-emerald-600" /> Issue Book
          </h3>
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
             <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Library Member ID *</label>
                <input type="text" placeholder="e.g. LIB-1001" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-emerald-500/20" value={memberId} onChange={(e) => setMemberId(e.target.value)} />
             </div>
             <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Book No *</label>
                <input type="text" placeholder="e.g. BK-001" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-emerald-500/20" />
             </div>
             <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Issue Date *</label>
                <input type="date" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium" />
             </div>
             <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Due Date *</label>
                <input type="date" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium" />
             </div>
             <button type="submit" className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 transition-all text-sm shadow-lg shadow-emerald-100 flex items-center justify-center gap-2 mt-4">
                <Repeat size={18} /> Process Issue
             </button>
          </form>
        </div>
      </div>

      {/* Issued Books List */}
      <div className="xl:col-span-2 space-y-6">
         <FilterBar 
            title="Current Circulation" 
            description="View currently issued and overdue books."
            onFilter={() => {}} 
            onReset={() => {}}
         >
           <FilterItem label="Filter by Status">
              <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium appearance-none">
                 <option value="">All Statuses</option>
                 <option value="Issued">Issued</option>
                 <option value="Overdue">Overdue</option>
                 <option value="Returned">Returned</option>
              </select>
           </FilterItem>
         </FilterBar>

         <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
               <h3 className="font-black text-slate-900 tracking-tight">Circulation History</h3>
            </div>
            <DataTable columns={columns} data={issueRecords} actions={actions} />
         </div>
      </div>
    </div>
  );
};

export default IssueReturn;
