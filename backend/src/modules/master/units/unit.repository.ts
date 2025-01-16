import prisma, { QueryMode } from '../../../configs/prisma.config'
import { ApiPaginationResponse } from '../../../utils/response';
import { NewUnit, Unit } from './unit.interface'

export async function addUnit(data: NewUnit): Promise<Unit | null> {
    return await prisma.unit.create({
        data: data
    });
}

export async function updateUnit(id: string, data: NewUnit): Promise<Unit | null> {
    return await prisma.unit.update({
        where: {
            id: id,
        },
        data: data
    });
}

export async function deleteUnit(id: string): Promise<Unit | null> {
    return await prisma.unit.update({
        where: {
            id: id,
        },
        data: {
            isActive: false
        }
    });
}

export async function getAllUnits(keyword: string | undefined): Promise<Unit[]> {
    const conditions = keyword === undefined ? {
        isActive: true
    } : {
        OR: [
            { name: { contains: keyword, mode: QueryMode.insensitive } },
            { description: { contains: keyword, mode: QueryMode.insensitive } },
        ],
        isActive: true
    }
    return await prisma.unit.findMany({
        where: conditions,
        orderBy: {
            name: 'asc'
        },
    });
}

export async function getAllPagination(keyword: string | undefined, pageNumber: number = 1, pageSize: number = 10, endpointUrl: string): Promise<ApiPaginationResponse<Unit> | null> {
    const conditions = keyword === undefined ? {
        isActive: true
    } : {
        OR: [
            { name: { contains: keyword, mode: QueryMode.insensitive } },
            { description: { contains: keyword, mode: QueryMode.insensitive } },
        ],
        isActive: true
    }
    const count = await prisma.unit.count({
        where: conditions
    });

    const totalPages = Math.ceil(count / pageSize);
    const data = await prisma.unit.findMany({
        where: conditions,
        skip: (pageNumber - 1) * pageSize,
        orderBy: {
            name: 'asc'
        },
        take: pageSize,
    }) as Unit[];
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

export async function getUnitById(id: string): Promise<Unit | null> {
    return await prisma.unit.findUnique({
        where: {
            id: id,
            isActive: true
        }
    });
}

export async function getUnitByName(name: string): Promise<Unit | null> {
    return await prisma.unit.findUnique({
        where: {
            name: name,
            isActive: true
        }
    });
}

export async function count(keyword: string | undefined): Promise<number> {
    const conditions = keyword === undefined ? {
        isActive: true
    } : {
        OR: [
            { name: { contains: keyword, mode: QueryMode.insensitive } },
            { description: { contains: keyword, mode: QueryMode.insensitive } },
        ],
        isActive: true
    }
    return await prisma.unit.count({
        where: conditions
    });
}