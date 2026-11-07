import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Calendar, Edit3, List, FileText, CreditCard, BarChart2,
  Settings, CheckSquare, Eye, Type, Layers, Info, Award
} from "lucide-react";
import {
  PieChart, Pie, Cell, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import SectionCard from "../../ui/SectionCard";
import QuickActionCard from "../../ui/QuickActionCard";
import StatCard from "../../ui/StatCard";
import { examStats } from "../../../mock/examData";

const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#6366f1", "#8b5cf6"];

const ExamHub = () => {
  const navigate = useNavigate();

  const modules = useMemo(
    () => [
      { label: "Exam", icon: Calendar, color: "text-indigo-600", path: "schedule" },
      { label: "Assign Marks", icon: Edit3, color: "text-emerald-600", path: "assign-marks" },
      { label: "Exam List", icon: List, color: "text-blue-600", path: "exam-list" },
      { label: "Single Result", icon: Eye, color: "text-violet-600", path: "single-result" },
      { label: "Admit Card", icon: CreditCard, color: "text-rose-600", path: "admit-card" },
      { label: "Marks Report", icon: BarChart2, color: "text-amber-600", path: "marks-report" },
      { label: "Exam Type", icon: Type, color: "text-slate-600", path: "exam-type" },
      { label: "Assessment", icon: CheckSquare, color: "text-slate-600", path: "assessment" },
      { label: "Observation", icon: FileText, color: "text-slate-600", path: "observation" },
      { label: "Observation Type", icon: Layers, color: "text-slate-600", path: "observation-type" },
      { label: "Exam Grade", icon: Award, color: "text-slate-600", path: "exam-grade" },
      { label: "Exam Instruction", icon: Info, color: "text-slate-600", path: "exam-instruction" },
    ],
    []
  );

  return (
    <div className="space-y-8">
      {/* Quick Actions Grid */}
      <SectionCard title="Quick Actions" description="Examination and result management workflows">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 p-6 pt-2">
          {modules.map((mod) => (
            <QuickActionCard
              key={mod.label}
              icon={mod.icon}
              label={mod.label}
              color={mod.color}
              onClick={() => navigate(mod.path)}
            />
          ))}
        </div>
      </SectionCard>

      {/* Stats Overview */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Upcoming Exams" value={examStats.upcomingExams} icon={<Calendar size={20} />} color="indigo" />
        <StatCard title="Results Published" value={examStats.resultsPublished} icon={<Award size={20} />} color="emerald" trend="+2" />
        <StatCard title="Avg Performance" value={examStats.avgPerformance} icon={<BarChart2 size={20} />} color="blue" trend="+3%" />
        <StatCard title="Grades Defined" value="8" icon={<Settings size={20} />} color="amber" />
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        <SectionCard title="Grade Distribution">
          <div className="p-6 h-[300px] flex items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={examStats.gradeDistribution} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {examStats.gradeDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-col gap-2 pr-4">
               {examStats.gradeDistribution.map((entry, index) => (
                 <div key={index} className="flex items-center gap-2">
                   <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                   <span className="text-xs font-bold text-slate-600 uppercase tracking-tighter">{entry.name} ({entry.value}%)</span>
                 </div>
               ))}
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Performance Trend">
          <div className="p-6 h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={examStats.performanceTrend}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <Tooltip cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '4 4' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                <Area type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" name="Avg Score %" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>
      </div>
    </div>
  );
};

export default ExamHub;
