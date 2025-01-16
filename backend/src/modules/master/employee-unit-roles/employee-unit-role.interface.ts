import { Role } from "../roles/role.interface"
import { Unit } from "../units/unit.interface"

export interface NewEmployeeUnitRole {
    employeeId: string,
    unitId: string,
    roleId: string,
}

export interface EmployeeUnitRole extends NewEmployeeUnitRole {
    id: string
}

export interface EmployeeUnitRoleDetail extends NewEmployeeUnitRole {
    id: string,
    unit: Unit,
    role: Role,
}

export interface UnitRoles {
    unit: Unit,
    role: Role,
}

export interface EmployeeUnitRoles {
    [key: string]: EmployeeUnitRole
}