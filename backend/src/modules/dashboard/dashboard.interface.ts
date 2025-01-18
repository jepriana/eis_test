export interface TopLoginItem {
    employeeId: string,
    employeeName: string | undefined,
    totalLogin: number,
}

export interface TrendItem {
    month: string,
    totalLogins: number,
}

export interface DashboardSummary {
    totalEmployee: number,
    totalLogin: number, 
    totalUnit: number,
    totalRole: number,
    topLogin: TopLoginItem[],
    loginTrend: TrendItem[],
}