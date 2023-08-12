import { NextRequest } from "next/server"

export const url = (pathname: string, request: NextRequest) => {
    // 解决反代时，https://localhost 导致 https ssl 证书错误
    const regex = new RegExp('localhost|127\.0\.0\.1');
    request.nextUrl.protocol = regex.test(request.nextUrl.hostname) ? 'http:' : request.nextUrl.protocol;
    return new URL(pathname, request.nextUrl.href);
}