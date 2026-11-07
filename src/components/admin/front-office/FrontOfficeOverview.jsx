import {
  AreaChart,
  UserPlus,
  Users,
  Phone,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Calendar,
  Settings,
  Send,
  Inbox,
  MessageSquare,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import StatCard from "../../ui/StatCard";
import SectionCard from "../../ui/SectionCard";
import QuickActionCard from "../../ui/QuickActionCard";
import {
  weeklyData,
  frontOfficeOverviewStats,
} from "../../../mock/frontOfficeData";
import {
  ResponsiveContainer,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

const modules = [
  {
    id: "admission",
    label: "Admission Enquiry",
    icon: UserPlus,
    color: "text-fuchsia-600",
  },
  { id: "visitor", label: "Visitor Book", icon: Users, color: "text-blue-600" },
  {
    id: "phone",
    label: "Phone Call Log",
    icon: Phone,
    color: "text-orange-500",
  },
  {
    id: "dispatch",
    label: "Postal Dispatch",
    icon: Send,
    color: "text-emerald-600",
  },
  {
    id: "receive",
    label: "Postal Receive",
    icon: Inbox,
    color: "text-rose-600",
  },
  {
    id: "complain",
    label: "Complain",
    icon: MessageSquare,
    color: "text-indigo-600",
  },
  {
    id: "settings",
    label: "Setup Front Office",
    icon: Settings,
    color: "text-teal-600",
  },
];

export default function FrontOfficeOverview() {
  const navigate = useNavigate();
  return (
    <div className="space-y-6">
      <SectionCard
        title="Quick Actions"
        description="Open your most-used front office modules."
        headerClassName="bg-white/50"
      >
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 p-6 pt-2">
          {modules.map((mod) => (
            <QuickActionCard
              key={mod.id}
              icon={mod.icon}
              label={mod.label}
              color={mod.color}
              onClick={() => navigate(mod.id)}
            />
          ))}
        </div>
      </SectionCard>

      <div className="grid gap-6 lg:grid-cols-[1.65fr_1fr]">
        <div className="overflow-hidden rounded-xl bg-white border border-slate-100 shadow-sm">
          <div className="border-b border-slate-200 px-6 py-5 sm:px-8 bg-slate-50/50">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Performance Overview
                </h2>
                <p className="mt-1 text-sm text-slate-500 font-medium italic">
                  Weekly admissions and visitor activity at a glance.
                </p>
              </div>
              <button className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition border border-slate-200 hover:bg-slate-50 shadow-sm">
                <Calendar size={16} />
                This Week
              </button>
            </div>
          </div>
          <div className="px-6 py-8 sm:px-8">
            <div className="mb-6 grid gap-4 sm:grid-cols-2">
              <StatCard
                title="Total Enquiries"
                value={frontOfficeOverviewStats.totalVisitors}
                trend="+12%"
                icon={<UserPlus size={18} />}
                color="indigo"
              />
              <StatCard
                title="Today's Visitors"
                value={frontOfficeOverviewStats.todayVisitors}
                trend="+5%"
                icon={<Users size={18} />}
                color="emerald"
              />
            </div>
            <div className="h-[320px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={weeklyData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient
                      id="colorEnquiries"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="#4f46e5"
                        stopOpacity={0.28}
                      />
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient
                      id="colorVisitors"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="#10b981"
                        stopOpacity={0.28}
                      />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="4 4"
                    vertical={false}
                    stroke="#e2e8f0"
                  />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#64748b", fontSize: 12, fontWeight: 500 }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#64748b", fontSize: 12, fontWeight: 500 }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#ffffff",
                      borderRadius: "14px",
                      border: "1px solid #e2e8f0",
                      boxShadow: "0 10px 30px rgba(15,23,42,0.12)",
                      fontWeight: "600",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="visitors"
                    stroke="#10b981"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorVisitors)"
                  />
                  <Area
                    type="monotone"
                    dataKey="enquiries"
                    stroke="#4f46e5"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorEnquiries)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl bg-slate-900 text-white shadow-xl shadow-slate-200">
          <div className="border-b border-white/10 px-6 py-5 sm:px-8">
            <h2 className="text-lg font-bold text-white">Recent Activity</h2>
            <p className="mt-1 text-sm text-slate-300">
              Latest front office actions and updates.
            </p>
          </div>
          <div className="space-y-5 px-6 py-6 sm:px-8">
            {[
              {
                title: "New Admission Enquiry",
                desc: "John Doe - Grade 5",
                time: "10 mins ago",
                color: "indigo",
              },
              {
                title: "Visitor Logged",
                desc: "Sarah Smith - Meeting Principal",
                time: "1 hour ago",
                color: "emerald",
              },
              {
                title: "Phone Call Received",
                desc: "Regarding admissions info",
                time: "2 hours ago",
                color: "amber",
              },
              {
                title: "Postal Sent",
                desc: "Grade Cards dispatched",
                time: "4 hours ago",
                color: "blue",
              },
              {
                title: "Complain Raised",
                desc: "Transport issue reported",
                time: "5 hours ago",
                color: "rose",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-start gap-4 rounded-[1.5rem] border border-white/10 bg-white/5 p-4"
              >
                <div className="relative">
                  <span
                    className={`block h-3.5 w-3.5 rounded-full bg-${item.color}-400`}
                  />
                  {i !== 4 && (
                    <span className="absolute left-1/2 top-4 block h-full w-px -translate-x-1/2 bg-white/10" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <h4 className="text-sm font-semibold text-white">
                      {item.title}
                    </h4>
                    <span className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
                      {item.time}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-slate-300 italic">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="border-t border-white/10 px-6 py-5 sm:px-8">
            <button className="inline-flex w-full items-center justify-center rounded-full bg-white px-4 py-3 text-sm font-black text-slate-900 transition hover:bg-slate-100 uppercase tracking-widest shadow-lg active:scale-95">
              View All Activity
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
