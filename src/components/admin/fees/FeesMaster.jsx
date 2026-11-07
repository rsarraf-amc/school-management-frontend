import { useState } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  Filter,
  Calendar,
  IndianRupee,
  AlertCircle,
  Bookmark,
  Clock,
} from "lucide-react";
import FilterBar from "../../ui/FilterBar";
import FilterItem from "../../ui/FilterItem";
import SlideOver from "../../ui/SlideOver";
import useApiData from "../../../hooks/useApiData";
import { feesApi } from "../../../services/api";
import { feeTypeFromApi } from "../../../utils/mappers";

const emptyAssign = {
  studentId: "",
  feeTypeId: "",
  session: "",
  customAmount: "",
};

export default function FeesMaster() {
  const [activeTab, setActiveTab] = useState("All");
  const [filters, setFilters] = useState({
    search: "",
    group: "All",
    minAmount: "",
    maxAmount: "",
  });
  const [filteredData, setFilteredData] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [assignForm, setAssignForm] = useState(emptyAssign);
  const [assigning, setAssigning] = useState(false);
  const [assignError, setAssignError] = useState("");
  const [assignSuccess, setAssignSuccess] = useState("");

  const {
    data: feeTypes,
    loading: typesLoading,
    error: typesError,
    reload: reloadTypes,
  } = useApiData(
    async () => (await feesApi.listTypes()).map(feeTypeFromApi),
    [],
    [],
  );

  const handleAssign = async (e) => {
    e.preventDefault();
    setAssigning(true);
    setAssignError("");
    setAssignSuccess("");
    try {
      const body = {
        studentId: assignForm.studentId.trim(),
        feeTypeId: Number(assignForm.feeTypeId),
        session: assignForm.session.trim(),
      };
      if (assignForm.customAmount !== "") {
        body.customAmount = Number(assignForm.customAmount);
      }
      await feesApi.assign(body);
      setAssignSuccess("Fee assigned successfully.");
      setAssignForm({ ...assignForm, studentId: "", customAmount: "" });
      reloadTypes();
    } catch (err) {
      setAssignError(err.message);
    } finally {
      setAssigning(false);
    }
  };

  const classes = [
    "All",
    "Class 1",
    "Class 2",
    "Class 3",
    "Class 4",
    "Class 5",
  ];

  const fees = [
    {
      id: 1,
      group: "Monthly Fees",
      type: "January Tuition",
      amount: "2500",
      dueDate: "10 Jan 2024",
      fine: "Fixed (100)",
      class: "Class 1",
    },
    {
      id: 2,
      group: "Admission Fees",
      type: "Admission 2024",
      amount: "15000",
      dueDate: "31 Mar 2024",
      fine: "Percentage (5%)",
      class: "Class 2",
    },
    {
      id: 3,
      group: "Monthly Fees",
      type: "February Tuition",
      amount: "2500",
      dueDate: "10 Feb 2024",
      fine: "None",
      class: "Class 1",
    },
    {
      id: 4,
      group: "Transport Fees",
      type: "Van Route A",
      amount: "1200",
      dueDate: "05 Jan 2024",
      fine: "Daily (10)",
      class: "Class 3",
    },
    {
      id: 5,
      group: "Exam Fees",
      type: "Quarterly Exam",
      amount: "500",
      dueDate: "20 Jan 2024",
      fine: "Fixed (50)",
      class: "Class 1",
    },
  ];

  const filteredFees =
    activeTab === "All" ? fees : fees.filter((f) => f.class === activeTab);

  const handleFilter = () => {
    let result = filteredFees;

    if (filters.search) {
      result = result.filter(
        (f) =>
          f.type.toLowerCase().includes(filters.search.toLowerCase()) ||
          f.group.toLowerCase().includes(filters.search.toLowerCase()),
      );
    }

    if (filters.group !== "All") {
      result = result.filter((f) => f.group === filters.group);
    }

    if (filters.minAmount) {
      result = result.filter(
        (f) => parseInt(f.amount) >= parseInt(filters.minAmount),
      );
    }

    if (filters.maxAmount) {
      result = result.filter(
        (f) => parseInt(f.amount) <= parseInt(filters.maxAmount),
      );
    }

    setFilteredData(result);
  };

  const handleReset = () => {
    setFilters({
      search: "",
      group: "All",
      minAmount: "",
      maxAmount: "",
    });
    setFilteredData(null);
  };

  const displayFees = filteredData !== null ? filteredData : filteredFees;

  return (
    <div className="space-y-6 relative">
      <div className="flex-1 space-y-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <p className="mb-4 rounded-xl bg-amber-50 px-4 py-2 text-xs font-bold text-amber-700">
            Sample data: the backend can't list fee assignments across students
            yet. Use the + button to assign a fee type to a student.
          </p>
          {/* Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-4 no-scrollbar mb-6 border-b border-slate-50">
            {classes.map((cls) => (
              <button
                key={cls}
                onClick={() => {
                  setActiveTab(cls);
                  setFilteredData(null);
                }}
                className={`flex-shrink-0 px-6 py-2 rounded-xl text-sm font-black transition-all ${
                  activeTab === cls
                    ? "bg-slate-900 text-white shadow-lg"
                    : "text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100"
                }`}
              >
                {cls}
              </button>
            ))}
          </div>

          {/* Filter Bar */}
          <div className="mb-8">
            <FilterBar
              title="Search & Filter Fees"
              description="Find fees by type, group, or amount range"
              onFilter={handleFilter}
              onReset={handleReset}
              icon={Search}
            >
              <FilterItem label="Fee Type / Group">
                <input
                  type="text"
                  placeholder="Search type or group..."
                  value={filters.search}
                  onChange={(e) =>
                    setFilters({ ...filters, search: e.target.value })
                  }
                  className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                />
              </FilterItem>

              <FilterItem label="Fee Group">
                <select
                  value={filters.group}
                  onChange={(e) =>
                    setFilters({ ...filters, group: e.target.value })
                  }
                  className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500/20 transition-all appearance-none cursor-pointer"
                >
                  <option value="All">All Groups</option>
                  <option>Monthly Fees</option>
                  <option>Admission Fees</option>
                  <option>Exam Fees</option>
                  <option>Transport Fees</option>
                </select>
              </FilterItem>

              <FilterItem label="Amount Range">
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.minAmount}
                    onChange={(e) =>
                      setFilters({ ...filters, minAmount: e.target.value })
                    }
                    className="w-1/2 bg-slate-50 border-none rounded-2xl px-4 py-3 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.maxAmount}
                    onChange={(e) =>
                      setFilters({ ...filters, maxAmount: e.target.value })
                    }
                    className="w-1/2 bg-slate-50 border-none rounded-2xl px-4 py-3 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                  />
                </div>
              </FilterItem>
            </FilterBar>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gradient-to-r from-slate-50 to-slate-100">
                <tr className="border-b border-slate-200 text-xs font-bold uppercase text-slate-700 tracking-wider">
                  <th className="px-4 py-4">Fee Group</th>
                  <th className="px-4 py-4">Fee Type</th>
                  <th className="px-4 py-4">Amount</th>
                  <th className="px-4 py-4">Due Date</th>
                  <th className="px-4 py-4">Fine Info</th>
                  <th className="px-4 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {displayFees.map((fee) => (
                  <tr
                    key={fee.id}
                    className="group hover:bg-slate-50 transition-all duration-200"
                  >
                    <td className="px-4 py-4 text-sm font-normal text-slate-900 flex items-center gap-3">
                      <div className="w-8 h-8 bg-indigo-50 text-indigo-500 rounded-lg flex items-center justify-center">
                        <Bookmark size={14} />
                      </div>
                      {fee.group}
                    </td>
                    <td className="px-4 py-4 text-sm font-normal text-slate-700">
                      {fee.type}
                    </td>
                    <td className="px-4 py-4 text-sm font-normal text-slate-900">
                      â‚¹{fee.amount}
                    </td>
                    <td className="px-4 py-4">
                      <span className="flex items-center gap-2 text-sm font-normal text-slate-700">
                        <Clock size={14} className="text-amber-500" />
                        {fee.dueDate}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      {fee.fine === "None" ? (
                        <span className="text-sm font-normal text-slate-400">
                          N/A
                        </span>
                      ) : (
                        <span className="flex items-center gap-2 text-rose-500 text-[10px] font-black uppercase tracking-widest px-2 py-1 bg-rose-50 rounded-lg">
                          <AlertCircle size={12} />
                          {fee.fine}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 hover:bg-white hover:text-blue-500 rounded-xl transition-all text-slate-400 shadow-sm border border-transparent hover:border-blue-100">
                          <Edit2 size={16} />
                        </button>
                        <button className="p-2 hover:bg-white hover:text-rose-500 rounded-xl transition-all text-slate-400 shadow-sm border border-transparent hover:border-rose-100">
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
        className="fixed right-6 bottom-6 z-50 inline-flex items-center justify-center rounded-full bg-indigo-600 text-white shadow-2xl shadow-indigo-600/20 w-14 h-14 hover:bg-indigo-700 transition-colors"
        aria-label="Add Fee Master"
      >
        <Plus size={24} />
      </button>

      <SlideOver
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title="Add Fee Master"
      >
        <form className="space-y-6" onSubmit={handleAssign}>
          {assignError && (
            <div className="rounded-2xl bg-rose-50 px-4 py-3 text-sm font-bold text-rose-600">
              {assignError}
            </div>
          )}
          {assignSuccess && (
            <div className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-600">
              {assignSuccess}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">
              Student ID (UUID)
            </label>
            <input
              type="text"
              required
              value={assignForm.studentId}
              onChange={(e) =>
                setAssignForm({ ...assignForm, studentId: e.target.value })
              }
              placeholder="e.g. 3f6c2c1e-5d3a-4d6e-9d5e-1c2b3a4d5e6f"
              className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500/20 transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">
              Fee Type
            </label>
            <select
              required
              value={assignForm.feeTypeId}
              onChange={(e) =>
                setAssignForm({ ...assignForm, feeTypeId: e.target.value })
              }
              className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500/20 transition-all appearance-none cursor-pointer"
            >
              <option value="">
                {typesLoading ? "Loading fee types..." : "Select Type"}
              </option>
              {(feeTypes || []).map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name} (â‚¹{t.amount})
                </option>
              ))}
            </select>
            {typesError && (
              <p className="text-xs font-bold text-rose-600 px-1">
                {typesError}{" "}
                <button
                  type="button"
                  onClick={reloadTypes}
                  className="underline"
                >
                  Retry
                </button>
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">
              Session
            </label>
            <input
              type="text"
              required
              value={assignForm.session}
              onChange={(e) =>
                setAssignForm({ ...assignForm, session: e.target.value })
              }
              placeholder="2025-2026"
              className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500/20 transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">
              Custom Amount (â‚¹, optional)
            </label>
            <div className="relative">
              <IndianRupee
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="number"
                min="0.01"
                step="0.01"
                placeholder="Defaults to fee type amount"
                value={assignForm.customAmount}
                onChange={(e) =>
                  setAssignForm({ ...assignForm, customAmount: e.target.value })
                }
                className="w-full bg-slate-50 border-none rounded-2xl pl-12 pr-4 py-3 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500/20 transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={assigning}
            className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black text-sm hover:bg-indigo-700 transition-all active:scale-95 shadow-lg shadow-indigo-600/20 disabled:opacity-50"
          >
            {assigning ? "Assigning..." : "Assign Fee"}
          </button>
        </form>
      </SlideOver>
    </div>
  );
}
