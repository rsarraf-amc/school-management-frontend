import { Info } from "lucide-react";

export default function NotConnectedNotice({
  message = "Not connected to backend yet. Nothing entered here will be saved.",
}) {
  return (
    <div className="flex items-center gap-2 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs font-bold text-amber-700">
      <Info size={16} />
      {message}
    </div>
  );
}
