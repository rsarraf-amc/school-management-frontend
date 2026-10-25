import { useNavigate } from "react-router-dom";
import {
  Users,
  CreditCard,
  ClipboardList,
  Settings,
  FileText,
  Wallet,
  ArrowRight,
  TrendingUp,
  Clock,
  AlertCircle,
} from "lucide-react";
import StatCard from "../../ui/StatCard";
import SectionCard from "../../ui/SectionCard";
import QuickActionCard from "../../ui/QuickActionCard";
import {
  feesStats,
} from "../../../mock/feesData";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";

export default function FeesOverview() {
  const navigate = useNavigate();

  const menuItems = [
    {
      title: "Collect Fees",
      description: "Search students and collect pending fees.",
      icon: Users,
      path: "collect",
      color: "text-blue-600",
      lightColor: "bg-blue-50",
    },
    {
      title: "Search Fees Due",
      description: "Find students with unpaid balances.",
      icon: AlertCircle,
      path: "due",
      color: "text-amber-600",
      lightColor: "bg-amber-50",
    },
    {
      title: "Fees Master",
      description: "Setup and manage fee structures.",
      icon: Settings,
      path: "master",
      color: "text-indigo-600",
      lightColor: "bg-indigo-50",
    },
    {
      title: "Fees Group",
      description: "Group fees logically.",
      icon: CreditCard,
      path: "group",
      color: "text-emerald-600",
      lightColor: "bg-emerald-50",
    },
    {
      title: "Fees Type",
      description: "Define specific fee types.",
      icon: ClipboardList,
      path: "type",
      color: "text-rose-600",
      lightColor: "bg-rose-50",
    },
  ];

  const collectionTrend = [
    { month: "Jan", collected: 68000, due: 18000 },
    { month: "Feb", collected: 72000, due: 14500 },
    { month: "Mar", collected: 81000, due: 12500 },
    { month: "Apr", collected: 76000, due: 13800 },
    { month: "May", collected: 84000, due: 9800 },
    { month: "Jun", collected: 90000, due: 7200 },
  ];

  const feeDistribution = [
    { name: "Monthly", value: 48, color: "#10b981" },
    { name: "Admission", value: 22, color: "#6366f1" },
    { name: "Exam", value: 18, color: "#f59e0b" },
    { name: "Transport", value: 12, color: "#ec4899" },
  ];

  return (
    <div className="space-y-8">
      {/* Quick Actions Navigation */}
      <SectionCard
        title="Quick Actions"
        description="Access fees modules quickly"
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 p-6 pt-2">
          {menuItems.map((item, idx) => (
            <QuickActionCard
              key={idx}
              icon={item.icon}
              label={item.title}
              description={item.description}
              color={item.color}
              lightColor={item.lightColor}
              onClick={() => navigate(item.path)}
            />
          ))}
        </div>
      </SectionCard>
      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Collection"
          value={feesStats.totalCollected}
          trend="+12.5%"
          icon={<TrendingUp size={20} />}
          color="emerald"
        />
        <StatCard
          title="Fees Due"
          value={feesStats.pendingAmount}
          trend="8 Students"
          icon={<Clock size={20} />}
          color="amber"
          isPositive={false}
        />
        <StatCard
          title="Overdue Amount"
          value={feesStats.overdueAmount}
          trend="Last 30 days"
          icon={<Wallet size={20} />}
          color="indigo"
        />
        <StatCard
          title="This Month"
          value={feesStats.thisMonthCollected}
          trend="+₹400 today"
          icon={<AlertCircle size={20} />}
          color="rose"
        />
      </div>

      {/* Charts Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm flex flex-col">
          <div className="p-6 border-b border-slate-100">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.24em] text-slate-400">
                  Collection Trend
                </p>
                <h2 className="text-2xl font-black text-slate-900 mt-2">
                  Monthly Fee Performance
                </h2>
              </div>
              <div className="rounded-3xl bg-slate-50 px-4 py-3 text-sm font-bold text-slate-600">
                Latest month collected ₹90,000
              </div>
            </div>
          </div>
          <div className="p-6 h-[260px] md:h-[300px] xl:h-[330px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={collectionTrend}
                margin={{ top: 10, right: 10, left: -18, bottom: 0 }}
              >
                <defs>
                  <linearGradient
                    id="collectedGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="dueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  stroke="#e2e8f0"
                  strokeDasharray="3 3"
                  vertical={false}
                />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "#64748b", fontSize: 12 }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "#64748b", fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: 16,
                    border: "1px solid #e2e8f0",
                    backgroundColor: "#fff",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="collected"
                  stroke="#10b981"
                  fillOpacity={1}
                  fill="url(#collectedGradient)"
                  strokeWidth={2.5}
                  dot={false}
                />
                <Area
                  type="monotone"
                  dataKey="due"
                  stroke="#f59e0b"
                  fillOpacity={1}
                  fill="url(#dueGradient)"
                  strokeWidth={2.5}
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid gap-6">
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-slate-200 shadow-[0_10px_30px_rgba(0,0,0,0.05)] p-6">
            <div className="flex items-center justify-between mb-5 gap-4">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.24em] text-slate-400">
                  Fee Group Split
                </p>
                <h2 className="text-xl font-black text-slate-900 mt-2">
                  Revenue by Group
                </h2>
              </div>
              <div className="rounded-full bg-slate-50 px-3 py-1 text-xs font-black uppercase tracking-[0.24em] text-slate-500">
                4 groups
              </div>
            </div>
            <div className="h-56 md:h-64 xl:h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={feeDistribution}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={56}
                    outerRadius={96}
                    paddingAngle={4}
                  >
                    {feeDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      borderRadius: 16,
                      border: "1px solid #e2e8f0",
                      backgroundColor: "#fff",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-4">
              {feeDistribution.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center gap-3 rounded-3xl bg-slate-50 p-4"
                >
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  ></span>
                  <div>
                    <p className="text-sm font-black text-slate-900">
                      {item.name}
                    </p>
                    <p className="text-sm text-slate-500">{item.value}%</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-5 gap-4">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.24em] text-slate-400">
                  Latest Collection
                </p>
                <h2 className="text-xl font-black text-slate-900 mt-2">
                  Monthly Comparison
                </h2>
              </div>
              <div className="rounded-full bg-slate-50 px-3 py-1 text-xs font-black uppercase tracking-[0.24em] text-slate-500">
                Actual vs Due
              </div>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={collectionTrend}
                  margin={{ top: 0, right: 0, left: -18, bottom: 0 }}
                >
                  <CartesianGrid
                    stroke="#e2e8f0"
                    strokeDasharray="3 3"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: "#64748b", fontSize: 12 }}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: "#64748b", fontSize: 12 }}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 16,
                      border: "1px solid #e2e8f0",
                      backgroundColor: "#fff",
                    }}
                  />
                  <Bar
                    dataKey="collected"
                    fill="#2563eb"
                    radius={[6, 6, 0, 0]}
                    barSize={14}
                  />
                  <Bar
                    dataKey="due"
                    fill="#f97316"
                    radius={[6, 6, 0, 0]}
                    barSize={14}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
