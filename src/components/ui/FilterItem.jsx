export default function FilterItem({ label, children, className = "" }) {
  return (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">
          {label}
        </label>
      )}
      {children}
    </div>
  );
}
