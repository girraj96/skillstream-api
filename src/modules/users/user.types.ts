export interface UpdateUser {
  name?: string;
  role?: "developer" | "student" | "admin";
}

export interface User {
  name: string;
  email: string;

  password: string;
}

export interface PaginationMap {
  limit: number;
  page: number;
  sortBy: "id" | "email" | "name" | "createdAt" | "updatedAt";
  sortOrder: "asc" | "desc";
  role?: "developer" | "student" | "admin";
  q?: string;
}
