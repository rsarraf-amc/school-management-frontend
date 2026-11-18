import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Calendar, Edit3, List, FileText, CreditCard, BarChart2,
  Settings, CheckSquare, Eye, Type, Layers, Info, Award
} from "lucide-react";
import {
  PieChart, Pie, Cell, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import SectionCard from "../../ui/SectionCard";
import QuickActionCard from "../../ui/QuickActionCard";
import StatCard from "../../ui/StatCard";
import useAsync from "../../../hooks/useAsync";
import { apiService } from "../../../services/apiService";
import { LoadState, EmptyState } from "./ModuleState";

const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#6366f1", "#8b5cf6", "#ef4444"];

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

  const { data, loading, error, reload } = useAsync(async () => {
    const [exams, results] = await Promise.all([apiService.exams.list(), apiService.exams.results.list()]);
    return { exams, results };
  });

  const stats = useMemo(() => {
    if (!data) return null;
    const today = new Date().toISOString().slice(0, 10);
    const { exams, results } = data;
    const pct = (r) => (r.maxMarks ? (r.marksObtained / r.maxMarks) * 100 : 0);
    const avg = results.length ? results.reduce((s, r) => s + pct(r), 0) / results.length : null;
    const gradeCounts = {};
    results.forEach((r) => {
      const g = r.grade || "N/A";
      gradeCounts[g] = (gradeCounts[g] || 0) + 1;
    });
    return {
      totalExams: exams.length,
      upcoming: exams.filter((e) => e.startDate && e.startDate >= today).length,
      withResults: new Set(results.map((r) => r.examId)).size,
      avg,
      gradeDistribution: Object.entries(gradeCounts).map(([name, value]) => ({ name, value })),
      examAverages: exams
        .map((e) => {
          const rs = results.filter((r) => r.examId === e.id);
          return rs.length ? { name: e.name, score: Math.round(rs.reduce((s, r) => s + pct(r), 0) / rs.length) } : null;
        })
        .filter(Boolean),
    };
  }, [data]);

  return (
    <div className="space-y-8">
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

      <LoadState loading={loading} error={error} onRetry={reload} />

      {stats && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard title="Total Exams" value={stats.totalExams} icon={<Settings size={20} />} color="amber" />
            <StatCard title="Upcoming Exams" value={stats.upcoming} icon={<Calendar size={20} />} color="indigo" />
            <StatCard title="Exams With Results" value={stats.withResults} icon={<Award size={20} />} color="emerald" />
            <StatCard title="Avg Performance" value={stats.avg === null ? "-" : `${stats.avg.toFixed(1)}%`} icon={<BarChart2 size={20} />} color="blue" />
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <SectionCard title="Grade Distribution">
              {stats.gradeDistribution.length === 0 ? (
                <EmptyState>No results recorded yet.</EmptyState>
              ) : (
                <div className="p-6 h-[300px] flex items-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={stats.gradeDistribution} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                        {stats.gradeDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex flex-col gap-2 pr-4">
                    {stats.gradeDistribution.map((entry, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                        <span className="text-xs font-bold text-slate-600 uppercase tracking-tighter">{entry.name} ({entry.value})</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </SectionCard>

            <SectionCard title="Average Score by Exam">
              {stats.examAverages.length === 0 ? (
                <EmptyState>No results recorded yet.</EmptyState>
              ) : (
                <div className="p-6 h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats.examAverages}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                      <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                      <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                      <Bar dataKey="score" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Avg Score %" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </SectionCard>
          </div>
        </>
      )}
    </div>
  );
};

export default ExamHub;
