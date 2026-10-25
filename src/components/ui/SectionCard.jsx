import { Plus } from "lucide-react";

export default function SectionCard({
  title,
  description,
  count,
  onAdd,
  addLabel,
  children,
  headerClassName = "bg-slate-50/50",
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
      <div
        className={`px-6 py-5 border-b border-slate-50 flex justify-between items-center ${headerClassName}`}
      >
        <div className="space-y-1">
          <h3 className="text-lg font-black text-slate-800 tracking-tight">
            {title}
          </h3>
          {description && (
            <p className="text-xs font-medium text-slate-500 italic">
              {description}
            </p>
          )}
          {count !== undefined && (
            <p className="text-xs font-medium text-slate-500 italic">
              Showing {count} records
            </p>
          )}
        </div>
        {onAdd && (
          <button
            onClick={onAdd}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-xl font-bold hover:bg-indigo-700 transition-all text-sm shadow-md shadow-indigo-200 active:scale-95"
          >
            <Plus size={18} className="stroke-[3]" />
            {addLabel || "Add New"}
          </button>
        )}
      </div>
      {children}
    </div>
  );
}
