import type React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { User, Bell, Lock, Users, Moon, HelpCircle, Info, LogOut, ChevronRight } from "lucide-react"

export default function SettingsPage() {
  return (
    <div className="container mx-auto p-4 max-w-3xl pb-16 md:pb-4">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      <div className="space-y-6">
        {/* Meta Section */}
        <div className="bg-card rounded-lg p-4 border">
          <div className="flex items-center gap-2 mb-2">
            <div className="bg-blue-500 text-white rounded p-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
              </svg>
            </div>
            <h2 className="font-semibold">Meta</h2>
          </div>

          <div className="mb-4">
            <h3 className="font-semibold mb-1">Accounts Center</h3>
            <p className="text-sm text-muted-foreground">
              Manage your connected experiences and account settings across Meta technologies.
            </p>
          </div>

          <div className="space-y-3">
            <SettingsLink icon={<User size={18} />} label="Personal details" />
            <SettingsLink icon={<Lock size={18} />} label="Password and security" />
            <SettingsLink icon={<Info size={18} />} label="Ad preferences" />
          </div>

          <Button variant="link" className="text-primary text-sm p-0 h-auto mt-3">
            See more in Accounts Center
          </Button>
        </div>

        {/* How you use Instagram */}
        <div>
          <h2 className="text-lg font-medium mb-3">How you use Heygram</h2>
          <div className="space-y-1">
            <SettingsLink icon={<User size={18} />} label="Edit profile" href="/settings/edit-profile" />
            <SettingsLink icon={<Bell size={18} />} label="Notifications" />
            <AppearanceToggle />
          </div>
        </div>

        {/* Who can see your content */}
        <div>
          <h2 className="text-lg font-medium mb-3">Who can see your content</h2>
          <div className="space-y-1">
            <SettingsLink icon={<Lock size={18} />} label="Account privacy" />
            <SettingsLink icon={<Users size={18} />} label="Close Friends" />
          </div>
        </div>

        {/* Help & About */}
        <div>
          <h2 className="text-lg font-medium mb-3">Help & About</h2>
          <div className="space-y-1">
            <SettingsLink icon={<HelpCircle size={18} />} label="Help Center" />
            <SettingsLink icon={<Info size={18} />} label="About" />
          </div>
        </div>

        {/* Logout */}
        <div>
          <Button
            variant="ghost"
            className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Log Out
          </Button>
        </div>

        <div className="text-center text-xs text-muted-foreground pt-4">
          <p>© 2024 Heygram from Meta</p>
        </div>
      </div>
    </div>
  )
}

function SettingsLink({
  icon,
  label,
  href = "#",
}: {
  icon: React.ReactNode
  label: string
  href?: string
}) {
  return (
    <Link href={href} className="flex items-center justify-between py-3 px-2 rounded-md hover:bg-accent">
      <div className="flex items-center gap-3">
        {icon}
        <span>{label}</span>
      </div>
      <ChevronRight size={18} className="text-muted-foreground" />
    </Link>
  )
}

function AppearanceToggle() {
  return (
    <Link
      href="/settings/appearance"
      className="flex items-center justify-between py-3 px-2 rounded-md hover:bg-accent"
    >
      <div className="flex items-center gap-3">
        <Moon size={18} />
        <span>Appearance</span>
      </div>
      <ChevronRight size={18} className="text-muted-foreground" />
    </Link>
  )
}

