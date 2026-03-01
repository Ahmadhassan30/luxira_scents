export interface ApiResponse<T> {
    status: 'success' | 'error';
    data?: T;
    message?: string;
    errors?: FieldError[];
    meta?: PaginationMeta;
}

export interface FieldError {
    field: string;
    message: string;
}

export interface PaginationMeta {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export interface PaginatedResult<T> {
    data: T[];
    meta: PaginationMeta;
}
