import { ChevronLeft, ChevronRight } from "lucide-react";

export default function QuickActionSectionHeader({
  title,
  description,
  showBack = false,
  onBack,
  breadcrumb,
}) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full blur-3xl -z-0 opacity-50 pointer-events-none"></div>

      <div className="flex items-center gap-4 relative z-10">
        {showBack && onBack && (
          <button
            onClick={onBack}
            className="p-2 hover:bg-slate-50 rounded-xl border border-slate-100 transition-colors text-slate-600"
            title="Back to Overview"
          >
            <ChevronLeft size={24} />
          </button>
        )}

        <div className="space-y-1">
          {breadcrumb && (
            <div className="flex items-center gap-2 text-slate-400 text-xs font-black uppercase tracking-widest mb-1">
              {breadcrumb.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  {index > 0 && <ChevronRight size={12} />}
                  <span className={item.active ? "text-indigo-600" : ""}>
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          )}

          <h1 className="text-2xl xl:text-3xl font-black text-slate-900 tracking-tight">
            {title}
          </h1>
          <p className="text-slate-500 font-medium text-sm">{description}</p>
        </div>
      </div>
    </div>
  );
}
