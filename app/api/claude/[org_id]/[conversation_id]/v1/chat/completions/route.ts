import { NextRequest } from 'next/server'
import * as claude from '@/libs/claude'

/**
 * 生成 AI 内容
 * 类 OpenAI 请求格式
 * @see https://platform.openai.com/docs/api-reference/chat/create
 */
export async function POST(
    request: NextRequest,
    { params }: { params: { org_id: string, conversation_id: string } }
) {
    const { messages, stream = false } = await request.json();
    const init: RequestInit = claude.openaiToClaudeRequest(messages, params.org_id, params.conversation_id);
    const response = await fetch(new URL('/api/claude/append_message', request.url), init);

    if (!response.ok) {
        return new Response(response.body, { status: 400 })
    }

    const result = stream ? await claude.iteratorToStream(response) : await claude.readerStream(response);
    return new Response(result, {
        headers: {
            'Content-Type': stream ? 'text/event-stream' : 'application/json',
            'Connection': 'keep-alive',
            'Cache-Control': 'no-cache, no-transform',
        },
    });
}