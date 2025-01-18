import prisma, { QueryMode } from '../../../configs/prisma.config'
import { ApiPaginationResponse } from '../../../utils/response';
import { NewRole, Role } from './role.interface'

export async function addRole(data: NewRole): Promise<Role | null> {
    return await prisma.role.create({
        data: data
    });
}

export async function updateRole(id: string, data: NewRole): Promise<Role | null> {
    return await prisma.role.update({
        where: {
            id: id,
        },
        data: data
    });
}

export async function deleteRole(id: string): Promise<Role | null> {
    return await prisma.role.update({
        where: {
            id: id,
        },
        data: {
            isActive: false
        }
    });
}

export async function getAllRoles(keyword: string | undefined): Promise<Role[]> {
    const conditions = keyword === undefined ? {
        isActive: true
    } : {
        OR: [
            { name: { contains: keyword, mode: QueryMode.insensitive } },
            { description: { contains: keyword, mode: QueryMode.insensitive } },
        ],
        isActive: true
    }
    return await prisma.role.findMany({
        where: conditions,
        orderBy: {
            name: 'asc'
        },
    });
}

export async function getAllPagination(keyword: string | undefined, pageNumber: number = 1, pageSize: number = 10, endpointUrl: string): Promise<ApiPaginationResponse<Role> | null> {
    const conditions = keyword === undefined ? {
        isActive: true
    } : {
        OR: [
            { name: { contains: keyword, mode: QueryMode.insensitive } },
            { description: { contains: keyword, mode: QueryMode.insensitive } },
        ],
        isActive: true
    }
    const count = await prisma.role.count({
        where: conditions
    });

    const totalPages = Math.ceil(count / pageSize);
    const data = await prisma.role.findMany({
        where: conditions,
        skip: (pageNumber - 1) * pageSize,
        orderBy: {
            name: 'asc'
        },
        take: pageSize,
    }) as Role[];
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
        data,
    };
}

export async function getRoleById(id: string): Promise<Role | null> {
    return await prisma.role.findUnique({
        where: {
            id: id,
            isActive: true
        }
    });
}

export async function getRoleByName(name: string): Promise<Role | null> {
    return await prisma.role.findUnique({
        where: {
            name: name,
            isActive: true
        }
    });
}

export async function countRole(keyword: string | undefined): Promise<number> {
    const conditions = keyword === undefined ? {
        isActive: true
    } : {
        OR: [
            { name: { contains: keyword, mode: QueryMode.insensitive } },
            { description: { contains: keyword, mode: QueryMode.insensitive } },
        ],
        isActive: true
    }
    return await prisma.role.count({
        where: conditions
    });
}