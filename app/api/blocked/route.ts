import { NextRequest, NextResponse } from "next/server"

export function GET(req: NextRequest) {
    return NextResponse.json("Too Many Requests", {
        status: 429
    })
}