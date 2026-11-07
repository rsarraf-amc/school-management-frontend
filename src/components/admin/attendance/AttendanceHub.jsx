import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  UserCheck,
  Calendar,
  FileText,
  Clock,
  Users,
  CheckCircle,
  XCircle,
  AlertCircle
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  LineChart,
  Line,
  AreaChart,
  Area
} from "recharts";
import SectionCard from "../../ui/SectionCard";
import QuickActionCard from "../../ui/QuickActionCard";
import StatCard from "../../ui/StatCard";
import { attendanceStats, attendanceTrendData, monthlyTrendData } from "../../../mock/attendanceData";

const AttendanceHub = () => {
  const navigate = useNavigate();

  const modules = useMemo(
    () => [
      {
        label: "Manual Attendance",
        icon: UserCheck,
        color: "text-emerald-600",
        path: "manual",
      },
      {
        label: "Daily Attendance",
        icon: Clock,
        color: "text-indigo-600",
        path: "daily",
      },
      {
        label: "Attendance Report",
        icon: FileText,
        color: "text-amber-600",
        path: "report",
      },
    ],
    []
  );

  return (
    <div className="space-y-8">
      {/* Quick Actions */}
      <SectionCard
        title="Quick Actions"
        description="Daily attendance workflows and reporting"
      >
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 p-6 pt-2">
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

      {/* Stats Overview */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Present Today"
          value={attendanceStats.presentToday}
          subValue={attendanceStats.totalStudents}
          subLabel="Total Students"
          icon={<CheckCircle size={20} />}
          color="emerald"
          trend="+2.1%"
        />
        <StatCard
          title="Absent Today"
          value={attendanceStats.absentToday}
          icon={<XCircle size={20} />}
          color="rose"
          trend="-5%"
          isPositive={true}
        />
        <StatCard
          title="On Leave"
          value={attendanceStats.onLeave}
          icon={<Calendar size={20} />}
          color="amber"
        />
        <StatCard
          title="Avg Attendance"
          value={attendanceStats.avgAttendance}
          icon={<Users size={20} />}
          color="indigo"
        />
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        <SectionCard title="Weekly Attendance Distribution">
          <div className="p-6 h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={attendanceTrendData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="day" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 12 }} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 12 }} 
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  cursor={{ fill: '#f8fafc' }}
                />
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
              <AreaChart data={monthlyTrendData}>
                <defs>
                  <linearGradient id="colorAttend" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="month" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 12 }} 
                />
                <YAxis 
                  domain={[0, 100]}
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 12 }} 
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="attendance" 
                  stroke="#6366f1" 
                  strokeWidth={4} 
                  fillOpacity={1} 
                  fill="url(#colorAttend)" 
                  dot={{ r: 4, fill: '#6366f1', strokeWidth: 2, stroke: '#fff' }} 
                  activeDot={{ r: 6, strokeWidth: 0 }}
                  name="Attendance %"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>
      </div>
    </div>
  );
};

export default AttendanceHub;
