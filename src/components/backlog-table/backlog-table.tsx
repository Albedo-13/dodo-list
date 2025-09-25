import { useMutation, useQuery } from '@apollo/client';
import {
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  type Row,
  useReactTable,
} from '@tanstack/react-table';
import { ListFilter, MoreHorizontal } from 'lucide-react';
import { useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';

import { DELETE_BACKLOG } from '@/apollo/queries/delete-backlog';
import { GET_ALL_BACKLOGS } from '@/apollo/queries/get-all-backlogs';
import { GET_ALL_STATUSES } from '@/apollo/queries/get-all-statuses';
import { TOGGLE_BACKLOG } from '@/apollo/queries/toggle-backlog';
import {
  type BacklogData,
  type DeleteBacklogPayload,
  type StatusData,
  type ToggleBacklogPayload,
} from '@/apollo/types/queries';
import type { BacklogItem, StatusKey } from '@/apollo/types/types';
import { matchIcon } from '@/lib/match-icon';
import { toggleStatusId } from '@/lib/toggle-status-id';
import { Button } from '@/ui/button';
import { Checkbox } from '@/ui/checkbox';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/ui/dialog-alert';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/ui/dropdown-menu';
import { Input } from '@/ui/input';
import { Label } from '@/ui/label';
import { Sheet, SheetTrigger } from '@/ui/sheet';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/ui/table';
import { Tag } from '@/ui/tag';

import { BacklogForm } from '../backlog-form/backlog-form';
import { columns } from './columns';

export function BacklogTable() {
  const { data: backlogsData } = useQuery<BacklogData>(GET_ALL_BACKLOGS);
  const { data: statusesData } = useQuery<StatusData>(GET_ALL_STATUSES);

  const [toggleBacklog, { loading: isToggleBacklogLoading }] =
    useMutation<ToggleBacklogPayload>(TOGGLE_BACKLOG, {
      refetchQueries: [{ query: GET_ALL_BACKLOGS }],
    });
  const [deleteBacklog] = useMutation<DeleteBacklogPayload>(DELETE_BACKLOG, {
    refetchQueries: [{ query: GET_ALL_BACKLOGS }],
  });

  const [backlogItem, setBacklogItem] = useState<BacklogItem | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [statusFilters, setStatusFilters] = useState<
    Record<StatusKey, boolean>
  >({
    // keys should be came as 'key' field value from 'statusesData'
    todo: true,
    inProgress: true,
    done: true,
  });

  const table = useReactTable({
    data: backlogsData?.allBacklogs || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    autoResetPageIndex: false,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      columnFilters,
    },
  });

  const onFormAddClick = () => {
    setIsFormOpen(true);
    setBacklogItem(null);
  };

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

  console.log('backlogsData', backlogsData);
  // console.log('statusesData', statusesData);
  // console.log('columnFilters', columnFilters);
  // console.log('table columns', table.getAllColumns());
  // https://ui.shadcn.com/docs/components/data-table

  return (
    <div className="container mx-auto mt-16 border-1 bg-white border-gray-200 p-8 rounded-lg shadow-lg">
      <div className="flex gap-6 items-center mb-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="h-8 w-9 p-[17px] cursor-pointer border-1 shadow-xs"
            >
              <span className="sr-only">Open menu</span>
              <ListFilter />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuLabel>Status filters</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {statusesData?.allStatuses.map(({ id, name, key, color }) => (
              <DropdownMenuItem
                className="gap-0"
                key={id}
                onSelect={(e) => {
                  e.preventDefault();
                }}
              >
                <Checkbox
                  defaultChecked={true}
                  id={key}
                  className="cursor-pointer"
                  checked={Boolean(statusFilters[key])}
                  onClick={() => {
                    setStatusFilters((prev) => {
                      const newValue = {
                        ...statusFilters,
                        [key]: !prev[key],
                      };

                      table
                        .getColumn('status_name')
                        ?.setFilterValue(() => newValue);

                      return newValue;
                    });
                  }}
                />
                <Label
                  htmlFor={key}
                  className="cursor-pointer font-normal pl-2 py-1"
                >
                  Show {matchIcon(key, color)}
                  {name}
                </Label>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <Input
          placeholder="Search tasks..."
          value={(table.getColumn('task')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('task')?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <Sheet open={isFormOpen} onOpenChange={setIsFormOpen}>
          <SheetTrigger asChild>
            <Button
              variant="secondary"
              onClick={onFormAddClick}
              className="cursor-pointer shadow-xs"
            >
              + Add new Task
            </Button>
          </SheetTrigger>
          <BacklogForm open={isFormOpen} backlogItem={backlogItem} />
        </Sheet>
      </div>
      <Table>
        {/* TODO: separate component */}
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => {
              // TODO: separate component
              const { id, task, type, estimation, status, user } = row.original;

              return (
                <TableRow
                  key={id}
                  className="border-l-4!"
                  style={{ borderLeftColor: status?.color }}
                >
                  <>
                    <TableCell className="font-medium flex gap-x-3 pt-4 pl-4">
                      {id}
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
                      {/* // TODO: separate table-row-actions comp */}
                      <Sheet>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              className="h-8 w-8 p-0 cursor-pointer"
                            >
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="cursor-pointer"
                              onClick={onFormEditClick(row)}
                            >
                              Edit
                            </DropdownMenuItem>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <DropdownMenuItem
                                  className="text-red-600 cursor-pointer hover:text-red-600!"
                                  onSelect={(e) => e.preventDefault()}
                                >
                                  Delete
                                </DropdownMenuItem>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Delete task {`"${task}"`}?
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This action cannot be undone. This will
                                    permanently delete backlog item.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={onRowDeleteClick(row)}
                                  >
                                    Continue
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </Sheet>
                    </TableCell>
                  </>
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="h-24 text-center font-semibold"
              >
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      {/* // TODO: separate component */}
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          aria-label="Previous page"
        >
          {'<'}
        </Button>
        <span className="font-light">
          {table.getState().pagination.pageIndex + 1} / {table.getPageCount()}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          aria-label="Next page"
        >
          {'>'}
        </Button>
      </div>
    </div>
  );
}
