import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { Bard } from "googlebard"

const googlebard = async (
    token: string,
    prompt: string,
    conversationId?: string
) => {
    let bot = new Bard(token);
    return await bot.ask(prompt, conversationId);
}

export async function POST (req: NextRequest) {
    const { prompt, conversationId } = await req.json();
    const cookie = `__Secure-1PSID=${cookies().get("__Secure-1PSID")?.value}`;
    try {
        const data = await googlebard(cookie, prompt, conversationId);
        return NextResponse.json(data, {status: 200});
    } catch (error) {
        return NextResponse.json( error.message, {status: 400});
    }
}
