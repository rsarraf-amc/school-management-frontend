import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users, UserPlus, CheckSquare, FileText, 
  DollarSign, CalendarDays, ClipboardCheck, 
  Settings, UserCheck, Layers, Building, Briefcase
} from "lucide-react";
import {
  PieChart, Pie, Cell, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import SectionCard from "../../ui/SectionCard";
import QuickActionCard from "../../ui/QuickActionCard";
import StatCard from "../../ui/StatCard";
import { hrStats } from "../../../mock/hrData";

const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#6366f1"];

const HrHub = () => {
  const navigate = useNavigate();

  const modules = useMemo(
    () => [
      { label: "Add Staff", icon: UserPlus, color: "text-blue-600", path: "add-staff" },
      { label: "Staff Directory", icon: Users, color: "text-indigo-600", path: "directory" },
      { label: "Manual Attendance", icon: CheckSquare, color: "text-emerald-600", path: "manual-attendance" },
      { label: "Attendance Report", icon: FileText, color: "text-violet-600", path: "attendance-report" },
      { label: "Payroll", icon: DollarSign, color: "text-rose-600", path: "payroll" },
      { label: "Apply Leave", icon: CalendarDays, color: "text-amber-600", path: "apply-leave" },
      { label: "Approve Leave", icon: ClipboardCheck, color: "text-emerald-600", path: "approve-leave" },
      { label: "Leave Type", icon: Settings, color: "text-slate-600", path: "leave-type" },
      { label: "Department", icon: Building, color: "text-slate-600", path: "department" },
      { label: "Designation", icon: Briefcase, color: "text-slate-600", path: "designation" },
      { label: "Shift Setup", icon: Settings, color: "text-slate-600", path: "shift" },
    ],
    []
  );

  return (
    <div className="space-y-8">
      {/* Quick Actions Grid */}
      <SectionCard title="Quick Actions" description="Human Resource workflows and configurations">
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
        <StatCard title="Total Staff" value={hrStats.totalStaff} icon={<Users size={20} />} color="indigo" />
        <StatCard title="Present Today" value={hrStats.presentToday} icon={<UserCheck size={20} />} color="emerald" trend="+2.5%" />
        <StatCard title="Absent Today" value={hrStats.absentToday} icon={<Users size={20} />} color="rose" isPositive={true} trend="-1.0%" />
        <StatCard title="Pending Leaves" value={hrStats.pendingLeaves} icon={<CalendarDays size={20} />} color="amber" />
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        <SectionCard title="Staff by Department">
          <div className="p-6 h-[300px] flex items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={hrStats.departmentDistribution} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {hrStats.departmentDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-col gap-2 pr-4">
               {hrStats.departmentDistribution.map((entry, index) => (
                 <div key={index} className="flex items-center gap-2">
                   <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                   <span className="text-xs font-bold text-slate-600 uppercase tracking-tighter">{entry.name} ({entry.value})</span>
                 </div>
               ))}
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Attendance Trend (%)">
          <div className="p-6 h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hrStats.attendanceTrend}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="attendance" fill="#10b981" radius={[4, 4, 0, 0]} name="Attendance %" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>
      </div>
    </div>
  );
};

export default HrHub;
