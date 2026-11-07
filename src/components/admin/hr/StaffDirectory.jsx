import React, { useState } from "react";
import { Search, Trash2, Mail, Phone, Eye } from "lucide-react";
import DataTable from "../../ui/DataTable";
import FilterBar from "../../ui/FilterBar";
import FilterItem from "../../ui/FilterItem";
import useApiData from "../../../hooks/useApiData";
import { employeesApi, departmentsApi, designationsApi } from "../../../services/api";
import { employeeFromApi, departmentFromApi, designationFromApi } from "../../../utils/mappers";

const StaffDirectory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [viewMode, setViewMode] = useState("card"); // 'card' or 'list'
  const [actionError, setActionError] = useState("");

  const { data, loading, error, reload } = useApiData(
    async () => {
      const [employees, departments, designations] = await Promise.all([
        employeesApi.list(),
        departmentsApi.list(),
        designationsApi.list(),
      ]);
      return {
        staff: employees.map(employeeFromApi),
        departments: departments.map(departmentFromApi),
        designations: designations.map(designationFromApi),
      };
    },
    [],
    { staff: [], departments: [], designations: [] }
  );

  const nameOf = (list, id) => list.find((item) => item.id === id)?.name ?? "-";
  const staffList = data.staff.map((s) => ({
    ...s,
    department: nameOf(data.departments, s.departmentId),
    designation: nameOf(data.designations, s.designationId),
    role: s.roleId != null ? `Role ${s.roleId}` : "-",
  }));

  const term = searchTerm.toLowerCase();
  const filteredStaff = staffList.filter((staff) => {
    const matchesSearch = (staff.name || "").toLowerCase().includes(term) || (staff.staffId || "").toLowerCase().includes(term);
    const matchesDept = departmentFilter ? String(staff.departmentId) === departmentFilter : true;
    return matchesSearch && matchesDept;
  });

  const handleDelete = async (staff) => {
    if (!window.confirm(`Delete staff member "${staff.name}"?`)) return;
    setActionError("");
    try {
      await employeesApi.remove(staff.id);
      reload();
    } catch (err) {
      setActionError(err.message);
    }
  };

  const columns = [
    { header: "Staff ID", accessor: "staffId", render: (row) => <span className="font-bold text-slate-900">{row.staffId}</span> },
    { header: "Name", accessor: "name", render: (row) => <span className="font-bold text-slate-700">{row.name}</span> },
    { header: "Role", accessor: "role", render: (row) => <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded text-[10px] font-black uppercase">{row.role}</span> },
    { header: "Department", accessor: "department", render: (row) => <span className="text-slate-500 font-medium text-xs">{row.department}</span> },
    { header: "Designation", accessor: "designation", render: (row) => <span className="text-slate-500 font-medium text-xs">{row.designation}</span> },
    { header: "Contact", render: (row) => <span className="text-slate-500 font-medium text-xs">{row.phone}</span> },
  ];

  const actions = [
    { icon: Trash2, label: "Delete Staff", variant: "danger", onClick: handleDelete },
  ];

  return (
    <div className="space-y-6">
      <FilterBar title="Staff Directory" description="Search and filter the complete staff database." onFilter={() => {}} onReset={() => { setSearchTerm(""); setDepartmentFilter(""); }}>
        <FilterItem label="Search Staff">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input type="text" placeholder="Name or ID..." className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-indigo-500/20" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
        </FilterItem>
        <FilterItem label="Department">
           <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium appearance-none" value={departmentFilter} onChange={(e) => setDepartmentFilter(e.target.value)}>
              <option value="">All Departments</option>
              {data.departments.map(d => <option key={d.id} value={String(d.id)}>{d.name}</option>)}
           </select>
        </FilterItem>
      </FilterBar>

      <div className="flex justify-end gap-2 mb-4">
        <button onClick={() => setViewMode("card")} className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all border ${viewMode === "card" ? "bg-indigo-50 text-indigo-600 border-indigo-200" : "bg-white text-slate-500 border-slate-200"}`}>Card View</button>
        <button onClick={() => setViewMode("list")} className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all border ${viewMode === "list" ? "bg-indigo-50 text-indigo-600 border-indigo-200" : "bg-white text-slate-500 border-slate-200"}`}>List View</button>
      </div>

      {actionError && <p className="text-sm font-bold text-rose-600">{actionError}</p>}
      {loading && <p className="text-sm font-medium text-slate-500">Loading staff...</p>}
      {error && <p className="text-sm font-bold text-rose-600">{error}</p>}

      {!loading && !error && (viewMode === "list" ? (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          <DataTable columns={columns} data={filteredStaff} actions={actions} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredStaff.length === 0 && <p className="text-sm font-medium text-slate-500">No records found.</p>}
          {filteredStaff.map((staff) => (
            <div key={staff.id} className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden group hover:shadow-md transition-all">
               <div className="p-6 text-center space-y-4">
                  <div className="w-20 h-20 bg-indigo-100 text-indigo-600 rounded-full mx-auto flex items-center justify-center text-2xl font-black">
                     {(staff.name || "?").charAt(0)}
                  </div>
                  <div>
                     <h3 className="font-black text-slate-900 text-lg">{staff.name}</h3>
                     <p className="text-xs font-bold text-slate-500">{staff.designation}</p>
                     <p className="text-[10px] font-black uppercase text-indigo-600 tracking-widest mt-1 bg-indigo-50 inline-block px-2 py-0.5 rounded-md">{staff.staffId}</p>
                  </div>
                  <div className="pt-4 border-t border-slate-100 flex flex-col gap-2 text-left">
                     <p className="text-xs text-slate-500 flex items-center gap-2"><Phone size={14} className="text-slate-400" /> {staff.phone}</p>
                     <p className="text-xs text-slate-500 flex items-center gap-2"><Mail size={14} className="text-slate-400" /> <span className="truncate">{staff.email}</span></p>
                  </div>
               </div>
               <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-between">
                  <button className="text-xs font-bold text-slate-600 flex items-center gap-1 hover:text-indigo-600"><Eye size={16}/> Profile</button>
                  <button onClick={() => handleDelete(staff)} className="text-xs font-bold text-slate-600 flex items-center gap-1 hover:text-rose-600"><Trash2 size={16}/> Delete</button>
               </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default StaffDirectory;
