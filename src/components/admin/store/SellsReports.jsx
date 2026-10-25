import React from "react";
import { BarChart2, Download, Filter } from "lucide-react";
import FilterBar from "../../ui/FilterBar";
import FilterItem from "../../ui/FilterItem";
import DataTable from "../../ui/DataTable";
import { inventoryLogs } from "../../../mock/storeData";

const SellsReports = () => {
  const salesData = inventoryLogs.filter(log => log.type === "Sale");

  const columns = [
    { header: "Date", accessor: "date", render: (row) => <span className="text-slate-500 font-medium text-xs">{row.date}</span> },
    { header: "Product", accessor: "product", render: (row) => <span className="font-bold text-slate-900">{row.product}</span> },
    { header: "Qty", accessor: "quantity", render: (row) => <span className="font-bold text-slate-700">{row.quantity}</span> },
    { header: "Revenue", accessor: "totalAmount", render: (row) => <span className="font-bold text-emerald-600">₹{row.totalAmount}</span> },
    { header: "Mode", accessor: "paymentMode", render: (row) => <span className="text-slate-500 font-medium text-xs">{row.paymentMode}</span> },
  ];

  return (
    <div className="space-y-6">
      <FilterBar title="Sales Analysis Report" description="Review store revenue and sales trends." onFilter={() => {}} onReset={() => {}}>
         <FilterItem label="Category">
            <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium">
               <option value="">All Categories</option>
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
            <BarChart2 size={18} className="text-slate-600" /> Sales Revenue Log
          </h3>
          <button className="px-6 py-2.5 bg-slate-800 text-white rounded-2xl font-bold hover:bg-slate-900 transition-all text-sm shadow-lg flex items-center gap-2">
            <Download size={18} /> Export CSV
          </button>
        </div>
        <DataTable columns={columns} data={salesData} />
        <div className="p-6 bg-emerald-50 border-t border-emerald-100 flex justify-between items-center">
           <div>
              <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Total Sales Revenue</span>
              <p className="text-2xl font-black text-emerald-700">₹{salesData.reduce((acc, curr) => acc + curr.totalAmount, 0).toLocaleString()}</p>
           </div>
           <div className="text-right">
              <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Items Sold</span>
              <p className="text-2xl font-black text-emerald-700">{salesData.reduce((acc, curr) => acc + curr.quantity, 0)}</p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default SellsReports;
