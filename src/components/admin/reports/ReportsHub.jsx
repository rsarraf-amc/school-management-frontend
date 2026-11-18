import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  FileText, TrendingUp, DollarSign, Users, CheckCircle, ArrowUpRight, ArrowDownRight
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar
} from "recharts";
import SectionCard from "../../ui/SectionCard";
import QuickActionCard from "../../ui/QuickActionCard";
import StatCard from "../../ui/StatCard";
import useAsync from "../../../hooks/useAsync";
import { apiService } from "../../../services/apiService";

const monthKey = (value) => (value ? String(value).slice(0, 7) : "");
const sumBy = (rows, fn) => rows.reduce((total, row) => total + (Number(fn(row)) || 0), 0);

const buildStats = ({ students, payments, payrolls }) => {
  const paid = payrolls.filter((r) => r.status === "PAID");
  const flow = {};
  const enroll = {};
  payments.forEach((p) => {
    const k = monthKey(p.paidOn);
    if (k) (flow[k] ||= { month: k, income: 0, expense: 0 }).income += Number(p.paidAmount) || 0;
  });
  paid.forEach((r) => {
    const k = monthKey(r.updatedAt || r.createdAt);
    if (k) (flow[k] ||= { month: k, income: 0, expense: 0 }).expense += Number(r.payableAmount) || 0;
  });
  students.forEach((s) => {
    const k = monthKey(s.admissionDate || s.createdAt);
    if (k) (enroll[k] ||= { month: k, admissions: 0 }).admissions += 1;
  });
  const byMonth = (a, b) => a.month.localeCompare(b.month);
  return {
    totalRevenue: sumBy(payments, (p) => p.paidAmount),
    totalExpenses: sumBy(paid, (r) => r.payableAmount),
    newAdmissions: students.length,
    payrollDisbursed: sumBy(paid, (r) => r.payableAmount),
    financialFlow: Object.values(flow).sort(byMonth),
    enrollmentTrend: Object.values(enroll).sort(byMonth),
  };
};

const emptyStats = buildStats({ students: [], payments: [], payrolls: [] });

const ReportsHub = () => {
  const navigate = useNavigate();
  const { data } = useAsync(async () => {
    const [students, payments, payrolls] = await Promise.all([
      apiService.getAllStudents(),
      apiService.getFeePayments(),
      apiService.getPayrolls(),
    ]);
    return buildStats({ students: students || [], payments: payments || [], payrolls: payrolls || [] });
  });
  const reportStats = data || emptyStats;

  const modules = useMemo(
    () => [
      { label: "Admission Report", icon: Users, color: "text-indigo-600", path: "admissions" },
      { label: "Transaction Reports", icon: TrendingUp, color: "text-emerald-600", path: "transactions" },
      { label: "Fees Report", icon: DollarSign, color: "text-blue-600", path: "fees" },
      { label: "Payroll Reports", icon: FileText, color: "text-violet-600", path: "payroll" },
    ],
    []
  );

  return (
    <div className="space-y-8">
      {/* Quick Actions Grid */}
      <SectionCard title="Quick Actions" description="Generate administrative and financial reports">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 p-6 pt-2">
          {modules.map((mod) => (
            <QuickActionCard
              key={mod.label}
              icon={mod.icon}
              label={mod.label}
              color={mod.color}
              onClick={() => navigate(mod.path)}
            />
          ))}
        </div>
      </SectionCard>

      {/* Stats Overview */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Revenue" value={`₹${reportStats.totalRevenue.toLocaleString()}`} icon={<ArrowUpRight size={20} />} color="emerald" />
        <StatCard title="Total Expenses" value={`₹${reportStats.totalExpenses.toLocaleString()}`} icon={<ArrowDownRight size={20} />} color="rose" isPositive={false} />
        <StatCard title="Total Students" value={reportStats.newAdmissions} icon={<Users size={20} />} color="blue" />
        <StatCard title="Payroll Disbursed" value={`₹${reportStats.payrollDisbursed.toLocaleString()}`} icon={<CheckCircle size={20} />} color="indigo" />
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        <SectionCard title="Financial Flow (Income vs Expense)">
          <div className="p-6 h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={reportStats.financialFlow}>
                <defs>
                  <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} tickFormatter={(value) => `₹${value/1000}k`} />
                <RechartsTooltip cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '4 4' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} formatter={(value) => `₹${value.toLocaleString()}`} />
                <Area type="monotone" dataKey="income" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorIncome)" name="Income" />
                <Area type="monotone" dataKey="expense" stroke="#f43f5e" strokeWidth={3} fillOpacity={1} fill="url(#colorExpense)" name="Expense" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

        <SectionCard title="Admission Trend (Monthly)">
          <div className="p-6 h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={reportStats.enrollmentTrend}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <RechartsTooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="admissions" fill="#3b82f6" radius={[4, 4, 0, 0]} name="New Admissions" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>
      </div>
    </div>
  );
};

export default ReportsHub;
