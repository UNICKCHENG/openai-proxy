import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { v1 as uuidv1 } from 'uuid'

/**
 * 查看所有会话
 */
export async function GET(
    request: NextRequest, 
    { params }: { params: { org_id: string }}
) {
    const base_url: string = `${process.env.CLAUDE_BASE}/organizations/${params.org_id}/chat_conversations`;
    const init: RequestInit = {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Cookie': `sessionKey=${cookies().get('sessionKey')?.value}`,
        }
    }
    const data = await fetch(base_url, init);
    if(!data.ok) {
        return NextResponse.json(data, {status: 400});
    }
    return NextResponse.json(await data.json());
}


/**
 * 新建会话
 */
export async function POST(
    request: NextRequest, 
    { params }: { params: { org_id: string }}
) {
    const base_url: string = `https://claude.ai/api/organizations/${params.org_id}/chat_conversations`;
    let { uuid, name } = await request.json();

    const init: RequestInit = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': '*/*',
            'Cookie': `sessionKey=${cookies().get('sessionKey')?.value}`,
        },
        body: JSON.stringify({
            uuid: uuid || uuidv1() as string,
            name
        })
    }
    const data = await fetch(base_url, init);
    if(!data.ok) {
        return NextResponse.json(data, {status: 400});
    }
    return NextResponse.json(await data.json());
}