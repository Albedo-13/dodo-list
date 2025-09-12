export type StatusKey = 'todo' | 'inProgress' | 'done';

export type Status = {
  id: number;
  key: StatusKey;
  name: string;
  color: string;
};

export type User = {
  name: string;
};

export type BacklogItem = {
  id: string;
  task: string;
  type: string;
  estimation: number;
  isDone: boolean;
  status: Status;
  user: User;
};
