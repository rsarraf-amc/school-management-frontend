import { useState } from "react";
import { User, DollarSign, Save } from "lucide-react";
import useAsync from "../../../hooks/useAsync";
import { apiService } from "../../../services/apiService";

const inputClass = "w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-indigo-500/20";
const labelClass = "text-xs font-black text-slate-500 uppercase tracking-widest ml-1";

const STAFF_ROLES = [
  { id: 3, name: "Teacher" },
  { id: 5, name: "Accounts" },
  { id: 6, name: "Transport" },
  { id: 7, name: "Librarian" },
  { id: 8, name: "Employee" },
];

const BLANK = {
  employeeNumber: "", firstName: "", lastName: "", roleId: 3, departmentId: "", designationId: "", shiftId: "",
  email: "", contactNumber: "", dateOfBirth: "", dateOfJoining: "", gender: "Male", panNumber: "", aadhaar: "",
  employmentType: "Permanent", basicPay: "", netAmount: "",
};

const Field = ({ label, children }) => (
  <div className="space-y-2">
    <label className={labelClass}>{label}</label>
    {children}
  </div>
);

const AddStaff = () => {
  const [activeTab, setActiveTab] = useState("basic");
  const [form, setForm] = useState(BLANK);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const { data: lookups } = useAsync(
    async () => {
      const [departments, designations, shifts] = await Promise.all([
        apiService.departments.list(),
        apiService.designations.list(),
        apiService.shifts.list(),
      ]);
      return { departments, designations, shifts };
    },
    { departments: [], designations: [], shifts: [] },
  );

  const set = (key) => (event) => setForm({ ...form, [key]: event.target.value });

  const submit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setMessage({ type: "", text: "" });
    const payload = {
      ...form,
      roleId: Number(form.roleId),
      departmentId: Number(form.departmentId),
      designationId: Number(form.designationId),
      basicPay: Number(form.basicPay || 0),
      netAmount: Number(form.netAmount || form.basicPay || 0),
    };
    if (form.shiftId) payload.shiftId = Number(form.shiftId);
    else delete payload.shiftId;
    if (!form.aadhaar) delete payload.aadhaar;
    try {
      await apiService.createEmployee(payload);
      setForm(BLANK);
      setActiveTab("basic");
      setMessage({ type: "ok", text: "Staff member saved." });
    } catch (requestError) {
      setMessage({ type: "err", text: requestError.message });
    } finally {
      setSaving(false);
    }
  };

  const tabClass = (id) =>
    `px-6 py-4 text-sm font-black uppercase tracking-widest whitespace-nowrap transition-all border-b-2 ${activeTab === id ? "text-indigo-600 border-indigo-600" : "text-slate-500 border-transparent hover:text-slate-700 hover:border-slate-300"}`;

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="flex border-b border-slate-100 overflow-x-auto">
        <button type="button" onClick={() => setActiveTab("basic")} className={tabClass("basic")}>Basic Details</button>
        <button type="button" onClick={() => setActiveTab("payroll")} className={tabClass("payroll")}>Payroll Details</button>
      </div>

      <form className="p-8 space-y-8" onSubmit={submit}>
        <div className={activeTab === "basic" ? "" : "hidden"}>
          <div className="flex items-center gap-2 mb-6 text-indigo-600">
            <User size={20} />
            <h3 className="text-lg font-black tracking-tight">Basic Information</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Field label="Staff ID *"><input required placeholder="e.g. STF-004" value={form.employeeNumber} onChange={set("employeeNumber")} className={inputClass} /></Field>
            <Field label="First Name *"><input required value={form.firstName} onChange={set("firstName")} className={inputClass} /></Field>
            <Field label="Last Name *"><input required value={form.lastName} onChange={set("lastName")} className={inputClass} /></Field>
            <Field label="Role *">
              <select required value={form.roleId} onChange={set("roleId")} className={`${inputClass} appearance-none`}>
                {STAFF_ROLES.map((role) => <option key={role.id} value={role.id}>{role.name}</option>)}
              </select>
            </Field>
            <Field label="Department *">
              <select required value={form.departmentId} onChange={set("departmentId")} className={`${inputClass} appearance-none`}>
                <option value="">Select...</option>
                {lookups.departments.map((item) => <option key={item.id} value={item.id}>{item.departmentName}</option>)}
              </select>
            </Field>
            <Field label="Designation *">
              <select required value={form.designationId} onChange={set("designationId")} className={`${inputClass} appearance-none`}>
                <option value="">Select...</option>
                {lookups.designations.map((item) => <option key={item.id} value={item.id}>{item.designationName}</option>)}
              </select>
            </Field>
            <Field label="Shift">
              <select value={form.shiftId} onChange={set("shiftId")} className={`${inputClass} appearance-none`}>
                <option value="">None</option>
                {lookups.shifts.map((item) => <option key={item.id} value={item.id}>{item.shiftName}</option>)}
              </select>
            </Field>
            <Field label="Email *"><input required type="email" value={form.email} onChange={set("email")} className={inputClass} /></Field>
            <Field label="Phone *"><input required value={form.contactNumber} onChange={set("contactNumber")} className={inputClass} /></Field>
            <Field label="Date of Birth *"><input required type="date" value={form.dateOfBirth} onChange={set("dateOfBirth")} className={inputClass} /></Field>
            <Field label="Date of Joining *"><input required type="date" value={form.dateOfJoining} onChange={set("dateOfJoining")} className={inputClass} /></Field>
            <Field label="Gender">
              <select value={form.gender} onChange={set("gender")} className={`${inputClass} appearance-none`}>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </Field>
            <Field label="PAN Number *"><input required value={form.panNumber} onChange={set("panNumber")} className={inputClass} /></Field>
            <Field label="Aadhaar"><input value={form.aadhaar} onChange={set("aadhaar")} className={inputClass} /></Field>
          </div>
        </div>

        <div className={activeTab === "payroll" ? "" : "hidden"}>
          <div className="flex items-center gap-2 mb-6 text-indigo-600">
            <DollarSign size={20} />
            <h3 className="text-lg font-black tracking-tight">Payroll Information</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Field label="Employment Type">
              <select value={form.employmentType} onChange={set("employmentType")} className={`${inputClass} appearance-none`}>
                <option value="Permanent">Permanent</option>
                <option value="Contract">Contract</option>
                <option value="Temporary">Temporary</option>
              </select>
            </Field>
            <Field label="Basic Pay *"><input required type="number" min="0" value={form.basicPay} onChange={set("basicPay")} className={inputClass} /></Field>
            <Field label="Net Amount"><input type="number" min="0" value={form.netAmount} onChange={set("netAmount")} className={inputClass} /></Field>
          </div>
        </div>

        {message.text && (
          <p className={`text-sm font-bold ${message.type === "ok" ? "text-emerald-600" : "text-rose-600"}`}>{message.text}</p>
        )}
        <div className="pt-6 border-t border-slate-100 flex justify-end">
          <button type="submit" disabled={saving} className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all text-sm shadow-lg shadow-indigo-100 flex items-center gap-2 disabled:opacity-60">
            <Save size={18} /> {saving ? "Saving..." : "Save Staff Member"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddStaff;
