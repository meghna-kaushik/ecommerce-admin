import { Package, DollarSign, TrendingUp, BarChart2 } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface StatsCardsProps {
  overview: {
    totalProducts: number;
    totalStock: number;
    totalValue: number;
    avgPrice: number;
    totalSales: number;
  };
}

export default function StatsCards({ overview }: StatsCardsProps) {
  const stats = [
    {
      label: "Total Products",
      value: overview.totalProducts.toLocaleString(),
      icon: Package,
      bg: "bg-blue-50",
      text: "text-blue-700",
      change: "+12 this month",
    },
    {
      label: "Inventory Value",
      value: formatCurrency(overview.totalValue),
      icon: DollarSign,
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      change: "+8.2% from last month",
    },
    {
      label: "Total Units",
      value: overview.totalStock.toLocaleString(),
      icon: BarChart2,
      bg: "bg-violet-50",
      text: "text-violet-700",
      change: "Across all categories",
    },
    {
      label: "Avg. Price",
      value: formatCurrency(overview.avgPrice),
      icon: TrendingUp,
      bg: "bg-orange-50",
      text: "text-orange-700",
      change: "Per product",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div key={stat.label} className="card">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                <p className="text-2xl font-bold text-slate-800 mt-1">{stat.value}</p>
                <p className={`text-xs mt-2 font-medium ${stat.text}`}>{stat.change}</p>
              </div>
              <div className={`${stat.bg} p-3 rounded-xl`}>
                <Icon className={`w-5 h-5 ${stat.text}`} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}