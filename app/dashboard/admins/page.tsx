export const revalidate = 0;

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import connectDB from "@/lib/db";
import Admin from "@/models/Admin";
import AdminsClient from "@/components/AdminsClient";

async function getAdmins() {
  await connectDB();
  const admins = await Admin.find().select("-password").sort({ createdAt: -1 }).lean();
  return JSON.parse(JSON.stringify(admins));
}

export default async function AdminsPage() {
  const session = await getServerSession(authOptions);
  if ((session?.user as any)?.role !== "superadmin") redirect("/dashboard");

  const admins = await getAdmins();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Manage Admins</h1>
        <p className="text-slate-500 mt-1">Onboard and manage administrator accounts</p>
      </div>
      <AdminsClient initialAdmins={admins} />
    </div>
  );
}