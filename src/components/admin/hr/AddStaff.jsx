import React, { useState } from "react";
import { User, DollarSign, Calendar, Save } from "lucide-react";
import useApiData from "../../../hooks/useApiData";
import { employeesApi, departmentsApi, designationsApi, shiftsApi } from "../../../services/api";
import { departmentFromApi, designationFromApi, shiftFromApi } from "../../../utils/mappers";

const inputClass = "w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-indigo-500/20";
const selectClass = "w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium appearance-none";
const labelClass = "text-xs font-black text-slate-500 uppercase tracking-widest ml-1";

const emptyForm = {
  employeeNumber: "", firstName: "", lastName: "", panNumber: "", roleId: "",
  departmentId: "", designationId: "", shiftId: "", gender: "Male", email: "",
  contactNumber: "", dateOfBirth: "", dateOfJoining: "",
  employmentType: "Permanent", basicPay: "", netAmount: "",
};

const required = [
  ["employeeNumber", "Staff ID"], ["firstName", "First Name"], ["lastName", "Last Name"], ["panNumber", "PAN Number"],
  ["roleId", "Role ID"], ["departmentId", "Department"], ["designationId", "Designation"], ["email", "Email"],
  ["contactNumber", "Phone"], ["dateOfBirth", "Date of Birth"], ["dateOfJoining", "Date of Joining"],
  ["basicPay", "Basic Salary"], ["netAmount", "Net Amount"],
];

const AddStaff = () => {
  const [activeTab, setActiveTab] = useState("basic");
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [actionError, setActionError] = useState("");
  const [success, setSuccess] = useState("");

  const { data: lookups, loading, error } = useApiData(
    async () => {
      const [departments, designations, shifts] = await Promise.all([
        departmentsApi.list(), designationsApi.list(), shiftsApi.list(),
      ]);
      return {
        departments: departments.map(departmentFromApi),
        designations: designations.map(designationFromApi),
        shifts: shifts.map(shiftFromApi),
      };
    },
    [],
    { departments: [], designations: [], shifts: [] }
  );

  const setField = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setActionError("");
    setSuccess("");
    const missing = required.find(([key]) => String(form[key]).trim() === "");
    if (missing) {
      setActionError(`${missing[1]} is required`);
      setActiveTab(["basicPay", "netAmount"].includes(missing[0]) ? "payroll" : "basic");
      return;
    }
    setSaving(true);
    try {
      await employeesApi.create({
        employeeNumber: form.employeeNumber.trim(),
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        panNumber: form.panNumber.trim(),
        roleId: Number(form.roleId),
        departmentId: Number(form.departmentId),
        designationId: Number(form.designationId),
        shiftId: form.shiftId ? Number(form.shiftId) : undefined,
        gender: form.gender,
        email: form.email.trim(),
        contactNumber: form.contactNumber.trim(),
        dateOfBirth: form.dateOfBirth,
        dateOfJoining: form.dateOfJoining,
        employmentType: form.employmentType,
        basicPay: Number(form.basicPay),
        netAmount: Number(form.netAmount),
      });
      setForm(emptyForm);
      setActiveTab("basic");
      setSuccess("Staff member saved.");
    } catch (err) {
      setActionError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="flex border-b border-slate-100 overflow-x-auto">
         <button type="button" onClick={() => setActiveTab("basic")} className={`px-6 py-4 text-sm font-black uppercase tracking-widest whitespace-nowrap transition-all border-b-2 ${activeTab === "basic" ? "text-indigo-600 border-indigo-600" : "text-slate-500 border-transparent hover:text-slate-700 hover:border-slate-300"}`}>Basic Details</button>
         <button type="button" onClick={() => setActiveTab("payroll")} className={`px-6 py-4 text-sm font-black uppercase tracking-widest whitespace-nowrap transition-all border-b-2 ${activeTab === "payroll" ? "text-indigo-600 border-indigo-600" : "text-slate-500 border-transparent hover:text-slate-700 hover:border-slate-300"}`}>Payroll Details</button>
         <button type="button" onClick={() => setActiveTab("leaves")} className={`px-6 py-4 text-sm font-black uppercase tracking-widest whitespace-nowrap transition-all border-b-2 ${activeTab === "leaves" ? "text-indigo-600 border-indigo-600" : "text-slate-500 border-transparent hover:text-slate-700 hover:border-slate-300"}`}>Leaves</button>
      </div>

      <div className="p-8">
         {loading && <p className="text-sm font-medium text-slate-500 mb-4">Loading departments, designations and shifts...</p>}
         {error && <p className="text-sm font-bold text-rose-600 mb-4">{error}</p>}
         <form className="space-y-8" onSubmit={handleSubmit}>

            {activeTab === "basic" && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center gap-2 mb-6 text-indigo-600">
                   <User size={20} />
                   <h3 className="text-lg font-black tracking-tight">Basic Information</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                   <div className="space-y-2">
                      <label className={labelClass}>Staff ID *</label>
                      <input type="text" placeholder="e.g. EMP-004" value={form.employeeNumber} onChange={setField("employeeNumber")} className={inputClass} />
                   </div>
                   <div className="space-y-2">
                      <label className={labelClass}>First Name *</label>
                      <input type="text" value={form.firstName} onChange={setField("firstName")} className={inputClass} />
                   </div>
                   <div className="space-y-2">
                      <label className={labelClass}>Last Name *</label>
                      <input type="text" value={form.lastName} onChange={setField("lastName")} className={inputClass} />
                   </div>
                   <div className="space-y-2">
                      <label className={labelClass}>PAN Number *</label>
                      <input type="text" placeholder="ABCDE1234F" value={form.panNumber} onChange={setField("panNumber")} className={inputClass} />
                   </div>
                   <div className="space-y-2">
                      <label className={labelClass}>Role ID *</label>
                      <input type="number" min="1" value={form.roleId} onChange={setField("roleId")} className={inputClass} />
                   </div>
                   <div className="space-y-2">
                      <label className={labelClass}>Department *</label>
                      <select value={form.departmentId} onChange={setField("departmentId")} className={selectClass}>
                         <option value="">Select Department</option>
                         {lookups.departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                      </select>
                   </div>
                   <div className="space-y-2">
                      <label className={labelClass}>Designation *</label>
                      <select value={form.designationId} onChange={setField("designationId")} className={selectClass}>
                         <option value="">Select Designation</option>
                         {lookups.designations.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                      </select>
                   </div>
                   <div className="space-y-2">
                      <label className={labelClass}>Shift</label>
                      <select value={form.shiftId} onChange={setField("shiftId")} className={selectClass}>
                         <option value="">No Shift</option>
                         {lookups.shifts.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                      </select>
                   </div>
                   <div className="space-y-2">
                      <label className={labelClass}>Email *</label>
                      <input type="email" value={form.email} onChange={setField("email")} className={inputClass} />
                   </div>
                   <div className="space-y-2">
                      <label className={labelClass}>Phone *</label>
                      <input type="text" value={form.contactNumber} onChange={setField("contactNumber")} className={inputClass} />
                   </div>
                   <div className="space-y-2">
                      <label className={labelClass}>Date of Birth *</label>
                      <input type="date" value={form.dateOfBirth} onChange={setField("dateOfBirth")} className={inputClass} />
                   </div>
                   <div className="space-y-2">
                      <label className={labelClass}>Date of Joining *</label>
                      <input type="date" value={form.dateOfJoining} onChange={setField("dateOfJoining")} className={inputClass} />
                   </div>
                   <div className="space-y-2">
                      <label className={labelClass}>Gender *</label>
                      <select value={form.gender} onChange={setField("gender")} className={selectClass}>
                         <option value="Male">Male</option>
                         <option value="Female">Female</option>
                         <option value="Other">Other</option>
                      </select>
                   </div>
                </div>
              </div>
            )}

            {activeTab === "payroll" && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center gap-2 mb-6 text-indigo-600">
                   <DollarSign size={20} />
                   <h3 className="text-lg font-black tracking-tight">Payroll Information</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="space-y-2">
                      <label className={labelClass}>Basic Salary *</label>
                      <input type="number" min="0" value={form.basicPay} onChange={setField("basicPay")} className={inputClass} />
                   </div>
                   <div className="space-y-2">
                      <label className={labelClass}>Net Amount *</label>
                      <input type="number" min="0" value={form.netAmount} onChange={setField("netAmount")} className={inputClass} />
                   </div>
                   <div className="space-y-2">
                      <label className={labelClass}>Contract Type *</label>
                      <select value={form.employmentType} onChange={setField("employmentType")} className={selectClass}>
                         <option value="Permanent">Permanent</option>
                         <option value="Contract">Contract</option>
                         <option value="Temporary">Temporary</option>
                      </select>
                   </div>
                </div>
              </div>
            )}

            {activeTab === "leaves" && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center gap-2 mb-6 text-indigo-600">
                   <Calendar size={20} />
                   <h3 className="text-lg font-black tracking-tight">Leave Allocations</h3>
                </div>
                <p className="mb-6 text-xs font-bold text-amber-600 bg-amber-50 rounded-xl px-3 py-2 inline-block">Not yet supported by the backend. These values are not saved.</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                   <div className="space-y-2">
                      <label className={labelClass}>Medical Leaves</label>
                      <input type="number" defaultValue={10} disabled className={`${inputClass} disabled:opacity-60`} />
                   </div>
                   <div className="space-y-2">
                      <label className={labelClass}>Casual Leaves</label>
                      <input type="number" defaultValue={12} disabled className={`${inputClass} disabled:opacity-60`} />
                   </div>
                   <div className="space-y-2">
                      <label className={labelClass}>Maternity/Paternity Leaves</label>
                      <input type="number" defaultValue={0} disabled className={`${inputClass} disabled:opacity-60`} />
                   </div>
                </div>
              </div>
            )}

            {actionError && <p className="text-sm font-bold text-rose-600">{actionError}</p>}
            {success && <p className="text-sm font-bold text-emerald-600">{success}</p>}

            <div className="pt-6 border-t border-slate-100 flex justify-end">
               <button type="submit" disabled={saving} className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all text-sm shadow-lg shadow-indigo-100 flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed">
                  <Save size={18} /> {saving ? "Saving..." : "Save Staff Member"}
               </button>
            </div>
         </form>
      </div>
    </div>
  );
};

export default AddStaff;
