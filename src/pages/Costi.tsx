import { CategoryCard } from "@/components/CategoryCard";
import { costCategories, getCategoryTotal, getTotalCosts } from "@/data/businessPlan";
import { formatCurrency } from "@/lib/format";
import { StatCard } from "@/components/StatCard";

export default function CostiPage() {
  const totals = getTotalCosts();

  return (
    <div className="min-h-screen pb-24">
      <div className="bg-card px-4 pb-4 pt-12 border-b border-border">
        <h1 className="font-heading text-2xl font-bold text-foreground">Costi</h1>
        <p className="text-sm text-muted-foreground">Color Fest 13 — Riferimento</p>
      </div>

      <div className="mx-auto max-w-lg px-4 mt-4 space-y-3">
        <div className="grid grid-cols-3 gap-2">
          <StatCard label="Totale" value={formatCurrency(totals.amount)} variant="primary" />
          <StatCard label="Pagati" value={formatCurrency(totals.paid)} variant="success" />
          <StatCard label="Da pagare" value={formatCurrency(totals.toPay)} variant="accent" />
        </div>

        {costCategories.map((cat, i) => {
          const catTot = getCategoryTotal(cat);
          return (
            <CategoryCard
              key={cat.id}
              icon={cat.icon}
              label={cat.label}
              total={formatCurrency(catTot.amount)}
              subtitle={catTot.toPay > 0 ? `Da pagare: ${formatCurrency(catTot.toPay)}` : "Saldato"}
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
                      <p className="font-semibold text-card-foreground">{formatCurrency(item.amount)}</p>
                      {item.toPay > 0 && (
                        <p className="text-xs text-accent">Da pagare: {formatCurrency(item.toPay)}</p>
                      )}
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
