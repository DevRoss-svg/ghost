import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";
import DarkModeToggle from "./DarkModeToggle";
import { LogoutButton } from "./ui/LogoutButton";
import { getUser } from "@/app/auth/auth/server";
import { SidebarTrigger } from "./ui/sidebar";

export default async function Header() {
  const user = await getUser();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur">
      <div className="flex h-16 items-center justify-between px-4">
        {/* Left side - Sidebar trigger + GOAT Notes Logo */}
        <div className="flex items-center gap-4">
          <SidebarTrigger className="-ml-1" />
          
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/Ghost.jpg"
              alt="GhostNotes logo"
              width={48}
              height={48}
              priority
              className="rounded-full"
            />
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight">Ghost</span>
              <span className="text-sm font-semibold tracking-tight">Notes</span>
            </div>
          </Link>
        </div>

        {/* Right side - Auth buttons */}
        <nav className="flex items-center gap-4">
          {user ? (
            <LogoutButton />
          ) : (
            <>
              <Button asChild variant="outline">
                <Link href="/sign-up" className="hidden sm:inline-flex">
                  Sign Up
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/login">Login</Link>
              </Button>
            </>
          )}
          <DarkModeToggle />
        </nav>
      </div>
    </header>
  );
}