import { NextApiRequest, NextApiResponse } from 'next'
import { v1 as uuidv1 } from 'uuid'

const fetchs = async(url: RequestInfo | URL, init?: RequestInit) => {
    const response = await fetch(url, init)
    const data = await response.json();
    if (response.ok) {
        return data;
    } else {
        throw new Error(data);
    }
}

async function creatConversations(
    method: string,
    cookies: string,
    organization_uuid: string,
    name: string,
): Promise<any> {
    const base_url: string = `https://claude.ai/api/organizations/${organization_uuid}/chat_conversations`
    const req: RequestInit = {
        method: method,
        headers: {
            'Content-Type': 'application/json',
            'Accept': '*/*',
            'Cookie': `sessionKey=${cookies}`,
        },
        body: JSON.stringify({
            uuid: uuidv1(),
            name: name
        })
    }
    return fetchs(base_url, req);
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const { orgId } = req.query;
    const { name } = req.body;
    try {
        const data: any = await creatConversations(
            req.method || 'POST', 
            req.cookies['sessionKey'] as string, 
            orgId as string,
            name,
        )
        res.status(201).json(data);
    } catch (error) {
        res.status(500).json({ 
            error: error.message
        });
    }
};