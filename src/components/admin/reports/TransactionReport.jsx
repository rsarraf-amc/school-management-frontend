import React from "react";
import { Download, TrendingUp } from "lucide-react";
import DataTable from "../../ui/DataTable";
import FilterBar from "../../ui/FilterBar";
import FilterItem from "../../ui/FilterItem";
import StatusMessage from "../../ui/StatusMessage";
import useAsync from "../../../hooks/useAsync";
import { apiService } from "../../../services/apiService";

const TransactionReport = () => {
  // Income = fee payments; salaries paid = expenses. No other ledger exists in the backend.
  const { data: transactions, loading, error } = useAsync(async () => {
    const [payments, payrolls] = await Promise.all([
      apiService.getFeePayments(),
      apiService.getPayrolls().catch(() => []),
    ]);
    const income = (payments || []).map((p) => ({
      id: `F-${p.id}`,
      transactionId: p.receiptNumber || `FEE-${p.id}`,
      date: (p.paidOn || "").slice(0, 10),
      type: "Income",
      amount: p.paidAmount,
      mode: "-",
      description: `${p.feeType?.name || "Fee"} - ${[p.student?.firstName, p.student?.lastName].filter(Boolean).join(" ")}`,
    }));
    const expense = (payrolls || [])
      .filter((r) => r.status === "PAID")
      .map((r) => ({
        id: `P-${r.id}`,
        transactionId: `PAY-${r.id}`,
        date: (r.updatedAt || r.createdAt || "").slice(0, 10),
        type: "Expense",
        amount: r.payableAmount,
        mode: r.paymentMode || "-",
        description: `Salary ${r.month} - ${[r.employee?.firstName, r.employee?.lastName].filter(Boolean).join(" ")}`,
      }));
    return [...income, ...expense].sort((a, b) => b.date.localeCompare(a.date));
  }, []);

  const columns = [
    { header: "Transaction ID", accessor: "transactionId", render: (row) => <span className="font-black text-slate-600 bg-slate-100 px-2 py-0.5 rounded text-[10px] uppercase">{row.transactionId}</span> },
    { header: "Date", accessor: "date", render: (row) => <span className="text-slate-500 font-medium text-xs">{row.date}</span> },
    { header: "Type", accessor: "type", render: (row) => (
       <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest ${
          row.type === "Income" ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
       }`}>
          {row.type}
       </span>
    )},
    { header: "Amount", accessor: "amount", render: (row) => <span className={`font-bold ${row.type === "Income" ? "text-emerald-600" : "text-rose-600"}`}>₹{row.amount}</span> },
    { header: "Mode", accessor: "mode", render: (row) => <span className="text-slate-500 font-medium text-xs">{row.mode}</span> },
    { header: "Description", accessor: "description", render: (row) => <span className="text-slate-600 font-medium">{row.description}</span> },
  ];

  return (
    <div className="space-y-6">
      <FilterBar 
         title="Transaction Report" 
         description="Track income and expense ledgers."
         onFilter={() => {}} 
         onReset={() => {}}
      >
        <FilterItem label="Transaction Type">
           <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium appearance-none">
              <option value="">All Types</option>
              <option value="Income">Income</option>
              <option value="Expense">Expense</option>
           </select>
        </FilterItem>
        <FilterItem label="Payment Mode">
           <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium appearance-none">
              <option value="">All Modes</option>
              <option value="Cash">Cash</option>
              <option value="Online">Online</option>
              <option value="Bank Transfer">Bank Transfer</option>
           </select>
        </FilterItem>
        <FilterItem label="From Date">
          <input type="date" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium" />
        </FilterItem>
        <FilterItem label="To Date">
          <input type="date" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium" />
        </FilterItem>
      </FilterBar>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
          <h3 className="font-black text-slate-900 tracking-tight flex items-center gap-2">
            <TrendingUp size={18} className="text-emerald-600" />
            Financial Transactions
          </h3>
          <div className="flex gap-2">
             <button className="px-6 py-2.5 bg-slate-800 text-white rounded-2xl font-bold hover:bg-slate-900 transition-all text-sm shadow-lg flex items-center gap-2">
               <Download size={18} /> CSV
             </button>
             <button className="px-6 py-2.5 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 transition-all text-sm shadow-lg shadow-emerald-100 flex items-center gap-2">
               <Download size={18} /> Export PDF
             </button>
          </div>
        </div>
        <StatusMessage loading={loading} error={error} empty={!loading && !error && !transactions?.length} />
        <DataTable columns={columns} data={transactions || []} />
      </div>
    </div>
  );
};

export default TransactionReport;
