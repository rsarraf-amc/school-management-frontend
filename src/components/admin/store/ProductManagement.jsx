import React from "react";
import { ShoppingBag, Plus, Edit, Trash2, Search } from "lucide-react";
import DataTable from "../../ui/DataTable";
import FilterBar from "../../ui/FilterBar";
import FilterItem from "../../ui/FilterItem";
import { products } from "../../../mock/storeData";

const ProductManagement = () => {
  const columns = [
    { header: "Product Name", accessor: "name", render: (row) => <span className="font-bold text-slate-900">{row.name}</span> },
    { header: "Category", accessor: "category", render: (row) => <span className="text-slate-500 font-medium text-xs">{row.category}</span> },
    { header: "Unit", accessor: "unit", render: (row) => <span className="text-slate-500 font-medium text-xs">{row.unit}</span> },
    { header: "Stock", accessor: "stock", render: (row) => (
       <span className={`font-black ${row.stock < 20 ? 'text-rose-600' : 'text-slate-700'}`}>
          {row.stock}
       </span>
    )},
    { header: "Price", accessor: "salePrice", render: (row) => <span className="font-bold text-emerald-600">₹{row.salePrice}</span> },
  ];

  const actions = [
    { icon: Edit, label: "Edit", onClick: () => {} },
    { icon: Trash2, label: "Delete", onClick: () => {} },
  ];

  return (
    <div className="space-y-6">
      <FilterBar title="Product Catalog" description="Search and filter store items." onFilter={() => {}} onReset={() => {}}>
         <FilterItem label="Category">
            <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium">
               <option value="">All Categories</option>
               <option value="Uniforms">Uniforms</option>
            </select>
         </FilterItem>
         <FilterItem label="Search Product">
            <div className="relative">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
               <input type="text" placeholder="Product name..." className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium" />
            </div>
         </FilterItem>
      </FilterBar>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
          <h3 className="font-black text-slate-900 tracking-tight flex items-center gap-2">
            <ShoppingBag size={18} className="text-emerald-600" /> Inventory Items
          </h3>
          <button className="px-6 py-2.5 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 transition-all text-sm shadow-lg shadow-emerald-100 flex items-center gap-2">
            <Plus size={18} /> Add Product
          </button>
        </div>
        <DataTable columns={columns} data={products} actions={actions} />
      </div>
    </div>
  );
};

export default ProductManagement;
