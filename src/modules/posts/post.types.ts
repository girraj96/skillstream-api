export interface Post {
  title: string;
  content: string;
}

export interface UpdatePost {
  title?: string;
  content?: string;
}

export interface CursorPostsPaginationMap {
  cursor?: number;
  limit: number;
}

export interface CursorPostSearchPaginationMap {
  cursor?: number;
  limit: number;
  q: string;
}
