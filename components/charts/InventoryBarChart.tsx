"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface InventoryBarChartProps {
  categoryBreakdown: Array<{ _id: string; count: number; totalValue: number; totalStock?: number }>;
}

export default function InventoryBarChart({ categoryBreakdown }: InventoryBarChartProps) {
  const data = categoryBreakdown.map((item) => ({
    category: item._id,
    products: item.count,
    stock: item.totalStock || 0,
  }));

  if (data.length === 0) {
    return (
      <div className="card flex items-center justify-center h-48">
        <p className="text-slate-400 text-sm">No data to display</p>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="mb-6">
        <h3 className="text-base font-semibold text-slate-800">Inventory by Category</h3>
        <p className="text-sm text-slate-400 mt-0.5">Products and stock count per category</p>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis dataKey="category" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "8px", color: "#f1f5f9", fontSize: "12px" }}
          />
          <Legend wrapperStyle={{ fontSize: "12px", color: "#64748b" }} />
          <Bar dataKey="products" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Products" />
          <Bar dataKey="stock" fill="#10b981" radius={[4, 4, 0, 0]} name="Stock Units" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}