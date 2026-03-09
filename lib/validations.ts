import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  description: z.string().min(10, "Description must be at least 10 characters").max(1000),
  price: z.number({ invalid_type_error: "Price must be a number" }).positive("Price must be positive"),
  category: z.enum(["Electronics", "Clothing", "Food", "Books", "Sports", "Home", "Other"], {
    required_error: "Please select a category",
  }),
  stock: z.number({ invalid_type_error: "Stock must be a number" }).int().min(0, "Stock cannot be negative"),
  sku: z.string().min(3).max(50).regex(/^[A-Z0-9-_]+$/i, "SKU can only contain letters, numbers, - and _"),
  imageUrl: z.string().optional(),
  imagePublicId: z.string().optional(),
  status: z.enum(["active", "inactive", "out_of_stock"]).default("active"),
  discount: z.number().min(0).max(100).default(0),
  tags: z.array(z.string()).optional().default([]),
});

export const adminSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain uppercase letter")
    .regex(/[0-9]/, "Must contain a number"),
  role: z.enum(["admin", "superadmin"]).default("admin"),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export type ProductFormData = z.infer<typeof productSchema>;
export type AdminFormData = z.infer<typeof adminSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;