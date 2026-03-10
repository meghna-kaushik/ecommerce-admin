"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface CategoryChartProps {
  categoryBreakdown: Array<{ _id: string; count: number; totalValue: number }>;
}

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#06b6d4"];

export default function CategoryChart({ categoryBreakdown }: CategoryChartProps) {
  const data = categoryBreakdown.map((item) => ({ name: item._id, value: item.count }));

  if (data.length === 0) {
    return (
      <div className="card flex items-center justify-center h-64">
        <p className="text-slate-400 text-sm">No data yet</p>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="mb-4">
        <h3 className="text-base font-semibold text-slate-800">Products by Category</h3>
        <p className="text-sm text-slate-400 mt-0.5">Distribution overview</p>
      </div>
      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie data={data} cx="50%" cy="45%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "8px", color: "#f1f5f9", fontSize: "12px" }}
            formatter={(value: number | undefined) => [value ?? 0, "Products"]}
          />
          <Legend wrapperStyle={{ fontSize: "11px", color: "#64748b" }} iconType="circle" iconSize={8} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}