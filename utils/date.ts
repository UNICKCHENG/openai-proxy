/**
 * 获取 date + days 天的日期
 * @param date 日期 
 * @param days 天数
 */
function dateSub (date: string, days: number): string {
    const newDate: Date = new Date(date);
    newDate.setDate(newDate.getDate() - days);
    return newDate.toISOString().substr(0, 10);
}

/**
 * 获取 date - days 天的日期
 * @param date 日期 
 * @param days 天数
 */
function dateAdd (date: string, days: number): string {
    const newDate: Date = new Date(date);
    newDate.setDate(newDate.getDate() + days);
    return newDate.toISOString().substr(0, 10);
}

/**
 * 获取当前日期和 90 天前的日期
 */
function getDefaultDateRange(): any {
    const default_end_date: string = new Date().toISOString().substr(0, 10);
    const default_start_date: string = dateSub(default_end_date, 90);
    return {default_start_date, default_end_date};
}

export { dateSub, dateAdd, getDefaultDateRange };