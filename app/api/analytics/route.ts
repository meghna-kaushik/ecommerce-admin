import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import Product from "@/models/Product";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();

    const [totalProducts, categoryBreakdown, stockSummary, recentProducts, lowStockProducts] =
      await Promise.all([
        Product.countDocuments(),
        Product.aggregate([
          { $group: { _id: "$category", count: { $sum: 1 }, totalValue: { $sum: { $multiply: ["$price", "$stock"] } } } },
          { $sort: { count: -1 } },
        ]),
        Product.aggregate([
          { $group: { _id: null, totalStock: { $sum: "$stock" }, totalValue: { $sum: { $multiply: ["$price", "$stock"] } }, avgPrice: { $avg: "$price" }, totalSales: { $sum: "$sales" } } },
        ]),
        Product.find().sort({ createdAt: -1 }).limit(5).select("name price category status createdAt imageUrl stock").lean(),
        Product.find({ stock: { $lt: 10 }, status: "active" }).select("name stock sku category").sort({ stock: 1 }).limit(8).lean(),
      ]);

    const salesData = [
      { month: "Jan", sales: 42000, revenue: 68000 },
      { month: "Feb", sales: 38000, revenue: 61000 },
      { month: "Mar", sales: 55000, revenue: 89000 },
      { month: "Apr", sales: 47000, revenue: 75000 },
      { month: "May", sales: 63000, revenue: 102000 },
      { month: "Jun", sales: 58000, revenue: 93000 },
      { month: "Jul", sales: 71000, revenue: 115000 },
      { month: "Aug", sales: 66000, revenue: 106000 },
      { month: "Sep", sales: 74000, revenue: 119000 },
      { month: "Oct", sales: 80000, revenue: 128000 },
      { month: "Nov", sales: 91000, revenue: 146000 },
      { month: "Dec", sales: 87000, revenue: 140000 },
    ];

    return NextResponse.json({
      overview: {
        totalProducts,
        totalStock: stockSummary[0]?.totalStock || 0,
        totalValue: stockSummary[0]?.totalValue || 0,
        avgPrice: stockSummary[0]?.avgPrice || 0,
        totalSales: stockSummary[0]?.totalSales || 0,
      },
      categoryBreakdown,
      salesData,
      recentProducts,
      lowStockProducts,
    });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}