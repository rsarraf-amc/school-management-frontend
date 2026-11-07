import React, { useState } from "react";
import { Check, X, Trash2 } from "lucide-react";
import DataTable from "../../ui/DataTable";
import useApiData from "../../../hooks/useApiData";
import { leavesApi } from "../../../services/api";
import { leaveFromApi } from "../../../utils/mappers";

const dayCount = (start, end) => {
  if (!start || !end) return "-";
  return Math.round((new Date(end) - new Date(start)) / 86400000) + 1;
};

const ApproveLeave = ({ reloadKey = 0 }) => {
  const { data: leaves, loading, error, reload } = useApiData(
    async () => (await leavesApi.list()).map(leaveFromApi),
    [reloadKey],
    []
  );
  const [actionError, setActionError] = useState("");
  const [notice, setNotice] = useState(false);

  const handleDelete = async (row) => {
    if (!window.confirm("Delete this leave request?")) return;
    setActionError("");
    try {
      await leavesApi.remove(row.id);
      reload();
    } catch (err) {
      setActionError(err.message);
    }
  };

  const columns = [
    { header: "Staff", accessor: "employeeName", render: (row) => <span className="font-bold text-slate-900">{row.employeeName || `#${row.employeeId}`}</span> },
    { header: "Leave Type", accessor: "leaveType", render: (row) => <span className="text-slate-500 font-medium text-xs">{row.leaveType}</span> },
    { header: "Date", accessor: "date", render: (row) => <span className="text-slate-500 font-medium text-xs">{row.startDate} → {row.endDate}</span> },
    { header: "Days", accessor: "days", render: (row) => <span className="font-bold text-slate-700">{dayCount(row.startDate, row.endDate)}</span> },
    { header: "Reason", accessor: "reason", render: (row) => <span className="text-slate-500 font-medium text-xs">{row.reason || "-"}</span> },
  ];

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
        <h3 className="font-black text-slate-900 tracking-tight">Pending Leave Requests</h3>
      </div>
      {notice && <p className="px-6 py-3 text-xs font-bold text-amber-600 bg-amber-50 border-b border-amber-100">Approving or disapproving leave is not yet supported by the backend.</p>}
      {actionError && <p className="px-6 py-3 text-sm font-bold text-rose-600">{actionError}</p>}
      {loading && <p className="p-6 text-sm font-medium text-slate-500">Loading leave requests...</p>}
      {error && <p className="p-6 text-sm font-bold text-rose-600">{error}</p>}
      {!loading && !error && (
        <DataTable columns={columns} data={leaves} actions={[
          { icon: Check, label: "Approve", onClick: () => setNotice(true) },
          { icon: X, label: "Disapprove", onClick: () => setNotice(true) },
          { icon: Trash2, label: "Delete", variant: "danger", onClick: handleDelete },
        ]} />
      )}
    </div>
  );
};

export default ApproveLeave;
