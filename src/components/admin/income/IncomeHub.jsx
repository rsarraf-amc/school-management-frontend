import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  PlusCircle,
  Search,
  Settings,
  TrendingUp,
  DollarSign,
  Calendar,
  Layers
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
import { incomeStats, incomeTrendData, incomeCategoryData } from "../../../mock/incomeData";

const COLORS = ["#10b981", "#6366f1", "#f59e0b", "#8b5cf6", "#14b8a6", "#ef4444"];

const IncomeHub = () => {
  const navigate = useNavigate();

  const modules = useMemo(
    () => [
      {
        label: "Add Income",
        icon: PlusCircle,
        color: "text-emerald-600",
        path: "add",
      },
      {
        label: "Search Income",
        icon: Search,
        color: "text-indigo-600",
        path: "search",
      },
      {
        label: "Income Head",
        icon: Settings,
        color: "text-amber-600",
        path: "income-head",
      },
    ],
    []
  );

  return (
    <div className="space-y-8">
      {/* Quick Actions */}
      <SectionCard
        title="Quick Actions"
        description="Manage your institutional income streams"
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
          title="Total Income"
          value={`₹${incomeStats.totalIncome.toLocaleString()}`}
          icon={<DollarSign size={20} />}
          color="emerald"
          trend="+15%"
        />
        <StatCard
          title="This Month"
          value={`₹${incomeStats.thisMonth.toLocaleString()}`}
          icon={<Calendar size={20} />}
          color="indigo"
          trend="Current"
        />
        <StatCard
          title="Recent Entries"
          value={incomeStats.recentTransactionsCount}
          icon={<PlusCircle size={20} />}
          color="amber"
          trend="Last 7 days"
        />
        <StatCard
          title="Top Category"
          value={incomeStats.topCategory}
          icon={<Layers size={20} />}
          color="violet"
        />
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Monthly Trend */}
        <SectionCard title="Institutional Income Trends">
          <div className="p-6 h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={incomeTrendData}>
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
                  stroke="#10b981" 
                  strokeWidth={4} 
                  dot={{ r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }} 
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

        {/* Category Distribution */}
        <SectionCard title="Revenue Stream Distribution">
          <div className="p-6 h-[300px] flex items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={incomeCategoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {incomeCategoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                   contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-col gap-2 pr-4">
              {incomeCategoryData.map((entry, index) => (
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

export default IncomeHub;
