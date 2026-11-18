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
import useAsync from "../../../hooks/useAsync";
import { apiService } from "../../../services/apiService";
import { LoadState, EmptyState } from "../exam/ModuleState";

const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#6366f1", "#8b5cf6"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

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

  const { data, loading, error, reload } = useAsync(async () => {
    const [books, issues, students] = await Promise.all([
      apiService.library.books.list(),
      apiService.library.issues.list(),
      apiService.getAllStudents(),
    ]);
    return { books, issues, students };
  });

  const stats = useMemo(() => {
    if (!data) return null;
    const today = new Date().toISOString().slice(0, 10);
    const { books, issues, students } = data;
    const counts = {};
    books.forEach((b) => {
      const name = b.category || "Uncategorized";
      counts[name] = (counts[name] || 0) + 1;
    });
    const categoryDistribution = Object.entries(counts).map(([name, value]) => ({
      name,
      value: Math.round((value / books.length) * 100),
    }));
    const now = new Date();
    const monthlyTrend = Array.from({ length: 6 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      return {
        month: MONTHS[d.getMonth()],
        issued: issues.filter((x) => (x.issueDate || "").startsWith(key)).length,
        returned: issues.filter((x) => (x.returnDate || "").startsWith(key)).length,
      };
    });
    return {
      totalBooks: books.reduce((sum, b) => sum + (b.totalCopies || 0), 0),
      issuedBooks: issues.filter((i) => i.status === "Issued").length,
      overdueBooks: issues.filter((i) => i.status === "Issued" && i.dueDate < today).length,
      totalMembers: students.length,
      categoryDistribution,
      monthlyTrend,
    };
  }, [data]);

  return (
    <div className="space-y-8">
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

      <LoadState loading={loading} error={error} onRetry={reload} />

      {stats && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard title="Total Books" value={stats.totalBooks} icon={<Library size={20} />} color="indigo" />
            <StatCard title="Books Issued" value={stats.issuedBooks} icon={<Repeat size={20} />} color="blue" />
            <StatCard title="Overdue Returns" value={stats.overdueBooks} icon={<AlertCircle size={20} />} color="rose" isPositive={false} />
            <StatCard title="Total Members" value={stats.totalMembers} icon={<Users size={20} />} color="emerald" />
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <SectionCard title="Books by Category">
              {stats.categoryDistribution.length === 0 ? (
                <EmptyState>No books yet.</EmptyState>
              ) : (
                <div className="p-6 h-[300px] flex items-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={stats.categoryDistribution} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                        {stats.categoryDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex flex-col gap-2 pr-4">
                    {stats.categoryDistribution.map((entry, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                        <span className="text-xs font-bold text-slate-600 uppercase tracking-tighter">{entry.name} ({entry.value}%)</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </SectionCard>

            <SectionCard title="Circulation Trend (Issued vs Returned)">
              <div className="p-6 h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.monthlyTrend}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                    <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                    <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                    <Bar dataKey="issued" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Issued" />
                    <Bar dataKey="returned" fill="#10b981" radius={[4, 4, 0, 0]} name="Returned" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </SectionCard>
          </div>
        </>
      )}
    </div>
  );
};

export default LibraryHub;
