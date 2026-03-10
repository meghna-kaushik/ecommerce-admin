export const revalidate = 0;
import connectDB from "@/lib/db";
import Product from "@/models/Product";
import StatsCards from "@/components/charts/StatsCards";
import SalesChart from "@/components/charts/SalesChart";
import CategoryChart from "@/components/charts/CategoryChart";
import InventoryBarChart from "@/components/charts/InventoryBarChart";

async function getAnalyticsData() {
  await connectDB();

  const [categoryBreakdown, stockSummary, totalProducts] = await Promise.all([
    Product.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 }, totalValue: { $sum: { $multiply: ["$price", "$stock"] } }, totalStock: { $sum: "$stock" } } },
      { $sort: { count: -1 } },
    ]),
    Product.aggregate([
      { $group: { _id: null, totalStock: { $sum: "$stock" }, totalValue: { $sum: { $multiply: ["$price", "$stock"] } }, avgPrice: { $avg: "$price" }, totalSales: { $sum: "$sales" } } },
    ]),
    Product.countDocuments(),
  ]);

  const salesData = [
    { month: "Jan", sales: 42000, revenue: 68000 },
    { month: "Feb", sales: 38000, revenue: 61000 },
    { month: "Mar", sales: 55000, revenue: 89000 },
    { month: "Apr", sales: 47000, revenue: 75000 },
    { month: "May", sales: 63000, revenue: 102000 },
    { month: "Jun", sales: 58000, revenue: 93000 },
    { month: "Jul", sales: 710, revenue: 115000 },
    { month: "Aug", sales: 66000, revenue: 106000 },
    { month: "Sep", sales: 74000, revenue: 119000 },
    { month: "Oct", sales: 80000, revenue: 128000 },
    { month: "Nov", sales: 91000, revenue: 146000 },
    { month: "Dec", sales: 87000, revenue: 140000 },
  ];

  return {
    overview: {
      totalProducts,
      totalStock: stockSummary[0]?.totalStock || 0,
      totalValue: stockSummary[0]?.totalValue || 0,
      avgPrice: stockSummary[0]?.avgPrice || 0,
      totalSales: stockSummary[0]?.totalSales || 0,
    },
    categoryBreakdown: JSON.parse(JSON.stringify(categoryBreakdown)),
    salesData,
  };
}

export default async function AnalyticsPage() {
  const data = await getAnalyticsData();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Analytics</h1>
        <p className="text-slate-500 mt-1">Detailed insights about your store performance</p>
      </div>
      <StatsCards overview={data.overview} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SalesChart salesData={data.salesData} />
        </div>
        <div>
          <CategoryChart data={data.categoryBreakdown} />
        </div>
      </div>
      <InventoryBarChart categoryBreakdown={data.categoryBreakdown} />
    </div>
  );
}