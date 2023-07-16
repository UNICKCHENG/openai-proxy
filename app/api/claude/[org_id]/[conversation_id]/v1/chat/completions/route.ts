import { ReadableStream } from 'stream/web' 
import { NextRequest, NextResponse } from 'next/server'
import { AnthropicStream, StreamingTextResponse } from 'ai'
import * as service from './_libs'

/**
 * 生成 AI 内容
 * 类 OpenAI 请求格式
 * @see https://platform.openai.com/docs/api-reference/chat/create
 */
export async function POST(
    request: NextRequest,
    { params }: { params: { org_id: string, conversation_id: string}}
) {
    const base_url: string = `${process.env.CLAUDE_BASE}/append_message`;
    const { messages, stream=false } = await request.json();
    const init: RequestInit = service.openaiToClaudeRequest(messages, params.org_id, params.conversation_id);
    const response = await fetch(base_url, init);

    if (stream) {
        const stream = service.iteratorToStream(response);
        return new Response(stream);
    } else {
        const content = await service.readerStream(response);
        const result = await service.claudeToOpenaiResponse(content);
        return new Response(result);
    }
}