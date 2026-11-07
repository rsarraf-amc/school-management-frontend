import React, { useState } from "react";
import { UserPlus, Edit, Trash2 } from "lucide-react";
import DataTable from "../../ui/DataTable";
import FilterBar from "../../ui/FilterBar";
import FilterItem from "../../ui/FilterItem";
import { members } from "../../../mock/libraryData";

const AddStudent = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredMembers = members.filter((member) =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.memberId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    { header: "Member ID", accessor: "memberId", render: (row) => <span className="font-black text-amber-600 bg-amber-50 px-2 py-0.5 rounded text-[10px] uppercase">{row.memberId}</span> },
    { header: "Library Card No", accessor: "libraryCardNo", render: (row) => <span className="font-medium text-slate-500 text-xs">{row.libraryCardNo}</span> },
    { header: "Name", accessor: "name", render: (row) => <span className="font-bold text-slate-900">{row.name}</span> },
    { header: "Member Type", accessor: "memberType", render: (row) => <span className="text-slate-500 font-medium text-xs">{row.memberType}</span> },
    { header: "Class", render: (row) => <span className="text-slate-500 font-medium text-xs">{row.class !== "N/A" ? `${row.class} (${row.section})` : "N/A"}</span> },
    { header: "Phone", accessor: "phone", render: (row) => <span className="text-slate-500 font-medium text-xs">{row.phone}</span> },
  ];

  const actions = [
    { icon: Edit, label: "Edit", onClick: () => {} },
    { icon: Trash2, label: "Delete", onClick: () => {} },
  ];

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
      {/* Add Member Form */}
      <div className="xl:col-span-1">
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 sticky top-8">
          <h3 className="font-black text-slate-900 tracking-tight flex items-center gap-2 mb-6">
             <UserPlus size={18} className="text-amber-600" /> Add Library Member
          </h3>
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
             <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Member Type *</label>
                <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium appearance-none">
                   <option value="Student">Student</option>
                   <option value="Staff">Staff</option>
                </select>
             </div>
             <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Select Member *</label>
                <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium appearance-none">
                   <option value="">Select Student/Staff</option>
                   <option value="ADM-001">Aarav Sharma</option>
                </select>
             </div>
             <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Library Card No *</label>
                <input type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-amber-500/20" />
             </div>
             <button type="submit" className="w-full py-4 bg-amber-600 text-white rounded-2xl font-bold hover:bg-amber-700 transition-all text-sm shadow-lg shadow-amber-100 flex items-center justify-center gap-2 mt-4">
                <UserPlus size={18} /> Register Member
             </button>
          </form>
        </div>
      </div>

      {/* Members List */}
      <div className="xl:col-span-2 space-y-6">
         <FilterBar 
            title="Library Members" 
            description="Manage registered students and staff."
            onFilter={() => {}} 
            onReset={() => setSearchTerm("")}
         >
           <FilterItem label="Search Member">
              <input type="text" placeholder="Name or Member ID..." className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
           </FilterItem>
         </FilterBar>

         <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
               <h3 className="font-black text-slate-900 tracking-tight">Registered Members List</h3>
            </div>
            <DataTable columns={columns} data={filteredMembers} actions={actions} />
         </div>
      </div>
    </div>
  );
};

export default AddStudent;
