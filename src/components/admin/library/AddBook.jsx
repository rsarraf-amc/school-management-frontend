import React, { useState } from "react";
import { BookOpen, Save } from "lucide-react";
import useAsync from "../../../hooks/useAsync";
import { apiService } from "../../../services/apiService";
import { inputClass, labelClass, Notice, errorMessage } from "../exam/ModuleState";

const emptyForm = { title: "", isbn: "", author: "", category: "", totalCopies: 1 };

const AddBook = () => {
  const { data: books } = useAsync(() => apiService.library.books.list(), []);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  const categories = [...new Set((books || []).map((b) => b.category).filter(Boolean))];
  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      await apiService.library.books.create({
        title: form.title.trim(),
        isbn: form.isbn.trim() || undefined,
        author: form.author.trim() || undefined,
        category: form.category.trim() || undefined,
        totalCopies: Number(form.totalCopies),
      });
      setForm(emptyForm);
      setMessage({ tone: "success", text: "Book saved." });
    } catch (err) {
      setMessage({ tone: "error", text: errorMessage(err) });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden max-w-4xl mx-auto">
      <div className="p-6 border-b border-slate-100 flex items-center gap-2 bg-indigo-50/30">
        <BookOpen size={20} className="text-indigo-600" />
        <h3 className="font-black text-slate-900 tracking-tight">Add New Book</h3>
      </div>

      <form className="p-8 space-y-8" onSubmit={submit}>
        {message && <Notice tone={message.tone}>{message.text}</Notice>}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className={labelClass}>Book Title *</label>
            <input required type="text" className={inputClass} value={form.title} onChange={set("title")} />
          </div>
          <div className="space-y-2">
            <label className={labelClass}>ISBN</label>
            <input type="text" className={inputClass} value={form.isbn} onChange={set("isbn")} />
          </div>
          <div className="space-y-2">
            <label className={labelClass}>Author</label>
            <input type="text" className={inputClass} value={form.author} onChange={set("author")} />
          </div>
          <div className="space-y-2">
            <label className={labelClass}>Category</label>
            <input type="text" list="book-categories" className={inputClass} value={form.category} onChange={set("category")} />
            <datalist id="book-categories">
              {categories.map((c) => <option key={c} value={c} />)}
            </datalist>
          </div>
          <div className="space-y-2">
            <label className={labelClass}>Quantity *</label>
            <input required type="number" min="1" className={inputClass} value={form.totalCopies} onChange={set("totalCopies")} />
          </div>
        </div>

        <div className="pt-6 border-t border-slate-100 flex justify-end">
          <button type="submit" disabled={saving} className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all text-sm shadow-lg shadow-indigo-100 flex items-center gap-2 disabled:opacity-60">
            <Save size={18} /> {saving ? "Saving..." : "Save Book"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddBook;
