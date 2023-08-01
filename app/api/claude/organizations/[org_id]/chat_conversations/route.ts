import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import * as claude from '@/libs/claude'

/**
 * 查看所有会话
 */
export async function GET(
    request: NextRequest,
    { params }: { params: { org_id: string } }
) {
    try {
        const data = await claude.getConversations(params.org_id, cookies().get('sessionKey')?.value!);
        return NextResponse.json(data);
    } catch (err: any) {
        return NextResponse.json(err.messages, { status: 400 });
    }
}

/**
 * 新建会话
 */
export async function POST(
    request: NextRequest,
    { params }: { params: { org_id: string } }
) {
    try {
        const sessionKey: string = cookies().get('sessionKey')?.value!;
        const { name, uuid }: any = await request.json();
        if (undefined == name) {
            throw new Error("Missing parameter: name");
        }
        const data = await claude.createConversation(params.org_id, sessionKey, {
            uuid, name
        });
        return NextResponse.json(data);
    } catch (err: any) {
        return NextResponse.json(err.messages, { status: 400 });
    }
}

/**
 * 删除所有会话
 */
export async function DELETE(
    request: NextRequest,
    { params }: { params: { org_id: string } }
) {
    try {
        const sessionKey: string = cookies().get('sessionKey')?.value!;
        const conversations: any = await claude.getConversations(params.org_id, sessionKey);
        if (0 < conversations.length) {
            for (const conversation of conversations) {
                await claude.deleteConversationViaId(params.org_id, conversation.uuid, sessionKey);
            }
            return NextResponse.json('success');
        }
        return NextResponse.json('success', { status: 201 });
    } catch (err: any) {
        return NextResponse.json(err.messages, { status: 400 });
    }
}