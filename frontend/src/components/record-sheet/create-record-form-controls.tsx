import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { FieldError } from "@/components/ui/field";
import { PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";
import { useMemo } from "react";

export function FormError({ message }: { message?: string }) {
  return message ? <FieldError>{message}</FieldError> : null;
}

/** Underline field style aligned with `Input`, not a boxed outline button. */
export function DatePickerFieldTrigger({
  id,
  empty,
  children,
}: {
  id: string;
  empty: boolean;
  children: ReactNode;
}) {
  return (
    <PopoverTrigger
      nativeButton={false}
      render={
        <button
          type="button"
          id={id}
          data-empty={empty}
          className={cn(
            "inline-flex h-10 w-full min-w-0 cursor-pointer items-center gap-2 border border-transparent border-b-input bg-transparent px-0 py-1 text-left text-base transition-[color,border-color] outline-none md:text-sm",
            "focus-visible:border-b-ring focus-visible:ring-0",
            "hover:bg-transparent",
            empty ? "text-muted-foreground" : "text-foreground",
            "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_svg]:text-muted-foreground",
          )}
        />
      }
    >
      {children}
    </PopoverTrigger>
  );
}

export type ComboboxOption = { value: string; label: string };

/** Single-select combobox: submits `value` (id) while display uses `label`. Optional `serverSearch` turns off client filtering and drives the GraphQL `search` arg via controlled `searchQuery`. */
export function FormIdCombobox({
  id,
  name,
  required,
  placeholder,
  emptyText,
  value,
  onValueChange,
  items,
  searchQuery,
  onSearchQueryChange,
  serverSearch,
}: {
  id: string;
  name: string;
  required?: boolean;
  placeholder: string;
  emptyText: string;
  value: string;
  onValueChange: (next: string) => void;
  items: readonly ComboboxOption[];
  /** Controlled typing text when using `serverSearch`. */
  searchQuery?: string;
  onSearchQueryChange?: (query: string) => void;
  /** Use server-provided `items` only (no client-side filter); pair with debounced GraphQL `search`. */
  serverSearch?: boolean;
}) {
  const ids = useMemo(() => items.map((i) => i.value), [items]);
  const labelById = useMemo(() => new Map(items.map((i) => [i.value, i.label])), [items]);

  const controlledSearch =
    serverSearch === true && typeof searchQuery === "string" && onSearchQueryChange !== undefined;

  return (
    <Combobox
      id={id}
      name={name}
      required={required}
      items={ids}
      value={value.length ? value : null}
      onValueChange={(v) => onValueChange(v ?? "")}
      itemToStringLabel={(itemId) => labelById.get(String(itemId)) ?? ""}
      itemToStringValue={(itemId) => String(itemId)}
      filter={serverSearch ? null : undefined}
      {...(controlledSearch
        ? {
            inputValue: searchQuery,
            onInputValueChange: (q: string) => onSearchQueryChange(q),
          }
        : {})}
    >
      <ComboboxInput placeholder={placeholder} className="w-full" />
      <ComboboxContent>
        <ComboboxEmpty>{emptyText}</ComboboxEmpty>
        <ComboboxList>
          {(itemId: string) => (
            <ComboboxItem key={itemId} value={itemId}>
              {labelById.get(itemId)}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}
