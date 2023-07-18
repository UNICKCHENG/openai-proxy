import { NextRequest } from 'next/server'
import { cookies } from 'next/headers'
import { Bard } from "googlebard"
import { cache } from 'react'

const bard = cache((cookie: string) => {
    return new Bard(cookie);
})

const googlebard = async (
    token: string,
    prompt: string,
    conversationId?: string
) => {
    let bot = bard(token);
    return await bot.askStream((res) => { }, prompt, conversationId);
}

export async function POST(req: NextRequest) {
    const { prompt, conversationId } = await req.json();
    const cookie = `__Secure-1PSID=${cookies().get("__Secure-1PSID")?.value}, __Secure-1PSIDTS=${cookies().get("__Secure-1PSIDTS")?.value}`;
    try {
        const data = await googlebard(cookie, prompt, conversationId);
        return new Response(data, {
            headers: {
                'Content-Type': 'text/event-stream',
                'Connection': 'keep-alive',
                'Cache-Control': 'no-cache, no-transform',
            },
        });
    } catch (error) {
        return new Response(error, { status: 400 });
    }
}