import type { Table } from '@tanstack/react-table';

import type { BacklogItem } from '@/apollo/types/types';
import { Button } from '@/ui/button';

type BacklogTableFooterProps = {
  table: Table<BacklogItem>;
};

export function BacklogTableFooter({ table }: BacklogTableFooterProps) {
  return (
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
  );
}
