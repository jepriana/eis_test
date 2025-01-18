import prisma, { QueryMode } from '../../../configs/prisma.config'
import { ApiPaginationResponse } from '../../../utils/response';
import { NewAuthLog, AuthLog, AuthLogWithEmployee } from './log.interface'

export async function addAuthLog(data: NewAuthLog): Promise<AuthLog | null> {
    return await prisma.authLog.create({
        data: data
    });
}

export async function updateAuthLog(id: string, data: NewAuthLog): Promise<AuthLog | null> {
    return await prisma.authLog.update({
        where: {
            id: id,
        },
        data: data
    });
}

export async function deleteAuthLog(id: string): Promise<AuthLog | null> {
    return await prisma.authLog.delete({
        where: {
            id: id,
        }
    });
}

export async function getAllAuthLogs(keyword: string | undefined): Promise<AuthLogWithEmployee[]> {
    const conditions = {
        ...(keyword === undefined ? {} : {
            OR: [
                { employee: { username: { contains: keyword, mode: QueryMode.insensitive } } },
                { employee: { fullName: { contains: keyword, mode: QueryMode.insensitive } } },
            ],
        }),
    }
    
    return await prisma.authLog.findMany({
        include: {
            employee: true
        },
        where: conditions,
        orderBy: {
            authAt: 'desc'
        },
    }) as AuthLogWithEmployee[];
}

export async function getAllPagination(keyword: string | undefined, pageNumber: number = 1, pageSize: number = 10, endpointUrl: string): Promise<ApiPaginationResponse<AuthLogWithEmployee> | null> {
    const conditions = {
        ...(keyword === undefined ? {} : {
            OR: [
                { employee: { username: { contains: keyword, mode: QueryMode.insensitive } } },
                { employee: { fullName: { contains: keyword, mode: QueryMode.insensitive } } },
            ],
        }),
    }
    const count = await prisma.authLog.count({
        where: conditions
    });

    const totalPages = Math.ceil(count / pageSize);
    const data = await prisma.authLog.findMany({
        include: {
            employee: true
        },
        where: conditions,
        skip: (pageNumber - 1) * pageSize,
        orderBy: {
            authAt: 'desc'
        },
        take: pageSize,
    }) as AuthLogWithEmployee[];
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

export async function getAuthLogById(id: string): Promise<AuthLogWithEmployee | null> {
    return await prisma.authLog.findUnique({
        include: {
            employee: true
        },
        where: {
            id: id,
        }
    }) as AuthLogWithEmployee | null;
}

export async function count(keyword: string | undefined): Promise<number> {
    const conditions = {
        ...(keyword === undefined ? {} : {
            OR: [
                { employee: { username: { contains: keyword, mode: QueryMode.insensitive } } },
                { employee: { fullName: { contains: keyword, mode: QueryMode.insensitive } } },
            ],
        }),
    }
    return await prisma.authLog.count({
        where: conditions
    });
}