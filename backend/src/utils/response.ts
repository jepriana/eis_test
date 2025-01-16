import { Response } from "express"
import {StatusCodes} from "http-status-codes"

export interface ApiPaginationResponse<T extends object> {
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  totalRecords: number;
  firstPage: string | null;
  lastPage: string | null;
  nextPage: string | null;
  prevPage: string | null;
  data: T[];
}


export const getPagination = (page: number, size: number) => {
  const limit = size ? +size : 10;
  const offset = page ? page * limit : 0;

  return { limit, offset };
};

export const getPagingData = (data: { totalItems: number, items: unknown }, page: number, limit: number) => {
  const { totalItems, items } = data;
  if (limit === 0) {
    return {
      totalItems,
      items,
      totalPages: 1,
      currentPage: 0,
    };
  }
  const currentPage = page ? +page : 0;
  const totalPages = Math.ceil(totalItems / limit);

  return {
    totalItems,
    items,
    totalPages,
    currentPage,
  };
};

export const okResponse = (res: Response, data: unknown) => {
  res.status(StatusCodes.OK).json(data);
};

export const createdResponse = (res: Response, data: unknown) => {
  res.status(StatusCodes.CREATED).send(data);
};

export const noContentResponse = (res: Response, message: string) => {
  res.status(StatusCodes.NO_CONTENT).json({
    message
  });
};

export const requestErrorResponse = (res: Response, errorMessage: string) => {
  res.status(StatusCodes.BAD_REQUEST).json({
    error: errorMessage
  });
};

export const authenticationErrorResponse = (res: Response, errorMessage: string) => {
  res.status(StatusCodes.UNAUTHORIZED).json({
    error: errorMessage
  });
};

export const authorizationErrorResponse = (res: Response, errorMessage: string) => {
  res.status(StatusCodes.FORBIDDEN).json({
    error: errorMessage
  });
};

export const notFoundErrorResponse = (res: Response, errorMessage: string) => {
  res.status(StatusCodes.NOT_FOUND).json({
    error: errorMessage
  });
};

export const internalErrorResponse = (res: Response, errorMessage: string) => {
  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    error: errorMessage
  });
};
