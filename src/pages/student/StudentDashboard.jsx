import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchStudentProfile } from "../../redux/slices/studentSlice";
import {
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  LineChart as LineChartIcon,
  PencilLine,
  Trophy,
  ArrowUpRight,
  Target,
  AlertCircle,
  Wallet,
  CreditCard,
  Receipt,
} from "lucide-react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import StatCard from "../../components/ui/StatCard";

import {
  studentMarksProgression,
  studentHomework,
  upcomingExams,
  studentFinance,
  studentStats,
} from "../../mock/studentDashboardData";

export default function StudentDashboard() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { profile, status } = useSelector((state) => state.student);

  useEffect(() => {
    if (user && user.id && status === "idle") {
      dispatch(fetchStudentProfile(user.id));
    }
  }, [status, dispatch, user]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center p-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  const stats = studentStats;

  return (
    <div className="space-y-10 pb-10">
      {/* Header & Exam Countdown */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Hi,{" "}
            <span className="text-emerald-600">
              {profile?.name || user?.name || "Student"}
            </span>
            ! 🚀
          </h1>
          <p className="text-slate-500 font-medium flex items-center gap-2">
            <BookOpen size={16} />
            You're doing great! You have 2 homework tasks due today.
          </p>
        </div>

        <div className="flex items-center gap-4 bg-emerald-50 px-6 py-4 rounded-[2rem] border border-emerald-100">
          <div className="p-3 bg-white rounded-2xl shadow-sm border border-emerald-50 text-emerald-600">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase text-emerald-600 tracking-widest leading-none mb-1">
              Final Exams In
            </p>
            <h4 className="text-xl font-black text-slate-800">
              15 Days, 04 Hours
            </h4>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Performance Chart */}
        <div className="xl:col-span-2 bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-black text-slate-800 tracking-tight">
              Learning Progress
            </h3>
            <div className="flex gap-2">
              <span className="flex items-center gap-1 text-[10px] font-black uppercase px-2 py-1 rounded-lg bg-emerald-100 text-emerald-700">
                Math
              </span>
              <span className="flex items-center gap-1 text-[10px] font-black uppercase px-2 py-1 rounded-lg bg-indigo-100 text-indigo-700">
                English
              </span>
            </div>
          </div>
          <div className="h-[22rem] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={studentMarksProgression}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f1f5f9"
                />
                <XAxis
                  dataKey="exam"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#64748b", fontSize: 12, fontWeight: 600 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#64748b", fontSize: 12, fontWeight: 600 }}
                  domain={[60, 100]}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "16px",
                    border: "none",
                    boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                  }}
                />
                <Legend
                  iconType="circle"
                  wrapperStyle={{
                    paddingTop: "20px",
                    fontWeight: 600,
                    fontSize: "12px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="math"
                  stroke="#10b981"
                  strokeWidth={4}
                  dot={{
                    r: 6,
                    fill: "#10b981",
                    strokeWidth: 2,
                    stroke: "#fff",
                  }}
                  activeDot={{ r: 8 }}
                />
                <Line
                  type="monotone"
                  dataKey="science"
                  stroke="#6366f1"
                  strokeWidth={4}
                  strokeDasharray="5 5"
                />
                <Line
                  type="monotone"
                  dataKey="english"
                  stroke="#f59e0b"
                  strokeWidth={4}
                  dot={{
                    r: 6,
                    fill: "#f59e0b",
                    strokeWidth: 2,
                    stroke: "#fff",
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sidebar Tasks */}
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
            <h3 className="text-xl font-black text-slate-800 tracking-tight mb-6">
              Homework
            </h3>
            <div className="space-y-4">
              {studentHomework.map((hw) => (
                <div
                  key={hw.id}
                  className="flex items-center gap-4 p-4 rounded-3xl hover:bg-slate-50 transition-all border border-slate-50"
                >
                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold ${
                      hw.status === "Done"
                        ? "bg-emerald-100 text-emerald-600"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {hw.status === "Done" ? (
                      <CheckCircle2 size={20} />
                    ) : (
                      <AlertCircle size={20} />
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-black text-slate-800 leading-none mb-1">
                      {hw.subject}
                    </h4>
                    <p className="text-xs font-bold text-slate-400 capitalize">
                      {hw.task}
                    </p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`text-[10px] font-black uppercase px-2 py-1 rounded-lg ${
                        hw.dueDate === "Tomorrow"
                          ? "bg-rose-100 text-rose-600"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {hw.dueDate}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-900 to-indigo-700 p-8 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden group">
            <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-white/5 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <Target className="text-indigo-300" />
                <h3 className="text-xl font-black">Goals</h3>
              </div>
              <p className="text-indigo-100 text-sm font-medium leading-relaxed mb-4">
                Complete all Physics assignments before Sunday to unlock the
                "Science Wizard" badge!
              </p>
              <div className="w-full bg-white/10 rounded-full h-1.5 mb-2">
                <div
                  className="bg-indigo-300 h-1.5 rounded-full"
                  style={{ width: "65%" }}
                ></div>
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-indigo-200">
                65% Progress
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Financial sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Financial Overview */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col group">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl group-hover:rotate-12 transition-transform">
                <Wallet size={24} />
              </div>
              <h3 className="text-xl font-black text-slate-800 tracking-tight">
                Financial Overview
              </h3>
            </div>
            <span className="text-[10px] font-black uppercase px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full tracking-widest">
              Live Balance
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="p-4 rounded-3xl bg-slate-50 border border-slate-50">
              <p className="text-[10px] font-black uppercase text-slate-400 mb-1 tracking-widest">
                Total Fees
              </p>
              <h4 className="text-lg font-black text-slate-800">
                {studentFinance.totalFees}
              </h4>
            </div>
            <div className="p-4 rounded-3xl bg-emerald-50/50 border border-emerald-100/50">
              <p className="text-[10px] font-black uppercase text-emerald-600 mb-1 tracking-widest">
                Paid
              </p>
              <h4 className="text-lg font-black text-emerald-700">
                {studentFinance.paidAmount}
              </h4>
            </div>
            <div className="p-4 rounded-3xl bg-rose-50/50 border border-rose-100/50">
              <p className="text-[10px] font-black uppercase text-rose-600 mb-1 tracking-widest">
                Balance
              </p>
              <h4 className="text-lg font-black text-rose-700">
                {studentFinance.balanceAmount}
              </h4>
            </div>
          </div>

          <div className="space-y-4 flex-1">
            <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
              <Receipt size={16} className="text-emerald-500" />
              Recent Activities
            </h4>
            <div className="space-y-3">
              {studentFinance.transactions.map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between p-3 rounded-2xl border border-slate-50 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-emerald-500 transition-colors">
                      <ArrowUpRight size={14} />
                    </div>
                    <div>
                      <p className="text-xs font-black text-slate-700 leading-none">
                        {tx.title}
                      </p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">
                        {tx.date}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-black text-slate-800">
                      {tx.amount}
                    </p>
                    <p className="text-[9px] font-black text-emerald-600 uppercase">
                      Successful
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Payment Method */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col group">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl group-hover:rotate-12 transition-transform">
                <CreditCard size={24} />
              </div>
              <h3 className="text-xl font-black text-slate-800 tracking-tight">
                Payment Method
              </h3>
            </div>
            <button className="text-[10px] font-black text-indigo-600 uppercase hover:underline">
              Manage Methods
            </button>
          </div>

          <div className="space-y-6 mb-8">
            {studentFinance.savedCards.map((card) => (
              <div
                key={card.id}
                className={`relative p-6 h-40 rounded-[2rem] text-white shadow-lg overflow-hidden transition-transform hover:-translate-y-1 ${
                  card.color === "indigo"
                    ? "bg-gradient-to-br from-indigo-600 to-indigo-800"
                    : "bg-gradient-to-br from-slate-700 to-slate-900"
                }`}
              >
                <div className="absolute top-0 right-0 p-6 opacity-20">
                  <CreditCard size={80} strokeWidth={1} />
                </div>
                <div className="relative z-10 flex flex-col h-full justify-between">
                  <div className="flex justify-between items-start">
                    <div className="w-10 h-7 bg-white/20 rounded-md backdrop-blur-sm border border-white/10" />
                    <span className="text-xs font-black italic tracking-widest">
                      {card.type}
                    </span>
                  </div>
                  <div>
                    <p className="text-lg font-black tracking-[0.2em] mb-1">
                      •••• •••• •••• {card.last4}
                    </p>
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-[8px] font-black uppercase tracking-widest opacity-60">
                          Expiry
                        </p>
                        <p className="text-xs font-bold leading-none">
                          {card.expiry}
                        </p>
                      </div>
                      <div className="px-2 py-1 rounded-lg bg-white text-indigo-900 text-[10px] font-black uppercase">
                        Active
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-auto">
            <button className="w-full py-4 bg-slate-900 text-white rounded-[1.5rem] font-black flex items-center justify-center gap-2 hover:bg-emerald-600 transition-all shadow-lg hover:shadow-emerald-200">
              Proceed to Pay Fees
              <ArrowUpRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Upcoming Exams Row */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-8 py-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
          <h3 className="text-xl font-black text-slate-800 tracking-tight">
            Exam Schedule
          </h3>
          <button className="text-emerald-600 text-sm font-bold hover:underline">
            Download Admit Card
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 divide-x divide-slate-50">
          {upcomingExams.map((exam, idx) => (
            <div
              key={idx}
              className="p-8 hover:bg-slate-50 transition-colors group"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl group-hover:bg-emerald-600 group-hover:text-white transition-all">
                  <Calendar size={20} />
                </div>
                <div>
                  <h4 className="font-black text-slate-800 leading-none">
                    {exam.subject}
                  </h4>
                  <p className="text-xs font-bold text-slate-400 mt-1">
                    {exam.time}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-lg font-black text-slate-700">
                  {exam.date}
                </span>
                <button className="p-2 border border-slate-100 rounded-xl hover:bg-white hover:border-emerald-200 text-slate-300 hover:text-emerald-600 transition-all">
                  <ArrowUpRight size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
