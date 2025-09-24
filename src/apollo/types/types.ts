export type StatusKey = 'todo' | 'inProgress' | 'done';

export type Status = {
  id: number;
  key: StatusKey;
  name: string;
  color: string;
};

export type User = {
  id: number;
  name: string;
};

export type BacklogItem = {
  id: number;
  task: string;
  type: string;
  estimation: number;
  isDone: boolean;
  status: Status;
  user: User | null;
};

export type FormPurpose = 'add' | 'edit';
