export type Status = {
  name: string;
  icon: string;
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
