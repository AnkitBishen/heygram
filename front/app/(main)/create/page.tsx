"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ImagePlus, MapPin, TagIcon, Users } from "lucide-react"

export default function CreatePage() {
  const [selectedFile, setSelectedFile] = useState<string | null>(null)
  const [caption, setCaption] = useState("")

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setSelectedFile(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Create New Post</h1>

      <Tabs defaultValue="post" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="post">Post</TabsTrigger>
          <TabsTrigger value="story">Story</TabsTrigger>
        </TabsList>

        <TabsContent value="post" className="mt-0">
          <div className="space-y-6">
            {!selectedFile ? (
              <div className="border-2 border-dashed rounded-lg p-12 text-center">
                <div className="flex justify-center mb-4">
                  <ImagePlus className="h-12 w-12 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-2">Drag photos and videos here</h3>
                <p className="text-sm text-muted-foreground mb-4">Or browse from your computer</p>
                <div className="flex justify-center">
                  <Label htmlFor="file-upload" className="cursor-pointer">
                    <Button>Select from computer</Button>
                    <Input
                      id="file-upload"
                      type="file"
                      accept="image/*,video/*"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </Label>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="relative aspect-square rounded-md overflow-hidden">
                  <img src={selectedFile || "/placeholder.svg"} alt="Selected" className="w-full h-full object-cover" />
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => setSelectedFile(null)}
                  >
                    Remove
                  </Button>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="caption">Caption</Label>
                    <Textarea
                      id="caption"
                      placeholder="Write a caption..."
                      value={caption}
                      onChange={(e) => setCaption(e.target.value)}
                      className="resize-none"
                      rows={4}
                    />
                  </div>

                  <div>
                    <Button variant="outline" className="w-full justify-start gap-2 mb-2">
                      <MapPin className="h-4 w-4" />
                      Add location
                    </Button>
                    <Button variant="outline" className="w-full justify-start gap-2 mb-2">
                      <TagIcon className="h-4 w-4" />
                      Tag people
                    </Button>
                    <Button variant="outline" className="w-full justify-start gap-2">
                      <Users className="h-4 w-4" />
                      Audience
                    </Button>
                  </div>

                  <Button className="w-full">Share</Button>
                </div>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="story" className="mt-0">
          <div className="border-2 border-dashed rounded-lg p-12 text-center">
            <div className="flex justify-center mb-4">
              <ImagePlus className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-2">Create a new story</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Share a photo or video that will disappear after 24 hours
            </p>
            <div className="flex justify-center">
              <Label htmlFor="story-upload" className="cursor-pointer">
                <Button>Select from computer</Button>
                <Input id="story-upload" type="file" accept="image/*,video/*" className="hidden" />
              </Label>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

