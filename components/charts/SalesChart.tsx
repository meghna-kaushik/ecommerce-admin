"use client";

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface SalesChartProps {
  salesData: Array<{ month: string; sales: number; revenue: number }>;
}

export default function SalesChart({ salesData }: SalesChartProps) {
  return (
    <div className="card">
      <div className="mb-6">
        <h3 className="text-base font-semibold text-slate-800">Sales & Revenue Overview</h3>
        <p className="text-sm text-slate-400 mt-0.5">Monthly performance for 2024</p>
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={salesData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
          <defs>
            <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
          <YAxis tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "8px", color: "#f1f5f9", fontSize: "12px" }}
            formatter={(value: number | undefined) => [`$${(value ?? 0).toLocaleString()}`, undefined] as any}
          />
          <Legend wrapperStyle={{ fontSize: "12px", color: "#64748b" }} />
          <Area type="monotone" dataKey="sales" stroke="#3b82f6" strokeWidth={2} fill="url(#colorSales)" name="Sales" />
          <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} fill="url(#colorRevenue)" name="Revenue" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}