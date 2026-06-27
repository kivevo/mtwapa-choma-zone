"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signInAdmin } from "@/lib/actions";
import type { SiteSettings } from "@/types/database.types";

export function AdminLoginClient({ settings }: { settings?: SiteSettings }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const result = await signInAdmin(email, password);
    setLoading(false);

    if (result.success) {
      toast.success("Welcome back!");
      router.push("/admin/dashboard");
      router.refresh();
    } else {
      toast.error(result.error ?? "Login failed");
    }
  };

  return (
    <div className="w-full max-w-md rounded-2xl bg-sand p-8 shadow-xl">
      <div className="mb-8 text-center">
        {settings?.frontend_content?.logo_image ? (
          <div className="relative mx-auto h-16 w-16 mb-4">
            <Image
              src={settings.frontend_content.logo_image}
              alt="Logo"
              fill
              className="object-contain"
            />
          </div>
        ) : (
          <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-ember font-display text-xl font-bold text-sand mb-4">
            {settings?.frontend_content?.logo_text || "CZ"}
          </span>
        )}
        <h1 className="font-display text-2xl font-bold text-charcoal">
          Admin Login
        </h1>
        <p className="mt-2 text-sm text-charcoal/60">
          {settings?.frontend_content?.logo_full_name || "Choma Zone"} {settings?.frontend_content?.logo_subtitle || "Mtwapa Palms"} dashboard
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1.5"
          />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="mt-1.5"
          />
        </div>
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Signing in...
            </>
          ) : (
            "Sign In"
          )}
        </Button>
      </form>
    </div>
  );
}
