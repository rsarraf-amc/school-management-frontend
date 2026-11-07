import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  Users,
  Layers,
  Calendar,
  UserPlus,
  ArrowUpCircle,
  FileText,
  Clock,
  PlusCircle,
  Settings,
  Grid
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";
import SectionCard from "../../ui/SectionCard";
import QuickActionCard from "../../ui/QuickActionCard";
import StatCard from "../../ui/StatCard";
import { academicsStats } from "../../../mock/academicsData";

const COLORS = ["#10b981", "#ef4444", "#6366f1", "#f59e0b"];

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
    []
  );

  return (
    <div className="space-y-8">
      {/* Quick Actions Grid */}
      <div className="grid gap-6 lg:grid-cols-1">
        {actionGroups.map((group) => (
          <SectionCard key={group.title} title={group.title}>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 p-6 pt-2">
              {group.items.map((item) => (
                <QuickActionCard
                  key={item.label}
                  icon={item.icon}
                  label={item.label}
                  color={item.color}
                  onClick={() => navigate(item.path)}
                />
              ))}
            </div>
          </SectionCard>
        ))}
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Classes"
          value={academicsStats.totalClasses}
          icon={<Layers size={20} />}
          color="indigo"
        />
        <StatCard
          title="Subjects"
          value={academicsStats.totalSubjects}
          icon={<BookOpen size={20} />}
          color="emerald"
        />
        <StatCard
          title="Faculty"
          value={academicsStats.totalTeachers}
          icon={<Users size={20} />}
          color="amber"
        />
        <StatCard
          title="Promotion Rate"
          value={academicsStats.avgPromotionRate}
          icon={<ArrowUpCircle size={20} />}
          color="rose"
        />
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        <SectionCard title="Promotion Success Rate">
          <div className="p-6 h-[300px] flex items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={academicsStats.promotionRateData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {academicsStats.promotionRateData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-col gap-2 pr-4">
               {academicsStats.promotionRateData.map((entry, index) => (
                 <div key={index} className="flex items-center gap-2">
                   <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                   <span className="text-xs font-bold text-slate-600 uppercase tracking-tighter">{entry.name} ({entry.value}%)</span>
                 </div>
               ))}
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Student Load by Class">
          <div className="p-6 h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={academicsStats.classDistributionData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>
      </div>
    </div>
  );
};

export default AcademicsHub;
