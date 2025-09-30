import type { BacklogItem, Status, User } from './types';

export type BacklogData = {
  allBacklogs: BacklogItem[];
};

export type StatusData = {
  allStatuses: Status[];
};

export type UserData = {
  allUsers: User[];
};

export type EditBacklogPayload = {
  id: number;
  task: string;
  type: string;
  estimation: number;
  status_id: number;
  user_id: number | null;
};

export type AddBacklogPayload = EditBacklogPayload;

export type ToggleBacklogPayload = {
  id: number;
  status_id: number;
};

export type DeleteBacklogPayload = {
  id: number;
};
