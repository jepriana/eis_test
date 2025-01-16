import prisma from "../../../configs/prisma.config";
import { ApiPaginationResponse } from "../../../utils/response";
import {
  EmployeeUnitRole,
  EmployeeUnitRoleDetail,
  NewEmployeeUnitRole,
} from "./employee-unit-role.interface";

export async function addEmployeeUnitRole(
  data: NewEmployeeUnitRole
): Promise<EmployeeUnitRole | null> {
  return await prisma.employeeUnitRole.create({
    data: data,
  });
}

export async function updateEmployeeUnitRole(
  id: string,
  data: NewEmployeeUnitRole
): Promise<EmployeeUnitRole | null> {
  return await prisma.employeeUnitRole.update({
    where: {
      id: id,
    },
    data: data,
  });
}

export async function deleteEmployeeUnitRole(
  id: string
): Promise<EmployeeUnitRole | null> {
  return await prisma.employeeUnitRole.update({
    where: {
      id: id,
    },
    data: {
      isActive: false,
    },
  });
}

export async function getAllEmployeeUnitRoles(
  employeeId: string | undefined,
  unitId: string | undefined,
  roleId: string | undefined,
): Promise<EmployeeUnitRoleDetail[]> {
  return await prisma.employeeUnitRole.findMany({
    where: {
      isActive: true,
      ...(employeeId && { employeeId: employeeId }),
      ...(unitId && { unitId: unitId }),
      ...(roleId && { roleId: roleId }),
    },
    include: {
      role: true,
      unit: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  }) as EmployeeUnitRoleDetail[];
}

export async function getAllEmployeeWithPagination(
  employeeId: string | undefined,
  unitId: string | undefined,
  roleId: string | undefined,
  pageNumber: number = 1,
  pageSize: number = 10,
  endpointUrl: string
): Promise<ApiPaginationResponse<EmployeeUnitRoleDetail> | null> {
  const conditions = {
        isActive: true,
        ...(employeeId && { employeeId: employeeId }),
        ...(unitId && { unitId: unitId }),
        ...(roleId && { roleId: roleId }),
      };
  const count = await prisma.employeeUnitRole.count({
    where: conditions,
  });

  const totalPages = Math.ceil(count / pageSize);
  const data = await prisma.employeeUnitRole.findMany({
    where: conditions,
    include: {
      unit: true,
      role: true,
    },
    skip: (pageNumber - 1) * pageSize,
    orderBy: {
      createdAt: "asc",
    },
    take: pageSize,
  }) as EmployeeUnitRoleDetail[];
  const firstPage =
    totalPages === 0
      ? null
      : `${endpointUrl}?pageNumber=1&pageSize=${pageSize}`;
  const lastPage =
    pageNumber > totalPages
      ? null
      : `${endpointUrl}?pageNumber=${totalPages}&pageSize=${pageSize}`;
  const nextPage =
    pageNumber < totalPages
      ? `${endpointUrl}?pageNumber=${pageNumber + 1}&pageSize=${pageSize}`
      : null;
  const prevPage =
    pageNumber > 1
      ? `${endpointUrl}?pageNumber=${pageNumber - 1}&pageSize=${pageSize}`
      : null;
  return {
    pageNumber,
    pageSize,
    totalPages,
    totalRecords: count,
    firstPage,
    lastPage,
    nextPage,
    prevPage,
    data,
  };
}

export async function getEmployeeUnitRoleById(
  id: string
): Promise<EmployeeUnitRoleDetail | null> {
  return await prisma.employeeUnitRole.findUnique({
    where: {
      id: id,
      isActive: true,
    },
    include: {
      unit: true,
      role: true,
    },
  }) as EmployeeUnitRoleDetail;
}

export async function count(
  employeeId: string | undefined,
  unitId: string | undefined,
  roleId: string | undefined,
): Promise<number> {
  const conditions = {
    isActive: true,
    ...(employeeId && { employeeId: employeeId }),
    ...(unitId && { unitId: unitId }),
    ...(roleId && { roleId: roleId }),
  };
  return await prisma.employeeUnitRole.count({
    where: conditions,
  });
}
