"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function EditProfilePage() {
  const [profile, setProfile] = useState({
    username: "username",
    name: "Your Name",
    website: "https://example.com",
    bio: "Creating my own sunshine. #Heygram",
    email: "user@example.com",
    phone: "+1 234 567 8900",
    gender: "male",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setProfile((prev) => ({ ...prev, [name]: value }))
  }

  const handleGenderChange = (value: string) => {
    setProfile((prev) => ({ ...prev, gender: value }))
  }

  return (
    <div className="container mx-auto p-4 max-w-2xl pb-16 md:pb-4">
      <div className="flex items-center gap-2 mb-6">
        <Link href="/settings">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Edit profile</h1>
      </div>

      <div className="space-y-8">
        {/* Profile Picture */}
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
          <Avatar className="h-20 w-20">
            <AvatarImage src="/placeholder.svg?height=80&width=80" alt="Profile" />
            <AvatarFallback>UN</AvatarFallback>
          </Avatar>
          <div className="text-center sm:text-left">
            <h2 className="font-semibold mb-1">{profile.username}</h2>
            <Button variant="link" className="h-auto p-0 text-primary">
              Change profile photo
            </Button>
          </div>
        </div>

        {/* Form Fields */}
        <div className="space-y-6">
          <div className="grid gap-2">
            <Label htmlFor="username">Username</Label>
            <Input id="username" name="username" value={profile.username} onChange={handleChange} />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" value={profile.name} onChange={handleChange} />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="website">Website</Label>
            <Input id="website" name="website" value={profile.website} onChange={handleChange} placeholder="Website" />
            <p className="text-xs text-muted-foreground">
              Editing your links is only available on mobile. Visit the Heygram app and edit your profile to change the
              websites in your bio.
            </p>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              name="bio"
              value={profile.bio}
              onChange={handleChange}
              rows={4}
              className="resize-none"
            />
            <div className="flex justify-end">
              <span className="text-xs text-muted-foreground">58 / 150</span>
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" value={profile.email} onChange={handleChange} />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="phone">Phone number</Label>
            <Input id="phone" name="phone" value={profile.phone} onChange={handleChange} />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="gender">Gender</Label>
            <Select value={profile.gender} onValueChange={handleGenderChange}>
              <SelectTrigger id="gender">
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="non-binary">Non-binary</SelectItem>
                <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">This won't be part of your public profile.</p>
          </div>

          <Button className="w-full">Submit</Button>
        </div>
      </div>
    </div>
  )
}

