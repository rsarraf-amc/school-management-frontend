import { useState } from "react";
import { Plus, Edit2, Trash2, Search, Filter, Tag } from "lucide-react";
import SlideOver from "../../ui/SlideOver";
import useApiData from "../../../hooks/useApiData";
import { feesApi } from "../../../services/api";
import { feeTypeFromApi } from "../../../utils/mappers";

const FREQUENCIES = ["monthly", "term", "annual", "one-time"];
const emptyForm = {
  name: "",
  description: "",
  amount: "",
  frequency: "monthly",
};

export default function FeesType() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const { data, loading, error, reload } = useApiData(
    async () => (await feesApi.listTypes()).map(feeTypeFromApi),
    [],
    [],
  );

  const types = (data || []).filter((t) =>
    `${t.name} ${t.description || ""}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  const closeForm = () => {
    setIsFormOpen(false);
    setFormError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFormError("");
    try {
      await feesApi.createType({
        name: form.name.trim(),
        description: form.description.trim(),
        amount: Number(form.amount),
        frequency: form.frequency,
      });
      setForm(emptyForm);
      setIsFormOpen(false);
      reload();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 relative">
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
                placeholder="Search types..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-slate-50 border-none rounded-2xl pl-12 pr-4 py-3 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-rose-500/20 transition-all"
              />
            </div>

            <button className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-50 rounded-xl transition-all">
              <Filter size={18} />
              Filter
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gradient-to-r from-slate-50 to-slate-100">
                <tr className="border-b border-slate-200 text-xs font-bold uppercase text-slate-700 tracking-wider">
                  <th className="px-4 py-4">Name</th>
                  <th className="px-4 py-4">Amount</th>
                  <th className="px-4 py-4">Frequency</th>
                  <th className="px-4 py-4">Description</th>
                  <th className="px-4 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading && (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-4 py-8 text-center text-sm text-slate-400"
                    >
                      Loading fee types...
                    </td>
                  </tr>
                )}
                {error && !loading && (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-4 py-8 text-center text-sm text-rose-600"
                    >
                      {error}{" "}
                      <button
                        type="button"
                        onClick={reload}
                        className="font-bold underline"
                      >
                        Retry
                      </button>
                    </td>
                  </tr>
                )}
                {!loading && !error && types.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-4 py-8 text-center text-sm text-slate-400"
                    >
                      No fee types found.
                    </td>
                  </tr>
                )}
                {types.map((type) => (
                  <tr
                    key={type.id}
                    className="group hover:bg-slate-50 transition-all duration-200"
                  >
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-slate-50 text-slate-400 rounded-lg flex items-center justify-center group-hover:bg-rose-50 group-hover:text-rose-500 transition-colors">
                          <Tag size={14} />
                        </div>
                        <span className="text-sm font-normal text-slate-700">
                          {type.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm font-normal text-slate-700">
                      ₹{type.amount}
                    </td>
                    <td className="px-4 py-4">
                      <span className="px-3 py-1 bg-slate-100 text-slate-600 text-[10px] font-black rounded-lg uppercase tracking-widest group-hover:bg-rose-50 group-hover:text-rose-600">
                        {type.frequency}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm font-normal text-slate-600 max-w-xs truncate">
                      {type.description}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          disabled
                          title="Editing is not supported by the backend yet"
                          className="p-2 rounded-xl text-slate-300 cursor-not-allowed"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          disabled
                          title="Deleting is not supported by the backend yet"
                          className="p-2 rounded-xl text-slate-300 cursor-not-allowed"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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

      <SlideOver isOpen={isFormOpen} onClose={closeForm} title="Add Fee Type">
        <form className="space-y-6" onSubmit={handleSubmit}>
          {formError && (
            <div className="rounded-2xl bg-rose-50 px-4 py-3 text-sm font-bold text-rose-600">
              {formError}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">
              Type Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Activity Fee"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-rose-500/20 transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">
              Frequency
            </label>
            <select
              value={form.frequency}
              onChange={(e) => setForm({ ...form, frequency: e.target.value })}
              className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-rose-500/20 transition-all appearance-none cursor-pointer"
            >
              {FREQUENCIES.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">
              Amount (₹)
            </label>
            <input
              type="number"
              min="0.01"
              step="0.01"
              required
              placeholder="0.00"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-rose-500/20 transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">
              Description
            </label>
            <textarea
              placeholder="Details..."
              rows={3}
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-rose-500/20 transition-all resize-none"
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-rose-600 text-white py-4 rounded-2xl font-black text-sm hover:bg-rose-700 transition-all active:scale-95 shadow-lg shadow-rose-600/20 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Fee Type"}
          </button>
        </form>
      </SlideOver>
    </div>
  );
}
