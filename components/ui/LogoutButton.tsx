"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { LogOut, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export function LogoutButton() {
  const [isPending, startTransition] = useTransition();

  const handleLogout = async () => {
    startTransition(async () => {
      try {
        const supabase = createClient();
        
        // Sign out from Supabase
        const { error } = await supabase.auth.signOut();

        if (error) {
          console.error("Logout error:", error.message);
          // Even if there's an error, try to redirect anyway
        }

        // Clear all cookies manually
        document.cookie.split(";").forEach((c) => {
          document.cookie = c
            .replace(/^ +/, "")
            .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
        });

        // Force reload to homepage
        window.location.replace("/");
        
      } catch (err) {
        console.error("Unexpected logout error:", err);
        // Force reload anyway
        window.location.replace("/");
      }
    });
  };

  return (
    <Button
      onClick={handleLogout}
      variant="outline"
      disabled={isPending}
      className="gap-2"
    >
      {isPending ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <>
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">Logout</span>
        </>
      )}
    </Button>
  );
}