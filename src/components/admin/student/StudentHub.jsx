import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  UserPlus,
  FileText,
  History,
  Key,
  Users,
  ListFilter,
  BookOpen,
  Users as UsersIcon,
  UserCheck,
} from "lucide-react";

import SectionCard from "../../ui/SectionCard";
import QuickActionCard from "../../ui/QuickActionCard";
import StatCard from "../../ui/StatCard";
import useAsync from "../../../hooks/useAsync";
import { apiService } from "../../../services/apiService";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7c7c"];

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";

// const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7c7c"];

const StudentHub = () => {
  const navigate = useNavigate();
  const { data, error } = useAsync(() => apiService.getAllStudents());
  const students = useMemo(() => data || [], [data]);

  /* -------------------- Quick Modules -------------------- */
  const modules = useMemo(
    () => [
      {
        label: "Student Admission",
        icon: UserPlus,
        color: "text-blue-600",
        path: "add",
      },
      {
        label: "Student Details",
        icon: Users,
        color: "text-indigo-600",
        path: "list",
      },
      {
        label: "Admission Report",
        icon: FileText,
        color: "text-purple-600",
        path: "admission-report",
      },
      {
        label: "Student History",
        icon: History,
        color: "text-amber-600",
        path: "history",
      },
      {
        label: "Login Credentials",
        icon: Key,
        color: "text-emerald-600",
        path: "login-credentials",
      },
      {
        label: "Student Category",
        icon: ListFilter,
        color: "text-rose-600",
        path: "category",
      },
      {
        label: "Assign Subject",
        icon: BookOpen,
        color: "text-cyan-600",
        path: "assign-subject",
      },
    ],
    [],
  );

  /* -------------------- Stats -------------------- */
  const stats = useMemo(
    () => ({
      total: students.length,
      male: students.filter((s) => s.gender === "Male").length,
      female: students.filter((s) => s.gender === "Female").length,
    }),
    [students],
  );

  /* -------------------- Class Distribution -------------------- */
  const classChartData = useMemo(() => {
    const map = {};
    students.forEach((s) => {
      const cls = s.class || "Unknown";
      map[cls] = (map[cls] || 0) + 1;
    });

    return Object.entries(map)
      .map(([cls, count]) => ({ class: cls, count }))
      .sort((a, b) => a.class.localeCompare(b.class, undefined, { numeric: true }));
  }, [students]);

  /* -------------------- Gender Distribution -------------------- */
  const genderChartData = useMemo(() => {
    const map = {};
    students.forEach((s) => {
      const g = s.gender || "Unknown";
      map[g] = (map[g] || 0) + 1;
    });

    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [students]);

  /* -------------------- Monthly Admissions -------------------- */
  const admissionTrendData = useMemo(() => {
    const map = {};
    students.forEach((s) => {
      const month = String(s.admissionDate || s.createdAt || "").slice(0, 7);
      if (month) map[month] = (map[month] || 0) + 1;
    });
    return Object.entries(map)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, admissions]) => ({ month, admissions }));
  }, [students]);

  return (
    <div className="space-y-8">
      {/* -------------------- Quick Actions -------------------- */}
      <SectionCard
        title="Quick Actions"
        description="Access student modules quickly"
      >
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 p-6 pt-2">
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
      {/* ------- Stats ------- */}
      {error && <p className="text-sm font-bold text-rose-600">{error}</p>}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          title="Total Students"
          value={stats.total}
          icon={<UsersIcon size={20} />}
          color="indigo"
        />
        <StatCard
          title="Male Students"
          value={stats.male}
          icon={<UserCheck size={20} />}
          color="emerald"
        />
        <StatCard
          title="Female Students"
          value={stats.female}
          icon={<UserCheck size={20} />}
          color="amber"
        />
      </div>

      {/* -------------------- Charts -------------------- */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Class */}
        <SectionCard title="Student Distribution by Class">
          <div className="p-6">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={classChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="class" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#8884d8" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

        {/* Gender */}
        <SectionCard title="Gender Distribution">
          <div className="p-6">
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPieChart>
                <Pie
                  data={genderChartData}
                  dataKey="value"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                >
                  {genderChartData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

        {/* Trends */}
        <SectionCard title="Monthly Admission Trends">
          <div className="p-6">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={admissionTrendData}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="admissions"
                  stroke="#8884d8"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>
      </div>
    </div>
  );
};

export default StudentHub;
