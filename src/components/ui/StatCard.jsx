import React from "react";
import { AreaChart, Area, ResponsiveContainer } from "recharts";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

const colorStyles = {
  emerald: {
    bg: "bg-emerald-50 text-emerald-600 border-emerald-100 shadow-emerald-100",
    pill: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20",
    chart: "#10b981",
  },
  rose: {
    bg: "bg-rose-50 text-rose-600 border-rose-100 shadow-rose-100",
    pill: "bg-rose-500/10 text-rose-700 border-rose-500/20",
    chart: "#f43f5e",
  },
  indigo: {
    bg: "bg-indigo-50 text-indigo-600 border-indigo-100 shadow-indigo-100",
    pill: "bg-indigo-500/10 text-indigo-700 border-indigo-500/20",
    chart: "#6366f1",
  },
  amber: {
    bg: "bg-amber-50 text-amber-600 border-amber-100 shadow-amber-100",
    pill: "bg-amber-500/10 text-amber-700 border-amber-500/20",
    chart: "#f59e0b",
  },
  violet: {
    bg: "bg-violet-50 text-violet-600 border-violet-100 shadow-violet-100",
    pill: "bg-violet-500/10 text-violet-700 border-violet-500/20",
    chart: "#8b5cf6",
  },
  teal: {
    bg: "bg-teal-50 text-teal-600 border-teal-100 shadow-teal-100",
    pill: "bg-teal-500/10 text-teal-700 border-teal-500/20",
    chart: "#14b8a6",
  },
  slate: {
    bg: "bg-slate-50 text-slate-600 border-slate-100 shadow-slate-100",
    pill: "bg-indigo-500/10 text-indigo-700 border-indigo-500/20",
    chart: "#64748b",
  },
};

export default function StatCard({
  title,
  value,
  subValue,
  subLabel,
  icon,
  trend,
  isPositive = true,
  color = "indigo",
  sparklineData,
  containerClassName = "",
  onClick,
}) {
  const style = colorStyles[color] || colorStyles.slate;

  // Default sparkline if none provided but color exists? 
  // Maybe better to only show if sparklineData is present.
  
  const id = React.useId();

  return (
    <div 
      onClick={onClick}
      className={`bg-white p-5 rounded-3xl border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-slate-200/50 hover:-translate-y-1 transition-all duration-300 group flex flex-col relative overflow-hidden ${onClick ? 'cursor-pointer' : ''} ${containerClassName}`}
    >
      {/* Subtle background glow on hover */}
      <div
        className={`absolute top-0 right-0 w-32 h-32 blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 rounded-full pointer-events-none ${
          style.bg.split(" ")[0]
        }`}
      ></div>

      <div className="flex justify-between items-start mb-4 gap-3 relative z-10">
        <div
          className={`p-2.5 rounded-2xl ${style.bg} border shadow-inner group-hover:scale-110 transition-transform shrink-0`}
        >
          {icon}
        </div>
        {trend && (
          <div
            className={`flex items-center gap-1 text-[10px] font-bold uppercase px-2.5 py-1 rounded-full border backdrop-blur-md shrink-0 whitespace-nowrap ${style.pill}`}
          >
            {isPositive ? <ArrowUpRight size={12} className="stroke-[3]" /> : <ArrowDownRight size={12} className="stroke-[3]" />}
            {trend}
          </div>
        )}
      </div>

      <div className="relative z-10 flex-1 flex flex-col">
        <p className="text-slate-400 text-[11px] font-black uppercase tracking-widest mb-1 truncate">
          {title}
        </p>
        <div className="flex items-end justify-between gap-2 mb-3">
          <h3 className="text-2xl xl:text-3xl font-black text-slate-800 tracking-tight shrink-0">
            {value}
          </h3>

          {/* Mini Sparkline Chart */}
          {sparklineData && (
            <div className="w-16 h-8 opacity-50 group-hover:opacity-100 transition-opacity shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={sparklineData}>
                  <defs>
                    <linearGradient
                      id={`gradient-${id.replace(/:/g, "")}`}
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor={style.chart}
                        stopOpacity={0.3}
                      />
                      <stop
                        offset="95%"
                        stopColor={style.chart}
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke={style.chart}
                    strokeWidth={2}
                    fillOpacity={1}
                    fill={`url(#gradient-${id.replace(/:/g, "")})`}
                    isAnimationActive={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {(subValue || subLabel) && (
          <div className="flex items-center justify-between pt-3 border-t border-slate-50 mt-auto">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter shrink-0">
              {subLabel}
            </span>
            <span className="text-xs xl:text-sm font-black text-slate-700 shrink-0 text-right">
              {subValue}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
