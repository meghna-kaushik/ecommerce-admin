"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Plus, Search, Pencil, Trash2, ChevronLeft, ChevronRight, Loader2, Package } from "lucide-react";
import toast from "react-hot-toast";
import { formatCurrency, formatDate } from "@/lib/utils";
import ProductModal from "./ProductModal";
import DeleteConfirmModal from "./DeleteConfirmModal";

interface ProductsClientProps {
  initialProducts: any[];
  initialPagination: { total: number; page: number; limit: number; totalPages: number };
  searchParams: any;
}

const CATEGORIES = ["Electronics", "Clothing", "Food", "Books", "Sports", "Home", "Other"];

export default function ProductsClient({ initialProducts, initialPagination, searchParams }: ProductsClientProps) {
  const router = useRouter();
  const [products, setProducts] = useState(initialProducts);
  const [pagination, setPagination] = useState(initialPagination);
  const [search, setSearch] = useState(searchParams.search || "");
  const [category, setCategory] = useState(searchParams.category || "");
  const [status, setStatus] = useState(searchParams.status || "");
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<any>(null);
  const [deleteProduct, setDeleteProduct] = useState<any>(null);

  const fetchProducts = useCallback(async (page = 1, filters?: any) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        search: filters?.search ?? search,
        category: filters?.category ?? category,
        status: filters?.status ?? status,
      });
      const res = await fetch(`/api/products?${params}`);
      const data = await res.json();
      setProducts(data.products);
      setPagination(data.pagination);
      router.replace(`/dashboard/products?${params}`, { scroll: false });
    } catch {
      toast.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  }, [search, category, status, router]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProducts(1, { search, category, status });
  };

  const handleDelete = async (productId: string) => {
    try {
      const res = await fetch(`/api/products/${productId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      toast.success("Product deleted successfully");
      setDeleteProduct(null);
      fetchProducts(pagination.page);
    } catch {
      toast.error("Failed to delete product");
    }
  };

  const handleProductSaved = () => {
    setModalOpen(false);
    setEditProduct(null);
    fetchProducts(pagination.page);
    toast.success(editProduct ? "Product updated!" : "Product created!");
  };

  return (
    <div className="space-y-4">
      <div className="card">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <form onSubmit={handleSearch} className="flex gap-2 flex-1 max-w-md">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products, SKU..."
                className="input-field pl-9"
              />
            </div>
            <button type="submit" className="btn-secondary">Search</button>
          </form>

          <div className="flex gap-2 flex-wrap">
            <select
              value={category}
              onChange={(e) => { setCategory(e.target.value); fetchProducts(1, { category: e.target.value, status }); }}
              className="input-field w-auto text-sm"
            >
              <option value="">All Categories</option>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>

            <select
              value={status}
              onChange={(e) => { setStatus(e.target.value); fetchProducts(1, { category, status: e.target.value }); }}
              className="input-field w-auto text-sm"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="out_of_stock">Out of Stock</option>
            </select>

            <button
              onClick={() => { setModalOpen(true); setEditProduct(null); }}
              className="btn-primary flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />Add Product
            </button>
          </div>
        </div>
      </div>

      <div className="card overflow-hidden p-0">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16">
            <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 font-medium">No products found</p>
            <button onClick={() => setModalOpen(true)} className="btn-primary mt-4 inline-flex items-center gap-2">
              <Plus className="w-4 h-4" />Add Product
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="text-left py-3 px-4 font-semibold text-slate-600">Product</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-600">SKU</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-600">Category</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-600">Price</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-600">Stock</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-600">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-600">Added</th>
                  <th className="text-right py-3 px-4 font-semibold text-slate-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {products.map((product) => (
                  <tr key={product._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-slate-100 rounded-lg overflow-hidden shrink-0 flex items-center justify-center">
                          {product.imageUrl ? (
                            <Image src={product.imageUrl} alt={product.name} width={36} height={36} className="object-cover w-full h-full" />
                          ) : (
                            <Package className="w-4 h-4 text-slate-400" />
                          )}
                        </div>
                        <p className="font-medium text-slate-700 max-w-[180px] truncate">{product.name}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-mono text-xs bg-slate-100 px-2 py-1 rounded text-slate-600">{product.sku}</span>
                    </td>
                    <td className="py-3 px-4 text-slate-600">{product.category}</td>
                    <td className="py-3 px-4 font-semibold text-slate-700">{formatCurrency(product.price)}</td>
                    <td className="py-3 px-4">
                      <span className={`font-medium ${product.stock === 0 ? "text-red-600" : product.stock < 10 ? "text-orange-600" : "text-slate-700"}`}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`badge badge-${product.status}`}>{product.status.replace("_", " ")}</span>
                    </td>
                    <td className="py-3 px-4 text-slate-500 text-xs">{formatDate(product.createdAt)}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => { setEditProduct(product); setModalOpen(true); }}
                          className="p-1.5 rounded-lg hover:bg-blue-50 text-slate-400 hover:text-blue-600 transition-colors"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteProduct(product)}
                          className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100">
            <p className="text-xs text-slate-500">
              Showing {(pagination.page - 1) * pagination.limit + 1}–{Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}
            </p>
            <div className="flex items-center gap-1">
              <button onClick={() => fetchProducts(pagination.page - 1)} disabled={pagination.page === 1} className="p-1.5 rounded hover:bg-slate-100 disabled:opacity-40">
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
                <button key={p} onClick={() => fetchProducts(p)} className={`w-8 h-8 rounded text-xs font-medium transition-colors ${p === pagination.page ? "bg-blue-600 text-white" : "hover:bg-slate-100 text-slate-600"}`}>
                  {p}
                </button>
              ))}
              <button onClick={() => fetchProducts(pagination.page + 1)} disabled={pagination.page === pagination.totalPages} className="p-1.5 rounded hover:bg-slate-100 disabled:opacity-40">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {modalOpen && (
        <ProductModal
          product={editProduct}
          onClose={() => { setModalOpen(false); setEditProduct(null); }}
          onSaved={handleProductSaved}
        />
      )}

      {deleteProduct && (
        <DeleteConfirmModal
          product={deleteProduct}
          onClose={() => setDeleteProduct(null)}
          onConfirm={() => handleDelete(deleteProduct._id)}
        />
      )}
    </div>
  );
}