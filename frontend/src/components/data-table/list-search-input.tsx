import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";

export function ListSearchInput({
  value,
  onChange,
  placeholder = "Search…",
  id = "list-search",
  className,
  "aria-label": ariaLabel = "Search",
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  id?: string;
  className?: string;
  "aria-label"?: string;
}) {
  return (
    <InputGroup className={cn("max-w-full sm:max-w-sm", className)}>
      <InputGroupAddon>
        <Search className="size-4" aria-hidden />
      </InputGroupAddon>
      <InputGroupInput
        id={id}
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={ariaLabel}
      />
    </InputGroup>
  );
}
