"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Home, Search, PlusSquare, Heart, User, MessageCircle, Compass, Instagram, Menu } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useMobile } from "@/hooks/use-mobile"

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isMobile = useMobile()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop Sidebar */}
      {!isMobile && (
        <div className="fixed inset-y-0 z-30 hidden w-20 flex-col border-r bg-background lg:flex lg:w-64">
          <div className="flex h-16 items-center justify-center px-4 lg:justify-start">
            <Instagram className="h-8 w-8 lg:hidden" />
            <h1 className="hidden text-xl font-bold lg:block">Heygram</h1>
          </div>
          <nav className="flex flex-1 flex-col gap-2 p-4">
            <NavLink href="/" icon={<Home />} label="Home" active={pathname === "/"} />
            <NavLink href="/explore" icon={<Compass />} label="Explore" active={pathname === "/explore"} />
            <NavLink href="/messages" icon={<MessageCircle />} label="Messages" active={pathname === "/messages"} />
            <NavLink
              href="/notifications"
              icon={<Heart />}
              label="Notifications"
              active={pathname === "/notifications"}
            />
            <NavLink href="/create" icon={<PlusSquare />} label="Create" active={pathname === "/create"} />
            <NavLink href="/profile" icon={<User />} label="Profile" active={pathname === "/profile"} />
          </nav>
          <div className="p-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" className="w-full justify-start gap-2">
                  <Menu className="h-5 w-5" />
                  <span className="hidden lg:inline-block">More</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <div className="grid gap-4 py-4">
                  <Link href="/settings" className="flex items-center gap-2 text-sm font-medium">
                    Settings
                  </Link>
                  <Link href="/saved" className="flex items-center gap-2 text-sm font-medium">
                    Saved
                  </Link>
                  <Link href="/login" className="flex items-center gap-2 text-sm font-medium">
                    Logout
                  </Link>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 lg:ml-20 lg:ml-64">{children}</main>

      {/* Mobile Bottom Navigation */}
      {isMobile && (
        <div className="fixed inset-x-0 bottom-0 z-30 border-t bg-background">
          <nav className="flex h-16 items-center justify-around">
            <Link href="/" className="flex h-full w-full items-center justify-center">
              <Home className={`h-6 w-6 ${pathname === "/" ? "text-primary" : "text-muted-foreground"}`} />
            </Link>
            <Link href="/explore" className="flex h-full w-full items-center justify-center">
              <Search className={`h-6 w-6 ${pathname === "/explore" ? "text-primary" : "text-muted-foreground"}`} />
            </Link>
            <Link href="/create" className="flex h-full w-full items-center justify-center">
              <PlusSquare className={`h-6 w-6 ${pathname === "/create" ? "text-primary" : "text-muted-foreground"}`} />
            </Link>
            <Link href="/notifications" className="flex h-full w-full items-center justify-center">
              <Heart
                className={`h-6 w-6 ${pathname === "/notifications" ? "text-primary" : "text-muted-foreground"}`}
              />
            </Link>
            <Link href="/profile" className="flex h-full w-full items-center justify-center">
              <Avatar className="h-7 w-7">
                <AvatarImage src="/placeholder-user.jpg" alt="@user" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
            </Link>
          </nav>
        </div>
      )}
    </div>
  )
}

function NavLink({
  href,
  icon,
  label,
  active,
}: { href: string; icon: React.ReactNode; label: string; active: boolean }) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-4 rounded-md px-3 py-2 text-sm font-medium ${
        active
          ? "bg-accent text-accent-foreground"
          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
      }`}
    >
      <div className="text-lg">{icon}</div>
      <span className="hidden lg:inline-block">{label}</span>
    </Link>
  )
}

