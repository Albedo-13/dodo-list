import { flexRender, type Table } from '@tanstack/react-table';

import type { BacklogItem } from '@/apollo/types/types';
import { TableHead, TableHeader as TableHeaderShadcn, TableRow } from '@/ui/table';

type BacklogTableHeaderProps = {
  table: Table<BacklogItem>;
};

export function BacklogTableHeader({ table }: BacklogTableHeaderProps) {
  return (
    <TableHeaderShadcn>
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
    </TableHeaderShadcn>
  );
}
