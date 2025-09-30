import { useQuery } from '@apollo/client';
import type { Table } from '@tanstack/react-table';
import { ListFilter } from 'lucide-react';
import { type Dispatch, type SetStateAction, useState } from 'react';

import { GET_ALL_STATUSES } from '@/apollo/queries/get-all-statuses';
import type { StatusData } from '@/apollo/types/queries';
import type { BacklogItem, StatusKey } from '@/apollo/types/types';
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
import { Sheet, SheetTrigger } from '@/ui/sheet';

import { BacklogForm } from '../backlog-form/backlog-form';

type BacklogTableTopPanelProps = {
  table: Table<BacklogItem>;
  isFormOpen: boolean;
  setIsFormOpen: Dispatch<SetStateAction<boolean>>;
  backlogItem: BacklogItem | null;
  setBacklogItem: Dispatch<SetStateAction<BacklogItem | null>>;
};

export function BacklogTableTopPanel({
  table,
  isFormOpen,
  setIsFormOpen,
  backlogItem,
  setBacklogItem,
}: BacklogTableTopPanelProps) {
  const { data: statusesData } = useQuery<StatusData>(GET_ALL_STATUSES);

  const [statusFilters, setStatusFilters] = useState<
    Record<StatusKey, boolean>
  >({
    // keys should be came as 'key' field value from 'statusesData'
    todo: true,
    inProgress: true,
    done: true,
  });

  const onFormAddClick = () => {
    setIsFormOpen(true);
    setBacklogItem(null);
  };

  return (
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
  );
}
