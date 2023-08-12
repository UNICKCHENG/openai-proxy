import * as claude from '@/libs/claude'
import { headers } from 'next/headers'

export async function generateConversationId(org_id: string) {
    const sessionKey: string = headers().get('Authorization')?.split(' ')[1]!;
    return await claude.createConversation(org_id, sessionKey, {
            name: `${process.env.CLAUDE_DEFAULT_CONVERSATION_NAME}-${new Date().getTime()}`
        }
    ).then(res => res.uuid);
}

export async function deleteOldConversations(org_id: string) {
    if('true' === process.env.CLAUDE_AUTO_DELETE_CONVERSATION) {
        const sessionKey: string = headers().get('Authorization')?.split(' ')[1]!;
        const promises: Promise<any>[] = [];

        (await claude.getConversations(org_id, sessionKey))
        .filter(m => m.name.startsWith(process.env.CLAUDE_DEFAULT_CONVERSATION_NAME!))
        .forEach(m => {
            promises.push(claude.deleteConversationViaId(org_id, m.uuid, sessionKey));
        });
        await Promise.all(promises);
    }
}