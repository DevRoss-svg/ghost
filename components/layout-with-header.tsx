import { Suspense } from "react";
import Header from "@/components/Header";
import { Skeleton } from "@/components/ui/skeleton";

// Fallback component while Header loads
function HeaderSkeleton() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Skeleton className="h-10 w-10 rounded-md" />
          <Skeleton className="h-6 w-32" />
        </div>
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-20" />
          <Skeleton className="h-10 w-10 rounded-md" />
        </div>
      </div>
    </header>
  );
}

export default function LayoutWithHeader({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Suspense fallback={<HeaderSkeleton />}>
        <Header />
      </Suspense>
      {children}
    </>
  );
}