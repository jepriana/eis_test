/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-useless-catch */
import prisma, { QueryMode } from '../../../configs/prisma.config'
import { ApiPaginationResponse } from '../../../utils/response';
import { EmployeeDetail, NewEmployee, EmployeeWithPassword, Employee } from './employee.interface'

export async function addEmployee(data: NewEmployee): Promise<Employee | null> {
    try {
        const { password, ...newEmployee } = await prisma.employee.create({
            data: data
        })
        return newEmployee as Employee;
    } catch (e) {
        throw e;
    }
}

export async function updateEmployee(id: string, data: NewEmployee): Promise<Employee | null> {
    try {
        const { password, ...updatedEmployee } = await prisma.employee.update({
            where: {
                id: id,
            },
            data: data
        })
        return updatedEmployee as Employee;
    } catch (e) {
        throw e;
    }
}

export async function deleteEmployee(id: string): Promise<Employee | null> {
    try {
        const { password, ...deletedEmployee } = await prisma.employee.update({
            where: {
                id: id,
            },
            data: {
                isActive: false
            }
        })
        return deletedEmployee as Employee;
    } catch (e) {
        throw e;
    }
}

export async function getAllEmployees(keyword: string | undefined): Promise<EmployeeDetail[]> {
    try {
        return await prisma.employee.findMany({
            select: {
                id: true,
                username: true,
                fullName: true,
                isAdmin: true,
                isActive: true,
                joinAt: true,
                createdAt: true,
                updatedAt: true,
                unitRoles: {
                    select: {
                        id: true,
                        unit: {
                            select: {
                                id: true,
                                name: true,
                                description: true,
                            }
                        },
                        role: {
                            select: {
                                id: true,
                                name: true,
                                description: true,
                            }
                        }
                    }
                }
            },
            where: {
                isActive: true,
                ...(keyword === undefined ? {} : {
                    OR: [
                        { username: { contains: keyword, mode: QueryMode.insensitive } },
                        { fullName: { contains: keyword, mode: QueryMode.insensitive } },
                    ]
                }),
            },
            orderBy: {
                username: 'asc'
            },
        });
    } catch (e) {
        throw e;
    }
}

export async function getAllEmployeeWithPagination(keyword: string | undefined, pageNumber: number = 1, pageSize: number = 10, endpointUrl: string): Promise<ApiPaginationResponse<EmployeeDetail> | null> {
    try {
        const conditions = {
            isActive: true,
            ...(keyword === undefined ? {} : {
                OR: [
                    { username: { contains: keyword, mode: QueryMode.insensitive } },
                    { fullName: { contains: keyword, mode: QueryMode.insensitive } },
                ]
            }),
        };
        const count = await prisma.employee.count({
            where: conditions
        });

        const totalPages = Math.ceil(count / pageSize);
        const data = await prisma.employee.findMany({
            select: {
                id: true,
                username: true,
                fullName: true,
                isAdmin: true,
                isActive: true,
                joinAt: true,
                createdAt: true,
                updatedAt: true,
                unitRoles: {
                    select: {
                        id: true,
                        unit: {
                            select: {
                                id: true,
                                name: true,
                                description: true,
                            }
                        },
                        role: {
                            select: {
                                id: true,
                                name: true,
                                description: true,
                            }
                        }
                    }
                }
            },
            where: conditions,
            skip: (pageNumber - 1) * pageSize,
            orderBy: {
                username: 'asc'
            },
            take: pageSize,
        });
        const firstPage = totalPages === 0 ? null : `${endpointUrl}?pageNumber=1&pageSize=${pageSize}`;
        const lastPage = pageNumber > totalPages ? null : `${endpointUrl}?pageNumber=${totalPages}&pageSize=${pageSize}`;
        const nextPage = pageNumber < totalPages ? `${endpointUrl}?pageNumber=${pageNumber + 1}&pageSize=${pageSize}` : null;
        const prevPage = pageNumber > 1 ? `${endpointUrl}?pageNumber=${pageNumber - 1}&pageSize=${pageSize}` : null;
        return {
            pageNumber,
            pageSize,
            totalPages,
            totalRecords: count,
            firstPage,
            lastPage,
            nextPage,
            prevPage,
            data
        }
    } catch (e) {
        throw e;
    }
}

export async function getEmployeeById(id: string): Promise<EmployeeDetail | null> {
    try {
        return await prisma.employee.findUnique({
            where: {
                id: id,
                isActive: true
            },
            select: {
                id: true,
                username: true,
                fullName: true,
                isAdmin: true,
                isActive: true,
                joinAt: true,
                createdAt: true,
                updatedAt: true,
                unitRoles: {
                    select: {
                        id: true,
                        unit: {
                            select: {
                                id: true,
                                name: true,
                                description: true,
                            }
                        },
                        role: {
                            select: {
                                id: true,
                                name: true,
                                description: true,
                            }
                        }
                    }
                }
            },
        });
    } catch (e) {
        throw e;
    }
}

export async function getEmployeeWithPasswordById(id: string): Promise<EmployeeWithPassword | null> {
    try {
        return await prisma.employee.findUnique({
            where: {
                id: id,
                isActive: true
            },
            select: {
                id: true,
                username: true,
                fullName: true,
                password: true,
                isAdmin: true,
                isActive: true,
                joinAt: true,
                createdAt: true,
                updatedAt: true,
                unitRoles: {
                    select: {
                        id: true,
                        unit: {
                            select: {
                                id: true,
                                name: true,
                                description: true,
                            }
                        },
                        role: {
                            select: {
                                id: true,
                                name: true,
                                description: true,
                            }
                        }
                    }
                }
            },
        });
    } catch (e) {
        throw e;
    }
}

export async function getEmployeeByUsername(username: string): Promise<EmployeeDetail | null> {
    try {
        return await prisma.employee.findUnique({
            where: {
                username: username,
                isActive: true
            },
            select: {
                id: true,
                username: true,
                fullName: true,
                isAdmin: true,
                isActive: true,
                joinAt: true,
                createdAt: true,
                updatedAt: true,
                unitRoles: {
                    select: {
                        id: true,
                        unit: {
                            select: {
                                id: true,
                                name: true,
                                description: true,
                            }
                        },
                        role: {
                            select: {
                                id: true,
                                name: true,
                                description: true,
                            }
                        }
                    }
                }
            },
        });
    } catch (e) {
        throw e;
    }
}

export async function countEmployee(keyword: string | undefined): Promise<number> {
    try {
        const conditions = {
            isActive: true,
            ...(keyword === undefined ? {} : {
                OR: [
                    { username: { contains: keyword, mode: QueryMode.insensitive } },
                    { fullName: { contains: keyword, mode: QueryMode.insensitive } },
                ]
            }),
        };
        return await prisma.employee.count({
            where: conditions
        });
    } catch (e) {
        throw e;
    }
}