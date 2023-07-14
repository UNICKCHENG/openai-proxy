/**
 * 获取充值的金额
 * @param requestOptions 包含认证的请求体
 */
async function getSubscription(
    requestOptions: RequestInit
): Promise<number> {
    const baseUrl: string = `${process.env.API_BASE}/v1/dashboard/billing/subscription`;
    const response = await fetch(`${baseUrl}`, requestOptions);

    const data = await response.json();
    if (response.ok) {
        return data.system_hard_limit_usd;
    } else {
        throw new Error(data.error.message);
    }
}


export { getSubscription };