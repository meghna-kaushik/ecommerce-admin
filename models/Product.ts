import mongoose, { Schema, Document } from "mongoose";

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  sku: string;
  imageUrl?: string;
  imagePublicId?: string;
  status: "active" | "inactive" | "out_of_stock";
  discount: number;
  tags: string[];
  sales: number;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    category: {
      type: String,
      required: true,
      enum: ["Electronics", "Clothing", "Food", "Books", "Sports", "Home", "Other"],
    },
    stock: { type: Number, required: true, min: 0, default: 0 },
    sku: { type: String, required: true, unique: true, trim: true },
    imageUrl: { type: String, default: "" },
    imagePublicId: { type: String, default: "" },
    status: { type: String, enum: ["active", "inactive", "out_of_stock"], default: "active" },
    discount: { type: Number, default: 0, min: 0, max: 100 },
    tags: [{ type: String, trim: true }],
    sales: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);