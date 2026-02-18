import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface CategoryCardProps {
  icon: string;
  label: string;
  total: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}

export function CategoryCard({ icon, label, total, subtitle, children, className }: CategoryCardProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className={cn("rounded-lg bg-card shadow-sm overflow-hidden animate-fade-in", className)}>
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between p-4 text-left"
      >
        <div className="flex items-center gap-3">
          <span className="text-xl">{icon}</span>
          <div>
            <p className="font-heading font-semibold text-card-foreground">{label}</p>
            {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-heading font-bold text-card-foreground">{total}</span>
          {open ? (
            <ChevronUp className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
      </button>
      {open && <div className="border-t border-border px-4 pb-4 pt-2">{children}</div>}
    </div>
  );
}
