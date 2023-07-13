import { NextRequest, NextResponse } from "next/server"
import { headers } from 'next/headers'
import { getCreditGrants } from '@/libs/openai/credit_grants'
import { getDefaultDateRange } from '@/libs/utils/date'

export async function GET(req: NextRequest) {
    let { start_date, end_date } = getDefaultDateRange();
    const params = req.nextUrl.searchParams;
    start_date = params.get("start_date") ?? start_date;
    end_date = params.get("end_date") ?? end_date;

    const requestOptions: RequestInit = {
        headers: { 
            'Content-Type': headers().get('Content-Type') as string,
            'Authorization': headers().get('Authorization') as string,
        }
    };

    try {
        const isKey: boolean = (headers().get('Authorization') as string).startsWith("Bearer sk-");
        const data = await getCreditGrants(requestOptions, isKey, start_date, end_date);
        return NextResponse.json(data, {status:200});
    } catch (error) {
        return NextResponse.json({ 
            error: error.message, 
            start_date: start_date, 
            end_date: end_date
        }, {status:400});
    }
}