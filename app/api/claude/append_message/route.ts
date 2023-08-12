import { NextRequest } from 'next/server'
import { cookies } from 'next/headers'

/**
 * 发送消息
 * @returns 流式输出
 */
export async function POST(request: NextRequest) {
    const base_url: string = `${process.env.CLAUDE_BASE}/append_message`;
    const init: RequestInit = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'text/event-stream',
            'Cookie': `sessionKey=${cookies().get('sessionKey')?.value}`,
        },
        redirect: 'follow',
        body: JSON.stringify(await request.json()),
    }
    const response = await fetch(base_url, init);
    const stream = await claudeWebApiStream(response);
    return new Response(stream, {
        headers: {
            'Content-Type': 'text/event-stream',
            'Connection': 'keep-alive',
            'Cache-Control': 'no-cache, no-transform',
        },
    });
}

async function claudeWebApiStream(response: any) {
    const encoder = new TextEncoder(); 
    const decoder = new TextDecoder("utf-8");
    const reader = response.body?.getReader();
    let temp: string = '';

    return new ReadableStream({
        async pull(controller) {
            const { value, done } = await reader?.read();
            if (done) {
                setTimeout(() => {
                    controller.close();
                }, 0);
            } else {
                let content: string = '';
                const lines = (temp + decoder.decode(value)).split("\n\n");
                lines.map((line) => line.replace(/^data: /, "").trim())
                    .filter((line) => line !== "")
                    .forEach((line) => {
                        try {
                            // 主要防止出现接收 line 时，字段接收不完整，如只出现 {"com
                            const te = JSON.parse(temp + line);
                            temp = '';
                            content += te.completion ? te.completion : '';
                        } catch (err: any) {
                            temp = line;
                        }
                    });
                controller.enqueue(encoder.encode(content));
            }
        },
    })
}
