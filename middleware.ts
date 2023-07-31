import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"
import { type NextFetchEvent, type NextRequest, NextResponse } from "next/server"

const initRateLimit = () => {
    if (process.env.UPSTASH_REDIS_REST_TOKEN) {
        return new Ratelimit({
            redis: Redis.fromEnv(),
            limiter: Ratelimit.cachedFixedWindow(Number(process.env.UPSTASH_RATE_LIMIT), "60s"),
            ephemeralCache: new Map(),
            analytics: true,
        });
    }
    return undefined;
}

const ratelimit: Ratelimit | undefined = initRateLimit();

const corsHeaders = ({
    "Access-Control-Allow-Origin": process.env.ACCESS_CONTROL_ALLOW_ORIGIN!,
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Accept, Authorization",
});

const setCorsHeaders = (res: NextResponse) => {
    Object.keys(corsHeaders).forEach(key => {
        res.headers.append(key, corsHeaders[key]);
    })
    return res;
}

export async function middleware(
    request: NextRequest,
    event: NextFetchEvent
): Promise<Response | undefined> {

    if ('OPTIONS' == request.method) {
        return new Response(null, { status: 200, headers: corsHeaders });
    }

    if (request.nextUrl.pathname === '/') {
        return NextResponse.redirect(new URL('https://github.com/UNICKCHENG/openai-proxy', request.url));
    }

    if (ratelimit) {
        const ip: String = request.ip ?? "127.0.0.1";
        const { success, pending, limit, reset, remaining } = await ratelimit.limit(`ratelimit_middleware_${ip}`);
        event.waitUntil(pending);
        const res: NextResponse = success ? NextResponse.next() : NextResponse.rewrite(new URL('/api/blocked', request.url));

        res.headers.set("X-RateLimit-Limit", limit.toString());
        res.headers.set("X-RateLimit-Remaining", remaining.toString());
        res.headers.set("X-RateLimit-Reset", reset.toString());
        return setCorsHeaders(res);
    }

    const response = NextResponse.next();
    return setCorsHeaders(response);
}

export const config = {
    matcher: '/:path*',
}