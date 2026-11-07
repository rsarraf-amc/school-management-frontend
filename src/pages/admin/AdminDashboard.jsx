import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllStudents,
  fetchAllTeachers,
  fetchAllClasses,
} from "../../redux/slices/adminSlice";

import {
  Users,
  GraduationCap,
  TrendingUp,
  TrendingDown,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  School,
  Calendar,
  Sun,
  Activity,
  CheckCircle,
  Clock,
  BookOpen,
  Trophy,
} from "lucide-react";

import {
  AreaChart,
  Area,
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
  Legend,
} from "recharts";
import DataTable from "../../components/ui/DataTable";
import StatCard from "../../components/ui/StatCard";

import {
  monthlyFinanceData,
  paymentMethodsData,
  dashboardStats,
  adminUpcomingEvents,
  adminRecentActivity,
} from "../../mock/adminDashboardData";

const IconMap = {
  Sun: Sun,
  BookOpen: BookOpen,
  Trophy: Trophy,
  Users: Users,
  Activity: Activity,
  CheckCircle: CheckCircle,
  Clock: Clock,
};

export default function AdminDashboard() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { students, status } = useSelector((state) => state.admin);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchAllStudents());
      dispatch(fetchAllTeachers());
      dispatch(fetchAllClasses());
    }
  }, [status, dispatch]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center p-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const recentStudentColumns = [
    {
      header: "Student Name",
      accessor: "name",
      width: 220,
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-slate-600 text-sm border border-slate-200">
            {row.name?.charAt(0)}
          </div>
          <span className="font-bold text-slate-700">{row.name}</span>
        </div>
      ),
    },
    { header: "Class", accessor: "classId", width: 140 },
    {
      header: "Attendance",
      accessor: "attendance",
      width: 170,
      render: (row) => (
        <div className="flex items-center gap-2">
          <div className="w-full bg-slate-100 rounded-full h-1.5 max-w-[120px]">
            <div
              className="bg-emerald-500 h-1.5 rounded-full"
              style={{ width: `${row.attendance ?? 0}%` }}
            />
          </div>
          <span className="text-xs font-black text-slate-600">
            {row.attendance ?? 0}%
          </span>
        </div>
      ),
    },
    {
      header: "Action",
      accessor: "id",
      width: 120,
      render: (row) => (
        <button className="bg-slate-50 text-slate-500 px-4 py-1.5 rounded-xl text-xs font-black uppercase tracking-tight hover:bg-slate-100 hover:text-slate-900 transition-all">
          Details
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-10 pb-10">
      {/* Header & Greeting */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-xl shadow-sm border border-slate-100">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Welcome back,{" "}
            <span className="text-indigo-600">{user?.name || "Admin"}</span>! 👋
          </h1>
          <p className="text-slate-500 font-medium flex items-center gap-2">
            <Calendar size={16} />
            Here's what's happening in your school today.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 active:scale-95">
            <Plus size={18} className="stroke-[3]" />
            New Admission
          </button>
        </div>
      </div>

      {/* Summary Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 xl:gap-6">
        <StatCard
          title="Today's Income"
          value={dashboardStats.todayIncome}
          subValue={dashboardStats.monthIncome}
          subLabel="This Month"
          icon={<TrendingUp size={16} />}
          trend="+12.5%"
          isPositive={true}
          color="emerald"
          sparklineData={[
            { value: 30 },
            { value: 45 },
            { value: 40 },
            { value: 60 },
            { value: 55 },
            { value: 80 },
          ]}
        />

        <StatCard
          title="Today's Expense"
          value={dashboardStats.todayExpense}
          subValue={dashboardStats.monthExpense}
          subLabel="This Month"
          icon={<TrendingDown size={16} />}
          trend="-2.4%"
          isPositive={false}
          color="rose"
          sparklineData={[
            { value: 30 },
            { value: 20 },
            { value: 25 },
            { value: 15 },
            { value: 30 },
            { value: 10 },
          ]}
        />

        <StatCard
          title="Total Students"
          value={dashboardStats.totalStudents}
          subValue={dashboardStats.presentStudents}
          subLabel="Present Today"
          icon={<GraduationCap size={16} />}
          trend={`${(
            (dashboardStats.presentStudents / dashboardStats.totalStudents) *
            100
          ).toFixed(1)}%`}
          isPositive={true}
          color="indigo"
          sparklineData={[
            { value: 40 },
            { value: 50 },
            { value: 45 },
            { value: 70 },
            { value: 65 },
            { value: 90 },
          ]}
        />

        <StatCard
          title="Total Staff"
          value={dashboardStats.totalStaff}
          subValue={dashboardStats.presentStaff}
          subLabel="Present Today"
          icon={<Users size={16} />}
          trend="96.4%"
          isPositive={true}
          color="amber"
          sparklineData={[
            { value: 50 },
            { value: 60 },
            { value: 55 },
            { value: 80 },
            { value: 75 },
            { value: 95 },
          ]}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 xl:gap-8">
        {/* Income vs Expense Bar Chart */}
        <div className="lg:col-span-2 bg-white p-6 xl:p-8 rounded-xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-shadow duration-500">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
            <h3 className="text-xl xl:text-2xl font-black text-slate-800 tracking-tight">
              Financial Overview
            </h3>
            <select className="bg-slate-50/80 border border-slate-200/80 text-sm font-bold px-4 py-2.5 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-sm cursor-pointer hover:bg-slate-100 transition-colors min-w-[140px]">
              <option>Last 7 Months</option>
              <option>Year 2024</option>
            </select>
          </div>
          <div className="h-[18rem] w-full mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={monthlyFinanceData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f1f5f9"
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#64748b", fontSize: 12, fontWeight: 600 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#64748b", fontSize: 12, fontWeight: 600 }}
                />
                <Tooltip
                  cursor={{ fill: "#f8fafc" }}
                  contentStyle={{
                    borderRadius: "16px",
                    border: "none",
                    boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                  }}
                />
                <Bar
                  dataKey="income"
                  fill="#6366f1"
                  radius={[6, 6, 0, 0]}
                  barSize={24}
                />
                <Bar
                  dataKey="expense"
                  fill="#f43f5e"
                  radius={[6, 6, 0, 0]}
                  barSize={24}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Payment Methods Pie Chart */}
        <div className="bg-white p-6 xl:p-8 rounded-xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_12px_40px_rgb(0,0,0,0.08)] transition-all duration-500 flex flex-col group">
          <div className="flex items-center justify-between gap-3 mb-6">
            <h3 className="text-xl xl:text-2xl font-black text-slate-800 tracking-tight">
              Payment Methods
            </h3>
            <div className="animate-pulse">
              <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
            </div>
          </div>
          <div className="h-[16rem] w-full mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={paymentMethodsData}
                  cx="50%"
                  cy="50%"
                  innerRadius="60%"
                  outerRadius="85%"
                  paddingAngle={8}
                  dataKey="value"
                >
                  {paymentMethodsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "none",
                    boxShadow: "0 10px 25px rgb(0 0 0 / 0.15)",
                    backgroundColor: "#fff",
                    padding: "12px 16px",
                  }}
                />
                <Legend
                  iconType="circle"
                  wrapperStyle={{
                    paddingTop: "16px",
                    fontWeight: 700,
                    fontSize: "12px",
                    display: "flex",
                    justifyContent: "center",
                    gap: "16px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-gradient-to-br from-emerald-50/50 to-slate-50/50 p-5 xl:p-6 rounded-2xl border border-emerald-100/50 shadow-sm hover:shadow-md transition-all group/stats">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-white border border-emerald-200 shadow-sm flex items-center justify-center text-emerald-600 group-hover/stats:scale-110 transition-transform">
                <CreditCard size={18} className="stroke-[2]" />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                  Total Collected
                </span>
                <h4 className="text-lg xl:text-xl font-black text-slate-800 tracking-tight">
                  {dashboardStats.monthIncome}
                </h4>
              </div>
            </div>

            <div className="mt-4 w-full">
              <div className="flex items-center justify-between mb-2 gap-2">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Collection Progress
                </span>
                <span className="text-xs font-black text-slate-700">85%</span>
              </div>
              <div className="w-full bg-slate-200/60 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-emerald-400 to-emerald-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: "85%" }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Third Row: Tables and Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Students */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="px-8 py-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
            <h3 className="text-xl font-black text-slate-800 tracking-tight">
              Recent Enrolled Students
            </h3>
            <button className="text-indigo-600 text-sm font-bold hover:underline">
              View All
            </button>
          </div>

          <div className="overflow-x-auto px-4 pb-4">
            <DataTable
              columns={recentStudentColumns}
              data={students.slice(0, 5)}
              rowKey="id"
              tableClassName="min-w-full"
              containerClassName="bg-transparent shadow-none border-0"
            />
          </div>
        </div>

        {/* Upcoming Events & Holidays */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden flex flex-col hover:shadow-md transition-shadow duration-300">
          <div className="px-6 py-5 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
            <h3 className="text-lg font-black text-slate-800 tracking-tight flex items-center gap-2">
              <Calendar size={18} className="text-indigo-600" />
              Upcoming Events
            </h3>
            <button className="text-indigo-600 text-[11px] font-black uppercase tracking-widest hover:underline transition-all">
              Full Calendar
            </button>
          </div>
          <div className="p-6 flex-1 flex flex-col gap-6">
            {adminUpcomingEvents.map((event) => {
              const Icon = IconMap[event.icon] || Calendar;
              const colorStyles = {
                emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
                indigo: "bg-indigo-50 text-indigo-600 border-indigo-100",
                amber: "bg-amber-50 text-amber-600 border-amber-100",
                rose: "bg-rose-50 text-rose-600 border-rose-100",
              };
              const bgClass =
                colorStyles[event.color] ||
                "bg-slate-50 text-slate-600 border-slate-100";

              return (
                <div key={event.id} className="flex gap-4 group">
                  <div className="flex flex-col items-center gap-2">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center border shadow-sm group-hover:scale-110 group-hover:-rotate-3 transition-transform ${bgClass}`}
                    >
                      <Icon size={18} className="stroke-[2.5]" />
                    </div>
                    <div className="w-px h-full bg-slate-100 group-last:hidden"></div>
                  </div>
                  <div className="pb-6 group-last:pb-0 flex-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1">
                      <Clock size={10} /> {event.date} • {event.time}
                    </p>
                    <h4 className="text-sm font-bold text-slate-800 tracking-tight mb-2 group-hover:text-indigo-600 transition-colors">
                      {event.title}
                    </h4>
                    <span
                      className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${bgClass} bg-opacity-50`}
                    >
                      {event.type}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Fourth Row: Activity and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        {/* Recent Activity Feed */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden flex flex-col hover:shadow-md transition-shadow duration-300">
          <div className="px-6 py-5 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
            <h3 className="text-lg font-black text-slate-800 tracking-tight flex items-center gap-2">
              <Activity size={18} className="text-emerald-500" />
              System Activity Log
            </h3>
            <button className="text-indigo-600 text-[11px] font-black uppercase tracking-widest hover:underline transition-all">
              View All Logs
            </button>
          </div>
          <div className="p-6 overflow-hidden">
            <div className="space-y-0">
              {adminRecentActivity.map((activity, idx) => {
                const colorStyles = {
                  emerald:
                    "border-emerald-500 bg-emerald-100 shadow-emerald-500/20",
                  indigo:
                    "border-indigo-500 bg-indigo-100 shadow-indigo-500/20",
                  amber: "border-amber-500 bg-amber-100 shadow-amber-500/20",
                  slate: "border-slate-500 bg-slate-100 shadow-slate-500/20",
                };
                const dotClass =
                  colorStyles[activity.color] || "border-slate-500 bg-white";

                return (
                  <div key={activity.id} className="flex gap-4 relative group">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-3.5 h-3.5 rounded-full border-2 mt-1 z-10 shadow-sm ${dotClass} group-hover:scale-150 transition-transform`}
                      ></div>
                      {idx !== adminRecentActivity.length - 1 && (
                        <div className="w-[1.5px] h-full bg-slate-100 absolute top-4 bottom-0 left-[6.5px] -z-0"></div>
                      )}
                    </div>
                    <div className="pb-6 flex-1 bg-transparent group-hover:bg-slate-50/80 rounded-xl -mt-1.5 transition-colors p-3 border border-transparent group-hover:border-slate-100">
                      <div className="flex items-center justify-between mb-1 gap-4">
                        <h4 className="text-sm font-bold text-slate-800 tracking-tight">
                          {activity.title}
                        </h4>
                        <span className="text-[10.5px] font-bold text-slate-400 flex items-center gap-1 shrink-0">
                          <Clock size={10} /> {activity.time}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-slate-500 leading-snug">
                        {activity.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Quick Actions & Academy Tip */}
        <div className="space-y-8">
          <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 rounded-xl text-white shadow-xl relative overflow-hidden group hover:shadow-2xl hover:shadow-slate-900/20 transition-shadow">
            <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl group-hover:scale-150 group-hover:bg-indigo-500/30 transition-all duration-700"></div>
            <div className="absolute -left-8 -top-8 w-32 h-32 bg-rose-500/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>

            <h3 className="text-lg font-black text-white mb-6 relative z-10 flex items-center gap-2">
              Launchpad 🚀
            </h3>
            <div className="grid grid-cols-2 gap-3 relative z-10">
              <QuickActionItem
                label="Mark Attendance"
                icon={<ClipboardCheck size={18} />}
              />
              <QuickActionItem
                label="Collect Fees"
                icon={<CreditCard size={18} />}
              />
              <QuickActionItem
                label="Create Exam"
                icon={<ClipboardList size={18} />}
              />
              <QuickActionItem label="Send SMS" icon={<Mail size={18} />} />
            </div>
          </div>

          <div className="bg-indigo-50/80 p-6 rounded-2xl border border-indigo-100 hover:shadow-lg hover:shadow-indigo-100/50 transition-all group">
            <h4 className="font-black text-indigo-900 mb-3 flex items-center gap-2">
              <School
                size={18}
                className="text-indigo-600 group-hover:scale-110 transition-transform"
              />
              Academy Tip
            </h4>
            <p className="text-indigo-700/80 text-sm font-semibold leading-relaxed">
              Did you know? Students with &gt;90% attendance show 40% better
              academic results. Consider tracking irregular students closely.
            </p>
            <button className="mt-5 text-[11px] font-black uppercase text-indigo-600 hover:text-indigo-800 hover:tracking-widest transition-all flex items-center gap-1 group/btn">
              Read More Analysis{" "}
              <ArrowUpRight
                size={14}
                className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform"
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function QuickActionItem({ label, icon }) {
  return (
    <button className="flex flex-col items-center gap-2 p-3 bg-white/10 hover:bg-white/20 rounded-2xl transition-all border border-white/5 active:scale-95 group/btn">
      <div className="p-2 bg-white/10 rounded-xl group-hover/btn:scale-110 transition-transform">
        {icon}
      </div>
      <span className="text-[10px] font-bold text-center leading-tight">
        {label}
      </span>
    </button>
  );
}

// Dummy icons for quick action items that weren't imported
import { ClipboardCheck, CreditCard, ClipboardList, Mail } from "lucide-react";
