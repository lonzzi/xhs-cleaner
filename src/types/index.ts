export interface XhsConfig {
  cookie: string;
  user_id?: string;
}

export interface NoteItem {
  id: string;
  title: string;
  type: 'like' | 'collect';
  xsec_token: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  code: number;
  msg?: string;
  data?: T;
}

export interface NotesListResponse {
  notes: NoteItem[];
  has_more: boolean;
  cursor: string;
}

export enum ActionType {
  UNLIKE = 'unlike',
  UNCOLLECT = 'uncollect',
}
