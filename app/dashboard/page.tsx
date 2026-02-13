import { Suspense } from "react";
import { getUser } from "@/app/auth/auth/server";
import { redirect } from "next/navigation";
import { syncUserToDatabase } from "@/app/action/users";

async function DashboardContent() {
  const user = await getUser();

  if (!user) {
    redirect("/login");
  }

  // Sync user to Prisma database (creates or updates)
  const result = await syncUserToDatabase();
  
  if (!result.success) {
    console.error("Failed to sync user:", result.error);
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      <div className="rounded-lg border p-6 mb-4">
        <p className="text-lg mb-2">Welcome back!</p>
        <p className="text-muted-foreground">Email: {user.email}</p>
        {result.success && (
          <p className="text-xs text-green-600 mt-2">
            ✓ Profile synced to database ({result.action})
          </p>
        )}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DashboardContent />
    </Suspense>
  );
}