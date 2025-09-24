/* eslint-disable @typescript-eslint/no-explicit-any */
import { CheckIcon, ChevronsUpDownIcon } from 'lucide-react';
import { useState } from 'react';
import type { ControllerRenderProps, UseFormReturn } from 'react-hook-form';

import { cn } from '@/lib/cn';
import { Button } from '@/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/ui/popover';

type ComboboxProps<T extends Record<string, any>> = {
  options: Array<{ key: number; content: string }>;
  placeholder: string;
  defaultValue?: string;
  field: ControllerRenderProps<T, any>;
  form: UseFormReturn<any, any, T>;
};

function Combobox<T extends Record<string, any>>({
  options,
  placeholder,
  field,
  form,
}: ComboboxProps<T>) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between font-normal"
        >
          {field.value ? (
            options.find((option) => Number(option.key) === Number(field.value))
              ?.content
          ) : (
            <span className="text-neutral-500">{placeholder}</span>
          )}
          <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)]">
        <Command>
          <CommandInput placeholder="Search..." />
          <CommandList>
            <CommandEmpty>Not found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.key}
                  value={String(option.key)}
                  onSelect={(currentValue) => {
                    const newValue =
                      Number(field.value) === Number(currentValue)
                        ? null
                        : +currentValue;
                    form.setValue(field.name, newValue);
                    setOpen(false);
                  }}
                >
                  <CheckIcon
                    className={cn(
                      'mr-2 h-4 w-4',
                      // TODO: cut numbers()
                      Number(field.value) === Number(option.key)
                        ? 'opacity-100'
                        : 'opacity-0'
                    )}
                  />
                  {option.content}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export { Combobox };
