import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

/**
 * conversation
 * 当 method = DELETE 时，删除当前会话
 * 当 method = GET 时，查看当前会话历史记录
 */
async function handler(
    request: NextRequest, 
    { params }: { params: { org_id: string, conversation_id: string}}
) {
    const base_url: string = `${process.env.CLAUDE_BASE}/organizations/${params.org_id}/chat_conversations/${params.conversation_id}`;
    const init: RequestInit = {
        method: request.method,
        headers: {
            'Content-Type': 'application/json',
            'Accept': '*/*',
            'Cookie': `sessionKey=${cookies().get('sessionKey')?.value}`,
        }
    }
    const data = await fetch(base_url, init);
    if(!data.ok) {
        return NextResponse.json(data, {status: 400});
    }

    try {
        return NextResponse.json(await data.json());
    } catch {
        return NextResponse.json(data);
    }
}

export { handler as GET, handler as DELETE}