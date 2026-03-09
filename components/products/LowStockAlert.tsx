import { AlertTriangle } from "lucide-react";
import Link from "next/link";

interface LowStockAlertProps {
  products: any[];
}

export default function LowStockAlert({ products }: LowStockAlertProps) {
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-base font-semibold text-slate-800">Low Stock Alerts</h3>
          {products.length > 0 && (
            <span className="badge bg-red-100 text-red-700">{products.length}</span>
          )}
        </div>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-8">
          <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-2xl">✅</span>
          </div>
          <p className="text-slate-600 text-sm font-medium">All stocked up!</p>
          <p className="text-slate-400 text-xs mt-1">No products are running low on stock.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {products.map((product) => (
            <div key={product._id} className="flex items-center justify-between p-3 bg-red-50/50 border border-red-100 rounded-lg">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-slate-700">{product.name}</p>
                  <p className="text-xs text-slate-400">SKU: {product.sku}</p>
                </div>
              </div>
              <div className="text-right">
                <div className={`text-sm font-bold ${product.stock === 0 ? "text-red-600" : product.stock < 5 ? "text-orange-600" : "text-yellow-600"}`}>
                  {product.stock} left
                </div>
                <p className="text-xs text-slate-400">{product.category}</p>
              </div>
            </div>
          ))}
          <Link href="/dashboard/products" className="block text-center text-xs text-blue-600 hover:text-blue-700 font-medium pt-2">
            Manage inventory →
          </Link>
        </div>
      )}
    </div>
  );
}