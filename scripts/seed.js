const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://ecomAdmin:Admin1234@ecom-cluster.ljzywe6.mongodb.net/?appName=ecom-cluster";

const AdminSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    password: String,
    role: { type: String, default: "admin" },
  },
  { timestamps: true }
);

const ProductSchema = new mongoose.Schema(
  {
    name: String,
    description: String,
    price: Number,
    category: String,
    stock: Number,
    sku: { type: String, unique: true },
    imageUrl: String,
    status: { type: String, default: "active" },
    discount: { type: Number, default: 0 },
    tags: [String],
    sales: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Admin = mongoose.models.Admin || mongoose.model("Admin", AdminSchema);
const Product = mongoose.models.Product || mongoose.model("Product", ProductSchema);

const sampleProducts = [
  {
    name: "Sony WH-1000XM5 Headphones",
    description: "Industry-leading noise cancellation with exceptional sound quality. Features 30-hour battery life and comfortable over-ear design.",
    price: 349.99, category: "Electronics", stock: 45, sku: "SONY-WH1000XM5",
    status: "active", discount: 10, tags: ["wireless", "noise-cancelling"],
    sales: 128, imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
  },
  {
    name: "Apple MacBook Air M2",
    description: "The remarkably thin MacBook Air with the powerful M2 chip. 13.6-inch Liquid Retina display, up to 18-hour battery.",
    price: 1099.00, category: "Electronics", stock: 18, sku: "APPLE-MBA-M2",
    status: "active", discount: 0, tags: ["apple", "laptop"],
    sales: 56, imageUrl: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400",
  },
  {
    name: "Nike Air Max 270",
    description: "Nike's biggest heel Air unit yet for a super-soft ride that feels as good as it looks. Perfect for all-day wear.",
    price: 149.99, category: "Clothing", stock: 82, sku: "NIKE-AM270-BLK",
    status: "active", discount: 15, tags: ["nike", "shoes"],
    sales: 312, imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400",
  },
  {
    name: "Levi's 501 Original Jeans",
    description: "The original blue jean since 1873. Straight fit with button fly. Made from 100% heavyweight denim.",
    price: 79.99, category: "Clothing", stock: 150, sku: "LEVIS-501-ORIG",
    status: "active", discount: 0, tags: ["levis", "jeans"],
    sales: 445, imageUrl: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400",
  },
  {
    name: "Atomic Habits",
    description: "An Easy and Proven Way to Build Good Habits and Break Bad Ones by James Clear.",
    price: 24.99, category: "Books", stock: 200, sku: "BOOK-ATOMIC-HABITS",
    status: "active", discount: 5, tags: ["self-help", "habits"],
    sales: 892, imageUrl: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400",
  },
  {
    name: "Yoga Mat Premium",
    description: "Extra thick 6mm non-slip exercise mat with carrying strap. Perfect for yoga, pilates, and fitness.",
    price: 44.99, category: "Sports", stock: 7, sku: "SPORT-YOGA-MAT-PRE",
    status: "active", discount: 0, tags: ["yoga", "fitness"],
    sales: 167, imageUrl: "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=400",
  },
  {
    name: "Philips Hue Smart Bulb Kit",
    description: "Start experiencing a smarter home with Philips Hue. Includes 3 bulbs and 1 bridge.",
    price: 179.99, category: "Home", stock: 0, sku: "PHILIPS-HUE-START",
    status: "out_of_stock", discount: 20, tags: ["smart-home", "lighting"],
    sales: 89, imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
  },
  {
    name: "Instant Pot Duo 7-in-1",
    description: "7-in-1 multi-use programmable pressure cooker, slow cooker, rice cooker, steamer, and more.",
    price: 89.99, category: "Home", stock: 34, sku: "INSTPOT-DUO-6QT",
    status: "active", discount: 25, tags: ["cooking", "kitchen"],
    sales: 234, imageUrl: "https://images.unsplash.com/photo-1585515320310-259814833e62?w=400",
  },
  {
    name: "Organic Green Tea Pack",
    description: "Premium Japanese Matcha green tea from Uji, Kyoto. 100 premium tea bags, no artificial flavors.",
    price: 19.99, category: "Food", stock: 3, sku: "TEA-ORG-GREEN-100",
    status: "active", discount: 0, tags: ["tea", "organic"],
    sales: 556, imageUrl: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400",
  },
  {
    name: "Samsung 4K Monitor 27\"",
    description: "27-inch 4K UHD monitor with IPS panel, HDR support, and USB-C connectivity.",
    price: 449.99, category: "Electronics", stock: 22, sku: "SAMSUNG-4K-27IN",
    status: "inactive", discount: 0, tags: ["samsung", "monitor"],
    sales: 43, imageUrl: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400",
  },
];

async function seed() {
  try {
    console.log("🌱 Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected!\n");

    console.log("👤 Creating admin accounts...");
    const superAdminPassword = await bcrypt.hash("Admin@1234", 12);
    const adminPassword = await bcrypt.hash("Admin@1234", 12);

    await Admin.deleteMany({});
    await Admin.create([
      { name: "Super Admin", email: "superadmin@shop.com", password: superAdminPassword, role: "superadmin" },
      { name: "Store Admin", email: "admin@shop.com", password: adminPassword, role: "admin" },
    ]);

    console.log("  ✅ superadmin@shop.com / Admin@1234");
    console.log("  ✅ admin@shop.com / Admin@1234\n");

    console.log("📦 Seeding products...");
    await Product.deleteMany({});
    await Product.create(sampleProducts);
    console.log(`  ✅ ${sampleProducts.length} products created\n`);

    console.log("🎉 Database seeded successfully!");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("🔐 Login with:");
    console.log("   superadmin@shop.com / Admin@1234");
    console.log("   admin@shop.com / Admin@1234");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
}

seed();
