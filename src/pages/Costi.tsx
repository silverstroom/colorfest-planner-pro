import { useState } from "react";
import { CategoryCard } from "@/components/CategoryCard";
import { defaultCostCategories, getCategoryTotal, type CostCategory, type CostItem } from "@/data/businessPlan";
import { formatCurrency } from "@/lib/format";
import { StatCard } from "@/components/StatCard";
import { Plus, Check, X, Pencil, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function CostiPage() {
  const [categories, setCategories] = useState<CostCategory[]>(defaultCostCategories);
  const [addingTo, setAddingTo] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", amount: "", paid: "", notes: "" });

  const totals = categories.reduce(
    (acc, cat) => {
      const t = getCategoryTotal(cat);
      return { amount: acc.amount + t.amount, paid: acc.paid + t.paid, toPay: acc.toPay + t.toPay };
    },
    { amount: 0, paid: 0, toPay: 0 }
  );

  const resetForm = () => {
    setForm({ name: "", amount: "", paid: "", notes: "" });
    setAddingTo(null);
    setEditingItem(null);
  };

  const handleAdd = (catId: string) => {
    if (!form.name) return;
    const amount = parseFloat(form.amount) || 0;
    const paid = parseFloat(form.paid) || 0;
    const newItem: CostItem = {
      id: `new_${Date.now()}`,
      name: form.name,
      amount,
      paid,
      toPay: Math.max(0, amount - paid),
      notes: form.notes || undefined,
    };
    setCategories((prev) =>
      prev.map((c) => (c.id === catId ? { ...c, items: [...c.items, newItem] } : c))
    );
    resetForm();
  };

  const handleEdit = (catId: string, itemId: string) => {
    if (!form.name) return;
    const amount = parseFloat(form.amount) || 0;
    const paid = parseFloat(form.paid) || 0;
    setCategories((prev) =>
      prev.map((c) =>
        c.id === catId
          ? {
              ...c,
              items: c.items.map((item) =>
                item.id === itemId
                  ? { ...item, name: form.name, amount, paid, toPay: Math.max(0, amount - paid), notes: form.notes || undefined }
                  : item
              ),
            }
          : c
      )
    );
    resetForm();
  };

  const handleDelete = (catId: string, itemId: string) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === catId ? { ...c, items: c.items.filter((i) => i.id !== itemId) } : c))
    );
  };

  const startEdit = (item: CostItem) => {
    setEditingItem(item.id);
    setAddingTo(null);
    setForm({ name: item.name, amount: String(item.amount), paid: String(item.paid), notes: item.notes || "" });
  };

  return (
    <div className="min-h-screen pb-24">
      <div className="bg-card px-4 pb-4 pt-12 border-b border-border">
        <h1 className="font-heading text-2xl font-bold text-foreground">Costi</h1>
        <p className="text-sm text-muted-foreground">Color Fest 14 — Edizione 2025</p>
      </div>

      <div className="mx-auto max-w-lg px-4 mt-4 space-y-3">
        <div className="grid grid-cols-3 gap-2">
          <StatCard label="Totale" value={formatCurrency(totals.amount)} variant="primary" />
          <StatCard label="Pagati" value={formatCurrency(totals.paid)} variant="success" />
          <StatCard label="Da pagare" value={formatCurrency(totals.toPay)} variant="accent" />
        </div>

        {categories.map((cat, i) => {
          const catTot = getCategoryTotal(cat);
          return (
            <CategoryCard
              key={cat.id}
              icon={cat.icon}
              label={cat.label}
              total={formatCurrency(catTot.amount)}
              subtitle={
                cat.items.length === 0
                  ? "Nessuna voce"
                  : catTot.toPay > 0
                  ? `Da pagare: ${formatCurrency(catTot.toPay)}`
                  : "Saldato"
              }
              className={`[animation-delay:${i * 50}ms]`}
            >
              <div className="space-y-2">
                {cat.items.map((item) => (
                  <div key={item.id}>
                    {editingItem === item.id ? (
                      <div className="space-y-2 rounded-md bg-muted/50 p-2">
                        <Input placeholder="Nome" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
                        <div className="grid grid-cols-2 gap-2">
                          <Input placeholder="Importo" type="number" value={form.amount} onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))} />
                          <Input placeholder="Pagato" type="number" value={form.paid} onChange={(e) => setForm((f) => ({ ...f, paid: e.target.value }))} />
                        </div>
                        <Input placeholder="Note (opzionale)" value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} />
                        <div className="flex gap-2">
                          <button onClick={() => handleEdit(cat.id, item.id)} className="flex items-center gap-1 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground">
                            <Check className="h-3 w-3" /> Salva
                          </button>
                          <button onClick={resetForm} className="flex items-center gap-1 rounded-md bg-muted px-3 py-1.5 text-xs font-medium text-muted-foreground">
                            <X className="h-3 w-3" /> Annulla
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex-1">
                          <div className="flex items-center gap-1.5">
                            <p className="font-medium text-card-foreground">{item.name}</p>
                            {"confirmed" in item && item.confirmed && (
                              <Check className="h-3.5 w-3.5 text-primary" />
                            )}
                          </div>
                          {item.notes && <p className="text-xs text-muted-foreground">{item.notes}</p>}
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="text-right">
                            <p className="font-semibold text-card-foreground">{formatCurrency(item.amount)}</p>
                            {item.toPay > 0 && (
                              <p className="text-xs text-accent">Da pagare: {formatCurrency(item.toPay)}</p>
                            )}
                          </div>
                          <div className="flex gap-1">
                            <button onClick={() => startEdit(item)} className="rounded p-1 text-muted-foreground hover:text-foreground hover:bg-muted">
                              <Pencil className="h-3.5 w-3.5" />
                            </button>
                            <button onClick={() => handleDelete(cat.id, item.id)} className="rounded p-1 text-muted-foreground hover:text-destructive hover:bg-muted">
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {addingTo === cat.id ? (
                  <div className="space-y-2 rounded-md bg-muted/50 p-2 mt-2">
                    <Input placeholder="Nome voce" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
                    <div className="grid grid-cols-2 gap-2">
                      <Input placeholder="Importo" type="number" value={form.amount} onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))} />
                      <Input placeholder="Pagato" type="number" value={form.paid} onChange={(e) => setForm((f) => ({ ...f, paid: e.target.value }))} />
                    </div>
                    <Input placeholder="Note (opzionale)" value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} />
                    <div className="flex gap-2">
                      <button onClick={() => handleAdd(cat.id)} className="flex items-center gap-1 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground">
                        <Check className="h-3 w-3" /> Aggiungi
                      </button>
                      <button onClick={resetForm} className="flex items-center gap-1 rounded-md bg-muted px-3 py-1.5 text-xs font-medium text-muted-foreground">
                        <X className="h-3 w-3" /> Annulla
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => { resetForm(); setAddingTo(cat.id); }}
                    className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-md border border-dashed border-border py-2 text-xs font-medium text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors"
                  >
                    <Plus className="h-3.5 w-3.5" /> Aggiungi voce
                  </button>
                )}
              </div>
            </CategoryCard>
          );
        })}
      </div>
    </div>
  );
}
