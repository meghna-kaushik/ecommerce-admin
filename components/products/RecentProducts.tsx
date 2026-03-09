import Link from "next/link";
import Image from "next/image";
import { formatCurrency, formatDate } from "@/lib/utils";
import { ArrowRight, Package } from "lucide-react";

interface RecentProductsProps {
  products: any[];
}

export default function RecentProducts({ products }: RecentProductsProps) {
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-slate-800">Recently Added</h3>
        <Link href="/dashboard/products" className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1 font-medium">
          View all <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-slate-400 text-sm">No products yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {products.map((product) => (
            <div key={product._id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors">
              <div className="w-10 h-10 bg-slate-100 rounded-lg overflow-hidden shrink-0 flex items-center justify-center">
                {product.imageUrl ? (
                  <Image src={product.imageUrl} alt={product.name} width={40} height={40} className="object-cover w-full h-full" />
                ) : (
                  <Package className="w-4 h-4 text-slate-400" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-700 truncate">{product.name}</p>
                <p className="text-xs text-slate-400">{product.category} · {formatDate(product.createdAt)}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm font-semibold text-slate-700">{formatCurrency(product.price)}</p>
                <span className={`badge badge-${product.status}`}>{product.status}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}