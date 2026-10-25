import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Filter,
  AlertTriangle,
  IndianRupee,
  ArrowRight,
  Clock,
  FileText,
  Download,
} from "lucide-react";

export default function SearchFeesDue() {
  const navigate = useNavigate();
  const students = [
    {
      id: 1,
      name: "Rahul Sharma",
      admissionNo: "ADM001",
      class: "Class 1",
      group: "Monthly Fees",
      amount: "5000",
      deposit: "2500",
      discount: "0",
      fine: "0",
      balance: "2500",
    },
    {
      id: 2,
      name: "Sneha Kapur",
      admissionNo: "ADM042",
      class: "Class 1",
      group: "Admission Fees",
      amount: "15000",
      deposit: "0",
      discount: "1000",
      fine: "0",
      balance: "14000",
    },
    {
      id: 3,
      name: "Arjun Singh",
      admissionNo: "ADM105",
      class: "Class 2",
      group: "Monthly Fees",
      amount: "2500",
      deposit: "0",
      discount: "0",
      fine: "100",
      balance: "2600",
    },
    {
      id: 4,
      name: "Ishita Roy",
      admissionNo: "ADM089",
      class: "Class 1",
      group: "Exam Fees",
      amount: "500",
      deposit: "0",
      discount: "0",
      fine: "0",
      balance: "500",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Filter Card */}
      <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-amber-50 rounded-full blur-3xl opacity-50 -z-0"></div>

        <div className="flex items-center gap-4 mb-8 relative z-10">
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center">
            <AlertTriangle size={24} />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-800 tracking-tight">
              Search Fees Due
            </h2>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-0.5">
              Filter students with outstanding balances
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-end relative z-10 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="space-y-2 flex-1">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">
              Fees Group
            </label>
            <select className="w-full bg-slate-50 border-none rounded-2xl px-4 py-2.5 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-amber-500/20 transition-all appearance-none cursor-pointer">
              <option value="">Select Group</option>
              <option>Monthly Fees</option>
              <option>Admission Fees</option>
              <option>Exam Fees</option>
            </select>
          </div>
          <div className="space-y-2 flex-1">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">
              Class
            </label>
            <select className="w-full bg-slate-50 border-none rounded-2xl px-4 py-2.5 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-amber-500/20 transition-all appearance-none cursor-pointer">
              <option value="">Select Class</option>
              <option>Class 1</option>
              <option>Class 2</option>
            </select>
          </div>
          <div className="space-y-2 flex-1">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">
              Section
            </label>
            <select className="w-full bg-slate-50 border-none rounded-2xl px-4 py-2.5 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-amber-500/20 transition-all appearance-none cursor-pointer">
              <option value="">Select Section</option>
              <option>A</option>
              <option>B</option>
            </select>
          </div>
          <button className="bg-slate-900 text-white h-[44px] px-8 rounded-2xl font-black text-sm flex items-center justify-center gap-3 hover:bg-amber-600 transition-all shadow-lg active:scale-95 group">
            <Search size={18} />
            Search Due
            <ArrowRight
              size={18}
              className="group-hover:translate-x-1 transition-transform"
            />
          </button>
        </div>
      </div>

      {/* Due List Table */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-8 py-6 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/30">
          <div className="flex items-center gap-3">
            <div className="px-3 py-1 bg-rose-50 text-rose-600 rounded-lg text-[10px] font-black uppercase tracking-widest border border-rose-100">
              Found 4 Defaulters
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="p-2.5 bg-white border border-slate-100 text-slate-400 hover:text-indigo-600 rounded-xl transition-all shadow-sm">
              <Download size={18} />
            </button>
            <button className="p-2.5 bg-white border border-slate-100 text-slate-400 hover:text-indigo-600 rounded-xl transition-all shadow-sm">
              <FileText size={18} />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gradient-to-r from-slate-50 to-slate-100">
              <tr className="border-b border-slate-200 text-xs font-bold uppercase text-slate-700 tracking-wider">
                <th className="px-8 py-4 text-left">Student</th>
                <th className="px-8 py-4 text-left">Admission No</th>
                <th className="px-8 py-4 text-left">Fees Group</th>
                <th className="px-8 py-4 text-left">Total Amount</th>
                <th className="px-8 py-4 text-left">Paid</th>
                <th className="px-8 py-4 text-left">Balance</th>
                <th className="px-8 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {students.map((student) => (
                <tr
                  key={student.id}
                  className="group hover:bg-slate-50 transition-all duration-200"
                >
                  <td className="px-8 py-4 text-sm font-normal text-slate-900">
                    {student.name}
                  </td>
                  <td className="px-8 py-4 text-sm font-normal text-slate-700">
                    {student.admissionNo}
                  </td>
                  <td className="px-8 py-4">
                    <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-black rounded-lg uppercase tracking-widest">
                      {student.group}
                    </span>
                  </td>
                  <td className="px-8 py-4 text-sm font-normal text-slate-700">
                    ₹{student.amount}
                  </td>
                  <td className="px-8 py-4 text-sm font-normal text-emerald-600">
                    ₹{student.deposit}
                  </td>
                  <td className="px-8 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-normal text-rose-600">
                        ₹{student.balance}
                      </span>
                      <span className="text-[9px] font-black text-slate-400 uppercase mt-0.5 flex items-center gap-1">
                        <Clock size={10} />
                        Overdue
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-4 text-right">
                    <button
                      onClick={() =>
                        navigate(`/admin/fees/collect/${student.id}`)
                      }
                      className="bg-slate-50 text-slate-600 hover:bg-emerald-600 hover:text-white px-4 py-2 rounded-xl text-xs font-black transition-all shadow-sm border border-slate-100 hover:border-emerald-500"
                    >
                      Collect
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
