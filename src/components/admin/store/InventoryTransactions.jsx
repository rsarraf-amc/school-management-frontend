import React from "react";
import { ShoppingCart, Plus, Search, Download } from "lucide-react";
import DataTable from "../../ui/DataTable";
import FilterBar from "../../ui/FilterBar";
import FilterItem from "../../ui/FilterItem";
import { inventoryLogs } from "../../../mock/storeData";

const InventoryTransactions = () => {
  const columns = [
    { header: "Date", accessor: "date", render: (row) => <span className="text-slate-500 font-medium text-xs">{row.date}</span> },
    { header: "Type", accessor: "type", render: (row) => (
       <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest ${
          row.type === "Sale" ? "bg-emerald-50 text-emerald-600" : "bg-blue-50 text-blue-600"
       }`}>
          {row.type}
       </span>
    )},
    { header: "Product", accessor: "product", render: (row) => <span className="font-bold text-slate-900">{row.product}</span> },
    { header: "Qty", accessor: "quantity", render: (row) => <span className="font-bold text-slate-700">{row.quantity}</span> },
    { header: "Total", accessor: "totalAmount", render: (row) => <span className="font-bold text-slate-900">₹{row.totalAmount}</span> },
    { header: "Mode", accessor: "paymentMode", render: (row) => <span className="text-slate-500 font-medium text-xs">{row.paymentMode}</span> },
  ];

  return (
    <div className="space-y-6">
      <FilterBar title="Buy / Sell Product" description="Track inventory purchases and sales." onFilter={() => {}} onReset={() => {}}>
         <FilterItem label="Transaction Type">
            <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium">
               <option value="">All Types</option>
               <option value="Sale">Sale</option>
               <option value="Purchase">Purchase</option>
            </select>
         </FilterItem>
         <FilterItem label="Date Range">
            <input type="date" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium" />
         </FilterItem>
      </FilterBar>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-rose-50/10">
          <h3 className="font-black text-slate-900 tracking-tight flex items-center gap-2">
            <ShoppingCart size={18} className="text-rose-600" /> Transaction Logs
          </h3>
          <div className="flex gap-2">
             <button className="px-6 py-2.5 bg-slate-800 text-white rounded-2xl font-bold hover:bg-slate-900 transition-all text-sm shadow-lg flex items-center gap-2">
               <Plus size={18} /> New Transaction
             </button>
             <button className="px-6 py-2.5 bg-rose-600 text-white rounded-2xl font-bold hover:bg-rose-700 transition-all text-sm shadow-lg shadow-rose-100 flex items-center gap-2">
               <Download size={18} /> Export PDF
             </button>
          </div>
        </div>
        <DataTable columns={columns} data={inventoryLogs} />
      </div>
    </div>
  );
};

export default InventoryTransactions;
