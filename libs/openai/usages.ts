import { dateSub, dateAdd } from '../utils/date';

interface DateRange {
    start_date: string,
    end_date: string,
}

interface RangeUsage extends DateRange {
    used,
}

interface Usages {
    list_used: RangeUsage[],
    total_used: number,
}

/**
 * 获取已经消费的金额
 * 注意官方 api 接口是遵循左闭右开原则，因此需要将结束日期 + 1 天
 * @param requestOptions 包含认证的请求体
 * @param startDate 请求统计的开始日期(包含当天)
 * @param endDate 请求统计的结束日期(包含当天)
 */
async function apiUsages (
    requestOptions: RequestInit, 
    startDate: string,
    endDate: string
): Promise<RangeUsage> {
    const baseUrl: string = `${process.env.API_BASE}/v1/dashboard/billing/usage`;
    const params: string = `end_date=${dateAdd(endDate, 1)}&start_date=${startDate}`;
    const response = await fetch(`${baseUrl}?${params}`, requestOptions);

    const data = await response.json();
    if (response.ok) {
        return {
            start_date: startDate,
            end_date: endDate,
            used: data.total_usage * 0.01
        };
    } else {
        throw new Error(data.error.message);
    }
}

/**
 * 拆分日期，按 90 天进行拆分
 * 如 {start_date: 2022-11-11, end_date:2023-05-01}，
 * 将会被拆分为 [{start_date:2022-11-11, end_date:2023-02-09}, 
 *  {start_date:2022-02-10, end_date:2023-05-01}]
 * @param startDate 统计的开始日期
 * @param endDate 统计的结束日期
 */
function dateToRange(
    startDate: string, 
    endDate: string
): DateRange[] {
    const result: DateRange[] = [];

    if(startDate > endDate) {
        throw new Error('end_date must come after start_date');
    }

    while(startDate <= endDate) {
        const nextDate: string = dateAdd(startDate, 90);
        
        const dateRange: DateRange = {
            start_date: startDate,
            end_date: nextDate
        }
        
        result.push(dateRange);
        startDate = dateAdd(nextDate, 1);
    }
    result[result.length - 1].end_date = endDate;

    return result;
}

/**
 * 获取每个阶段的使用量，以及总使用量
 * @param requestOptions  包含认证的请求体
 * @param startDate 统计的开始日期
 * @param endDate 统计的结束日期
 */
async function getUsages (
    requestOptions: RequestInit, 
    startDate: string,
    endDate: string
): Promise<Usages> {
    const ranges: DateRange[] = dateToRange(startDate, endDate);
    const promises: Promise<any>[] = [];

    for (const range of ranges) {
        promises.push(apiUsages(requestOptions, range.start_date, range.end_date));
    }
    const results = await Promise.all(promises);
    let sum = 0;
    for (const i of results) {
        sum += i.used;
    }
    return {
        list_used: results,
        total_used: sum
    }
}

export { getUsages }
