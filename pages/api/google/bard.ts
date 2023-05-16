import { NextApiRequest, NextApiResponse } from 'next';
import { googlebard } from "../../../google/bard";

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const { cookies, prompt, conversationId, translation } = req.body;
    try {
        const data = await googlebard(cookies, prompt, conversationId);
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ 
            error: error.message
        });
    }
};
