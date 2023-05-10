import { NextApiRequest, NextApiResponse } from 'next';
 
/**
 * 获取已经消费的金额
 * @param requestOptions 包含认证的请求体
 * @param start_date 请求统计的开始日期
 * @param end_date 请求统计的结束日期
 */
async function getUsages(
    requestOptions: RequestInit, 
    start_date: any,
    end_date: any
): Promise<number> {
    const baseUrl: string = 'https://api.openai.com/v1/dashboard/billing/usage';
    const params: string = `end_date=${end_date}&start_date=${start_date}`;
    const response = await fetch(`${baseUrl}?${params}`, requestOptions);

    const data = await response.json();
    if (response.ok) {
        return data.total_usage * 0.01;
    } else {
        throw new Error(data.error.message);
    }
}

/**
 * 获取充值的金额
 * @param requestOptions 包含认证的请求体
 */
async function getSubscription(
    requestOptions: RequestInit
): Promise<number> {
    const baseUrl: string = 'https://api.openai.com/v1/dashboard/billing/subscription';
    const response = await fetch(`${baseUrl}`, requestOptions);

    const data = await response.json();
    if (response.ok) {
        return data.system_hard_limit_usd;
    } else {
        throw new Error(data.error.message);
    }
}

/**
 * 获取默认请求统计的时间，默认为 开始日期 = 当前日期-99天，结束日期 = 当前日期 + 1 天
 */
async function getTime() {
    const current: Date = new Date();
    const endDate: any = new Date(current.getTime() + 1 * 24 * 60 * 60 * 1000).toISOString().substr(0, 10);
    const startDate: any = new Date(current.getTime() - 99 * 24 * 60 * 60 * 1000).toISOString().substr(0, 10); // 当前日期 - 90天，格式为 yyyy-mm-dd
    return {startDate, endDate};
}

interface credit {
    usages: number,
    subscription: number,
    start_date: any,
    end_date: any
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const {startDate, endDate} = await getTime();
    const { start_date = startDate, end_date = endDate } = req.query;   
    
    const requestOptions: RequestInit = {
        method: 'GET',
        headers: { 
            'Content-Type': req.headers['content-type'],
            'Authorization': req.headers['authorization']
        }
      };
    try { 
        const usages: number = await getUsages(requestOptions, start_date, end_date);
        const subscription: number = await getSubscription(requestOptions);

        const data: credit = {
            usages: usages,
            subscription: subscription,
            start_date,
            end_date
        }
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ 
            error: error.message, 
            start_date: start_date, 
            end_date: end_date
        });
    }
};
