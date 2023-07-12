import { NextRequest, NextResponse } from 'next/server';
import { fetchTemplate } from '@/libs'

/**
 * 发送消息
 * @returns 流式输出
 */
export async function POST(request: NextRequest) {
    try {
        const base_url: string = `https://claude.ai/api/append_message`;
        return NextResponse.json(await fetchTemplate(base_url, request as RequestInit));
    } catch (err: any) {
        return NextResponse.json({ code: 400, error: err.message }, {
            status: 400,
        });
    }
}