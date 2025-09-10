import { useQuery } from '@apollo/client';
import { MoreHorizontal } from 'lucide-react';

import { GET_BACKLOG_LIST } from '@/apollo/queries/get-backlog-list';
import { type BacklogData } from '@/apollo/types/queries';
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
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/ui/table';
import { Tag } from '@/ui/tag';

export function BacklogTable() {
  const {
    //loading, error,
    data,
  } = useQuery<BacklogData>(GET_BACKLOG_LIST);

  console.log(data);
  // https://ui.shadcn.com/docs/components/data-table

  return (
    <>
      <Button>Click me</Button>
      <Table>
        <TableCaption>A list of backlog tasks.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]" />
            <TableHead>Task name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Estim (hrs)</TableHead>
            <TableHead>Assignee</TableHead>
            <TableHead className="text-right" />
          </TableRow>
        </TableHeader>

        <TableBody>
          {data?.allBacklogs.map(
            ({ id, task, type, estimation, isDone, status, user }) => (
              <TableRow
                key={id}
                className="border-l-4!"
                style={{ borderLeftColor: status?.color }}
              >
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
                  <Tag icon={status.icon} color={status.color}>
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
                        Mark as done
                        <Checkbox checked={isDone} />
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer">
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600 cursor-pointer">
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            )
          )}
        </TableBody>
      </Table>
    </>
  );
}
