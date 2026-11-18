import React, { useState } from "react";
import { Trash2 } from "lucide-react";
import DataTable from "../../ui/DataTable";
import useAsync from "../../../hooks/useAsync";
import { apiService } from "../../../services/apiService";
import { LoadState, EmptyState, Notice, errorMessage } from "./ModuleState";

const ExamList = () => {
  const [actionError, setActionError] = useState("");
  const { data, loading, error, reload } = useAsync(async () => {
    const [exams, results] = await Promise.all([apiService.exams.list(), apiService.exams.results.list()]);
    return { exams, results };
  });

  const exams = data?.exams || [];
  const resultCount = (id) => (data?.results || []).filter((r) => r.examId === id).length;

  const remove = async (row) => {
    if (!window.confirm(`Delete exam "${row.name}"?`)) return;
    setActionError("");
    try {
      await apiService.exams.remove(row.id);
      await reload();
    } catch (err) {
      setActionError(errorMessage(err));
    }
  };

  const columns = [
    { header: "Exam Name", accessor: "name", render: (row) => <span className="font-bold text-slate-900">{row.name}</span> },
    { header: "Class", accessor: "class", render: (row) => <span className="text-slate-500 font-medium text-xs">{row.class?.name || "-"}</span> },
    { header: "Dates", accessor: "startDate", render: (row) => <span className="text-slate-500 font-medium text-xs">{row.startDate ? `${row.startDate} - ${row.endDate || ""}` : "-"}</span> },
    { header: "Results", accessor: "results", render: (row) => {
      const count = resultCount(row.id);
      return <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest ${count ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-600"}`}>{count} recorded</span>;
    } },
  ];

  return (
    <div className="space-y-4">
      {actionError && <Notice tone="error">{actionError}</Notice>}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
          <h3 className="font-black text-slate-900 tracking-tight">Examination Registry</h3>
        </div>
        <LoadState loading={loading} error={error} onRetry={reload} />
        {!loading && !error && (exams.length ? <DataTable columns={columns} data={exams} actions={[{ icon: Trash2, label: "Delete", onClick: remove }]} /> : <EmptyState>No exams found.</EmptyState>)}
      </div>
    </div>
  );
};

export default ExamList;
