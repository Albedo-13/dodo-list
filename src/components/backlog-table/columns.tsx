import { type ColumnDef } from '@tanstack/react-table';

import type { BacklogItem } from '@/apollo/types/types';

export const columns: ColumnDef<BacklogItem>[] = [
  {
    accessorKey: 'isDone',
    header: '',
  },
  {
    accessorKey: 'task',
    header: 'Task name',
  },
  {
    accessorKey: 'type',
    header: 'Type',
  },
  {
    accessorKey: 'status.name',
    header: 'Status',
    filterFn: (row, _, value) => {
      return value[row.original.status.key];
    },
  },
  {
    accessorKey: 'estimation',
    header: 'Estim (hrs)',
  },
  {
    accessorKey: 'user.name',
    header: 'Assignee',
  },
  {
    accessorKey: 'dropdown',
    header: '',
  },
];
