import { StatCard } from "@/components/StatCard";
import { formatCurrency } from "@/lib/format";
import { getTotalCosts, getTotalRevenue, defaultCostCategories as costCategories, defaultRevenueCategories as revenueCategories, getCategoryTotal } from "@/data/businessPlan";
import { TrendingUp, TrendingDown, AlertCircle } from "lucide-react";

export default function Dashboard() {
  const costs = getTotalCosts();
  const revenue = getTotalRevenue();
  const balance = revenue.actual - costs.paid;
  const topCostCategories = costCategories.
  map((c) => ({ label: c.label, icon: c.icon, total: getCategoryTotal(c).amount })).
  sort((a, b) => b.total - a.total).
  slice(0, 4);

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <div className="gradient-primary px-4 pb-8 pt-12">
        <p className="text-sm font-medium opacity-80 text-primary-foreground">Business Plan</p>
        <h1 className="font-heading text-3xl font-bold text-primary-foreground">Color Fest 14</h1>
        <p className="mt-1 text-sm opacity-70 text-primary-foreground">Edizione 2026</p>
      </div>

      {/* Stats */}
      <div className="mx-auto max-w-lg px-4 -mt-4 space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <StatCard
            label="Costi Totali"
            value={formatCurrency(costs.amount)}
            sublabel={`Pagati: ${formatCurrency(costs.paid)}`} />

          <StatCard
            label="Entrate Totali"
            value={formatCurrency(revenue.actual)}
            sublabel={`Stimate: ${formatCurrency(revenue.estimated)}`} />

        </div>

        <StatCard
          label="Bilancio Attuale"
          value={formatCurrency(balance)}
          sublabel={balance >= 0 ? "In positivo" : "In negativo"}
          variant={balance >= 0 ? "success" : "accent"} />


        {costs.toPay > 0 &&
        <div className="flex items-center gap-3 rounded-lg bg-secondary/30 p-3">
            <AlertCircle className="h-5 w-5 text-secondary-foreground" />
            <div>
              <p className="text-sm font-semibold text-secondary-foreground">Da pagare</p>
              <p className="text-xs text-muted-foreground">{formatCurrency(costs.toPay)} ancora da saldare</p>
            </div>
          </div>
        }

        {/* Quick Breakdown */}
        <div>
          <h2 className="mb-3 font-heading text-lg font-bold text-foreground">Voci principali costi</h2>
          <div className="space-y-2">
            {topCostCategories.map((cat) =>
            <div key={cat.label} className="flex items-center justify-between rounded-lg bg-card p-3 shadow-sm">
                <div className="flex items-center gap-2">
                  <span>{cat.icon}</span>
                  <span className="text-sm font-medium text-card-foreground">{cat.label}</span>
                </div>
                <span className="font-heading text-sm font-bold text-card-foreground">{formatCurrency(cat.total)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Revenue quick */}
        <div>
          <h2 className="mb-3 font-heading text-lg font-bold text-foreground">Entrate per categoria</h2>
          <div className="space-y-2">
            {revenueCategories.map((cat) => {
              const tot = cat.items.reduce((a, i) => a + i.actual, 0);
              return (
                <div key={cat.id} className="flex items-center justify-between rounded-lg bg-card p-3 shadow-sm">
                  <div className="flex items-center gap-2">
                    <span>{cat.icon}</span>
                    <span className="text-sm font-medium text-card-foreground">{cat.label}</span>
                  </div>
                  <span className="font-heading text-sm font-bold text-card-foreground">{formatCurrency(tot)}</span>
                </div>);

            })}
          </div>
        </div>
      </div>
    </div>);

}