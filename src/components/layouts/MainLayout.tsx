"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const navigation: { name: string; href: string }[] = [];

export default function MainLayout({
  children,
  footerContent,
}: {
  children: React.ReactNode;
  footerContent?: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-lg font-bold font-geist-sans">Rate it</span>
          </Link>

          <nav className="hidden md:flex space-x-6 ml-auto">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary font-geist-sans",
                  pathname === item.href
                    ? "text-primary"
                    : "text-muted-foreground",
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>
          <Avatar>
            <AvatarFallback>me</AvatarFallback>
          </Avatar>
        </div>
      </header>
      <main className="flex-1 flex justify-center">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </div>
      </main>
      <footer className="flex-col items-center  justify-center bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        {footerContent}
      </footer>
    </div>
  );
}
