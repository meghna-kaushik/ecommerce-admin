"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { adminSchema, AdminFormData } from "@/lib/validations";
import { cn } from "@/lib/utils";
import { Plus, X, Loader2, User, Shield, ShieldCheck, Eye, EyeOff, Trash2, KeyRound } from "lucide-react";
import toast from "react-hot-toast";

interface AdminsClientProps {
  initialAdmins: any[];
}

export default function AdminsClient({ initialAdmins }: AdminsClientProps) {
  const [admins, setAdmins] = useState(initialAdmins);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [resetModal, setResetModal] = useState<any>(null);
  const [newPassword, setNewPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [deleteModal, setDeleteModal] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  
const { register, handleSubmit, reset, formState: { errors } } = useForm<AdminFormData>({
  resolver: zodResolver(adminSchema) as any,
  defaultValues: { role: "admin" },
});
  const onSubmit = async (data: AdminFormData) => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Failed to create admin");
      setAdmins((prev) => [result, ...prev]);
      toast.success("Admin created successfully!");
      setModalOpen(false);
      reset();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setSubmitting(false);
    }
  };

const handleResetPassword = async () => {
  // Same validation as create
  if (!newPassword || newPassword.length < 8) {
    toast.error("Password must be at least 8 characters");
    return;
  }
  if (!/[A-Z]/.test(newPassword)) {
    toast.error("Password must contain at least one uppercase letter");
    return;
  }
  if (!/[0-9]/.test(newPassword)) {
    toast.error("Password must contain at least one number");
    return;
  }

  setLoading(true);
  try {
    const res = await fetch(`/api/admin/${resetModal._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "resetPassword", newPassword }),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error);
    toast.success("Password reset successfully!");
    setResetModal(null);
    setNewPassword("");
  } catch (error: any) {
    toast.error(error.message);
  } finally {
    setLoading(false);
  }
};

  const handleDelete = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/${deleteModal._id}`, { method: "DELETE" });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error);
      setAdmins((prev) => prev.filter((a) => a._id !== deleteModal._id));
      toast.success("Admin deleted successfully!");
      setDeleteModal(null);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-slate-500">{admins.length} admin{admins.length !== 1 ? "s" : ""} registered</p>
          <button onClick={() => setModalOpen(true)} className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" />Add Admin
          </button>
        </div>

        <div className="space-y-3">
          {admins.map((admin) => (
            <div key={admin._id} className="flex items-center justify-between p-4 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-violet-600">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-slate-700">{admin.name}</p>
                  <p className="text-sm text-slate-400">{admin.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  {admin.role === "superadmin" ? (
                    <ShieldCheck className="w-4 h-4 text-violet-600" />
                  ) : (
                    <Shield className="w-4 h-4 text-blue-500" />
                  )}
                  <span className={cn(
                    "text-xs font-semibold capitalize",
                    admin.role === "superadmin" ? "text-violet-700" : "text-blue-700"
                  )}>
                    {admin.role}
                  </span>
                </div>

                {admin.role !== "superadmin" && (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => { setResetModal(admin); setNewPassword(""); }}
                      className="p-1.5 rounded-lg hover:bg-blue-50 text-slate-400 hover:text-blue-600 transition-colors"
                      title="Reset Password"
                    >
                      <KeyRound className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => setDeleteModal(admin)}
                      className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors"
                      title="Delete Admin"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Admin Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-slate-800">Add New Admin</h2>
              <button onClick={() => { setModalOpen(false); reset(); }} className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name</label>
                <input {...register("name")} className={cn("input-field", errors.name && "input-error")} placeholder="John Doe" />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Email Address</label>
                <input {...register("email")} type="email" className={cn("input-field", errors.email && "input-error")} placeholder="admin@example.com" />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
                <div className="relative">
                  <input {...register("password")} type={showPassword ? "text" : "password"} className={cn("input-field pr-10", errors.password && "input-error")} placeholder="Min. 8 chars, 1 uppercase, 1 number" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Role</label>
                <select {...register("role")} className="input-field">
                  <option value="admin">Admin</option>
                  <option value="superadmin">Super Admin</option>
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => { setModalOpen(false); reset(); }} className="btn-secondary flex-1" disabled={submitting}>Cancel</button>
                <button type="submit" disabled={submitting} className="btn-primary flex-1 flex items-center justify-center gap-2">
                  {submitting ? <><Loader2 className="w-4 h-4 animate-spin" />Creating...</> : "Create Admin"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reset Password Modal */}
      {resetModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-800">Reset Password</h2>
              <button onClick={() => setResetModal(null)} className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center">
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-sm text-slate-500 mb-4">
              Resetting password for <span className="font-semibold text-slate-700">{resetModal.name}</span>
            </p>
            <div className="relative mb-4">
              <input
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Min. 8 chars, 1 uppercase, 1 number"
                className="input-field pr-10"
              />
              <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setResetModal(null)} className="btn-secondary flex-1">Cancel</button>
              <button onClick={handleResetPassword} disabled={loading} className="btn-primary flex-1 flex items-center justify-center gap-2">
                {loading ? <><Loader2 className="w-4 h-4 animate-spin" />Resetting...</> : "Reset Password"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-800">Delete Admin?</h2>
              <button onClick={() => setDeleteModal(null)} className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center">
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-sm text-slate-500 mb-1">You are about to delete:</p>
            <p className="font-semibold text-slate-700 mb-3">{deleteModal.name} ({deleteModal.email})</p>
            <p className="text-red-500 text-xs bg-red-50 rounded-lg p-3 mb-4">
              ⚠️ This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteModal(null)} className="btn-secondary flex-1">Cancel</button>
              <button onClick={handleDelete} disabled={loading} className="btn-danger flex-1 flex items-center justify-center gap-2">
                {loading ? <><Loader2 className="w-4 h-4 animate-spin" />Deleting...</> : "Delete Admin"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}