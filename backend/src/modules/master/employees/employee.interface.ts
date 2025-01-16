import { UnitRoles } from "../employee-unit-roles/employee-unit-role.interface"

export interface NewEmployee {
    username: string,
    fullName: string,
    password: string,
    isAdmin: boolean,
    joinAt: Date,
}

export interface Employee {
    id: string,
    username: string,
    fullName: string,
    joinAt: Date,
    isAdmin: boolean,
    isActive: boolean
}

export interface EmployeeDetail extends Employee {
    unitRoles: UnitRoles[]
}
export interface EmployeeWithPassword extends EmployeeDetail {
    password: string
}

export interface Employees {
    [key: string]: EmployeeDetail
}