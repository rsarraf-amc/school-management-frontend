import { ArrowRight } from "lucide-react";

export default function QuickActionCard({
  icon: Icon,
  label,
  description = "Open section",
  onClick,
  color = "text-indigo-600",
  lightColor = "bg-indigo-50",
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="group relative w-full text-left p-6 rounded-3xl bg-gray-50 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col"
    >
      {/* Decorative Background */}
      <div
        className={`absolute top-0 right-0 w-24 h-24 ${lightColor} rounded-full -mr-8 -mt-8 opacity-40 group-hover:scale-150 transition-transform duration-700`}
      />

      {/* Icon */}
      <div
        className={`w-12 h-12 ${lightColor} ${color} rounded-2xl flex items-center justify-center mb-5 relative z-10`}
      >
        <Icon size={20} strokeWidth={2} />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col flex-grow">
        <h3 className="text-lg font-black text-slate-900 mb-1">
          {label}
        </h3>

        <p className="text-sm text-slate-500 font-medium mb-5 leading-relaxed">
          {description}
        </p>

        {/* Arrow at bottom-right */}
        <div className="mt-auto flex justify-end">
          <ArrowRight
            size={18}
            className={`${color} transition-all duration-300 group-hover:translate-x-1`}
          />
        </div>
      </div>
    </button>
  );
}