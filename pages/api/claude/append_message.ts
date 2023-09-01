import { NextApiRequest, NextApiResponse } from "next"
import initCycleTLS, { type CycleTLSRequestOptions, formatConversion } from '@/libs/cycletls'
import { Readable } from "stream"

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
    const result = await appendMessage(option);

    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Cache-Control', 'no-cache, no-transform');

    const stream = new Readable();
    stream.push(result);
    stream.push(null);
    stream.pipe(res);
}

async function appendMessage(option: CycleTLSRequestOptions): Promise<any> {
    const base_url: string = `${process.env.CLAUDE_BASE}/append_message`;
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

