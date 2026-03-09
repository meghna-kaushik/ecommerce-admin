import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import LoginForm from "@/components/forms/LoginForm";
import { ShoppingBag } from "lucide-react";

export default async function LoginPage() {
  const session = await getServerSession(authOptions);
  if (session) redirect("/dashboard");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4 shadow-lg shadow-blue-600/40">
            <ShoppingBag className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">ShopAdmin</h1>
          <p className="text-slate-400 mt-2">Sign in to your admin dashboard</p>
        </div>

        <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 shadow-2xl">
          <LoginForm />

          <div className="mt-6 pt-6 border-t border-slate-700">
            <p className="text-xs text-slate-500 text-center">Demo credentials:</p>
            <div className="mt-2 bg-slate-900/60 rounded-lg p-3 text-xs text-slate-400 space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-500">Super Admin:</span>
                <span>superadmin@shop.com / Admin@1234</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Admin:</span>
                <span>admin@shop.com / Admin@1234</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}