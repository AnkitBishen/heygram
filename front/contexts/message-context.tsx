"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

// Define types
interface Message {
  id: number
  senderId: number
  senderUsername: string
  senderAvatar: string
  recipientId?: number
  content: string
  timestamp: string
  read: boolean
}

interface MessageContextType {
  messages: Message[]
  unreadCount: number
  markAsRead: (messageId: number) => void
  markAllAsRead: () => void
  sendMessage: (content: string, recipientId: number) => Message
}

// Sample messages data
const SAMPLE_MESSAGES: Message[] = [
  {
    id: 1,
    senderId: 2,
    senderUsername: "janedoe",
    senderAvatar: "/placeholder.svg?height=40&width=40",
    content: "Hey! How are you doing?",
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 minutes ago
    read: false,
  },
  {
    id: 2,
    senderId: 3,
    senderUsername: "mike_smith",
    senderAvatar: "/placeholder.svg?height=40&width=40",
    content: "Check out this post!",
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
    read: false,
  },
  {
    id: 3,
    senderId: 4,
    senderUsername: "sarah_j",
    senderAvatar: "/placeholder.svg?height=40&width=40",
    content: "Liked a message",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    read: true,
  },
]

const MessageContext = createContext<MessageContextType>({
  messages: [],
  unreadCount: 0,
  markAsRead: () => {},
  markAllAsRead: () => {},
  sendMessage: () => ({
    id: 0,
    senderId: 0,
    senderUsername: "",
    senderAvatar: "",
    content: "",
    timestamp: "",
    read: false,
  }),
})

interface MessageProviderProps {
  children: ReactNode
}

export function MessageProvider({ children }: MessageProviderProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [unreadCount, setUnreadCount] = useState<number>(0)

  // Initialize messages
  useEffect(() => {
    setMessages(SAMPLE_MESSAGES)
    setUnreadCount(SAMPLE_MESSAGES.filter((msg) => !msg.read).length)
  }, [])

  const markAsRead = (messageId: number): void => {
    setMessages((prev) => prev.map((msg) => (msg.id === messageId ? { ...msg, read: true } : msg)))

    // Update unread count
    setUnreadCount((prev) => Math.max(0, prev - 1))
  }

  const markAllAsRead = (): void => {
    setMessages((prev) => prev.map((msg) => ({ ...msg, read: true })))
    setUnreadCount(0)
  }

  const sendMessage = (content: string, recipientId: number): Message => {
    const newMessage: Message = {
      id: Date.now(),
      senderId: 1, // Current user
      senderUsername: "johndoe",
      senderAvatar: "/placeholder.svg?height=40&width=40",
      recipientId,
      content,
      timestamp: new Date().toISOString(),
      read: true,
    }

    setMessages((prev) => [...prev, newMessage])
    return newMessage
  }

  return (
    <MessageContext.Provider
      value={{
        messages,
        unreadCount,
        markAsRead,
        markAllAsRead,
        sendMessage,
      }}
    >
      {children}
    </MessageContext.Provider>
  )
}

export const useMessages = () => useContext(MessageContext)

