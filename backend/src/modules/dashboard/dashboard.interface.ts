export interface TopLoginItem {
    employeeId: string,
    employeeName: string | undefined,
    totalLogin: number,
}

export interface DashboardSummary {
    totalEmployee: number,
    totalLogin: number, 
    totalUnit: number,
    totalRole: number,
    topLogin: TopLoginItem[],
}