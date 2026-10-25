import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  BookOpen, List, Repeat, UserPlus, Bookmark, BarChart2,
  Library, AlertCircle, Users
} from "lucide-react";
import {
  PieChart, Pie, Cell, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import SectionCard from "../../ui/SectionCard";
import QuickActionCard from "../../ui/QuickActionCard";
import StatCard from "../../ui/StatCard";
import { libraryStats } from "../../../mock/libraryData";

const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#6366f1", "#8b5cf6"];

const LibraryHub = () => {
  const navigate = useNavigate();

  const modules = useMemo(
    () => [
      { label: "Add Book", icon: BookOpen, color: "text-indigo-600", path: "add-book" },
      { label: "Book List", icon: List, color: "text-blue-600", path: "book-list" },
      { label: "Issue Return", icon: Repeat, color: "text-emerald-600", path: "issue-return" },
      { label: "Add Student", icon: UserPlus, color: "text-amber-600", path: "add-student" },
      { label: "Category", icon: Bookmark, color: "text-slate-600", path: "category" },
      { label: "Monthly Report", icon: BarChart2, color: "text-violet-600", path: "monthly-report" },
    ],
    []
  );

  return (
    <div className="space-y-8">
      {/* Quick Actions Grid */}
      <SectionCard title="Quick Actions" description="Library inventory and circulation workflows">
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
        <StatCard title="Total Books" value={libraryStats.totalBooks} icon={<Library size={20} />} color="indigo" />
        <StatCard title="Books Issued" value={libraryStats.issuedBooks} icon={<Repeat size={20} />} color="blue" />
        <StatCard title="Overdue Returns" value={libraryStats.overdueBooks} icon={<AlertCircle size={20} />} color="rose" isPositive={false} trend="+2%" />
        <StatCard title="Total Members" value={libraryStats.totalMembers} icon={<Users size={20} />} color="emerald" />
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        <SectionCard title="Books by Category">
          <div className="p-6 h-[300px] flex items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={libraryStats.categoryDistribution} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {libraryStats.categoryDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-col gap-2 pr-4">
               {libraryStats.categoryDistribution.map((entry, index) => (
                 <div key={index} className="flex items-center gap-2">
                   <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                   <span className="text-xs font-bold text-slate-600 uppercase tracking-tighter">{entry.name} ({entry.value}%)</span>
                 </div>
               ))}
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Circulation Trend (Issued vs Returned)">
          <div className="p-6 h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={libraryStats.monthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="issued" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Issued" />
                <Bar dataKey="returned" fill="#10b981" radius={[4, 4, 0, 0]} name="Returned" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>
      </div>
    </div>
  );
};

export default LibraryHub;
