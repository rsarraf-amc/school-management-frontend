import {
  UserPlus,
  Users,
  Phone,
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
import useAsync from "../../../hooks/useAsync";
import { apiService } from "../../../services/apiService";
import { LoadState, localDateKey } from "./FrontOfficeState";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

const modules = [
  { id: "admission", label: "Admission Enquiry", icon: UserPlus, color: "text-fuchsia-600" },
  { id: "visitor", label: "Visitor Book", icon: Users, color: "text-blue-600" },
  { id: "phone", label: "Phone Call Log", icon: Phone, color: "text-orange-500" },
  { id: "dispatch", label: "Postal Dispatch", icon: Send, color: "text-emerald-600" },
  { id: "receive", label: "Postal Receive", icon: Inbox, color: "text-rose-600" },
  { id: "complain", label: "Complain", icon: MessageSquare, color: "text-indigo-600" },
  { id: "settings", label: "Setup Front Office", icon: Settings, color: "text-teal-600" },
];

const DOT = { enquiry: "bg-indigo-400", visitor: "bg-emerald-400" };

export default function FrontOfficeOverview() {
  const navigate = useNavigate();
  const { data, loading, error } = useAsync(async () => {
    const [visitors, enquiries] = await Promise.all([
      apiService.frontOffice.visitors.list(),
      apiService.frontOffice.enquiries.list(),
    ]);
    return { visitors, enquiries };
  }, { visitors: [], enquiries: [] });

  const { visitors, enquiries } = data;
  const today = localDateKey(new Date());

  const weekly = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const key = localDateKey(d);
    return {
      name: d.toLocaleDateString([], { weekday: "short" }),
      visitors: visitors.filter((v) => localDateKey(v.checkIn) === key).length,
      enquiries: enquiries.filter((e) => e.date === key).length,
    };
  });

  const recent = [
    ...enquiries.map((e) => ({
      type: "enquiry",
      title: "Admission Enquiry",
      desc: `${e.name} - ${e.status}`,
      at: new Date(e.createdAt || e.date),
    })),
    ...visitors.map((v) => ({
      type: "visitor",
      title: "Visitor Logged",
      desc: `${v.visitorName} - ${v.purpose}`,
      at: new Date(v.checkIn),
    })),
  ]
    .sort((a, b) => b.at - a.at)
    .slice(0, 5);

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

      <LoadState loading={loading} error={error} />

      {!loading && !error && (
        <div className="grid gap-6 lg:grid-cols-[1.65fr_1fr]">
          <div className="overflow-hidden rounded-xl bg-white border border-slate-100 shadow-sm">
            <div className="border-b border-slate-200 px-6 py-5 sm:px-8 bg-slate-50/50">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Performance Overview</h2>
                  <p className="mt-1 text-sm text-slate-500 font-medium italic">
                    Enquiries and visitor activity over the last 7 days.
                  </p>
                </div>
                <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-700 border border-slate-200 shadow-sm">
                  <Calendar size={16} />
                  Last 7 Days
                </span>
              </div>
            </div>
            <div className="px-6 py-8 sm:px-8">
              <div className="mb-6 grid gap-4 sm:grid-cols-2">
                <StatCard title="Total Enquiries" value={enquiries.length} icon={<UserPlus size={18} />} color="indigo" />
                <StatCard
                  title="Today's Visitors"
                  value={visitors.filter((v) => localDateKey(v.checkIn) === today).length}
                  icon={<Users size={18} />}
                  color="emerald"
                />
              </div>
              <div className="h-[320px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={weekly} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorEnquiries" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.28} />
                        <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.28} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 12, fontWeight: 500 }} dy={10} />
                    <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 12, fontWeight: 500 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#ffffff",
                        borderRadius: "14px",
                        border: "1px solid #e2e8f0",
                        boxShadow: "0 10px 30px rgba(15,23,42,0.12)",
                        fontWeight: "600",
                      }}
                    />
                    <Area type="monotone" dataKey="visitors" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorVisitors)" />
                    <Area type="monotone" dataKey="enquiries" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorEnquiries)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-xl bg-slate-900 text-white shadow-xl shadow-slate-200">
            <div className="border-b border-white/10 px-6 py-5 sm:px-8">
              <h2 className="text-lg font-bold text-white">Recent Activity</h2>
              <p className="mt-1 text-sm text-slate-300">Latest enquiries and visitor check-ins.</p>
            </div>
            <div className="space-y-5 px-6 py-6 sm:px-8">
              {recent.length === 0 && <p className="text-sm text-slate-300">No recent activity.</p>}
              {recent.map((item, i) => (
                <div key={i} className="flex items-start gap-4 rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
                  <span className={`mt-1 block h-3.5 w-3.5 rounded-full ${DOT[item.type]}`} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-3">
                      <h4 className="text-sm font-semibold text-white">{item.title}</h4>
                      <span className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
                        {item.at.toLocaleDateString()}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-slate-300 italic">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
