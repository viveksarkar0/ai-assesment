'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { chats, messages } from '@/lib/db/schema'
import { eq, desc } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

export async function createChat(title: string) {
  const session = await auth()
  if (!session?.user?.id) throw new Error('Unauthorized')

  const [newChat] = await db.insert(chats).values({
    userId: session.user.id,
    title: title.slice(0, 100),
  }).returning()

  revalidatePath('/chat')
  return newChat
}

export async function getUserChats() {
  const session = await auth()
  if (!session?.user?.id) return []

  return await db
    .select()
    .from(chats)
    .where(eq(chats.userId, session.user.id))
    .orderBy(desc(chats.updatedAt))
}

export async function getChatMessages(chatId: string) {
  const session = await auth()
  if (!session?.user?.id) throw new Error('Unauthorized')

  return await db
    .select()
    .from(messages)
    .where(eq(messages.chatId, chatId))
    .orderBy(messages.createdAt)
}

export async function saveMessage(chatId: string, role: 'user' | 'assistant', content: string, toolInvocations?: any[]) {
  const session = await auth()
  if (!session?.user?.id) throw new Error('Unauthorized')

  await db.insert(messages).values({
    chatId,
    role,
    content,
    toolInvocations,
  })

  // Update chat timestamp
  await db.update(chats)
    .set({ updatedAt: new Date() })
    .where(eq(chats.id, chatId))

  revalidatePath('/chat')
}
