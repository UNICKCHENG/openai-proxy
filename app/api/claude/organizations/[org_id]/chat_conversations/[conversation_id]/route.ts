import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import * as claude from '@/libs/claude'

/**
 * conversation
 * 当 method = DELETE 时，删除当前会话
 * 当 method = GET 时，查看当前会话历史记录
 */
async function handler(
    request: NextRequest,
    { params }: { params: { org_id: string, conversation_id: string } }
) {
    const sessionKey: string = cookies().get('sessionKey')?.value!;
    try {
        if ('DELETE' === request.method) {
            const data = await claude.deleteConversationViaId(params.org_id, params.conversation_id, sessionKey);
            return NextResponse.json(data);
        } else {
            const data = await claude.getConversationMessagesViaId(params.org_id, params.conversation_id, sessionKey);
            return NextResponse.json(data);
        }
    } catch (err: any) {
        return NextResponse.json(err.messages, { status: 400 });
    }
}

export { handler as GET, handler as DELETE }