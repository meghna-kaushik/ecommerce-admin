import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import Admin from "@/models/Admin";
import { adminSchema } from "@/lib/validations";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if ((session.user as any)?.role !== "superadmin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    await connectDB();
    const admins = await Admin.find().select("-password").sort({ createdAt: -1 }).lean();
    return NextResponse.json(admins);
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if ((session.user as any)?.role !== "superadmin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    await connectDB();
    const body = await req.json();
    const validated = adminSchema.parse(body);

    const existing = await Admin.findOne({ email: validated.email });
    if (existing) return NextResponse.json({ error: "Admin with this email already exists" }, { status: 400 });

    const newAdmin = new Admin({
      name: validated.name,
      email: validated.email,
      password: validated.password,
      role: validated.role,
      isActive: true,
    });

    await newAdmin.save();

    return NextResponse.json({
      _id: newAdmin._id,
      name: newAdmin.name,
      email: newAdmin.email,
      role: newAdmin.role,
      isActive: newAdmin.isActive,
      createdAt: newAdmin.createdAt,
    }, { status: 201 });
  } catch (error: any) {
    console.error("POST admin error:", error);
    if (error.name === "ZodError") return NextResponse.json({ error: "Validation failed" }, { status: 400 });
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}