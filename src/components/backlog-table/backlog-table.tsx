import { useQuery } from '@apollo/client';
import {
  type ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useState } from 'react';

import { GET_ALL_BACKLOGS } from '@/apollo/queries/get-all-backlogs';
import { type BacklogData } from '@/apollo/types/queries';
import type { BacklogItem } from '@/apollo/types/types';
import { Table, TableBody, TableCell, TableRow } from '@/ui/table';

import { BacklogTableFooter } from './backlog-table-footer';
import { BacklogTableHeader } from './backlog-table-header';
import { BacklogTableRow } from './backlog-table-row';
import { BacklogTableTopPanel } from './backlog-table-top-panel';
import { columns } from './columns';

export function BacklogTable() {
  const { data: backlogsData } = useQuery<BacklogData>(GET_ALL_BACKLOGS);

  const [backlogItem, setBacklogItem] = useState<BacklogItem | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

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

  return (
    <div className="container mx-auto mt-16 border-1 bg-white border-gray-200 p-8 rounded-lg shadow-lg">
      <BacklogTableTopPanel
        table={table}
        isFormOpen={isFormOpen}
        setIsFormOpen={setIsFormOpen}
        backlogItem={backlogItem}
        setBacklogItem={setBacklogItem}
      />
      <Table>
        <BacklogTableHeader table={table} />

        <TableBody>
          {table.getRowModel().rows?.length ? (
            table
              .getRowModel()
              .rows.map((row) => (
                <BacklogTableRow
                  key={row.original.id}
                  row={row}
                  setIsFormOpen={setIsFormOpen}
                  setBacklogItem={setBacklogItem}
                />
              ))
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
      <BacklogTableFooter table={table} />
    </div>
  );
}
