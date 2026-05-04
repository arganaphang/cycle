import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function EntityDetailSheet({
  open,
  onOpenChange,
  title,
  description,
  children,
  sheetContentClassName,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: ReactNode;
  /** Appended to default SheetContent layout (e.g. wider panel for long-form content). */
  sheetContentClassName?: string;
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className={cn("w-full overflow-y-auto sm:max-w-lg", sheetContentClassName)}>
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
          {description ? <SheetDescription>{description}</SheetDescription> : null}
        </SheetHeader>
        <div className="flex flex-col gap-4 px-4 pb-6 pt-2 sm:px-8">{children}</div>
      </SheetContent>
    </Sheet>
  );
}

export function DetailFields({ rows }: { rows: { label: string; value: ReactNode }[] }) {
  return (
    <dl className="grid gap-x-4 gap-y-3 text-sm sm:grid-cols-[minmax(0,8rem)_1fr]">
      {rows.map((row, i) => (
        <div key={`${row.label}-${i}`} className="contents">
          <dt className="text-muted-foreground">{row.label}</dt>
          <dd className="min-w-0 wrap-break-word font-medium">{row.value ?? "—"}</dd>
        </div>
      ))}
    </dl>
  );
}
