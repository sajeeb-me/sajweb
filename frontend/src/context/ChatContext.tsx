import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

interface ChatContextType {
  messages: Message[];
  addMessage: (message: Message) => void;
  isLoading: boolean;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Hello! I\'m SajWeb AI, your intelligent coding assistant. I can help you build web applications, write code, and answer your development questions. What would you like to create today?',
      role: 'assistant',
      timestamp: new Date()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const addMessage = (message: Message) => {
    setMessages(prev => [...prev, message]);
    
    // Simulate AI response
    if (message.role === 'user') {
      setIsLoading(true);
      setTimeout(() => {
        const responses = [
          "I'll help you build that! Let me create the necessary files and components for your project.",
          "Great idea! I'll start by setting up the project structure and implementing the core functionality you need.",
          "Perfect! I'll create a beautiful, responsive design with modern animations and smooth interactions.",
          "Excellent request! I'll build that with best practices and clean, maintainable code architecture.",
          "I love that concept! Let me create an impressive implementation with great user experience and performance."
        ];
        
        const response: Message = {
          id: Date.now().toString(),
          content: responses[Math.floor(Math.random() * responses.length)],
          role: 'assistant',
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, response]);
        setIsLoading(false);
      }, 1500 + Math.random() * 1000);
    }
  };

  return (
    <ChatContext.Provider value={{ messages, addMessage, isLoading }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};