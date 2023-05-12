import { getUsages } from './usages';
import { getSubscription } from './subscription';

/**
 * 当使用 sessions 作为认证时，则使用网页端接口进行请求
 * @param requestOptions 含认证的请求体
 */
async function apiCreditGrants (
    requestOptions: ResponseInit
): Promise<any> {
    const base_url: string = `${process.env.API_BASE}/dashboard/billing/credit_grants`;
    const response = await fetch(`${base_url}`, requestOptions);

    const data = await response.json();
    if (response.ok) {
        return data;
    } else {
        throw new Error(data.error.message);
    }
}

/**
 * 当使用 key 作为认证时，则统计求和
 * 注意，该方法与网页页面的数据存在差异
 * @param requestOptions 含认证的请求体
 * @param startDate 统计的开始日期
 * @param endDate 统计的结束日期
 * @returns 
 */
async function customCreditGrants (
    requestOptions: ResponseInit,
    startDate: string,
    endDate: string
): Promise<any> {
    const [{list_used, total_used}, total_granted] = await Promise.all([
        getUsages(requestOptions, startDate, endDate),
        getSubscription(requestOptions)
    ]);

    return {
        list_used,
        total_used,
        total_granted,
        start_date: startDate,
        end_date: endDate
    }
}

/**
 * 根据 authorization 类型进行不同的请求
 * @param requestOptions 包含认证的请求体
 * @param isToken 是否是 api key 认证，即 sk-****
 * @param startDate 统计的开始日期
 * @param endDate 统计的结束日期
 */
async function getCreditGrants (
    requestOptions: ResponseInit,
    isKey: boolean,
    startDate: string,
    endDate: string
): Promise<any> {
    if (isKey) {
        return await customCreditGrants(requestOptions, startDate, endDate);
    } else {
        return await apiCreditGrants(requestOptions);
    }  
}

export { getCreditGrants }