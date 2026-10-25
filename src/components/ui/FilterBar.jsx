import { Filter, RotateCcw } from "lucide-react";

export default function FilterBar({ 
  title, 
  description, 
  onFilter, 
  onReset, 
  children,
  icon: Icon = Filter
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
      <div className="flex items-center gap-2 mb-4 text-slate-800">
        <Icon size={18} className="text-indigo-600 stroke-[2.5]" />
        <div>
          <h3 className="font-black tracking-tight">{title}</h3>
          {description && <p className="text-sm text-slate-500">{description}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {children}
        
        <div className="flex items-end gap-2">
          <button
            onClick={onFilter}
            className="flex-1 bg-indigo-600 text-white px-4 py-3 rounded-2xl font-bold hover:bg-indigo-700 transition-all text-sm shadow-md shadow-indigo-100 flex items-center justify-center gap-2"
          >
            <Filter size={16} />
            Filter
          </button>
          <button
            onClick={onReset}
            className="p-3 bg-slate-100 text-slate-500 rounded-2xl hover:bg-slate-200 transition-all"
            title="Reset Filters"
          >
            <RotateCcw size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
