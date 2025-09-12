import { useQuery } from '@apollo/client';
import {
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { ListFilter, MoreHorizontal } from 'lucide-react';
import { useState } from 'react';

import { GET_ALL_BACKLOGS } from '@/apollo/queries/get-all-backlogs';
import { GET_ALL_STATUSES } from '@/apollo/queries/get-all-statuses';
import { type BacklogData, type StatusData } from '@/apollo/types/queries';
import type { StatusKey } from '@/apollo/types/types';
import { matchIcon } from '@/lib/match-icon';
import { Button } from '@/ui/button';
import { Checkbox } from '@/ui/checkbox';
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/ui/table';
import { Tag } from '@/ui/tag';

import { columns } from './columns';

export function BacklogTable() {
  const { data: backlogsData } = useQuery<BacklogData>(GET_ALL_BACKLOGS);
  const { data: statusesData } = useQuery<StatusData>(GET_ALL_STATUSES);

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
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      columnFilters,
    },
  });

  // console.log('backlogsData', backlogsData);
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
        <Button variant="secondary" className="cursor-pointer shadow-xs">
          + Add new Task
        </Button>
      </div>

      <Table>
        {/* <TableCaption>A list of backlog tasks.</TableCaption> */}
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
              const { id, task, type, estimation, isDone, status, user } =
                row.original;

              return (
                <TableRow
                  key={id}
                  className="border-l-4!"
                  style={{ borderLeftColor: status?.color }}
                >
                  <>
                    <TableCell className="font-medium flex gap-x-3 pt-4 pl-4">
                      <Checkbox
                        checked={isDone}
                        id="isDone"
                        className="cursor-pointer"
                      />
                    </TableCell>
                    <TableCell className="font-medium">{task}</TableCell>
                    <TableCell>
                      <Tag>{type}</Tag>
                    </TableCell>
                    <TableCell>
                      <Tag icon={status.key} color={status.color}>
                        {status.name}
                      </Tag>
                    </TableCell>
                    <TableCell>{estimation}</TableCell>
                    <TableCell>{user.name}</TableCell>

                    <TableCell className="text-right">
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
                          <DropdownMenuItem className="cursor-pointer">
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600 cursor-pointer">
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
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
