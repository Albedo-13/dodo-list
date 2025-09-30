import { useMutation, useQuery } from '@apollo/client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { ADD_BACKLOG } from '@/apollo/queries/create-backlog';
import { EDIT_BACKLOG } from '@/apollo/queries/edit-backlog';
import { GET_ALL_BACKLOGS } from '@/apollo/queries/get-all-backlogs';
import { GET_ALL_STATUSES } from '@/apollo/queries/get-all-statuses';
import { GET_ALL_USERS } from '@/apollo/queries/get-all-users';
import type {
  AddBacklogPayload,
  EditBacklogPayload,
  StatusData,
  UserData,
} from '@/apollo/types/queries';
import type { BacklogItem, FormPurpose } from '@/apollo/types/types';
import { matchIcon } from '@/lib/match-icon';
import { Button } from '@/ui/button';
import { Combobox } from '@/ui/combobox';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/ui/form';
import { Input } from '@/ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/ui/select';
import {
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/ui/sheet';

import { backlogFormSchema } from './schema';

type BacklogFormType = {
  open: boolean;
  backlogItem: BacklogItem | null;
};

export function BacklogForm({ open, backlogItem }: BacklogFormType) {
  const { data: statusesData } = useQuery<StatusData>(GET_ALL_STATUSES);
  const { data: usersData } = useQuery<UserData>(GET_ALL_USERS);

  const [addBacklog] = useMutation<AddBacklogPayload>(ADD_BACKLOG, {
    refetchQueries: [{ query: GET_ALL_BACKLOGS }],
  });
  const [editBacklog] = useMutation<EditBacklogPayload>(EDIT_BACKLOG, {
    refetchQueries: [{ query: GET_ALL_BACKLOGS }],
  });

  const formPurpose: FormPurpose = backlogItem ? 'edit' : 'add';

  const form = useForm<z.infer<typeof backlogFormSchema>>({
    resolver: zodResolver(backlogFormSchema),
    values: {
      task: backlogItem?.task || '',
      type: backlogItem?.type || '',
      statusId: backlogItem?.status?.id.toString() || '1', // 1 - todo
      estimation: backlogItem?.estimation || 0,
      userId: Number(backlogItem?.user?.id) || null,
    },
  });
  const { handleSubmit, control, reset, watch, getValues, setValue } = form;

  useEffect(() => {
    if (!open) {
      reset();
    }
  }, [open, reset]);

  const onUserChange = () => {
    if (!getValues('userId')) setValue('statusId', '1');
  };

  const onSubmit = async (values: z.infer<typeof backlogFormSchema>) => {
    const query = formPurpose === 'add' ? addBacklog : editBacklog;

    await query({
      variables: {
        ...(formPurpose === 'edit' && { id: backlogItem?.id }),
        task: values.task,
        type: values.type,
        status_id: Number(values.statusId),
        estimation: values.estimation,
        user_id: values.userId,
      },
    });

    if (formPurpose === 'add') reset();
  };

  return (
    open && (
      <SheetContent>
        <Form {...form}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="h-full flex flex-col"
          >
            <SheetHeader>
              <SheetTitle>
                <span className="capitalize">{formPurpose}</span> backlog item
              </SheetTitle>
              <SheetDescription>
                Table row form. Click save when you&apos;re done.
              </SheetDescription>
            </SheetHeader>
            <div className="grid flex-1 auto-rows-min gap-6 px-4">
              <FormField
                control={control}
                name="task"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Task name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="statusId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <FormControl>
                      <Select
                        {...field}
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={!watch('userId')}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Status list</SelectLabel>
                            {statusesData?.allStatuses.map((status) => (
                              <SelectItem
                                key={status.id}
                                value={status.id.toString()}
                              >
                                {matchIcon(status.key, status.color)}
                                {status.name}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="estimation"
                render={({ field }) => (
                  <>
                    <FormLabel>Estimation hours</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        onChange={(event) =>
                          field.onChange(+event.target.value)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </>
                )}
              />
              <FormField
                control={control}
                name="userId"
                render={({ field }) => (
                  <>
                    <FormLabel>Assignee</FormLabel>
                    <FormControl>
                      <Combobox<z.infer<typeof backlogFormSchema>>
                        {...field}
                        field={field}
                        form={form}
                        placeholder="Select assignee"
                        onChange={onUserChange}
                        options={(usersData?.allUsers || []).map((user) => ({
                          key: user.id,
                          content: user.name,
                        }))}
                      />
                    </FormControl>
                    <FormMessage />
                  </>
                )}
              />
            </div>
            <SheetFooter>
              <Button type="submit">Save changes</Button>
              <SheetClose asChild>
                <Button variant="outline">Close</Button>
              </SheetClose>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    )
  );
}
