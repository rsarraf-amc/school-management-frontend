import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { UserCheck, Calendar, FileText, Clock, Users, CheckCircle, XCircle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, AreaChart, Area } from "recharts";
import SectionCard from "../../ui/SectionCard";
import QuickActionCard from "../../ui/QuickActionCard";
import StatCard from "../../ui/StatCard";
import { apiService } from "../../../services/apiService";
import useAsync from "../../../hooks/useAsync";

const dayKey = (d) => d.toISOString().split("T")[0];
const pct = (rows) => {
  if (!rows.length) return null;
  const ok = rows.filter((r) => r.status === "Present" || r.status === "Late").length
    + rows.filter((r) => r.status === "Half Day").length * 0.5;
  return Math.round((ok / rows.length) * 100);
};

const AttendanceHub = () => {
  const navigate = useNavigate();

  const modules = useMemo(
    () => [
      { label: "Manual Attendance", icon: UserCheck, color: "text-emerald-600", path: "manual" },
      { label: "Daily Attendance", icon: Clock, color: "text-indigo-600", path: "daily" },
      { label: "Attendance Report", icon: FileText, color: "text-amber-600", path: "report" },
    ],
    [],
  );

  const { data, loading, error } = useAsync(async () => {
    const [records, students] = await Promise.all([
      apiService.attendance.list({ Type: "STUDENT" }),
      apiService.getAllStudents(),
    ]);
    return { records, students };
  }, { records: [], students: [] });

  const { stats, weekly, monthly } = useMemo(() => {
    const todayKey = dayKey(new Date());
    const todays = data.records.filter((r) => String(r.date) === todayKey);
    const count = (list, s) => list.filter((r) => r.status === s).length;
    const avg = pct(data.records);

    const weekly = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const rows = data.records.filter((r) => String(r.date) === dayKey(d));
      weekly.push({
        day: d.toLocaleDateString(undefined, { weekday: "short" }),
        present: count(rows, "Present"),
        absent: count(rows, "Absent"),
        late: count(rows, "Late"),
      });
    }

    const monthly = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setDate(1);
      d.setMonth(d.getMonth() - i);
      const prefix = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      const rows = data.records.filter((r) => String(r.date).startsWith(prefix));
      monthly.push({ month: d.toLocaleDateString(undefined, { month: "short" }), attendance: pct(rows) ?? 0 });
    }

    return {
      stats: {
        present: count(todays, "Present"),
        absent: count(todays, "Absent"),
        leave: count(todays, "Leave"),
        avg: avg == null ? "-" : `${avg}%`,
        total: data.students.length,
      },
      weekly,
      monthly,
    };
  }, [data]);

  return (
    <div className="space-y-8">
      <SectionCard title="Quick Actions" description="Daily attendance workflows and reporting">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 p-6 pt-2">
          {modules.map((mod) => (
            <QuickActionCard key={mod.path} icon={mod.icon} label={mod.label} color={mod.color} onClick={() => navigate(mod.path)} />
          ))}
        </div>
      </SectionCard>

      {error && <div className="p-4 rounded-2xl bg-rose-50 text-rose-700 text-sm font-medium">{error}</div>}
      {loading ? (
        <div className="p-8 text-center text-sm font-medium text-slate-500">Loading...</div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard title="Present Today" value={stats.present} subValue={stats.total} subLabel="Total Students" icon={<CheckCircle size={20} />} color="emerald" />
            <StatCard title="Absent Today" value={stats.absent} icon={<XCircle size={20} />} color="rose" />
            <StatCard title="On Leave" value={stats.leave} icon={<Calendar size={20} />} color="amber" />
            <StatCard title="Avg Attendance" value={stats.avg} icon={<Users size={20} />} color="indigo" />
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <SectionCard title="Weekly Attendance Distribution">
              <div className="p-6 h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weekly}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} />
                    <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} />
                    <Tooltip contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)" }} cursor={{ fill: "#f8fafc" }} />
                    <Legend iconType="circle" />
                    <Bar dataKey="present" fill="#10b981" radius={[4, 4, 0, 0]} name="Present" />
                    <Bar dataKey="absent" fill="#ef4444" radius={[4, 4, 0, 0]} name="Absent" />
                    <Bar dataKey="late" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Late" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </SectionCard>

            <SectionCard title="Monthly Attendance Trends (%)">
              <div className="p-6 h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthly}>
                    <defs>
                      <linearGradient id="colorAttend" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1} />
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} />
                    <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} />
                    <Tooltip contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)" }} />
                    <Area type="monotone" dataKey="attendance" stroke="#6366f1" strokeWidth={4} fillOpacity={1} fill="url(#colorAttend)" dot={{ r: 4, fill: "#6366f1", strokeWidth: 2, stroke: "#fff" }} activeDot={{ r: 6, strokeWidth: 0 }} name="Attendance %" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </SectionCard>
          </div>
        </>
      )}
    </div>
  );
};

export default AttendanceHub;
