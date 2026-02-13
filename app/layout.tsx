import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { Suspense } from "react";
import "@/app/globals.css";
import Header from "@/components/Header";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import AppSidebar from "@/components/AppSidebar";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Ghost-Notes",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SidebarProvider defaultOpen={false}>
            {/* Sidebar */}
            <Suspense fallback={<div className="w-64 border-r" />}>
              <AppSidebar />
            </Suspense>
            
            {/* Main Content Area */}
            <SidebarInset className="flex min-h-screen w-full flex-col">
              {/* Header */}
              <Suspense fallback={<div className="h-16 w-full border-b" />}>
                <Header />
              </Suspense>

              {/* Page Content */}
              <main className="flex flex-1 flex-col px-4 pt-4 xl:px-8">
                {children}
              </main>
            </SidebarInset>
          </SidebarProvider>
          
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}