import React, { useState } from "react";
import { Clock, Plus, Search, Calendar, Edit, Trash2 } from "lucide-react";
import FilterBar from "../../ui/FilterBar";
import FilterItem from "../../ui/FilterItem";
import { timetableData } from "../../../mock/academicsData";

const TimeTableManagement = () => {
  const [selectedClass, setSelectedClass] = useState("");

  return (
    <div className="space-y-6">
      <FilterBar title="Timetable Viewer" description="Select class and section to view or manage the weekly schedule." onFilter={() => {}} onReset={() => {}}>
        <FilterItem label="Class">
          <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium appearance-none">
            <option value="10">Class 10</option>
          </select>
        </FilterItem>
        <FilterItem label="Section">
          <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium appearance-none">
            <option value="A">Section A</option>
          </select>
        </FilterItem>
      </FilterBar>

      <div className="grid gap-6">
        {timetableData.map((dayData) => (
          <div key={dayData.day} className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <h4 className="font-black text-slate-900 tracking-tight flex items-center gap-2">
                <Calendar size={18} className="text-indigo-600" />
                {dayData.day}
              </h4>
              <button className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
                <Plus size={14} /> Add Period
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {dayData.periods.map((period, idx) => (
                  <div key={idx} className={`p-4 rounded-2xl border ${period.subject === "Break" ? 'bg-slate-50 border-slate-200' : 'bg-indigo-50/50 border-indigo-100'} group relative`}>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{period.time}</p>
                    <p className="font-bold text-slate-900">{period.subject}</p>
                    <p className="text-xs text-slate-500 font-medium">{period.teacher}</p>
                    
                    {period.subject !== "Break" && (
                      <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                        <button className="p-1.5 bg-white rounded-lg border border-slate-200 text-slate-400 hover:text-indigo-600 shadow-sm"><Edit size={12} /></button>
                        <button className="p-1.5 bg-white rounded-lg border border-slate-200 text-slate-400 hover:text-rose-600 shadow-sm"><Trash2 size={12} /></button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TimeTableManagement;
