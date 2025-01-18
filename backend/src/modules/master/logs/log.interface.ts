import { TransactionType } from "../../../../prisma/generated/client"
import { Employee } from "../employees/employee.interface"

export interface NewAuthLog {
    employeeId: string
    transaction: TransactionType
    isSucceed: boolean
    authAt: Date
}

export interface AuthLog extends NewAuthLog {
    id: string
}

export interface AuthLogWithEmployee extends AuthLog {
    employee: Employee
}