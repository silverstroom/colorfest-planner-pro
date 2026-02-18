import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string;
  sublabel?: string;
  variant?: "default" | "primary" | "success" | "accent";
  className?: string;
}

const variantClasses = {
  default: "bg-card",
  primary: "gradient-primary text-primary-foreground",
  success: "gradient-success text-success-foreground",
  accent: "bg-accent text-accent-foreground",
};

export function StatCard({ label, value, sublabel, variant = "default", className }: StatCardProps) {
  return (
    <div
      className={cn(
        "rounded-lg p-4 shadow-sm animate-fade-in",
        variantClasses[variant],
        className
      )}
    >
      <p className={cn("text-xs font-medium uppercase tracking-wide", variant === "default" ? "text-muted-foreground" : "opacity-80")}>
        {label}
      </p>
      <p className="mt-1 font-heading text-2xl font-bold">{value}</p>
      {sublabel && (
        <p className={cn("mt-0.5 text-xs", variant === "default" ? "text-muted-foreground" : "opacity-70")}>
          {sublabel}
        </p>
      )}
    </div>
  );
}
