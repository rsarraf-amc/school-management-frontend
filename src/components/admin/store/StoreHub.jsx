import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users, ShoppingBag, Layers, GitBranch, ShoppingCart, 
  Ruler, BarChart2, Package, AlertTriangle, TrendingUp, DollarSign
} from "lucide-react";
import {
  PieChart, Pie, Cell, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import SectionCard from "../../ui/SectionCard";
import QuickActionCard from "../../ui/QuickActionCard";
import StatCard from "../../ui/StatCard";
import { storeStats } from "../../../mock/storeData";

const COLORS = ["#6366f1", "#3b82f6", "#10b981", "#f59e0b", "#ef4444"];

const StoreHub = () => {
  const navigate = useNavigate();

  const modules = useMemo(
    () => [
      { label: "Vendor", icon: Users, color: "text-indigo-600", path: "vendors" },
      { label: "Products", icon: ShoppingBag, color: "text-emerald-600", path: "products" },
      { label: "Category", icon: Layers, color: "text-blue-600", path: "category" },
      { label: "Sub Category", icon: GitBranch, color: "text-violet-600", path: "sub-category" },
      { label: "Buy Sell Product", icon: ShoppingCart, color: "text-rose-600", path: "transactions" },
      { label: "Unit", icon: Ruler, color: "text-amber-600", path: "units" },
      { label: "Sells Reports", icon: BarChart2, color: "text-slate-600", path: "reports" },
    ],
    []
  );

  return (
    <div className="space-y-8">
      {/* Quick Actions Grid */}
      <SectionCard title="Quick Actions" description="Store management and inventory workflows">
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
        <StatCard title="Total Stock Value" value={`₹${(storeStats.totalStockValue / 100000).toFixed(2)}L`} icon={<Package size={20} />} color="indigo" trend="+8%" />
        <StatCard title="Monthly Sales" value={`₹${(storeStats.monthlySales / 1000).toFixed(1)}k`} icon={<DollarSign size={20} />} color="emerald" trend="+15%" />
        <StatCard title="Low Stock Alert" value={storeStats.lowStockItems} icon={<AlertTriangle size={20} />} color="rose" isPositive={false} />
        <StatCard title="Active Vendors" value={storeStats.vendorsCount} icon={<Users size={20} />} color="blue" />
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        <SectionCard title="Inventory Distribution">
          <div className="p-6 h-[300px] flex items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={storeStats.categoryDistribution} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {storeStats.categoryDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-col gap-2 pr-4">
               {storeStats.categoryDistribution.map((entry, index) => (
                 <div key={index} className="flex items-center gap-2">
                   <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                   <span className="text-xs font-bold text-slate-600 uppercase tracking-tighter">{entry.name} ({entry.value}%)</span>
                 </div>
               ))}
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Sales Performance Trend">
          <div className="p-6 h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={storeStats.salesTrend}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <Tooltip cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '4 4' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                <Area type="monotone" dataKey="sales" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" name="Sales Revenue" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>
      </div>
    </div>
  );
};

export default StoreHub;
