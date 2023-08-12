import { NextRequest, NextResponse } from 'next/server'
import * as claude from '@/libs/claude'
import * as service from './_libs'
import { url } from '@/libs/utils/url'

/**
 * 生成 AI 内容 (无需指定 conversation)
 * 类 OpenAI 请求格式
 * @see https://platform.openai.com/docs/api-reference/chat/create
 */
export async function POST(
    request: NextRequest,
    { params }: { params: { org_id: string } }
) {
    try {
        const { messages, stream = false } = await request.json();
        const [ _del, conversation_uuid ] = await Promise.all([
            await service.deleteOldConversations(params.org_id),
            await service.generateConversationId(params.org_id),
        ])
        const init: RequestInit = claude.openaiToClaudeRequest(messages, params.org_id, conversation_uuid);
        const result = await fetch(url('/api/claude/append_message', request), init).then(async(res) => {
            if(!res.ok) {
                throw new Error(await res.json());
            }
            return stream ? await claude.iteratorToStream(res) : await claude.readerStream(res);
        });
        return new Response(result, {
            headers: {
                'Content-Type': stream ? 'text/event-stream' : 'application/json',
                'Connection': 'keep-alive',
                'Cache-Control': 'no-cache, no-transform',
            },
        });
    } catch(err: any) {
        return new Response(err.message, { status: 400 });
    }
}