import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Users, BookOpen, ClipboardCheck, Calendar, GraduationCap } from "lucide-react";
import DataTable from "../../components/ui/DataTable";
import StatCard from "../../components/ui/StatCard";
import useAsync from "../../hooks/useAsync";
import { apiService } from "../../services/apiService";

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const hhmm = (t) => (t ? String(t).slice(0, 5) : "—");

export default function TeacherDashboard() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const now = new Date();
  const dayName = DAYS[now.getDay()];

  const { data, loading, error } = useAsync(async () => {
    const [classes, timetable] = await Promise.all([
      apiService.teacherSelf.classes(),
      apiService.teacherSelf.timetable(),
    ]);
    return { classes: classes || [], timetable: timetable || [] };
  });

  const classes = data?.classes || [];
  const studentTotal = classes.reduce((sum, c) => sum + (c.studentCount || 0), 0);
  const schedule = (data?.timetable || [])
    .filter((entry) => entry.dayOfWeek === dayName)
    .sort((a, b) => String(a.startTime).localeCompare(String(b.startTime)));

  const classRows = classes.map((c) => ({
    id: c.id,
    name: c.name,
    studentCount: c.studentCount,
    periods: c.periodsPerWeek,
  }));

  const classColumns = [
    { header: "Class Name", accessor: "name", width: 220 },
    {
      header: "Students",
      accessor: "studentCount",
      render: (row) => (
        <span className="text-xs font-black text-slate-600">{row.studentCount} Students</span>
      ),
    },
    { header: "Periods / Week", accessor: "periods" },
  ];

  const scheduleColumns = [
    {
      header: "Time",
      render: (row) => (
        <span className="text-xs font-black text-slate-600">
          {hhmm(row.startTime)} – {hhmm(row.endTime)}
        </span>
      ),
    },
    { header: "Class", render: (row) => row.class?.name || "—" },
    { header: "Subject", render: (row) => row.subject?.name || "—" },
    { header: "Room", render: (row) => row.room || "—" },
  ];

  return (
    <div className="space-y-10 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Greetings, <span className="text-violet-600">{user?.name || "Teacher"}</span>
          </h1>
          <p className="text-slate-500 font-medium flex items-center gap-2">
            <Calendar size={16} />
            {now.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}
            {!loading && !error && ` • ${schedule.length} sessions in today's school timetable`}
          </p>
        </div>
        <button
          onClick={() => navigate("/admin/attendance")}
          className="flex items-center gap-2 bg-violet-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-violet-700 transition-all shadow-lg shadow-violet-200 active:scale-95"
        >
          <ClipboardCheck size={18} className="stroke-[3]" />
          Mark Attendance
        </button>
      </div>

      {error && (
        <p role="alert" className="rounded-xl bg-rose-50 p-5 text-sm font-medium text-rose-700">
          {error}
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Classes" value={loading ? "…" : classes.length} icon={<BookOpen size={20} />} color="violet" />
        <StatCard title="Students" value={loading ? "…" : studentTotal} icon={<GraduationCap size={20} />} color="indigo" />
        <StatCard title="Sessions Today" value={loading ? "…" : schedule.length} icon={<Users size={20} />} color="amber" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
          <div className="px-8 py-6 border-b border-slate-50 bg-slate-50/50">
            <h3 className="text-xl font-black text-slate-800 tracking-tight">Today's Timetable ({dayName})</h3>
          </div>
          <DataTable columns={scheduleColumns} data={schedule} rowKey="id" />
        </div>
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
          <div className="px-8 py-6 border-b border-slate-50 bg-slate-50/50">
            <h3 className="text-xl font-black text-slate-800 tracking-tight">Classes</h3>
          </div>
          <DataTable columns={classColumns} data={classRows} rowKey="id" />
        </div>
      </div>
    </div>
  );
}
