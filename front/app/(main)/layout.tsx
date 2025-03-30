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
// import { ThemeProvider } from "@/components/theme-provider"
import { useAuth } from "@/contexts/auth-context"
import { useMessages } from "@/contexts/message-context"
import { ProfileHoverCard } from "@/components/profile-hover-card"
export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isMobile = useMobile()
  // const { theme } = ThemeProvider()
  const { user, logout } = useAuth()
  const { unreadCount } = useMessages()
  const [mounted, setMounted] = useState<boolean>(false)

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
            <NavLink
              href="/messages"
              icon={<MessageIcon />}
              label="Messages"
              active={pathname === "/messages"}
              badge={unreadCount > 0 ? unreadCount : null}
            />
            <NavLink
              href="/notifications"
              icon={<NotificationIcon />}
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

interface NavLinkProps {
  href: string
  icon: React.ReactNode
  label: string
  active: boolean
  badge?: number | null
}

function NavLink({ href, icon, label, active, badge = null }: NavLinkProps) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-4 rounded-xl px-3 py-3 text-sm font-medium transition-all ${
        active
          ? "bg-accent text-accent-foreground"
          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
      }`}
    >
      <div className="text-lg relative">
        {icon}
        {badge !== null && (
          <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
            {badge}
          </span>
        )}
      </div>
      <span className="hidden lg:inline-block">{label}</span>
    </Link>
  )
}
function MessageIcon({ filled }: { filled?: boolean }) {
  return filled ? (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
    </svg>
  ) : (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
    </svg>
  )
}

function NotificationIcon({ filled }: { filled?: boolean }) {
  return filled ? (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
    </svg>
  ) : (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
    </svg>
  )
}


function LogoutIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
      <polyline points="16 17 21 12 16 7"></polyline>
      <line x1="21" x2="9" y1="12" y2="12"></line>
    </svg>
  )
}
