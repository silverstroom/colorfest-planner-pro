import { CategoryCard } from "@/components/CategoryCard";
import { revenueCategories, getRevenueCategoryTotal, getTotalRevenue } from "@/data/businessPlan";
import { formatCurrency } from "@/lib/format";
import { StatCard } from "@/components/StatCard";

export default function EntratePage() {
  const totals = getTotalRevenue();

  return (
    <div className="min-h-screen pb-24">
      <div className="bg-card px-4 pb-4 pt-12 border-b border-border">
        <h1 className="font-heading text-2xl font-bold text-foreground">Entrate</h1>
        <p className="text-sm text-muted-foreground">Color Fest 13 — Riferimento</p>
      </div>

      <div className="mx-auto max-w-lg px-4 mt-4 space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <StatCard label="Stimate" value={formatCurrency(totals.estimated)} variant="default" />
          <StatCard label="Effettive" value={formatCurrency(totals.actual)} variant="success" />
        </div>

        {revenueCategories.map((cat, i) => {
          const catTot = getRevenueCategoryTotal(cat);
          return (
            <CategoryCard
              key={cat.id}
              icon={cat.icon}
              label={cat.label}
              total={formatCurrency(catTot.actual)}
              subtitle={`Stimato: ${formatCurrency(catTot.estimated)}`}
              className={`[animation-delay:${i * 50}ms]`}
            >
              <div className="space-y-2">
                {cat.items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between text-sm">
                    <div>
                      <p className="font-medium text-card-foreground">{item.name}</p>
                      {item.notes && <p className="text-xs text-muted-foreground">{item.notes}</p>}
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-card-foreground">{formatCurrency(item.actual)}</p>
                      <p className="text-xs text-muted-foreground">Stima: {formatCurrency(item.estimated)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CategoryCard>
          );
        })}
      </div>
    </div>
  );
}
