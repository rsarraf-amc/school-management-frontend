import React from "react";
import { Check, X } from "lucide-react";
import DataTable from "../../ui/DataTable";
import { leaveRequests } from "../../../mock/hrData";

const ApproveLeave = () => {
  const columns = [
    { header: "Staff", accessor: "staff", render: (row) => <span className="font-bold text-slate-900">{row.staff}</span> },
    { header: "Leave Type", accessor: "type", render: (row) => <span className="text-slate-500 font-medium text-xs">{row.type}</span> },
    { header: "Date", accessor: "date", render: (row) => <span className="text-slate-500 font-medium text-xs">{row.date}</span> },
    { header: "Days", accessor: "days", render: (row) => <span className="font-bold text-slate-700">{row.days}</span> },
    { header: "Apply Date", accessor: "applyDate", render: (row) => <span className="text-slate-500 font-medium text-xs">{row.applyDate}</span> },
    { header: "Status", accessor: "status", render: (row) => (
       <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest ${
          row.status === "Approved" ? "bg-emerald-50 text-emerald-600" :
          row.status === "Pending" ? "bg-amber-50 text-amber-600" :
          "bg-rose-50 text-rose-600"
       }`}>
          {row.status}
       </span>
    )},
  ];

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
        <h3 className="font-black text-slate-900 tracking-tight">Pending Leave Requests</h3>
      </div>
      <DataTable columns={columns} data={leaveRequests} actions={[
          { icon: Check, label: "Approve", onClick: () => {} },
          { icon: X, label: "Disapprove", onClick: () => {} }
      ]} />
    </div>
  );
};

export default ApproveLeave;
