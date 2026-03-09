import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import Admin from "@/models/Admin";
import bcrypt from "bcryptjs";

// Toggle active/inactive
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if ((session.user as any)?.role !== "superadmin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    await connectDB();
    const body = await req.json();
    const { action, newPassword } = body;

    const admin = await Admin.findById(params.id);
    if (!admin) return NextResponse.json({ error: "Admin not found" }, { status: 404 });

    // Superadmin ko deactivate nahi kar sakte
    if (action === "toggle" && admin.role === "superadmin") {
      return NextResponse.json({ error: "Cannot deactivate a superadmin" }, { status: 400 });
    }

    if (action === "toggle") {
      admin.isActive = !admin.isActive;
      await admin.save();
      return NextResponse.json({
        _id: admin._id,
        isActive: admin.isActive,
        message: `Admin ${admin.isActive ? "activated" : "deactivated"} successfully`,
      });
    }

    if (action === "resetPassword") {
      if (!newPassword || newPassword.length < 8) {
        return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
      }
      admin.password = newPassword;
      await admin.save();
      return NextResponse.json({ message: "Password reset successfully" });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error: any) {
    console.error("PATCH admin error:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}

// Delete admin
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if ((session.user as any)?.role !== "superadmin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    await connectDB();
    const admin = await Admin.findById(params.id);
    if (!admin) return NextResponse.json({ error: "Admin not found" }, { status: 404 });

    // Superadmin ko delete nahi kar sakte
    if (admin.role === "superadmin") {
      return NextResponse.json({ error: "Cannot delete a superadmin" }, { status: 400 });
    }

    // Khud ko delete nahi kar sakte
    const currentUserId = (session.user as any)?.id;
    if (admin._id.toString() === currentUserId) {
      return NextResponse.json({ error: "Cannot delete your own account" }, { status: 400 });
    }

    await Admin.findByIdAndDelete(params.id);
    return NextResponse.json({ message: "Admin deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
