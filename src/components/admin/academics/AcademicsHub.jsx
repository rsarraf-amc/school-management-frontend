import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  BookOpen, Users, Layers, Calendar, UserPlus, ArrowUpCircle, FileText, Clock, PlusCircle, Settings, Grid,
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import SectionCard from "../../ui/SectionCard";
import QuickActionCard from "../../ui/QuickActionCard";
import StatCard from "../../ui/StatCard";
import { apiService } from "../../../services/apiService";
import useAsync from "../../../hooks/useAsync";

const AcademicsHub = () => {
  const navigate = useNavigate();

  const actionGroups = useMemo(
    () => [
      {
        title: "Academic Setup",
        items: [
          { label: "Subjects", icon: BookOpen, color: "text-emerald-600", path: "subjects" },
          { label: "Class", icon: Layers, color: "text-indigo-600", path: "class-sections" },
          { label: "Sections", icon: Grid, color: "text-amber-600", path: "class-sections" },
          { label: "Holidays", icon: Calendar, color: "text-rose-600", path: "holidays" },
        ],
      },
      {
        title: "Operations & Promotion",
        items: [
          { label: "Assign Subjects", icon: UserPlus, color: "text-blue-600", path: "assign-subjects" },
          { label: "Promote Students", icon: ArrowUpCircle, color: "text-emerald-600", path: "promote" },
          { label: "Transfer Certificate", icon: FileText, color: "text-violet-600", path: "certificates" },
        ],
      },
      {
        title: "TimeTable & Scheduling",
        items: [
          { label: "TimeTable", icon: Clock, color: "text-indigo-600", path: "timetable" },
          { label: "Create Time Group", icon: PlusCircle, color: "text-amber-600", path: "timetable" },
          { label: "Assign TimeGroup", icon: Settings, color: "text-emerald-600", path: "timetable" },
        ],
      },
    ],
    [],
  );

  const { data, loading, error } = useAsync(async () => {
    const [classes, subjects, teachers, students] = await Promise.all([
      apiService.getAllClasses(),
      apiService.timetable.subjects.list(),
      apiService.getAllTeachers(),
      apiService.getAllStudents(),
    ]);
    return { classes, subjects, teachers, students };
  }, { classes: [], subjects: [], teachers: [], students: [] });

  const classLoad = useMemo(
    () => data.classes.map((c) => ({
      name: c.name,
      count: data.students.filter((s) => String(s.classId) === String(c.id)).length,
    })),
    [data],
  );

  return (
    <div className="space-y-8">
      <div className="grid gap-6 lg:grid-cols-1">
        {actionGroups.map((group) => (
          <SectionCard key={group.title} title={group.title}>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 p-6 pt-2">
              {group.items.map((item) => (
                <QuickActionCard key={item.label} icon={item.icon} label={item.label} color={item.color} onClick={() => navigate(item.path)} />
              ))}
            </div>
          </SectionCard>
        ))}
      </div>

      {error && <div className="p-4 rounded-2xl bg-rose-50 text-rose-700 text-sm font-medium">{error}</div>}
      {loading ? (
        <div className="p-8 text-center text-sm font-medium text-slate-500">Loading...</div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard title="Total Classes" value={data.classes.length} icon={<Layers size={20} />} color="indigo" />
            <StatCard title="Subjects" value={data.subjects.length} icon={<BookOpen size={20} />} color="emerald" />
            <StatCard title="Faculty" value={data.teachers.length} icon={<Users size={20} />} color="amber" />
            <StatCard title="Students" value={data.students.length} icon={<Users size={20} />} color="rose" />
          </div>

          <SectionCard title="Student Load by Class">
            <div className="p-6 h-[300px]">
              {classLoad.length ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={classLoad}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} />
                    <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} />
                    <Tooltip cursor={{ fill: "#f8fafc" }} contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)" }} />
                    <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} name="Students" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-sm font-medium text-slate-500">No classes found.</div>
              )}
            </div>
          </SectionCard>
        </>
      )}
    </div>
  );
};

export default AcademicsHub;
