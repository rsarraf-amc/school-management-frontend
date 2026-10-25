import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  BookOpen, CheckSquare, FileText, CheckCircle, Clock
} from "lucide-react";
import {
  PieChart, Pie, Cell, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import SectionCard from "../../ui/SectionCard";
import QuickActionCard from "../../ui/QuickActionCard";
import StatCard from "../../ui/StatCard";
import { homeworkStats } from "../../../mock/homeworkData";

const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#6366f1", "#8b5cf6"];

const HomeworkHub = () => {
  const navigate = useNavigate();

  const modules = useMemo(
    () => [
      { label: "Add Homework", icon: BookOpen, color: "text-indigo-600", path: "add" },
      { label: "Submission Details", icon: CheckSquare, color: "text-emerald-600", path: "submissions" },
    ],
    []
  );

  return (
    <div className="space-y-8">
      {/* Quick Actions Grid */}
      <SectionCard title="Quick Actions" description="Homework management workflows">
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
        <StatCard title="Total Assignments" value={homeworkStats.totalAssignments} icon={<FileText size={20} />} color="indigo" />
        <StatCard title="Evaluated" value={homeworkStats.evaluated} icon={<CheckCircle size={20} />} color="emerald" trend="+12%" />
        <StatCard title="Pending Evaluation" value={homeworkStats.pendingEvaluation} icon={<Clock size={20} />} color="amber" isPositive={false} trend="-5%" />
        <StatCard title="Avg Completion" value={homeworkStats.avgCompletionRate} icon={<CheckSquare size={20} />} color="blue" />
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        <SectionCard title="Subject Distribution">
          <div className="p-6 h-[300px] flex items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={homeworkStats.subjectDistribution} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {homeworkStats.subjectDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-col gap-2 pr-4">
               {homeworkStats.subjectDistribution.map((entry, index) => (
                 <div key={index} className="flex items-center gap-2">
                   <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                   <span className="text-xs font-bold text-slate-600 uppercase tracking-tighter">{entry.name} ({entry.value})</span>
                 </div>
               ))}
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Weekly Trend">
          <div className="p-6 h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={homeworkStats.weeklyTrend}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="assigned" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Assigned" />
                <Bar dataKey="submitted" fill="#10b981" radius={[4, 4, 0, 0]} name="Submitted" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>
      </div>
    </div>
  );
};

export default HomeworkHub;
