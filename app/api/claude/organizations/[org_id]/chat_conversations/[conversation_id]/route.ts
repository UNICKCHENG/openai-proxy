import { NextRequest, NextResponse } from 'next/server';
import { fetchTemplate } from '@/libs'

/**
 * conversation 
 * 当 method = DELETE 时，删除当前会话
 * 当 method = GET 时，查看当前会话历史记录
 */
async function handler(
    request: NextRequest, 
    { params }: { params: { org_id: string, conversation_id: string}}
) {
    try {
        const base_url: string = `https://claude.ai/api/organizations/${params.org_id}/chat_conversations/${params.conversation_id}`;
        return NextResponse.json(await fetchTemplate(base_url, request as RequestInit));
    } catch (err: any) {
        return NextResponse.json({ code: 400, error: err }, {
            status: 400,
        });
    }
}

export { handler as GET, handler as DELETE}