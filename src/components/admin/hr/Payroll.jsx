import { useMemo, useState } from "react";
import { DollarSign, CheckCircle } from "lucide-react";
import DataTable from "../../ui/DataTable";
import FilterBar from "../../ui/FilterBar";
import FilterItem from "../../ui/FilterItem";
import StatusMessage from "../../ui/StatusMessage";
import useAsync from "../../../hooks/useAsync";
import { apiService } from "../../../services/apiService";
import { ROLE_NAMES } from "../../../constants/roles";

const selectClass = "w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium appearance-none";
const currentMonth = () => new Date().toISOString().slice(0, 7);

const Payroll = () => {
  const [month, setMonth] = useState(currentMonth());
  const [roleId, setRoleId] = useState("");
  const [notice, setNotice] = useState("");

  const { data, loading, error, setError, reload } = useAsync(async () => {
    const [employees, payrolls] = await Promise.all([
      apiService.getAllEmployees(),
      apiService.getPayrolls({ month }),
    ]);
    return { employees, payrolls };
  }, { employees: [], payrolls: [] });

  const rows = useMemo(() => {
    const byEmployee = new Map(data.payrolls.map((payroll) => [payroll.employeeId, payroll]));
    return data.employees
      .filter((employee) => !roleId || String(employee.roleId) === roleId)
      .map((employee) => ({
        ...employee,
        name: [employee.firstName, employee.lastName].filter(Boolean).join(" "),
        payroll: byEmployee.get(employee.id) || null,
      }));
  }, [data, roleId]);

  const run = async (action, successText) => {
    setError("");
    setNotice("");
    try {
      await action();
      setNotice(successText);
      await reload();
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  const generate = (employee) =>
    run(() => {
      const gross = Number(employee.basicPay || 0) + Number(employee.allowanceDA || 0) + Number(employee.allowanceHRA || 0);
      const net = Number(employee.netAmount || gross);
      return apiService.createPayroll({
        employeeId: employee.id,
        month,
        basicSalary: Number(employee.basicPay || 0),
        grossSalary: gross,
        netSalary: net,
        totalDeduction: Math.max(0, gross - net),
        workingDays: 30,
        absentDays: 0,
        halfDays: 0,
        payableAmount: net,
      });
    }, `Payroll generated for ${employee.name}.`);

  const markPaid = (employee) =>
    run(() => apiService.payPayroll(employee.payroll.id, { paymentMode: "Cash" }), `Marked paid: ${employee.name}.`);

  const columns = [
    { header: "Staff ID", accessor: "employeeNumber", render: (row) => <span className="font-bold text-slate-900">{row.employeeNumber}</span> },
    { header: "Name", accessor: "name", render: (row) => <span className="font-bold text-slate-700">{row.name}</span> },
    { header: "Role", accessor: "roleId", render: (row) => <span className="px-2 py-0.5 bg-rose-50 text-rose-600 rounded text-[10px] font-black uppercase">{ROLE_NAMES[row.roleId] || row.roleId}</span> },
    { header: "Basic Pay", accessor: "basicPay", render: (row) => <span className="text-slate-600 font-medium text-xs">{row.basicPay}</span> },
    { header: "Net Payable", accessor: "payroll", render: (row) => <span className="text-slate-600 font-medium text-xs">{row.payroll ? row.payroll.payableAmount : "-"}</span> },
    { header: "Status", accessor: "status", render: (row) => (
      <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
        !row.payroll ? "bg-slate-100 text-slate-500" : row.payroll.status === "PAID" ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
      }`}>{!row.payroll ? "Not Generated" : row.payroll.status}</span>
    ) },
  ];

  const actions = [
    { icon: DollarSign, label: "Generate Payroll", onClick: (row) => (row.payroll ? setError("Payroll already generated for this month.") : generate(row)) },
    { icon: CheckCircle, label: "Mark Paid", onClick: (row) => (!row.payroll ? setError("Generate payroll first.") : row.payroll.status === "PAID" ? setNotice("Already paid.") : markPaid(row)) },
  ];

  return (
    <div className="space-y-6">
      <FilterBar title="Payroll Management" description="Generate and manage staff salaries and payslips." onFilter={reload} onReset={() => { setMonth(currentMonth()); setRoleId(""); }}>
        <FilterItem label="Role">
          <select value={roleId} onChange={(event) => setRoleId(event.target.value)} className={selectClass}>
            <option value="">All Roles</option>
            {[3, 5, 6, 7, 8].map((id) => <option key={id} value={id}>{ROLE_NAMES[id]}</option>)}
          </select>
        </FilterItem>
        <FilterItem label="Month">
          <input type="month" value={month} onChange={(event) => setMonth(event.target.value)} className={selectClass} />
        </FilterItem>
      </FilterBar>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
          <h3 className="font-black text-slate-900 tracking-tight">Staff Payroll List</h3>
          {notice && <span className="text-xs font-bold text-emerald-600">{notice}</span>}
        </div>
        <StatusMessage loading={loading} error={error} empty={!loading && !error && rows.length === 0} emptyText="No staff found." />
        {!loading && rows.length > 0 && <DataTable columns={columns} data={rows} actions={actions} />}
      </div>
    </div>
  );
};

export default Payroll;
