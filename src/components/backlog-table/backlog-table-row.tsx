import { useMutation } from '@apollo/client';
import type { Row } from '@tanstack/react-table';
import type { Dispatch, SetStateAction } from 'react';
import { useDebouncedCallback } from 'use-debounce';

import { DELETE_BACKLOG } from '@/apollo/queries/delete-backlog';
import { GET_ALL_BACKLOGS } from '@/apollo/queries/get-all-backlogs';
import { TOGGLE_BACKLOG } from '@/apollo/queries/toggle-backlog';
import type {
  DeleteBacklogPayload,
  ToggleBacklogPayload,
} from '@/apollo/types/queries';
import type { BacklogItem } from '@/apollo/types/types';
import { toggleStatusId } from '@/lib/toggle-status-id';
import { Checkbox } from '@/ui/checkbox';
import { TableCell, TableRow as TableRowShadcn } from '@/ui/table';
import { Tag } from '@/ui/tag';

import { BacklogTableRowActions } from './backlog-table-row-actions';

type BacklogTableRowProps = {
  row: Row<BacklogItem>;
  setIsFormOpen: Dispatch<SetStateAction<boolean>>;
  setBacklogItem: Dispatch<SetStateAction<BacklogItem | null>>;
};

export function BacklogTableRow({
  row,
  setIsFormOpen,
  setBacklogItem,
}: BacklogTableRowProps) {
  const { task, type, estimation, status, user } = row.original;

  const [toggleBacklog, { loading: isToggleBacklogLoading }] =
    useMutation<ToggleBacklogPayload>(TOGGLE_BACKLOG, {
      refetchQueries: [{ query: GET_ALL_BACKLOGS }],
    });
  const [deleteBacklog] = useMutation<DeleteBacklogPayload>(DELETE_BACKLOG, {
    refetchQueries: [{ query: GET_ALL_BACKLOGS }],
  });

  const onFormEditClick = (row: Row<BacklogItem>) => () => {
    setIsFormOpen(true);
    setBacklogItem(row.original);
  };

  const onRowDeleteClick = (row: Row<BacklogItem>) => () => {
    deleteBacklog({
      variables: {
        id: row.original.id,
      },
    });
  };

  const onDebouncedToggleBacklogClick = useDebouncedCallback(
    (row: Row<BacklogItem>) => {
      const { id, status, user } = row.original;
      toggleBacklog({
        variables: {
          id,
          status_id: toggleStatusId(status, user),
        },
      });
    },
    150
  );

  return (
    <TableRowShadcn
      className="border-l-4!"
      style={{ borderLeftColor: status?.color }}
    >
      <>
        <TableCell className="font-medium flex gap-x-3 pt-4 pl-4">
          <Checkbox
            checked={status?.key === 'done'}
            onClick={() => onDebouncedToggleBacklogClick(row)}
            id="isDone"
            className="cursor-pointer"
            disabled={isToggleBacklogLoading}
          />
        </TableCell>
        <TableCell className="font-medium">{task}</TableCell>
        <TableCell>
          <Tag>{type}</Tag>
        </TableCell>
        <TableCell>
          <Tag icon={status?.key} color={status?.color}>
            {status?.name}
          </Tag>
        </TableCell>
        <TableCell>{estimation}</TableCell>
        <TableCell>{user?.name}</TableCell>

        <TableCell className="text-right">
          <BacklogTableRowActions
            row={row}
            onFormEditClick={onFormEditClick}
            onRowDeleteClick={onRowDeleteClick}
          />
        </TableCell>
      </>
    </TableRowShadcn>
  );
}
