import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchAllStudents,
  fetchAllTeachers,
  fetchAllClasses,
} from "../../redux/slices/adminSlice";
import {
  Users,
  GraduationCap,
  TrendingUp,
  Plus,
  Calendar,
  Activity,
  ClipboardCheck,
  CreditCard,
  ClipboardList,
  Mail,
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
  Legend,
} from "recharts";
import DataTable from "../../components/ui/DataTable";
import StatCard from "../../components/ui/StatCard";
import useAsync from "../../hooks/useAsync";
import { apiService } from "../../services/apiService";

const COLORS = ["#6366f1", "#10b981", "#f59e0b", "#f43f5e", "#8b5cf6", "#14b8a6"];
const inr = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;
const localDate = (d = new Date()) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

export default function AdminDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { students, teachers, status, error, teachersError } = useSelector((state) => state.admin);

  const today = localDate();
  const live = useAsync(async () => {
    const [payments, attendance] = await Promise.all([
      apiService.getFeePayments(),
      apiService.attendance.list({ Type: "STUDENT", Date: today }),
    ]);
    return { payments: payments || [], attendance: attendance || [] };
  });

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchAllStudents());
      dispatch(fetchAllTeachers());
      dispatch(fetchAllClasses());
    }
  }, [status, dispatch]);

  const dashboardStudents = useMemo(
    () =>
      students.map((student) => ({
        ...student,
        name: [student.firstName, student.lastName].filter(Boolean).join(" "),
        classId: student.class || student.classModel?.name || student.classId,
      })),
    [students],
  );

  const payments = live.data?.payments || [];
  const attendance = live.data?.attendance || [];

  const summary = useMemo(() => {
    const month = today.slice(0, 7);
    const dayOf = (p) => (p.paidOn ? String(p.paidOn).slice(0, 10) : "");
    const todayTotal = payments
      .filter((p) => dayOf(p) === today)
      .reduce((t, p) => t + Number(p.paidAmount || 0), 0);
    const monthTotal = payments
      .filter((p) => dayOf(p).slice(0, 7) === month)
      .reduce((t, p) => t + Number(p.paidAmount || 0), 0);
    const total = payments.reduce((t, p) => t + Number(p.paidAmount || 0), 0);

    const months = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({
        key: localDate(d).slice(0, 7),
        name: d.toLocaleString("en", { month: "short" }),
        collected: 0,
      });
    }
    const typeMap = {};
    payments.forEach((p) => {
      const slot = months.find((m) => m.key === dayOf(p).slice(0, 7));
      if (slot) slot.collected += Number(p.paidAmount || 0);
      const name = p.feeType?.name || "Other";
      typeMap[name] = (typeMap[name] || 0) + Number(p.paidAmount || 0);
    });

    const present = attendance.filter((a) => a.status === "Present" || a.status === "Late").length;
    return {
      todayTotal,
      monthTotal,
      total,
      monthly: months,
      byType: Object.entries(typeMap).map(([name, value]) => ({ name, value })),
      marked: attendance.length,
      present,
    };
  }, [payments, attendance, today]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center p-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
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
    { header: "Admission Date", accessor: "admissionDate", width: 150 },
    {
      header: "Action",
      accessor: "id",
      width: 120,
      render: (row) => (
        <button
          onClick={() => navigate(`/admin/student/view/${row.id}`)}
          className="bg-slate-50 text-slate-500 px-4 py-1.5 rounded-xl text-xs font-black uppercase tracking-tight hover:bg-slate-100 hover:text-slate-900 transition-all"
        >
          Details
        </button>
      ),
    },
  ];

  const recentPayments = [...payments]
    .sort((a, b) => String(b.paidOn || "").localeCompare(String(a.paidOn || "")))
    .slice(0, 6);

  const emptyChart = (text) => (
    <div className="flex h-full items-center justify-center text-sm font-medium text-slate-400">{text}</div>
  );

  return (
    <div className="space-y-10 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-xl shadow-sm border border-slate-100">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Welcome back,{" "}
            <span className="text-indigo-600">{user?.name || "Admin"}</span>!
          </h1>
          <p className="text-slate-500 font-medium flex items-center gap-2">
            <Calendar size={16} />
            Here's what's happening in your school today.
          </p>
        </div>

        {(error || teachersError || live.error) && (
          <p role="alert" className="rounded-xl bg-rose-50 p-4 text-sm font-medium text-rose-700">
            {error || teachersError || live.error}
          </p>
        )}

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/admin/student/add")}
            className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 active:scale-95"
          >
            <Plus size={18} className="stroke-[3]" />
            New Admission
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 xl:gap-6">
        <StatCard
          title="Today's Fee Collection"
          value={live.loading ? "…" : inr(summary.todayTotal)}
          subValue={live.loading ? "…" : inr(summary.monthTotal)}
          subLabel="This Month"
          icon={<TrendingUp size={16} />}
          color="emerald"
        />
        <StatCard
          title="Total Collected"
          value={live.loading ? "…" : inr(summary.total)}
          subValue={payments.length.toLocaleString()}
          subLabel="Payments"
          icon={<CreditCard size={16} />}
          color="rose"
        />
        <StatCard
          title="Total Students"
          value={students.length.toLocaleString()}
          subLabel="Current enrollment"
          icon={<GraduationCap size={16} />}
          color="indigo"
        />
        <StatCard
          title="Teachers"
          value={teachers.length.toLocaleString()}
          subLabel="Current teachers"
          icon={<Users size={16} />}
          color="amber"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 xl:gap-8">
        <div className="lg:col-span-2 bg-white p-6 xl:p-8 rounded-xl border border-slate-100 shadow-sm">
          <h3 className="text-xl xl:text-2xl font-black text-slate-800 tracking-tight mb-8">
            Fee Collection (Last 6 Months)
          </h3>
          <div className="h-[18rem] w-full mt-2">
            {live.loading ? (
              emptyChart("Loading…")
            ) : payments.length === 0 ? (
              emptyChart("No fee payments recorded yet.")
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={summary.monthly} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 12, fontWeight: 600 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 12, fontWeight: 600 }} />
                  <Tooltip
                    cursor={{ fill: "#f8fafc" }}
                    formatter={(v) => inr(v)}
                    contentStyle={{ borderRadius: "16px", border: "none", boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)" }}
                  />
                  <Bar dataKey="collected" name="Collected" fill="#6366f1" radius={[6, 6, 0, 0]} barSize={28} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="bg-white p-6 xl:p-8 rounded-xl border border-slate-100 shadow-sm flex flex-col">
          <h3 className="text-xl xl:text-2xl font-black text-slate-800 tracking-tight mb-6">
            Collection by Fee Type
          </h3>
          <div className="h-[16rem] w-full">
            {live.loading ? (
              emptyChart("Loading…")
            ) : summary.byType.length === 0 ? (
              emptyChart("No fee payments recorded yet.")
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={summary.byType} cx="50%" cy="50%" innerRadius="60%" outerRadius="85%" paddingAngle={6} dataKey="value">
                    {summary.byType.map((entry, index) => (
                      <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => inr(v)} />
                  <Legend iconType="circle" wrapperStyle={{ fontWeight: 700, fontSize: "12px" }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
          <div className="mt-6 rounded-2xl border border-slate-100 bg-slate-50/60 p-5">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Today's Student Attendance
            </p>
            <p className="mt-1 text-xl font-black text-slate-800">
              {live.loading
                ? "…"
                : summary.marked === 0
                  ? "Not marked yet"
                  : `${summary.present} / ${summary.marked} present`}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="px-8 py-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
            <h3 className="text-xl font-black text-slate-800 tracking-tight">Recent Enrolled Students</h3>
            <button onClick={() => navigate("/admin/student")} className="text-indigo-600 text-sm font-bold hover:underline">
              View All
            </button>
          </div>
          <div className="overflow-x-auto px-4 pb-4">
            <DataTable
              columns={recentStudentColumns}
              data={dashboardStudents.slice(0, 5)}
              rowKey="id"
              tableClassName="min-w-full"
              containerClassName="bg-transparent shadow-none border-0"
            />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
          <div className="px-6 py-5 border-b border-slate-50 bg-slate-50/50">
            <h3 className="text-lg font-black text-slate-800 tracking-tight flex items-center gap-2">
              <Activity size={18} className="text-emerald-500" />
              Recent Fee Payments
            </h3>
          </div>
          <div className="p-6 flex-1 space-y-4">
            {live.loading ? (
              <p className="text-sm text-slate-400">Loading…</p>
            ) : recentPayments.length === 0 ? (
              <p className="text-sm text-slate-400">No fee payments recorded yet.</p>
            ) : (
              recentPayments.map((p) => (
                <div key={p.id} className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-bold text-slate-800">
                      {[p.student?.firstName, p.student?.lastName].filter(Boolean).join(" ") || p.studentId}
                    </p>
                    <p className="text-[11px] font-bold text-slate-400 uppercase">
                      {p.feeType?.name || "Fee"} • {p.paidOn ? String(p.paidOn).slice(0, 10) : "—"}
                    </p>
                  </div>
                  <span className="text-sm font-black text-emerald-600">{inr(p.paidAmount)}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 rounded-xl text-white shadow-xl">
        <h3 className="text-lg font-black text-white mb-6">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <QuickActionItem label="Mark Attendance" icon={<ClipboardCheck size={18} />} onClick={() => navigate("/admin/attendance")} />
          <QuickActionItem label="Collect Fees" icon={<CreditCard size={18} />} onClick={() => navigate("/admin/fees")} />
          <QuickActionItem label="Exams" icon={<ClipboardList size={18} />} onClick={() => navigate("/admin/exam")} />
          <QuickActionItem label="Communicate" icon={<Mail size={18} />} onClick={() => navigate("/admin/communicate")} />
        </div>
      </div>
    </div>
  );
}

function QuickActionItem({ label, icon, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-2 p-3 bg-white/10 hover:bg-white/20 rounded-2xl transition-all border border-white/5 active:scale-95"
    >
      <div className="p-2 bg-white/10 rounded-xl">{icon}</div>
      <span className="text-[10px] font-bold text-center leading-tight">{label}</span>
    </button>
  );
}
