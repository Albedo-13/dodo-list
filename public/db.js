export const users = [
  { id: 1, name: 'John Doe' },
  { id: 2, name: 'Jane Doe' },
  { id: 3, name: 'Ivan Dorn' },
];

export const backlogs = [
  {
    id: 1,
    task: 'Paint Buttons',
    type: 'Narrative',
    isDone: false,
    status_id: 2,
    estimation: 16,
    user_id: 3,
  },
  {
    id: 2,
    task: 'Create new UI',
    type: 'UI',
    isDone: false,
    status_id: 1,
    estimation: 32,
    user_id: 2,
  },
  {
    id: 3,
    task: 'Create new API',
    type: 'API',
    isDone: true,
    status_id: 3,
    estimation: 8,
    user_id: 1,
  },
  {
    id: 4,
    task: 'Add new page',
    type: 'Page',
    isDone: true,
    status_id: 3,
    estimation: 20,
    user_id: 1,
  },
  {
    id: 5,
    task: 'Fix margins',
    type: 'UI',
    isDone: false,
    status_id: 2,
    estimation: 2,
    user_id: 3,
  },
];

export const statuses = [
  {
    id: 1,
    name: 'To do',
    icon: 'todo',
    color: '#87ceeb',
  },
  {
    id: 2,
    name: 'In progress',
    icon: 'inProgress',
    color: '#ffa500',
  },
  {
    id: 3,
    name: 'Done',
    icon: 'done',
    color: '#008000',
  },
];

// TODO: one of db files is redundant
