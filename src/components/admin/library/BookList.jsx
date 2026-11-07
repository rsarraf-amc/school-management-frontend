import React, { useState } from "react";
import { Search, Edit, Trash2 } from "lucide-react";
import DataTable from "../../ui/DataTable";
import FilterBar from "../../ui/FilterBar";
import FilterItem from "../../ui/FilterItem";
import { books } from "../../../mock/libraryData";

const BookList = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.bookNo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    { header: "Book Title", accessor: "title", render: (row) => <span className="font-bold text-slate-900">{row.title}</span> },
    { header: "Book No", accessor: "bookNo", render: (row) => <span className="font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded text-[10px] uppercase">{row.bookNo}</span> },
    { header: "Publisher", accessor: "publisher", render: (row) => <span className="text-slate-500 font-medium text-xs">{row.publisher}</span> },
    { header: "Author", accessor: "author", render: (row) => <span className="text-slate-500 font-medium text-xs">{row.author}</span> },
    { header: "Category", accessor: "category", render: (row) => <span className="text-slate-500 font-medium text-xs">{row.category}</span> },
    { header: "Qty", accessor: "qty", render: (row) => <span className="font-bold text-slate-700">{row.qty}</span> },
    { header: "Available", accessor: "available", render: (row) => <span className={`font-bold ${row.available > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>{row.available}</span> },
    { header: "Price", accessor: "price", render: (row) => <span className="font-medium text-slate-600">${row.price}</span> },
  ];

  const actions = [
    { icon: Edit, label: "Edit", onClick: () => {} },
    { icon: Trash2, label: "Delete", onClick: () => {} },
  ];

  return (
    <div className="space-y-6">
      <FilterBar 
         title="Library Book Inventory" 
         description="Search and manage all books currently in the library system."
         onFilter={() => {}} 
         onReset={() => setSearchTerm("")}
      >
        <FilterItem label="Search Book">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input type="text" placeholder="Title or Book No..." className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-indigo-500/20" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
        </FilterItem>
      </FilterBar>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
          <h3 className="font-black text-slate-900 tracking-tight">Book List</h3>
        </div>
        <DataTable columns={columns} data={filteredBooks} actions={actions} />
      </div>
    </div>
  );
};

export default BookList;
