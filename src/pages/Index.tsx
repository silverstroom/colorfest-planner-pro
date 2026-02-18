import { useState, useEffect } from "react";
import { StatCard } from "@/components/StatCard";
import { formatCurrency } from "@/lib/format";
import { getCategoryTotal } from "@/data/businessPlan";
import { AlertCircle, HandCoins } from "lucide-react";
import { useCostCategories, useRevenueCategories } from "@/hooks/useBusinessData";
import { supabase } from "@/integrations/supabase/client";

export default function Dashboard() {
  const { categories: costCategories, loading: loadingCosts } = useCostCategories();
  const { categories: revenueCategories, loading: loadingRevenue } = useRevenueCategories();
  const [diceRevenue, setDiceRevenue] = useState(0);
  const [diceLoading, setDiceLoading] = useState(true);

  useEffect(() => {
    supabase.functions.invoke('dice-sales').then(({ data }) => {
      if (data?.success) setDiceRevenue(data.totals.totalRevenue || 0);
      setDiceLoading(false);
    }).catch(() => setDiceLoading(false));
  }, []);

  if (loadingCosts || loadingRevenue) {
    return (
      <div className="min-h-screen pb-24">
        <div className="gradient-primary px-4 pb-8 pt-12">
          <p className="text-sm font-medium opacity-80 text-primary-foreground">Business Plan</p>
          <h1 className="font-heading text-3xl font-bold text-primary-foreground">Color Fest 14</h1>
          <p className="mt-1 text-sm opacity-70 text-primary-foreground">Edizione 2026</p>
        </div>
        <div className="flex items-center justify-center mt-20">
          <p className="text-muted-foreground">Caricamento...</p>
        </div>
      </div>
    );
  }

  const costs = costCategories.reduce(
    (acc, cat) => {
      const t = getCategoryTotal(cat);
      return { amount: acc.amount + t.amount, paid: acc.paid + t.paid, toPay: acc.toPay + t.toPay };
    },
    { amount: 0, paid: 0, toPay: 0 }
  );
  const revenue = revenueCategories.reduce(
    (acc, cat) => {
      const t = cat.items.reduce((a, i) => ({ estimated: a.estimated + i.estimated, actual: a.actual + i.actual }), { estimated: 0, actual: 0 });
      return { estimated: acc.estimated + t.estimated, actual: acc.actual + t.actual };
    },
    { estimated: 0, actual: 0 }
  );

  const totalRevenue = revenue.actual + diceRevenue;
  const balance = totalRevenue - costs.paid;

  const topCostCategories = costCategories
    .map((c) => ({ label: c.label, icon: c.icon, total: getCategoryTotal(c).amount }))
    .filter((c) => c.total > 0);

  // Collect all anticipi across all categories
  const anticipi: { name: string; category: string; persona: string; importo: number }[] = [];
  costCategories.forEach((cat) => {
    cat.items.forEach((item) => {
      if (item.anticipoPersona && item.anticipoImporto && item.anticipoImporto > 0) {
        anticipi.push({
          name: item.name,
          category: cat.label,
          persona: item.anticipoPersona,
          importo: item.anticipoImporto,
        });
      }
    });
  });

  // Group by persona
  const anticipiByPersona = anticipi.reduce<Record<string, { items: typeof anticipi; total: number }>>((acc, a) => {
    if (!acc[a.persona]) acc[a.persona] = { items: [], total: 0 };
    acc[a.persona].items.push(a);
    acc[a.persona].total += a.importo;
    return acc;
  }, {});

  const totalAnticipi = anticipi.reduce((s, a) => s + a.importo, 0);

  return (
    <div className="min-h-screen pb-24">
      <div className="gradient-primary px-4 pb-8 pt-12">
        <p className="text-sm font-medium opacity-80 text-primary-foreground">Business Plan</p>
        <h1 className="font-heading text-3xl font-bold text-primary-foreground">Color Fest 14</h1>
        <p className="mt-1 text-sm opacity-70 text-primary-foreground">Edizione 2026</p>
      </div>

      <div className="mx-auto max-w-lg px-4 -mt-4 space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <StatCard label="Costi Totali" value={formatCurrency(costs.amount)} sublabel={`Pagati: ${formatCurrency(costs.paid)}`} />
          <StatCard label="Entrate Totali" value={formatCurrency(totalRevenue)} sublabel={diceRevenue > 0 ? `Di cui DICE: ${formatCurrency(diceRevenue)}` : `Stimate: ${formatCurrency(revenue.estimated)}`} />
        </div>

        <StatCard
          label="Bilancio Attuale"
          value={formatCurrency(balance)}
          sublabel={balance >= 0 ? "In positivo" : "In negativo"}
          variant={balance >= 0 ? "success" : "accent"} />

        {costs.toPay > 0 && (
          <div className="flex items-center gap-3 rounded-lg bg-secondary/30 p-3">
            <AlertCircle className="h-5 w-5 text-secondary-foreground" />
            <div>
              <p className="text-sm font-semibold text-secondary-foreground">Da pagare</p>
              <p className="text-xs text-muted-foreground">{formatCurrency(costs.toPay)} ancora da saldare</p>
            </div>
          </div>
        )}

        {/* Anticipi Section */}
        {totalAnticipi > 0 && (
          <div className="rounded-lg border-2 border-primary/30 bg-primary/5 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HandCoins className="h-5 w-5 text-primary" />
                <h2 className="font-heading text-lg font-bold text-foreground">Anticipi</h2>
              </div>
              <span className="font-heading text-lg font-bold text-primary">{formatCurrency(totalAnticipi)}</span>
            </div>
            <div className="space-y-2">
              {Object.entries(anticipiByPersona).map(([persona, data]) => (
                <div key={persona} className="rounded-lg bg-card p-3 shadow-sm space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-card-foreground">{persona}</span>
                    <span className="font-heading text-sm font-bold text-primary">{formatCurrency(data.total)}</span>
                  </div>
                  {data.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{item.name} ({item.category})</span>
                      <span>{formatCurrency(item.importo)}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
          <h2 className="mb-3 font-heading text-lg font-bold text-foreground">Voci principali costi</h2>
          <div className="space-y-2">
            {topCostCategories.map((cat) => (
              <div key={cat.label} className="flex items-center justify-between rounded-lg bg-card p-3 shadow-sm">
                <div className="flex items-center gap-2">
                  <span>{cat.icon}</span>
                  <span className="text-sm font-medium text-card-foreground">{cat.label}</span>
                </div>
                <span className="font-heading text-sm font-bold text-card-foreground">{formatCurrency(cat.total)}</span>
              </div>
            ))}
          </div>
        </div>

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
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
