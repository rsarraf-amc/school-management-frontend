import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Map, Truck, Link, FileText, UserPlus, Users, Calendar, MapPin, Anchor
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
import { LoadState } from "./TransportState";

const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#6366f1", "#8b5cf6"];

const TransportHub = () => {
  const navigate = useNavigate();
  const { data, loading, error } = useAsync(async () => {
    const [routes, vehicles, assignments] = await Promise.all([
      apiService.transport.routes.list(),
      apiService.transport.vehicles.list(),
      apiService.transport.assignments.list(),
    ]);
    return { routes, vehicles, assignments };
  }, { routes: [], vehicles: [], assignments: [] });

  const modules = useMemo(
    () => [
      { label: "Routes", icon: Map, color: "text-indigo-600", path: "routes" },
      { label: "Vehicles", icon: Truck, color: "text-emerald-600", path: "vehicles" },
      { label: "Assign Vehicles", icon: Link, color: "text-blue-600", path: "assign-vehicles" },
      { label: "Transport Report", icon: FileText, color: "text-violet-600", path: "report" },
      { label: "Assign Student To Transport", icon: UserPlus, color: "text-amber-600", path: "assign-student" },
      { label: "Add Driver", icon: Users, color: "text-rose-600", path: "drivers" },
      { label: "Route TimeTable", icon: Calendar, color: "text-slate-600", path: "timetable" },
      { label: "Stoppage", icon: MapPin, color: "text-slate-600", path: "stoppage" },
    ],
    []
  );

  const { routes, vehicles, assignments } = data;

  const perRoute = useMemo(
    () =>
      routes.map((route) => ({
        name: route.routeName,
        students: assignments.filter((a) => a.routeId === route.id).length,
        capacity: route.vehicle?.capacity ?? 0,
      })),
    [routes, assignments]
  );
  const routeDistribution = perRoute.filter((r) => r.students > 0).map((r) => ({ name: r.name, value: r.students }));
  const vehiclesWithDriver = vehicles.filter((v) => v.driverName).length;

  return (
    <div className="space-y-8">
      <SectionCard title="Quick Actions" description="Transport network workflows">
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

      <LoadState loading={loading} error={error} />

      {!loading && !error && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard title="Active Routes" value={routes.length} icon={<Map size={20} />} color="indigo" />
            <StatCard title="Total Vehicles" value={vehicles.length} icon={<Truck size={20} />} color="emerald" />
            <StatCard title="Assigned Students" value={assignments.length} icon={<Users size={20} />} color="blue" />
            <StatCard title="Vehicles With Driver" value={vehiclesWithDriver} icon={<Anchor size={20} />} color="amber" />
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <SectionCard title="Route Utilization">
              {routeDistribution.length === 0 ? (
                <p className="p-6 text-sm text-slate-500">No students are assigned to routes yet.</p>
              ) : (
                <div className="p-6 h-[300px] flex items-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={routeDistribution} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                        {routeDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex flex-col gap-2 pr-4">
                    {routeDistribution.map((entry, index) => (
                      <div key={entry.name} className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                        <span className="text-xs font-bold text-slate-600 uppercase tracking-tighter">{entry.name} ({entry.value})</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </SectionCard>

            <SectionCard title="Capacity vs Assigned Students (By Route)">
              {perRoute.length === 0 ? (
                <p className="p-6 text-sm text-slate-500">No routes created yet.</p>
              ) : (
                <div className="p-6 h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={perRoute}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                      <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                      <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                      <Bar dataKey="capacity" fill="#cbd5e1" radius={[4, 4, 0, 0]} name="Vehicle Capacity" />
                      <Bar dataKey="students" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Assigned Students" />
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

export default TransportHub;
