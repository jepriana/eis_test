import prisma from "../../configs/prisma.config";
import { countUnit } from "../master/units/unit.repository";
import { countRole } from "../master/roles/role.repository";
import {
    DashboardSummary,
} from "./dashboard.interface";
import { format, parseISO } from "date-fns";

export async function getDashboardSummary(startDate: Date, endDate: Date): Promise<DashboardSummary> {
    const totalUnit = await countUnit(undefined);
    const totalRole = await countRole(undefined);
    const totalEmployee = await prisma.employee.count({
        where: {
            isActive: true,
            joinAt: {
                gte: startDate,
                lte: endDate
            }
        }
    });
    const totalLogin = await prisma.authLog.count({
        where: {
            authAt: {
                gte: startDate,
                lte: endDate
            }
        }
    });
    const topTenLogin = await prisma.authLog.groupBy({
        by: ['employeeId'],
        where: {
            authAt: {
                gte: startDate,
                lte: endDate
            },
            isSucceed: true,
        },
        _count: {
            employeeId: true,
        },
        orderBy: {
            _count: {
                employeeId: 'desc',
            },
        },
        having: {
            employeeId: {
                _count: {
                    gt: 25,
                }
            }
        },
        take: 10,
    });

    const topLogin = await Promise.all(
        topTenLogin.map(async (item) => {
            const employee = await prisma.employee.findUnique({
                where: {
                    id: item.employeeId
                }
            });
            return {
                employeeId: item.employeeId,
                employeeName: employee?.fullName,
                totalLogin: item._count.employeeId
            }
        })
    );

    const authLogs = await prisma.authLog.findMany({
        select: {
            authAt: true
        },
        where: {
            authAt: {
                gte: startDate,
                lte: endDate
            },
        },
        orderBy: {
            authAt: 'asc',
        },
    });

    const trend = authLogs.reduce((acc, log) => { 
        const month = format(parseISO(log.authAt.toISOString()), 'yyyy-MM'); 
        if (!acc[month]) { 
            acc[month] = 0; 
        } 
        acc[month]++; 
        return acc; 
    }, {} as Record<string, number>); 
    const loginTrend = Object.entries(trend).map(([month, totalLogins]) => ({ month, totalLogins, })).sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime());

    return {
        totalUnit,
        totalRole,
        totalEmployee,
        totalLogin,
        topLogin,
        loginTrend,
    };
}