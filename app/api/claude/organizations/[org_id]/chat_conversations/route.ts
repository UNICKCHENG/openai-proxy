import { NextRequest, NextResponse } from 'next/server'
import { fetchTemplate } from '@/libs'
import { v1 as uuidv1 } from 'uuid'

/**
 * 查看所有会话
 */
export async function GET(
    request: NextRequest, 
    { params }: { params: { org_id: string }}
) {
    try {
        const base_url: string = `https://claude.ai/api/organizations/${params.org_id}/chat_conversations`;
        return NextResponse.json(await fetchTemplate(base_url, request as RequestInit));
    } catch (err: any) {
        return NextResponse.json({ code: 400, error: err }, {
            status: 400,
        });
    }
}

/**
 * 新建会话
 */
export async function POST(
    request: NextRequest, 
    { params }: { params: { org_id: string }}
) {
    try {
        const base_url: string = `https://claude.ai/api/organizations/${params.org_id}/chat_conversations`;
        let { uuid, name } = await request.json();
        let req: RequestInit = request;

        if (undefined === uuid) {
            req = initReuqest(request, name);
        }
        return NextResponse.json(await fetchTemplate(base_url, req));
    } catch (err: any) {
        return NextResponse.json({ code: 400, error: err }, {
            status: 400,
        });
    }
}

function initReuqest(req: NextRequest, name: string): RequestInit {
    return {
        method: req.method,
        headers: {
            'Content-Type': 'application/json',
            'Accept': '*/*',
            'Cookie': `sessionKey=${req.cookies['sessionKey'] as string}`,
        },
        body: JSON.stringify({
            uuid: uuidv1(),
            name: name
        })
    }
}