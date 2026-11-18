import { useSelector } from "react-redux";
import { BookOpen, Calendar, CheckCircle2, ClipboardList, Clock, Wallet } from "lucide-react";
import StatCard from "../../components/ui/StatCard";
import DataTable from "../../components/ui/DataTable";
import useAsync from "../../hooks/useAsync";
import { apiService } from "../../services/apiService";

const today = () => new Date().toISOString().slice(0, 10);
const day = (d) => (d ? String(d).slice(0, 10) : "—");
const hhmm = (t) => (t ? String(t).slice(0, 5) : "—");
const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const money = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;

function Section({ title, icon: Icon, children }) {
  return (
    <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
      <h3 className="px-8 py-6 border-b border-slate-50 bg-slate-50/50 text-xl font-black text-slate-800 tracking-tight flex items-center gap-2">
        <Icon size={20} className="text-emerald-600" />
        {title}
      </h3>
      {children}
    </div>
  );
}

export default function StudentDashboard() {
  const { user } = useSelector((state) => state.auth);
  const { data, loading, error } = useAsync(async () => {
    const self = apiService.studentSelf;
    const [profile, attendance, exams, results, timetable, fees] = await Promise.all([
      self.profile(), self.attendance(), self.exams(), self.results(), self.timetable(), self.fees(),
    ]);
    return { profile, attendance, exams, results, timetable, fees };
  });

  if (loading) return <p className="text-sm font-medium text-slate-500">Loading…</p>;
  if (error) {
    return <p role="alert" className="rounded-xl bg-rose-50 p-5 text-sm font-medium text-rose-700">{error}</p>;
  }

  const { profile, attendance, exams, results, timetable, fees } = data;
  const present = attendance.filter((a) => a.status === "Present").length;
  const attendancePct = attendance.length ? Math.round((present / attendance.length) * 100) : null;
  const upcoming = exams.filter((e) => !e.endDate || day(e.endDate) >= today()).slice(0, 6);
  const todayName = DAYS[new Date().getDay()];
  const todaysClasses = timetable.filter((t) => t.dayOfWeek === todayName);
  const assigned = fees.assignments.reduce(
    (sum, a) => sum + Number(a.customAmount ?? a.feeType?.amount ?? 0),
    0,
  );
  const paid = fees.payments.reduce((sum, p) => sum + Number(p.paidAmount || 0), 0);

  const resultColumns = [
    { header: "Exam", render: (r) => r.examName || "—" },
    { header: "Subject", render: (r) => r.subject || "—" },
    { header: "Marks", render: (r) => `${r.marksObtained} / ${r.maxMarks}` },
    { header: "Grade", render: (r) => r.grade || "—" },
  ];
  const scheduleColumns = [
    { header: "Time", render: (r) => `${hhmm(r.startTime)} – ${hhmm(r.endTime)}` },
    { header: "Subject", render: (r) => r.subject?.name || "—" },
    { header: "Teacher", render: (r) => r.teacher?.name || "—" },
    { header: "Room", render: (r) => r.room || "—" },
  ];

  return (
    <div className="space-y-10 pb-10">
      <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 space-y-1">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Hi, <span className="text-emerald-600">{profile.firstName || user?.name || "Student"}</span>!
        </h1>
        <p className="text-slate-500 font-medium flex items-center gap-2">
          <BookOpen size={16} />
          Class {profile.class || "—"}{profile.section ? ` (${profile.section})` : ""} • Admission No. {profile.admissionNumber}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard title="Attendance" value={attendancePct === null ? "—" : `${attendancePct}%`} icon={<CheckCircle2 size={20} />} color="emerald" />
        <StatCard title="Classes Today" value={todaysClasses.length} icon={<Clock size={20} />} color="indigo" />
        <StatCard title="Upcoming Exams" value={upcoming.length} icon={<Calendar size={20} />} color="amber" />
        <StatCard title="Fees Due" value={money(Math.max(assigned - paid, 0))} icon={<Wallet size={20} />} color="violet" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <Section title={`Today's Timetable (${todayName})`} icon={Clock}>
          <DataTable columns={scheduleColumns} data={todaysClasses} rowKey="id" />
        </Section>
        <Section title="Upcoming Exams" icon={Calendar}>
          <div className="p-8 space-y-4">
            {upcoming.length === 0 && <p className="text-sm font-medium text-slate-400">No upcoming exams scheduled.</p>}
            {upcoming.map((exam) => (
              <div key={exam.id} className="flex items-center justify-between gap-4">
                <p className="font-bold text-slate-800">{exam.name}</p>
                <span className="text-xs font-black text-slate-500">{day(exam.startDate)}</span>
              </div>
            ))}
          </div>
        </Section>
        <Section title="My Results" icon={ClipboardList}>
          <DataTable columns={resultColumns} data={results} rowKey="id" />
        </Section>
      </div>
    </div>
  );
}
