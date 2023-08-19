import { headers } from 'next/headers'
import { v1 as uuidv1 } from 'uuid'
import { cache } from 'react'

interface Conversation {
    uuid: string,
    name: string,
    summary: string,
    created_at: string,
    updated_at: string,
}

export async function getConversations(org_id: string, sessionKey: string): Promise<Conversation[]> {
    const base_url: string = `${process.env.CLAUDE_BASE}/organizations/${org_id}/chat_conversations`;
    const data = await fetch(base_url, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Cookie': `sessionKey=${sessionKey}`,
        },
        cache: 'no-cache'
    })
    .then((res: Response) => res.json())
    .catch((err: any) => {
        throw new Error(`请求错误: ${err.messages}`);
    });
    return data;
}

export async function createConversation(org_id: string, sessionKey: string, opts?: {
    uuid?: string,
    name?: string,
}): Promise<Conversation> {
    const base_url: string = `${process.env.CLAUDE_BASE}/organizations/${org_id}/chat_conversations`;
    const data = await fetch(base_url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': '*/*',
            'Cookie': `sessionKey=${sessionKey}`,
        },
        body: JSON.stringify({
            uuid: opts?.uuid || uuidv1() as string,
            name: opts?.name || process.env.CLAUDE_DEFAULT_CONVERSATION_NAME
        })
    })
    .then((res: Response) => res.json())
    .catch((err: any) => {
        throw new Error(`请求错误: ${err.messages}`);
    });
    return data;
}

export async function deleteConversationViaId(org_id: string, conversation_id: string, sessionKey: string) {
    const base_url: string = `${process.env.CLAUDE_BASE}/organizations/${org_id}/chat_conversations/${conversation_id}`;
    const data = await fetch(base_url, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Cookie': `sessionKey=${sessionKey}`,
        },
        cache: 'no-cache'
    })
    .catch((err: any) => {
        throw new Error(`请求错误: ${err.messages}`);
    });
    return data;
}

export async function getConversationMessagesViaId(org_id: string, conversation_id: string, sessionKey: string) {
    const base_url: string = `${process.env.CLAUDE_BASE}/organizations/${org_id}/chat_conversations/${conversation_id}`;
    const data = await fetch(base_url, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Cookie': `sessionKey=${sessionKey}`,
        }
    })
    .then((res: Response) => res.json())
    .catch((err: any) => {
        throw new Error(`请求错误: ${err.messages}`);
    });
    return data;
}