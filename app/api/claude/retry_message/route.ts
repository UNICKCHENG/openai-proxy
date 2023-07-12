import { NextRequest, NextResponse } from 'next/server';
import { fetchTemplate } from '@/libs'

/**
 * 重新生成内容
 */
export async function POST(request: NextRequest) {
    try {
        const base_url: string = `https://claude.ai/api/retry_message`;
        return NextResponse.json(await fetchTemplate(base_url, request as RequestInit));
    } catch (err: any) {
        return NextResponse.json({ code: 400, error: err }, {
            status: 400,
        });
    }
}