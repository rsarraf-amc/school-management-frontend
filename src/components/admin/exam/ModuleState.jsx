import React from "react";
import { AlertCircle, Info } from "lucide-react";

export const inputClass =
  "w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-indigo-500/20";
export const labelClass =
  "text-xs font-black text-slate-500 uppercase tracking-widest ml-1";

export const errorMessage = (error) => error?.message || String(error || "Request failed");

export function LoadState({ loading, error, onRetry }) {
  if (loading) {
    return <div className="p-8 text-center text-sm font-medium text-slate-500">Loading...</div>;
  }
  if (error) {
    return (
      <div className="m-4 flex items-center justify-between gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm font-medium text-rose-700">
        <span className="flex items-center gap-2"><AlertCircle size={16} /> {error}</span>
        {onRetry && (
          <button type="button" onClick={onRetry} className="font-bold underline">Retry</button>
        )}
      </div>
    );
  }
  return null;
}

export function EmptyState({ children = "No records found." }) {
  return <div className="p-8 text-center text-sm font-medium text-slate-400">{children}</div>;
}

export function Notice({ tone = "info", children }) {
  const tones = {
    info: "border-amber-200 bg-amber-50 text-amber-700",
    error: "border-rose-200 bg-rose-50 text-rose-700",
    success: "border-emerald-200 bg-emerald-50 text-emerald-700",
  };
  return (
    <div className={`flex items-center gap-2 rounded-2xl border p-3 text-xs font-bold ${tones[tone]}`}>
      <Info size={14} /> {children}
    </div>
  );
}

export function NotConnected({ what }) {
  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-6 border-b border-slate-100 bg-slate-50/30">
        <h3 className="font-black text-slate-900 tracking-tight">{what}</h3>
      </div>
      <div className="p-6 space-y-4">
        <Notice>Not connected to backend yet.</Notice>
        <EmptyState>No data available.</EmptyState>
      </div>
    </div>
  );
}
