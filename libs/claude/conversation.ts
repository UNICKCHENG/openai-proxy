import { headers } from 'next/headers'
import { cache } from 'react'

interface Conversation {
    uuid: string,
    name: string,
    summary: string,
    created_at: string,
    updated_at: string,
}

/**
 * Get a conversation with the default name,
 * or create one if it doesn't exist.
 */
export const autoGetConversationId = cache(async (org_id: string, req_url: string) => {
    const conversations: Conversation[] = await getConversation(org_id, req_url);
    if (0 < conversations.length) {
        for (const conversation of conversations) {
            if (process.env.CLAUSE_DEFAULT_CONVERSATION_NAME == conversation.name) {
                return conversation.uuid;
            }
        }
    }
    const conversation: Conversation = await createConversation(org_id, req_url);
    return conversation.uuid;
})

async function getConversation(org_id: string, req_url: string): Promise<Conversation[]> {
    const url = new URL(`/api/claude/organizations/${encodeURIComponent(org_id)}/chat_conversations`, req_url);
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            "Accept": "application/json",
            'Cookie': `sessionKey=${headers().get('Authorization')?.split(' ')[1]}`,
        },
        cache: 'no-cache'
    });
    if (!response.ok) {
        throw new Error(`请求错误: ${response.body}`);
    }
    return await response.json();
}

async function createConversation(org_id: string, req_url: string): Promise<Conversation> {
    const url = new URL(`/api/claude/organizations/${encodeURIComponent(org_id)}/chat_conversations`, req_url);
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Cookie': `sessionKey=${headers().get('Authorization')?.split(' ')[1]}`,
        },
        body: JSON.stringify({
            name: process.env.CLAUSE_DEFAULT_CONVERSATION_NAME
        })
    });
    if (!response.ok) {
        throw new Error(`请求错误: ${response.body}`);
    }
    return await response.json();
}