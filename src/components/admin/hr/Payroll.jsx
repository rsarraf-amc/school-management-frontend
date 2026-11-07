import React, { useState } from "react";
import { DollarSign, FileText } from "lucide-react";
import DataTable from "../../ui/DataTable";
import FilterBar from "../../ui/FilterBar";
import FilterItem from "../../ui/FilterItem";
import useApiData from "../../../hooks/useApiData";
import { employeesApi, payrollApi } from "../../../services/api";
import { employeeFromApi } from "../../../utils/mappers";

const money = (value) => (value == null ? "-" : Number(value).toLocaleString());

const Payroll = () => {
  const [selectedId, setSelectedId] = useState(null);

  const { data: staff, loading, error } = useApiData(
    async () => (await employeesApi.list()).map(employeeFromApi),
    [],
    []
  );

  const { data: payslips, loading: payLoading, error: payError } = useApiData(
    async () => (selectedId ? payrollApi.listByEmployee(selectedId) : []),
    [selectedId],
    []
  );

  const selected = staff.find((s) => s.id === selectedId);

  const columns = [
    { header: "Staff ID", accessor: "staffId", render: (row) => <span className="font-bold text-slate-900">{row.staffId}</span> },
    { header: "Name", accessor: "name", render: (row) => <span className="font-bold text-slate-700">{row.name}</span> },
    { header: "Employment", accessor: "employmentType", render: (row) => <span className="px-2 py-0.5 bg-rose-50 text-rose-600 rounded text-[10px] font-black uppercase">{row.employmentType}</span> },
    { header: "Basic Pay", accessor: "basicPay", render: (row) => <span className="text-slate-500 font-medium text-xs">{money(row.basicPay)}</span> },
    { header: "Net Amount", accessor: "netAmount", render: (row) => <span className="text-slate-500 font-medium text-xs">{money(row.netAmount)}</span> },
  ];

  const payColumns = [
    { header: "Month", accessor: "Month", render: (row) => <span className="font-bold text-slate-900">{row.Month}</span> },
    { header: "Basic Salary", accessor: "BasicSalary", render: (row) => <span className="text-slate-500 font-medium text-xs">{money(row.BasicSalary)}</span> },
    { header: "Gross Salary", accessor: "GrossSalary", render: (row) => <span className="text-slate-500 font-medium text-xs">{money(row.GrossSalary)}</span> },
    { header: "Deduction", accessor: "TotalDeduction", render: (row) => <span className="text-slate-500 font-medium text-xs">{money(row.TotalDeduction)}</span> },
    { header: "Payable", accessor: "PayableAmount", render: (row) => <span className="font-bold text-slate-700">{money(row.PayableAmount)}</span> },
    { header: "Status", accessor: "Status", render: (row) => (
       <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest ${row.Status === "PAID" ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"}`}>{row.Status}</span>
    )},
  ];

  const actions = [
    { icon: FileText, label: "View Payroll", onClick: (row) => setSelectedId(row.id) },
  ];

  return (
    <div className="space-y-6">
      <FilterBar title="Payroll Management" description="View staff salaries and payslips." onFilter={() => {}} onReset={() => setSelectedId(null)}>
        <FilterItem label="Staff">
           <select value={selectedId ?? ""} onChange={(e) => setSelectedId(e.target.value ? Number(e.target.value) : null)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium appearance-none">
              <option value="">Select staff...</option>
              {staff.map((s) => <option key={s.id} value={s.id}>{s.name} ({s.staffId})</option>)}
           </select>
        </FilterItem>
      </FilterBar>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
          <h3 className="font-black text-slate-900 tracking-tight">Staff Payroll List</h3>
        </div>
        {loading && <p className="p-6 text-sm font-medium text-slate-500">Loading staff...</p>}
        {error && <p className="p-6 text-sm font-bold text-rose-600">{error}</p>}
        {!loading && !error && <DataTable columns={columns} data={staff} actions={actions} />}
      </div>

      {selected && (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center gap-2 bg-slate-50/30">
            <DollarSign size={18} className="text-slate-600" />
            <h3 className="font-black text-slate-900 tracking-tight">Payroll - {selected.name}</h3>
          </div>
          {payLoading && <p className="p-6 text-sm font-medium text-slate-500">Loading payroll...</p>}
          {payError && <p className="p-6 text-sm font-bold text-rose-600">{payError}</p>}
          {!payLoading && !payError && <DataTable columns={payColumns} data={payslips} />}
        </div>
      )}
    </div>
  );
};

export default Payroll;
