import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  PlusCircle,
  Search,
  Settings,
  CreditCard,
  Calendar,
  PieChart as PieChartIcon
} from "lucide-react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from "recharts";
import SectionCard from "../../ui/SectionCard";
import QuickActionCard from "../../ui/QuickActionCard";
import StatCard from "../../ui/StatCard";
import useAsync from "../../../hooks/useAsync";
import { apiService } from "../../../services/apiService";

const COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#14b8a6"];

const rupees = (value) =>
  `₹${Number(value || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;
const dayOf = (value) => String(value || "").slice(0, 10);

const ExpenseHub = () => {
  const navigate = useNavigate();
  const { data: items, loading, error } = useAsync(() => apiService.accounts.expenses.list(), []);

  const { expenseStats, expenseTrendData, expenseCategoryData, recent } = useMemo(() => {
    const monthKey = new Date().toISOString().slice(0, 7);
    const byHead = {};
    const byMonth = {};
    let total = 0;
    let thisMonth = 0;
    items.forEach((item) => {
      const amount = Number(item.amount || 0);
      total += amount;
      const month = dayOf(item.date).slice(0, 7);
      if (month === monthKey) thisMonth += amount;
      if (month) byMonth[month] = (byMonth[month] || 0) + amount;
      const headName = item.head?.name || "Uncategorized";
      byHead[headName] = (byHead[headName] || 0) + amount;
    });
    const categories = Object.entries(byHead)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
    const trend = Object.keys(byMonth)
      .sort()
      .slice(-6)
      .map((month) => ({ month, amount: byMonth[month] }));
    return {
      expenseStats: {
        totalExpense: rupees(total),
        thisMonth: rupees(thisMonth),
        recentTransactionsCount: items.length,
        topCategory: categories[0]?.name || "—",
      },
      expenseTrendData: trend,
      expenseCategoryData: categories,
      recent: items.slice(0, 5),
    };
  }, [items]);

  const modules = useMemo(
    () => [
      {
        label: "Add Expense",
        icon: PlusCircle,
        color: "text-rose-600",
        path: "add",
      },
      {
        label: "Search Expense",
        icon: Search,
        color: "text-indigo-600",
        path: "search",
      },
      {
        label: "Expense Head",
        icon: Settings,
        color: "text-amber-600",
        path: "expense-head",
      },
    ],
    []
  );

  return (
    <div className="space-y-8">
      {error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-bold text-rose-700">
          {error}
        </div>
      )}
      {loading && <div className="text-sm text-slate-500">Loading...</div>}
      <SectionCard
        title="Quick Actions"
        description="Streamline your expense recording and management"
      >
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 p-6 pt-2">
          {modules.map((mod) => (
            <QuickActionCard
              key={mod.path}
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
        <StatCard
          title="Total Expense"
          value={expenseStats.totalExpense}
          icon={<CreditCard size={20} />}
          color="rose"
        />
        <StatCard
          title="This Month"
          value={expenseStats.thisMonth}
          icon={<Calendar size={20} />}
          color="indigo"
        />
        <StatCard
          title="Vouchers Issued"
          value={expenseStats.recentTransactionsCount}
          icon={<PlusCircle size={20} />}
          color="amber"
        />
        <StatCard
          title="Top Category"
          value={expenseStats.topCategory}
          icon={<PieChartIcon size={20} />}
          color="violet"
        />
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Monthly Trend */}
        <SectionCard title="Monthly Expenditure Trend">
          <div className="p-6 h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={expenseTrendData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="month" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 12 }} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 12 }} 
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="amount" 
                  stroke="#ef4444" 
                  strokeWidth={4} 
                  dot={{ r: 4, fill: '#ef4444', strokeWidth: 2, stroke: '#fff' }} 
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

        {/* Category Distribution */}
        <SectionCard title="Expense by Category">
          <div className="p-6 h-[300px] flex items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={expenseCategoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {expenseCategoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                   contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-col gap-2 pr-4">
              {expenseCategoryData.map((entry, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                  <span className="text-xs font-bold text-slate-600 uppercase tracking-tighter">{entry.name} · {rupees(entry.value)}</span>
                </div>
              ))}
            </div>
          </div>
        </SectionCard>
      </div>

      <SectionCard title="Recent Expenses">
        <div className="divide-y divide-slate-100">
          {recent.length === 0 ? (
            <p className="p-6 text-sm text-slate-500">No expenses recorded yet.</p>
          ) : (
            recent.map((item) => (
              <div key={item.id} className="flex items-center justify-between px-6 py-3">
                <div className="flex flex-col">
                  <span className="font-bold text-slate-900 text-sm">{item.name}</span>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">
                    {item.head?.name || "—"} · {dayOf(item.date)}
                  </span>
                </div>
                <span className="font-black text-rose-600 text-sm">{rupees(item.amount)}</span>
              </div>
            ))
          )}
        </div>
      </SectionCard>
    </div>
  );
};

export default ExpenseHub;
