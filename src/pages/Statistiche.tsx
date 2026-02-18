import { StatCard } from "@/components/StatCard";
import { formatCurrency } from "@/lib/format";
import { costCategories, revenueCategories, getCategoryTotal, getRevenueCategoryTotal, getTotalCosts, getTotalRevenue } from "@/data/businessPlan";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const COLORS = [
  "hsl(24, 95%, 53%)",
  "hsl(340, 82%, 52%)",
  "hsl(45, 93%, 58%)",
  "hsl(152, 60%, 42%)",
  "hsl(200, 70%, 50%)",
  "hsl(280, 60%, 55%)",
  "hsl(15, 80%, 45%)",
];

export default function StatistichePage() {
  const costs = getTotalCosts();
  const revenue = getTotalRevenue();

  const costData = costCategories.map((c) => ({
    name: c.label.split(" ")[0],
    value: getCategoryTotal(c).amount,
  }));

  const revenueData = revenueCategories.map((c) => ({
    name: c.label,
    value: getRevenueCategoryTotal(c).actual,
  }));

  const overviewData = [
    { name: "Costi", preventivo: costs.amount, effettivo: costs.paid },
    { name: "Entrate", preventivo: revenue.estimated, effettivo: revenue.actual },
  ];

  return (
    <div className="min-h-screen pb-24">
      <div className="bg-card px-4 pb-4 pt-12 border-b border-border">
        <h1 className="font-heading text-2xl font-bold text-foreground">Statistiche</h1>
        <p className="text-sm text-muted-foreground">Panoramica finanziaria CF13</p>
      </div>

      <div className="mx-auto max-w-lg px-4 mt-4 space-y-6">
        <div className="grid grid-cols-2 gap-3">
          <StatCard label="Margine" value={formatCurrency(revenue.actual - costs.paid)} variant="success" />
          <StatCard label="% Pagato" value={`${Math.round((costs.paid / costs.amount) * 100)}%`} />
        </div>

        {/* Bar Chart - Overview */}
        <div className="rounded-lg bg-card p-4 shadow-sm">
          <h3 className="mb-3 font-heading text-sm font-bold text-card-foreground">Preventivo vs Effettivo</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={overviewData}>
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(v: number) => formatCurrency(v)} />
              <Bar dataKey="preventivo" fill="hsl(24, 95%, 53%)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="effettivo" fill="hsl(152, 60%, 42%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie - Costs */}
        <div className="rounded-lg bg-card p-4 shadow-sm">
          <h3 className="mb-3 font-heading text-sm font-bold text-card-foreground">Distribuzione Costi</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={costData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                {costData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(v: number) => formatCurrency(v)} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Bar - Revenue */}
        <div className="rounded-lg bg-card p-4 shadow-sm">
          <h3 className="mb-3 font-heading text-sm font-bold text-card-foreground">Entrate per Categoria</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={revenueData} layout="vertical">
              <XAxis type="number" tick={{ fontSize: 10 }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={70} />
              <Tooltip formatter={(v: number) => formatCurrency(v)} />
              <Bar dataKey="value" fill="hsl(152, 60%, 42%)" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
