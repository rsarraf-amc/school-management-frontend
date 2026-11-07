import { useEffect, useMemo, useState } from "react";
import { Plus, Search, Tag } from "lucide-react";
import SlideOver from "../../ui/SlideOver";
import { apiService } from "../../../services/apiService";

const frequencies = ["monthly", "term", "annual", "one-time"];
const emptyFeeType = { name: "", amount: "", frequency: "", description: "" };

export default function FeesType() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [feeTypes, setFeeTypes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState(emptyFeeType);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    apiService
      .getFeeTypes()
      .then((records) => {
        if (active) setFeeTypes(records);
      })
      .catch((requestError) => {
        if (active) setError(requestError.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const filteredFeeTypes = useMemo(() => {
    const query = searchTerm.toLowerCase();
    return feeTypes.filter((feeType) =>
      [feeType.name, feeType.frequency, feeType.description]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(query)),
    );
  }, [feeTypes, searchTerm]);

  const updateField = (event) => {
    setFormData((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };

  const saveFeeType = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      const createdFeeType = await apiService.createFeeType({
        ...formData,
        amount: Number(formData.amount),
      });
      setFeeTypes((records) => [...records, createdFeeType]);
      setFormData(emptyFeeType);
      setIsFormOpen(false);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 relative">
      {error && (
        <p role="alert" className="rounded-xl bg-rose-50 p-4 text-sm font-medium text-rose-700">
          {error}
        </p>
      )}
      <div className="flex-1 space-y-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div className="relative flex-1 max-w-md">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                placeholder="Search fee types..."
                className="w-full bg-slate-50 border-none rounded-2xl pl-12 pr-4 py-3 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-rose-500/20 transition-all"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gradient-to-r from-slate-50 to-slate-100">
                <tr className="border-b border-slate-200 text-xs font-bold uppercase text-slate-700 tracking-wider">
                  <th className="px-4 py-4">Name</th>
                  <th className="px-4 py-4">Amount</th>
                  <th className="px-4 py-4">Frequency</th>
                  <th className="px-4 py-4">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredFeeTypes.map((feeType) => (
                  <tr key={feeType.id} className="group hover:bg-slate-50 transition-all duration-200">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-slate-50 text-slate-400 rounded-lg flex items-center justify-center group-hover:bg-rose-50 group-hover:text-rose-500 transition-colors">
                          <Tag size={14} />
                        </div>
                        <span className="text-sm font-normal text-slate-700">{feeType.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm font-normal text-slate-700">₹{feeType.amount}</td>
                    <td className="px-4 py-4 text-sm font-normal capitalize text-slate-700">{feeType.frequency}</td>
                    <td className="px-4 py-4 text-sm font-normal text-slate-600 max-w-xs truncate">{feeType.description}</td>
                  </tr>
                ))}
                {!loading && !error && filteredFeeTypes.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-sm text-slate-500">
                      {searchTerm ? "No fee types match your search." : "No fee types have been configured."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            {loading && <p className="p-5 text-sm text-slate-500">Loading fee types...</p>}
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setIsFormOpen(true)}
        className="fixed right-6 bottom-6 z-50 inline-flex items-center justify-center rounded-full bg-rose-600 text-white shadow-2xl shadow-rose-600/20 w-14 h-14 hover:bg-rose-700 transition-colors"
        aria-label="Add Fee Type"
      >
        <Plus size={24} />
      </button>

      <SlideOver
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title="Add Fee Type"
      >
        <form className="space-y-6" onSubmit={saveFeeType}>
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">
              Type Name
            </label>
            <input
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={updateField}
              placeholder="e.g. Activity Fee"
              className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-rose-500/20 transition-all"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">
              Amount
            </label>
            <input
              name="amount"
              type="number"
              min="0.01"
              step="0.01"
              required
              value={formData.amount}
              onChange={updateField}
              className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-rose-500/20 transition-all"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">
              Frequency
            </label>
            <select
              name="frequency"
              required
              value={formData.frequency}
              onChange={updateField}
              className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-rose-500/20 transition-all appearance-none cursor-pointer"
            >
              <option value="">Select frequency</option>
              {frequencies.map((frequency) => (
                <option key={frequency} value={frequency}>{frequency}</option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={updateField}
              placeholder="Details..."
              rows={3}
              className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-rose-500/20 transition-all resize-none"
            />
          </div>
          <button
            disabled={saving}
            className="w-full bg-rose-600 text-white py-4 rounded-2xl font-black text-sm hover:bg-rose-700 transition-all active:scale-95 shadow-lg shadow-rose-600/20 disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save Fee Type"}
          </button>
        </form>
      </SlideOver>
    </div>
  );
}
