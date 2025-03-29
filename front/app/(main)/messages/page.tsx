import Image from "next/image"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Info, Phone, Video, Smile, ImageIcon, Heart, Send } from "lucide-react"

export default function MessagesPage() {
  return (
    <div className="flex h-[calc(100vh-4rem)] md:h-screen md:pt-16">
      {/* Conversations List - Hidden on mobile */}
      <div className="hidden md:flex md:w-80 border-r flex-col">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold text-center">Messages</h2>
        </div>
        <ScrollArea className="flex-1">
          {Array.from({ length: 15 }).map((_, i) => (
            <div
              key={i}
              className={`p-4 flex items-center gap-3 hover:bg-accent cursor-pointer ${i === 0 ? "bg-accent" : ""}`}
            >
              <Avatar>
                <AvatarImage src={`/placeholder.svg?height=40&width=40`} alt={`User ${i + 1}`} />
                <AvatarFallback>U{i}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <p className="font-medium truncate">user{i + 1}</p>
                  <span className="text-xs text-muted-foreground">{i === 0 ? "Now" : `${i}h ago`}</span>
                </div>
                <p className="text-sm text-muted-foreground truncate">
                  {i % 3 === 0 ? "Hey, how are you doing?" : i % 3 === 1 ? "Check out this post!" : "Liked a message"}
                </p>
              </div>
            </div>
          ))}
        </ScrollArea>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="p-4 border-b flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Chat User" />
              <AvatarFallback>U1</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">user1</p>
              <p className="text-xs text-muted-foreground">Active now</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon">
              <Phone className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Video className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Info className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Chat Messages */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            <div className="flex justify-start">
              <div className="bg-accent rounded-2xl rounded-tl-sm p-3 max-w-[70%]">
                <p>Hey! How are you doing?</p>
                <p className="text-xs text-muted-foreground mt-1">10:30 AM</p>
              </div>
            </div>
            <div className="flex justify-end">
              <div className="bg-primary text-primary-foreground rounded-2xl rounded-tr-sm p-3 max-w-[70%]">
                <p>I'm good! Just checking out this new app called Heygram 😄</p>
                <p className="text-xs text-primary-foreground/70 mt-1">10:32 AM</p>
              </div>
            </div>
            <div className="flex justify-start">
              <div className="bg-accent rounded-2xl rounded-tl-sm p-3 max-w-[70%]">
                <p>It looks really cool! Very similar to Instagram.</p>
                <p className="text-xs text-muted-foreground mt-1">10:33 AM</p>
              </div>
            </div>
            <div className="flex justify-end">
              <div className="bg-primary text-primary-foreground rounded-2xl rounded-tr-sm p-3 max-w-[70%]">
                <p>Yeah, I like the interface. It's clean and easy to use.</p>
                <p className="text-xs text-primary-foreground/70 mt-1">10:35 AM</p>
              </div>
            </div>
            <div className="flex justify-start">
              <div className="bg-accent rounded-2xl rounded-tl-sm p-3 max-w-[70%]">
                <p>Have you posted anything yet?</p>
                <p className="text-xs text-muted-foreground mt-1">10:36 AM</p>
              </div>
            </div>
            <div className="flex justify-start">
              <div className="bg-accent rounded-2xl rounded-tl-sm p-3 max-w-[70%]">
                <Image
                  src="/placeholder.svg?height=300&width=300"
                  alt="Shared image"
                  width={200}
                  height={200}
                  className="rounded-md"
                />
                <p className="text-xs text-muted-foreground mt-1">10:37 AM</p>
              </div>
            </div>
            <div className="flex justify-end">
              <div className="bg-primary text-primary-foreground rounded-2xl rounded-tr-sm p-3 max-w-[70%]">
                <p>Not yet, but I'm planning to share some photos from my recent trip!</p>
                <p className="text-xs text-primary-foreground/70 mt-1">10:38 AM</p>
              </div>
            </div>
          </div>
        </ScrollArea>

        {/* Chat Input */}
        <div className="p-4 border-t">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Smile className="h-5 w-5" />
            </Button>
            <Input placeholder="Message..." className="flex-1" />
            <Button variant="ghost" size="icon">
              <ImageIcon className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Heart className="h-5 w-5" />
            </Button>
            <Button size="icon" className="rounded-full">
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

