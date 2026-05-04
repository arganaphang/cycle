import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function EntityDetailDialog({
  open,
  onOpenChange,
  title,
  description,
  children,
  contentClassName,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: ReactNode;
  /** Appended to default dialog layout (e.g. wider modal for long-form content). */
  contentClassName?: string;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          "flex w-full max-w-full flex-col overflow-hidden sm:max-w-lg",
          contentClassName,
        )}
      >
        <DialogHeader className="border-border/60 shrink-0 space-y-1 border-b bg-muted/25 pb-4 sm:pb-5">
          <DialogTitle className="text-xl font-semibold tracking-tight text-foreground normal-case">
            {title}
          </DialogTitle>
          {description ? (
            <DialogDescription className="text-muted-foreground text-sm leading-snug">
              {description}
            </DialogDescription>
          ) : null}
        </DialogHeader>
        <div className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto">{children}</div>
      </DialogContent>
    </Dialog>
  );
}

/** Grouped block with a small section title (use above `DetailFields` or custom content). */
export function DetailSection({
  title,
  description,
  children,
  className,
  actions,
}: {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
  /** Shown on the right of the section heading (e.g. primary actions for this block). */
  actions?: ReactNode;
}) {
  return (
    <section className={cn("space-y-3", className)}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 space-y-0.5 px-0.5">
          <h3 className="text-foreground text-xs font-semibold tracking-wide uppercase">{title}</h3>
          {description ? (
            <p className="text-muted-foreground text-xs leading-relaxed">{description}</p>
          ) : null}
        </div>
        {actions ? <div className="shrink-0">{actions}</div> : null}
      </div>
      {children}
    </section>
  );
}

const detailRowClass =
  "flex flex-col gap-1 sm:grid sm:grid-cols-[minmax(7.25rem,11rem)_minmax(0,1fr)] sm:items-start sm:gap-x-8 sm:gap-y-1";

/** Label above value, full width — for long-form / print content. */
const detailRowClassStacked = "flex flex-col gap-1.5";

const labelClass = "text-muted-foreground pt-0.5 text-[11px] font-semibold uppercase tracking-wide";

const valueClass = "text-foreground min-w-0 text-sm leading-relaxed";

/** Single label/value row — matches rows inside `DetailFields` for custom layouts. */
export function DetailValueRow({
  label,
  value,
  layout = "default",
}: {
  label: string;
  value: ReactNode;
  /** `stacked` = label on top, value below (no side-by-side grid on larger screens). */
  layout?: "default" | "stacked";
}) {
  return (
    <div className={layout === "stacked" ? detailRowClassStacked : detailRowClass}>
      <dt className={labelClass}>{label}</dt>
      <dd
        className={cn(
          valueClass,
          "wrap-break-word font-normal",
          layout === "stacked" && "whitespace-pre-wrap",
        )}
      >
        {value ?? "—"}
      </dd>
    </div>
  );
}

export function DetailFields({
  rows,
  className,
  layout = "default",
}: {
  rows: { label: string; value: ReactNode }[];
  className?: string;
  layout?: "default" | "stacked";
}) {
  return (
    <dl className={cn("flex flex-col gap-4", className)}>
      {rows.map((row, i) => (
        <DetailValueRow
          key={`${row.label}-${i}`}
          label={row.label}
          value={row.value}
          layout={layout}
        />
      ))}
    </dl>
  );
}
