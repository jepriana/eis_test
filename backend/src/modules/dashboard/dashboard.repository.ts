import prisma from "../../configs/prisma.config";
import { countUnit } from "../master/units/unit.repository";
import { countRole } from "../master/roles/role.repository";
import {
  DashboardSummary,
} from "./dashboard.interface";

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
  
    return {
      totalUnit,
      totalRole,
      totalEmployee,
      totalLogin,
      topLogin,
    };
  }