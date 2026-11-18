import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell, MessageSquare, Send, Activity, TrendingUp
} from "lucide-react";
import {
  PieChart, Pie, Cell, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import SectionCard from "../../ui/SectionCard";
import QuickActionCard from "../../ui/QuickActionCard";
import StatCard from "../../ui/StatCard";
import useAsync from "../../../hooks/useAsync";
import { apiService } from "../../../services/apiService";
import { LoadState } from "../transport/TransportState";

const COLORS = ["#6366f1", "#3b82f6", "#10b981", "#f59e0b"];

const CommunicateHub = () => {
  const navigate = useNavigate();
  const { data, loading, error } = useAsync(async () => {
    const [notices, sms] = await Promise.all([
      apiService.communicate.notices.list(),
      apiService.communicate.sms.list(),
    ]);
    return { notices, sms };
  }, null);

  const modules = useMemo(
    () => [
      { label: "Notice Board", icon: Bell, color: "text-indigo-600", path: "notice-board" },
      { label: "SMS", icon: MessageSquare, color: "text-emerald-600", path: "sms" },
    ],
    []
  );

  const communicateStats = useMemo(() => {
    const notices = data?.notices || [];
    const sms = data?.sms || [];
    const queued = sms.filter((s) => s.status === "Queued").length;
    const weekAgo = new Date().getTime() - 7 * 24 * 60 * 60 * 1000;
    const recentNotices = notices.filter((n) => new Date(n.publishDate || n.createdAt).getTime() >= weekAgo).length;

    const byAudience = {};
    [...notices, ...sms].forEach((item) => {
      byAudience[item.audience] = (byAudience[item.audience] || 0) + 1;
    });
    const total = notices.length + sms.length;

    const trend = Array.from({ length: 6 }, (_, i) => {
      const d = new Date();
      d.setDate(1);
      d.setMonth(d.getMonth() - (5 - i));
      return { year: d.getFullYear(), month: d.getMonth(), label: d.toLocaleDateString(undefined, { month: "short" }) };
    }).map(({ year, month, label }) => ({
      month: label,
      sms: sms.filter((s) => {
        const created = new Date(s.createdAt);
        return created.getFullYear() === year && created.getMonth() === month;
      }).length,
    }));

    return {
      totalNotices: notices.length,
      smsSent: sms.length,
      queued,
      recentNotices,
      audienceDistribution: Object.entries(byAudience).map(([name, count]) => ({
        name,
        value: Math.round((count / total) * 100),
      })),
      communicationTrend: trend,
    };
  }, [data]);

  return (
    <div className="space-y-8">
      <LoadState loading={loading} error={error} />
      <SectionCard title="Quick Actions" description="Communication and messaging workflows">
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
        <StatCard title="Total Notices" value={communicateStats.totalNotices} icon={<Bell size={20} />} color="indigo" />
        <StatCard title="SMS Recorded" value={communicateStats.smsSent} icon={<Send size={20} />} color="emerald" />
        <StatCard title="SMS Queued (no gateway)" value={communicateStats.queued} icon={<Activity size={20} />} color="blue" />
        <StatCard title="Notices This Week" value={communicateStats.recentNotices} icon={<TrendingUp size={20} />} color="amber" />
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        <SectionCard title="Audience Reach">
          <div className="p-6 h-[300px] flex items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={communicateStats.audienceDistribution} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {communicateStats.audienceDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-col gap-2 pr-4">
               {communicateStats.audienceDistribution.map((entry, index) => (
                 <div key={index} className="flex items-center gap-2">
                   <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                   <span className="text-xs font-bold text-slate-600 uppercase tracking-tighter">{entry.name} ({entry.value}%)</span>
                 </div>
               ))}
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Communication Volume Trend">
          <div className="p-6 h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={communicateStats.communicationTrend}>
                <defs>
                  <linearGradient id="colorSms" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <Tooltip cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '4 4' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                <Area type="monotone" dataKey="sms" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorSms)" name="SMS Recorded" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>
      </div>
    </div>
  );
};

export default CommunicateHub;
