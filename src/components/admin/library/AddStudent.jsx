import React, { useState } from "react";
import DataTable from "../../ui/DataTable";
import FilterBar from "../../ui/FilterBar";
import FilterItem from "../../ui/FilterItem";
import useAsync from "../../../hooks/useAsync";
import { apiService } from "../../../services/apiService";
import { LoadState, EmptyState, Notice } from "../exam/ModuleState";

const fullName = (s) => [s.firstName, s.lastName].filter(Boolean).join(" ");

const AddStudent = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { data, loading, error, reload } = useAsync(() => apiService.getAllStudents(), []);

  const term = searchTerm.toLowerCase();
  const members = (data || []).filter(
    (s) => fullName(s).toLowerCase().includes(term) || String(s.id).toLowerCase().includes(term),
  );

  const columns = [
    { header: "Member ID", accessor: "id", render: (row) => <span className="font-black text-amber-600 bg-amber-50 px-2 py-0.5 rounded text-[10px] uppercase">{row.id}</span> },
    { header: "Name", accessor: "name", render: (row) => <span className="font-bold text-slate-900">{fullName(row)}</span> },
    { header: "Member Type", accessor: "memberType", render: () => <span className="text-slate-500 font-medium text-xs">Student</span> },
    { header: "Class", accessor: "class", render: (row) => <span className="text-slate-500 font-medium text-xs">{row.class ? `${row.class}${row.section ? ` (${row.section})` : ""}` : "-"}</span> },
    { header: "Phone", accessor: "phone", render: (row) => <span className="text-slate-500 font-medium text-xs">{row.guardianPhone || row.phone || "-"}</span> },
  ];

  return (
    <div className="space-y-6">
      <FilterBar
        title="Library Members"
        description="All enrolled students are library members."
        onFilter={() => {}}
        onReset={() => setSearchTerm("")}
      >
        <FilterItem label="Search Member">
          <input type="text" placeholder="Name or ID..." className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </FilterItem>
      </FilterBar>

      <Notice>Members are the students registered in the school. Register new students from the Students module.</Notice>
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50/30">
          <h3 className="font-black text-slate-900 tracking-tight">Member List</h3>
        </div>
        <LoadState loading={loading} error={error} onRetry={reload} />
        {!loading && !error && (members.length ? <DataTable columns={columns} data={members} /> : <EmptyState>No members found.</EmptyState>)}
      </div>
    </div>
  );
};

export default AddStudent;
