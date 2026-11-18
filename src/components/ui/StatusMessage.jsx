export default function StatusMessage({ loading, error, empty, emptyText = "No records found." }) {
  if (loading) return <p className="p-6 text-sm font-medium text-slate-500">Loading...</p>;
  if (error) return <p className="p-6 text-sm font-bold text-rose-600">{error}</p>;
  if (empty) return <p className="p-6 text-sm font-medium text-slate-400">{emptyText}</p>;
  return null;
}
