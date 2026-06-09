export interface User {
  name: string;
  email: string;
  role?: "developer" | "student" | "admin";
}

export interface PaginationMap {
  limit: number;
  page: number;
}
