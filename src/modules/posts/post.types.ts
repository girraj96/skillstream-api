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
