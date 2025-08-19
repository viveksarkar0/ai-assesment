"use client";

// Local storage fallback for chat functionality when database is not available
// This provides a temporary solution for development and testing

export interface User {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Chat {
  id: string;
  userId: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Message {
  id: string;
  chatId: string;
  role: "user" | "assistant";
  content: string;
  toolInvocations?: any[];
  createdAt: Date;
}

// In-memory storage
let users: User[] = [];
let chats: Chat[] = [];
let messages: Message[] = [];

// Utility functions
const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

const saveToLocalStorage = () => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('chat-users', JSON.stringify(users));
      localStorage.setItem('chat-chats', JSON.stringify(chats));
      localStorage.setItem('chat-messages', JSON.stringify(messages));
    } catch (error) {
      console.warn('Failed to save to localStorage:', error);
    }
  }
};

const loadFromLocalStorage = () => {
  if (typeof window !== 'undefined') {
    try {
      const storedUsers = localStorage.getItem('chat-users');
      const storedChats = localStorage.getItem('chat-chats');
      const storedMessages = localStorage.getItem('chat-messages');

      if (storedUsers) {
        users = JSON.parse(storedUsers).map((user: any) => ({
          ...user,
          createdAt: new Date(user.createdAt),
          updatedAt: new Date(user.updatedAt),
        }));
      }

      if (storedChats) {
        chats = JSON.parse(storedChats).map((chat: any) => ({
          ...chat,
          createdAt: new Date(chat.createdAt),
          updatedAt: new Date(chat.updatedAt),
        }));
      }

      if (storedMessages) {
        messages = JSON.parse(storedMessages).map((message: any) => ({
          ...message,
          createdAt: new Date(message.createdAt),
        }));
      }
    } catch (error) {
      console.warn('Failed to load from localStorage:', error);
    }
  }
};

// Initialize storage
loadFromLocalStorage();

export const LocalStorage = {
  // User operations
  async createUser(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    const existingUser = users.find(u => u.email === userData.email);
    if (existingUser) {
      return existingUser;
    }

    const user: User = {
      id: userData.email, // Use email as ID for consistency
      ...userData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    users.push(user);
    saveToLocalStorage();
    return user;
  },

  async getUserByEmail(email: string): Promise<User | null> {
    return users.find(u => u.email === email) || null;
  },

  async updateUser(id: string, updates: Partial<Omit<User, 'id' | 'createdAt'>>): Promise<User | null> {
    const userIndex = users.findIndex(u => u.id === id);
    if (userIndex === -1) return null;

    users[userIndex] = {
      ...users[userIndex],
      ...updates,
      updatedAt: new Date(),
    };

    saveToLocalStorage();
    return users[userIndex];
  },

  // Chat operations
  async createChat(userId: string, title: string): Promise<Chat> {
    const chat: Chat = {
      id: generateId(),
      userId,
      title,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    chats.push(chat);
    saveToLocalStorage();
    return chat;
  },

  async getChatsByUserId(userId: string): Promise<Chat[]> {
    return chats
      .filter(c => c.userId === userId)
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
  },

  async getChatById(id: string): Promise<Chat | null> {
    return chats.find(c => c.id === id) || null;
  },

  async updateChat(id: string, updates: Partial<Omit<Chat, 'id' | 'userId' | 'createdAt'>>): Promise<Chat | null> {
    const chatIndex = chats.findIndex(c => c.id === id);
    if (chatIndex === -1) return null;

    chats[chatIndex] = {
      ...chats[chatIndex],
      ...updates,
      updatedAt: new Date(),
    };

    saveToLocalStorage();
    return chats[chatIndex];
  },

  async deleteChat(id: string): Promise<boolean> {
    const chatIndex = chats.findIndex(c => c.id === id);
    if (chatIndex === -1) return false;

    // Delete chat and associated messages
    chats.splice(chatIndex, 1);
    messages = messages.filter(m => m.chatId !== id);

    saveToLocalStorage();
    return true;
  },

  // Message operations
  async createMessage(messageData: Omit<Message, 'id' | 'createdAt'>): Promise<Message> {
    const message: Message = {
      id: generateId(),
      ...messageData,
      createdAt: new Date(),
    };

    messages.push(message);

    // Update chat's updatedAt timestamp
    const chatIndex = chats.findIndex(c => c.id === messageData.chatId);
    if (chatIndex !== -1) {
      chats[chatIndex].updatedAt = new Date();
    }

    saveToLocalStorage();
    return message;
  },

  async getMessagesByChatId(chatId: string): Promise<Message[]> {
    return messages
      .filter(m => m.chatId === chatId)
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  },

  async deleteMessage(id: string): Promise<boolean> {
    const messageIndex = messages.findIndex(m => m.id === id);
    if (messageIndex === -1) return false;

    messages.splice(messageIndex, 1);
    saveToLocalStorage();
    return true;
  },

  // Utility operations
  async clearAllData(): Promise<void> {
    users = [];
    chats = [];
    messages = [];

    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem('chat-users');
        localStorage.removeItem('chat-chats');
        localStorage.removeItem('chat-messages');
      } catch (error) {
        console.warn('Failed to clear localStorage:', error);
      }
    }
  },

  async getStats(): Promise<{ userCount: number; chatCount: number; messageCount: number }> {
    return {
      userCount: users.length,
      chatCount: chats.length,
      messageCount: messages.length,
    };
  },

  // Export/Import functions for data portability
  async exportData(): Promise<{ users: User[]; chats: Chat[]; messages: Message[] }> {
    return {
      users: JSON.parse(JSON.stringify(users)),
      chats: JSON.parse(JSON.stringify(chats)),
      messages: JSON.parse(JSON.stringify(messages)),
    };
  },

  async importData(data: { users?: User[]; chats?: Chat[]; messages?: Message[] }): Promise<void> {
    if (data.users) {
      users = data.users.map(user => ({
        ...user,
        createdAt: new Date(user.createdAt),
        updatedAt: new Date(user.updatedAt),
      }));
    }

    if (data.chats) {
      chats = data.chats.map(chat => ({
        ...chat,
        createdAt: new Date(chat.createdAt),
        updatedAt: new Date(chat.updatedAt),
      }));
    }

    if (data.messages) {
      messages = data.messages.map(message => ({
        ...message,
        createdAt: new Date(message.createdAt),
      }));
    }

    saveToLocalStorage();
  },
};

// Auto-save to localStorage every 30 seconds
if (typeof window !== 'undefined') {
  setInterval(saveToLocalStorage, 30000);
}

export default LocalStorage;
