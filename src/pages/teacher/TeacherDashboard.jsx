import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTeacherClasses } from "../../redux/slices/teacherSlice";
import {
  Users,
  BookOpen,
  ClipboardCheck,
  PencilLine,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Clock,
  MapPin,
  GraduationCap,
} from "lucide-react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import DataTable from "../../components/ui/DataTable";
import StatCard from "../../components/ui/StatCard";

import {
  teacherClassPerformance,
  teacherWeeklySchedule,
  teacherStats,
} from "../../mock/teacherDashboardData.jsx";

export default function TeacherDashboard() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { classes, status, error } = useSelector((state) => state.teacher);

  useEffect(() => {
    if (user && user.id && status === "idle") {
      dispatch(fetchTeacherClasses(user.id));
    }
  }, [status, dispatch, user]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center p-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600"></div>
      </div>
    );
  }

  if (status === "failed") {
    return (
      <p role="alert" className="rounded-xl bg-rose-50 p-5 text-sm font-medium text-rose-700">
        {error}
      </p>
    );
  }

  const classTableColumns = [
    { header: "Class Name", accessor: "name", width: 220 },
    { header: "Subject ID", accessor: "id", width: 120 },
    {
      header: "Students",
      accessor: "studentCount",
      width: 160,
      render: (row) => (
        <span className="text-xs font-black text-slate-600">
          {row.studentCount} Students
        </span>
      ),
    },
    {
      header: "Performance",
      accessor: "id",
      width: 140,
      render: () => (
        <button className="bg-violet-50 text-violet-600 px-4 py-1.5 rounded-xl text-xs font-black uppercase tracking-tight hover:bg-violet-600 hover:text-white transition-all">
          Details
        </button>
      ),
    },
  ];

  const stats = teacherStats;

  return (
    <div className="space-y-10 pb-10">
      {/* Header & Greeting */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Greetings,{" "}
            <span className="text-violet-600">
              Prof. {user?.name || "Teacher"}
            </span>{" "}
            🎓
          </h1>
          <p className="text-slate-500 font-medium flex items-center gap-2">
            <Calendar size={16} />
            Today is Tuesday, 24th March. You have 4 sessions scheduled.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 bg-violet-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-violet-700 transition-all shadow-lg shadow-violet-200 active:scale-95">
            <ClipboardCheck size={18} className="stroke-[3]" />
            Mark Attendance
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      {/* Charts & Schedule */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Class Performance Chart */}
        <div className="xl:col-span-2 bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-black text-slate-800 tracking-tight">
              Class Performance Index
            </h3>
            <div className="px-4 py-2 bg-slate-50 rounded-xl text-xs font-bold text-slate-500 border border-slate-100 uppercase tracking-widest leading-none">
              Avg Marks %
            </div>
          </div>
          <div className="h-[22rem] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={teacherClassPerformance}
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
                  dataKey="avgMarks"
                  fill="#8b5cf6"
                  radius={[6, 6, 0, 0]}
                  barSize={40}
                >
                  {teacherClassPerformance.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.avgMarks > 80 ? "#8b5cf6" : "#a78bfa"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Today's Schedule */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
          <h3 className="text-xl font-black text-slate-800 tracking-tight mb-8">
            Next Sessions
          </h3>
          <div className="space-y-6">
            {teacherWeeklySchedule.map((session, idx) => (
              <div
                key={idx}
                className="group flex items-start gap-4 p-4 rounded-3xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100"
              >
                <div className="flex flex-col items-center justify-center text-[10px] font-black uppercase text-slate-400 min-w-[60px]">
                  <Clock
                    size={16}
                    className="mb-1 text-slate-300 group-hover:text-violet-500 transition-colors"
                  />
                  {session.time.split(" ")[0]}
                  <span className="text-[8px]">
                    {session.time.split(" ")[1]}
                  </span>
                </div>
                <div className="flex-1">
                  <h4 className="font-black text-slate-800 group-hover:text-violet-600 transition-colors leading-tight">
                    {session.subject}
                  </h4>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
                    <span className="flex items-center gap-1 text-[11px] font-bold text-slate-500 uppercase">
                      <GraduationCap size={12} /> {session.class}
                    </span>
                    <span className="flex items-center gap-1 text-[11px] font-bold text-slate-500 uppercase">
                      <MapPin size={12} /> {session.room}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button className="w-full mt-8 py-4 bg-slate-50 rounded-2xl text-xs font-black uppercase tracking-widest text-slate-400 hover:bg-violet-50 hover:text-violet-600 transition-all">
            View Full Timetable →
          </button>
        </div>
      </div>

      {/* Classes Table */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-8 py-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
          <h3 className="text-xl font-black text-slate-800 tracking-tight">
            Assigned Classes Overview
          </h3>
          <button className="text-violet-600 text-sm font-bold hover:underline">
            Manage All
          </button>
        </div>

        <div className="overflow-x-auto px-4 pb-4">
          <DataTable
            columns={classTableColumns}
            data={classes}
            rowKey="id"
            tableClassName="min-w-full"
            containerClassName="bg-transparent shadow-none border-0"
          />
        </div>
      </div>
    </div>
  );
}
