import { NextApiRequest, NextApiResponse } from "next"
import initCycleTLS, { type CycleTLSRequestOptions, formatConversion } from '@/libs/cycletls'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        if ("POST" === req.method) {
            await post(req, res);
        } else {
            res.status(405).json(`${req.method} not be allowed`);
        }
    } catch(err: any) {
        console.error(err);
        res.status(400).json(err.message);
    }
}

async function post(req: NextApiRequest, res: NextApiResponse) {
    const option: CycleTLSRequestOptions = {
        'headers': {
            'Accept': 'text/event-stream, text/event-stream',
            'Cookie': `sessionKey=${req.cookies.sessionKey}`,
        },
        'body': JSON.stringify(req.body),
        'timeout': 120,
    }
    const result = await retryMessage(option);

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    for(const chunk of result) {
        res.write(chunk);
    }
    res.end();
}

async function retryMessage(option: CycleTLSRequestOptions): Promise<any> {
    const base_url: string = `${process.env.CLAUDE_BASE}/retry_message`;
    const cycleTLS = await initCycleTLS()
    const response = await cycleTLS.post(base_url, option)
        .then(res => res.body)
        .then(res => formatConversion(res))
        .catch(err => {
            throw new Error(err);
        });
    cycleTLS.exit();
    return response;
}