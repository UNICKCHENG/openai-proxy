import { NextRequest } from 'next/server'
import * as service from './_libs'
import { NextURL } from 'next/dist/server/web/next-url';

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
    const init: RequestInit = service.openaiToClaudeRequest(messages, params.org_id, params.conversation_id);
    const response = await fetch(new URL('/api/claude/append_message', request.url), init);

    if (!response.ok) {
        return new Response(response.body, { status: 400 })
    }

    if (stream) {
        const stream = await service.iteratorToStream(response);
        return new Response(stream, {
            headers: {
                'Content-Type': 'text/event-stream',
                'Connection': 'keep-alive',
                'Cache-Control': 'no-cache, no-transform',
            },
        });
    } else {
        const result = await service.readerStream(response);
        return new Response(result, {
            headers: {
                'Content-Type': 'application/json',
                'Connection': 'keep-alive',
                'Cache-Control': 'no-cache, no-transform',
            },
        });
    }
}