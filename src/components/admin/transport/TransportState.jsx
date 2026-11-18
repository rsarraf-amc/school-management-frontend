import React from "react";
import { AlertCircle, Loader2 } from "lucide-react";

export const inputClass =
  "w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-slate-500/20";

export function LoadState({ loading, error }) {
  if (loading) {
    return (
      <div className="flex items-center gap-2 px-6 py-4 text-sm text-slate-500">
        <Loader2 size={16} className="animate-spin" /> Loading...
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex items-center gap-2 px-6 py-4 text-sm text-rose-600">
        <AlertCircle size={16} /> {error}
      </div>
    );
  }
  return null;
}

export function FormMessage({ error }) {
  if (!error) return null;
  return <p className="text-xs font-medium text-rose-600">{error}</p>;
}
