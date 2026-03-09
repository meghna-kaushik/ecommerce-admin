"use client";

import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, Loader2, ChevronRight, ChevronLeft, Check, ImageIcon } from "lucide-react";
import { productSchema, ProductFormData } from "@/lib/validations";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";
import Image from "next/image";

interface ProductModalProps {
  product?: any;
  onClose: () => void;
  onSaved: () => void;
}

const CATEGORIES = ["Electronics", "Clothing", "Food", "Books", "Sports", "Home", "Other"];
const STEPS = ["Basic Info", "Pricing & Stock", "Media & Details"];

export default function ProductModal({ product, onClose, onSaved }: ProductModalProps) {
  const [step, setStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>(product?.imageUrl || "");
  const [imagePublicId, setImagePublicId] = useState<string>(product?.imagePublicId || "");
  const fileRef = useRef<HTMLInputElement>(null);

  const { register, handleSubmit, trigger, setValue, formState: { errors } } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema) as any,
    defaultValues: product ? {
      name: product.name, description: product.description, price: product.price,
      category: product.category, stock: product.stock, sku: product.sku,
      status: product.status, discount: product.discount, imageUrl: product.imageUrl,
      imagePublicId: product.imagePublicId, tags: product.tags || [],
    } : { status: "active", discount: 0, stock: 0, tags: [] },
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { toast.error("Image must be smaller than 5MB"); return; }

    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "ecommerce-admin");

      const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, { method: "POST", body: formData });

      if (!res.ok) {
        const url = URL.createObjectURL(file);
        setImagePreview(url);
        setValue("imageUrl", url);
        toast.success("Image preview ready");
        return;
      }

      const data = await res.json();
      setImagePreview(data.secure_url);
      setImagePublicId(data.public_id);
      setValue("imageUrl", data.secure_url);
      setValue("imagePublicId", data.public_id);
      toast.success("Image uploaded!");
    } catch {
      const url = URL.createObjectURL(file);
      setImagePreview(url);
      setValue("imageUrl", url);
      toast.success("Image preview set");
    } finally {
      setUploadingImage(false);
    }
  };

  const nextStep = async () => {
    let fields: (keyof ProductFormData)[] = [];
    if (step === 0) fields = ["name", "description", "category"];
    if (step === 1) fields = ["price", "stock", "sku", "status"];
    const valid = await trigger(fields);
    if (valid) setStep((s) => s + 1);
  };

const onSubmit = async (data: ProductFormData) => {
  setIsSubmitting(true);
  try {
    // Active product mein stock minimum 1 hona chahiye
    if (data.status === "active" && data.stock < 1) {
      toast.error("Active product must contain minimum 1 stock item!");
      setIsSubmitting(false);
      return;
    }

    // out_of_stock aur inactive pe stock 0 karo
    if (data.status === "out_of_stock" || data.status === "inactive") {
      data.stock = 0;
    }

    const url = product ? `/api/products/${product._id}` : "/api/products";
    const method = product ? "PUT" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, imageUrl: imagePreview, imagePublicId }),
    });
    const responseData = await res.json();
    if (!res.ok) throw new Error(responseData.error || "Failed to save product");
    onSaved();
  } catch (error: any) {
    toast.error(error.message || "Failed to save product");
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-800">{product ? "Edit Product" : "Add New Product"}</h2>
            <p className="text-sm text-slate-400 mt-0.5">Step {step + 1} of {STEPS.length}: {STEPS[step]}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center gap-0 px-6 pt-4">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center flex-1">
              <div className={cn("w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-colors",
                i < step ? "bg-green-500 text-white" : i === step ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-400"
              )}>
                {i < step ? <Check className="w-3.5 h-3.5" /> : i + 1}
              </div>
              {i < STEPS.length - 1 && (
                <div className={cn("flex-1 h-0.5 mx-1 transition-colors", i < step ? "bg-green-400" : "bg-slate-100")} />
              )}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex-1 overflow-y-auto p-6 space-y-4">
          {step === 0 && (
            <>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Product Name *</label>
                <input {...register("name")} className={cn("input-field", errors.name && "input-error")} placeholder="e.g., Wireless Bluetooth Headphones" />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Description *</label>
                <textarea {...register("description")} rows={4} className={cn("input-field resize-none", errors.description && "input-error")} placeholder="Describe your product..." />
                {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Category *</label>
                <select {...register("category")} className={cn("input-field", errors.category && "input-error")}>
                  <option value="">Select a category</option>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category.message}</p>}
              </div>
            </>
          )}

          {step === 1 && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Price (USD) *</label>
                  <input {...register("price", { valueAsNumber: true })} type="number" step="0.01" min="0" className={cn("input-field", errors.price && "input-error")} placeholder="0.00" />
                  {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Discount (%)</label>
                  <input {...register("discount", { valueAsNumber: true })} type="number" min="0" max="100" className="input-field" placeholder="0" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Stock *</label>
                  <input {...register("stock", { valueAsNumber: true })} type="number" min="0" className={cn("input-field", errors.stock && "input-error")} placeholder="0" />
                  {errors.stock && <p className="text-red-500 text-xs mt-1">{errors.stock.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">SKU *</label>
                  <input {...register("sku")} className={cn("input-field font-mono uppercase", errors.sku && "input-error")} placeholder="PROD-001" />
                  {errors.sku && <p className="text-red-500 text-xs mt-1">{errors.sku.message}</p>}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Status *</label>
                <select {...register("status")} className="input-field">
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="out_of_stock">Out of Stock</option>
                </select>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Product Image</label>
                {imagePreview ? (
                  <div className="relative">
                    <Image src={imagePreview} alt="Preview" width={400} height={200} className="w-full h-40 object-cover rounded-lg border border-slate-200" />
                    <button type="button" onClick={() => { setImagePreview(""); setValue("imageUrl", ""); }} className="absolute top-2 right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div onClick={() => fileRef.current?.click()} className="border-2 border-dashed border-slate-200 rounded-lg p-8 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 transition-colors">
                    {uploadingImage ? <Loader2 className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-2" /> : <ImageIcon className="w-8 h-8 text-slate-300 mx-auto mb-2" />}
                    <p className="text-sm font-medium text-slate-600">{uploadingImage ? "Uploading..." : "Click to upload image"}</p>
                    <p className="text-xs text-slate-400 mt-1">PNG, JPG up to 5MB</p>
                  </div>
                )}
                <input ref={fileRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Tags (comma separated)</label>
                <input
                  placeholder="e.g., wireless, bluetooth, premium"
                  className="input-field"
                  onChange={(e) => setValue("tags", e.target.value.split(",").map((t) => t.trim()).filter(Boolean))}
                  defaultValue={product?.tags?.join(", ") || ""}
                />
              </div>
            </>
          )}
        </form>

        <div className="flex items-center justify-between p-6 border-t border-slate-100">
          <button type="button" onClick={step === 0 ? onClose : () => setStep((s) => s - 1)} className="btn-secondary flex items-center gap-1.5">
            {step > 0 && <ChevronLeft className="w-4 h-4" />}
            {step === 0 ? "Cancel" : "Back"}
          </button>

          {step < STEPS.length - 1 ? (
            <button type="button" onClick={nextStep} className="btn-primary flex items-center gap-1.5">
              Next <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button type="button" onClick={handleSubmit(onSubmit)} disabled={isSubmitting} className="btn-primary flex items-center gap-2">
              {isSubmitting ? <><Loader2 className="w-4 h-4 animate-spin" />Saving...</> : <><Check className="w-4 h-4" />{product ? "Update Product" : "Create Product"}</>}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}