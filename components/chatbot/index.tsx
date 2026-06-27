'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import FloatingBot from './floating-bot'
import ChatWindow from './chat-window'

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false)
  const [isThrottled, setIsThrottled] = useState(false)
  const pathname = usePathname()

  // Hide the chatbot on auth and admin pages
  if (pathname?.startsWith('/login') || pathname?.startsWith('/signup') || pathname?.startsWith('/admin')) {
    return null
  }

  const handleToggle = () => {
    if (isThrottled) return
    
    setIsOpen(!isOpen)
    setIsThrottled(true)
    
    // 500ms cooldown to prevent rapid clicking from hanging the UI
    setTimeout(() => setIsThrottled(false), 500)
  }

  return (
    <>
      <FloatingBot 
        isOpen={isOpen} 
        onClick={handleToggle} 
      />
      <ChatWindow 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
      />
    </>
  )
}
