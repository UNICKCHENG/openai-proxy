import { NextRequest, NextResponse } from 'next/server'
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
    return await bot.ask(prompt, conversationId || 'default');
}

export async function POST(req: NextRequest) {
    const { prompt, conversationId } = await req.json();
    const cookie = `__Secure-1PSID=${cookies().get("__Secure-1PSID")?.value}, __Secure-1PSIDTS=${cookies().get("__Secure-1PSIDTS")?.value}`;
    try {
        const data = await googlebard(cookie, prompt, conversationId);
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json(error, { status: 400 });
    }
}