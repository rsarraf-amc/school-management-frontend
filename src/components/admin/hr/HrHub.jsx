import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users, UserPlus, CheckSquare, FileText, 
  DollarSign, CalendarDays, ClipboardCheck, 
  Settings, UserCheck, Layers, Building, Briefcase
} from "lucide-react";
import {
  PieChart, Pie, Cell,
  Tooltip, ResponsiveContainer
} from "recharts";
import SectionCard from "../../ui/SectionCard";
import QuickActionCard from "../../ui/QuickActionCard";
import StatCard from "../../ui/StatCard";
import useAsync from "../../../hooks/useAsync";
import { apiService } from "../../../services/apiService";

const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#6366f1", "#ec4899", "#14b8a6"];

const HrHub = () => {
  const navigate = useNavigate();
  const { data: stats } = useAsync(async () => {
    const [employees, departments, leaves, shifts] = await Promise.all([
      apiService.getAllEmployees(),
      apiService.departments.list(),
      apiService.leaves.list(),
      apiService.shifts.list(),
    ]);
    const names = new Map(departments.map((department) => [department.id, department.departmentName]));
    const counts = new Map();
    employees.forEach((employee) => {
      const name = names.get(employee.departmentId) || "Unassigned";
      counts.set(name, (counts.get(name) || 0) + 1);
    });
    return {
      totalStaff: employees.length,
      departments: departments.length,
      shifts: shifts.length,
      pendingLeaves: leaves.filter((leave) => leave.status === "Pending").length,
      departmentDistribution: [...counts].map(([name, value]) => ({ name, value })),
    };
  }, { totalStaff: 0, departments: 0, shifts: 0, pendingLeaves: 0, departmentDistribution: [] });
  const hrStats = stats;

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
        <StatCard title="Departments" value={hrStats.departments} icon={<Building size={20} />} color="emerald" />
        <StatCard title="Shifts" value={hrStats.shifts} icon={<Layers size={20} />} color="rose" />
        <StatCard title="Pending Leaves" value={hrStats.pendingLeaves} icon={<CalendarDays size={20} />} color="amber" />
      </div>

      {/* Charts Section */}
      <div className="grid gap-6">
        <SectionCard title="Staff by Department">
          <div className="p-6 h-[300px] flex items-center">
            {hrStats.departmentDistribution.length === 0 ? (
              <p className="text-sm text-slate-400 font-medium">No staff added yet.</p>
            ) : (
              <>
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
              </>
            )}
          </div>
        </SectionCard>
      </div>
    </div>
  );
};

export default HrHub;
