import ProductsClient from "@/components/products/ProductsClient";
import connectDB from "@/lib/db";
import Product from "@/models/Product";

interface ProductsPageProps {
  searchParams: { page?: string; search?: string; category?: string; status?: string; };
}

async function getProducts(searchParams: ProductsPageProps["searchParams"]) {
  await connectDB();

  const page = parseInt(searchParams.page || "1");
  const limit = 10;
  const search = searchParams.search || "";
  const category = searchParams.category || "";
  const status = searchParams.status || "";

  const query: any = {};
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { sku: { $regex: search, $options: "i" } },
    ];
  }
  if (category) query.category = category;
  if (status) query.status = status;

  const [products, total] = await Promise.all([
    Product.find(query).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
    Product.countDocuments(query),
  ]);

  return {
    products: JSON.parse(JSON.stringify(products)),
    pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
  };
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const data = await getProducts(searchParams);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Products</h1>
        <p className="text-slate-500 mt-1">
          Manage your store&apos;s product catalog ({data.pagination.total} total)
        </p>
      </div>
      <ProductsClient
        initialProducts={data.products}
        initialPagination={data.pagination}
        searchParams={searchParams}
      />
    </div>
  );
}
