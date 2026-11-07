import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  PlusCircle,
  Search,
  Settings,
  TrendingDown,
  CreditCard,
  Calendar,
  PieChart as PieChartIcon
} from "lucide-react";
import {
  BarChart,
  Bar,
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
import { expenseStats, expenseTrendData, expenseCategoryData } from "../../../mock/expenseData";

const COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#14b8a6"];

const ExpenseHub = () => {
  const navigate = useNavigate();

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
      {/* Quick Actions */}
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
          value={`₹${expenseStats.totalExpense.toLocaleString()}`}
          icon={<CreditCard size={20} />}
          color="rose"
          trend="+8.2%"
          isPositive={false}
        />
        <StatCard
          title="This Month"
          value={`₹${expenseStats.thisMonth.toLocaleString()}`}
          icon={<Calendar size={20} />}
          color="indigo"
          trend="Budgeted"
        />
        <StatCard
          title="Vouchers Issued"
          value={expenseStats.recentTransactionsCount}
          icon={<PlusCircle size={20} />}
          color="amber"
          trend="Active"
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
                  <span className="text-xs font-bold text-slate-600 uppercase tracking-tighter">{entry.name}</span>
                </div>
              ))}
            </div>
          </div>
        </SectionCard>
      </div>
    </div>
  );
};

export default ExpenseHub;
