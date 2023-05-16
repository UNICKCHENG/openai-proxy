import { NextApiRequest, NextApiResponse } from 'next';
import { getCreditGrants } from '../../../openai/credit_grants';
import { getDefaultDateRange } from '../../../utils/date';

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const { default_start_date, default_end_date } = getDefaultDateRange();
    const { start_date = default_start_date, end_date = default_end_date } = req.query;
    const requestOptions: RequestInit = {
        method: 'GET',
        headers: { 
            'Content-Type': req.headers['content-type'],
            'Authorization': req.headers['authorization']
        }
    };

    try {
        const isKey: boolean = req.headers['authorization'].startsWith("Bearer sk-");
        const data = await getCreditGrants(requestOptions, isKey, start_date, end_date);
        res.status(200).json(data)
    } catch (error) {
        res.status(500).json({ 
            error: error.message, 
            start_date: start_date, 
            end_date: end_date
        });
    }
};
