import { useState } from "react";
import { CategoryCard } from "@/components/CategoryCard";
import { defaultRevenueCategories, getRevenueCategoryTotal, type RevenueCategory, type RevenueItem } from "@/data/businessPlan";
import { formatCurrency } from "@/lib/format";
import { StatCard } from "@/components/StatCard";
import { Plus, Check, X, Pencil, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

function RevenueItemForm({
  form,
  setForm,
  onSubmit,
  onCancel,
  submitLabel,
}: {
  form: { name: string; estimated: string; actual: string; notes: string };
  setForm: React.Dispatch<React.SetStateAction<typeof form>>;
  onSubmit: () => void;
  onCancel: () => void;
  submitLabel: string;
}) {
  return (
    <div className="space-y-3 rounded-lg bg-muted/50 p-3">
      <Input placeholder="Nome voce" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label className="text-xs text-muted-foreground mb-1 block">Stimato (€)</Label>
          <Input placeholder="0" type="number" value={form.estimated} onChange={(e) => setForm((f) => ({ ...f, estimated: e.target.value }))} />
        </div>
        <div>
          <Label className="text-xs text-muted-foreground mb-1 block">Effettivo (€)</Label>
          <Input placeholder="0" type="number" value={form.actual} onChange={(e) => setForm((f) => ({ ...f, actual: e.target.value }))} />
        </div>
      </div>
      <div>
        <Label className="text-xs text-muted-foreground mb-1 block">Note / Dettagli</Label>
        <Textarea placeholder="Dettagli incasso, riferimenti, stato..." value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} rows={2} />
      </div>
      <div className="flex gap-2">
        <button onClick={onSubmit} className="flex items-center gap-1 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground">
          <Check className="h-3 w-3" /> {submitLabel}
        </button>
        <button onClick={onCancel} className="flex items-center gap-1 rounded-md bg-muted px-3 py-1.5 text-xs font-medium text-muted-foreground">
          <X className="h-3 w-3" /> Annulla
        </button>
      </div>
    </div>
  );
}

function RevenueItemDetail({ item, onEdit, onDelete }: { item: RevenueItem; onEdit: () => void; onDelete: () => void }) {
  return (
    <div className="rounded-lg border border-border/50 bg-background/50 p-3 space-y-2">
      <div className="flex items-start justify-between">
        <p className="font-semibold text-card-foreground">{item.name}</p>
        <div className="flex gap-1">
          <button onClick={onEdit} className="rounded p-1 text-muted-foreground hover:text-foreground hover:bg-muted">
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button onClick={onDelete} className="rounded p-1 text-muted-foreground hover:text-destructive hover:bg-muted">
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="rounded bg-muted/60 p-2">
          <p className="text-muted-foreground">Stimato</p>
          <p className="font-heading font-bold text-card-foreground">{formatCurrency(item.estimated)}</p>
        </div>
        <div className="rounded bg-muted/60 p-2">
          <p className="text-muted-foreground">Effettivo</p>
          <p className="font-heading font-bold text-primary">{formatCurrency(item.actual)}</p>
        </div>
      </div>
      {item.notes && (
        <p className="text-xs text-muted-foreground bg-muted/40 rounded p-2 italic">{item.notes}</p>
      )}
    </div>
  );
}

export default function EntratePage() {
  const [categories, setCategories] = useState<RevenueCategory[]>(defaultRevenueCategories);
  const [addingTo, setAddingTo] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const emptyForm = { name: "", estimated: "", actual: "", notes: "" };
  const [form, setForm] = useState(emptyForm);

  const totals = categories.reduce(
    (acc, cat) => {
      const t = getRevenueCategoryTotal(cat);
      return { estimated: acc.estimated + t.estimated, actual: acc.actual + t.actual };
    },
    { estimated: 0, actual: 0 }
  );

  const resetForm = () => {
    setForm(emptyForm);
    setAddingTo(null);
    setEditingItem(null);
  };

  const handleAdd = (catId: string) => {
    if (!form.name) return;
    const newItem: RevenueItem = {
      id: `new_${Date.now()}`,
      name: form.name,
      estimated: parseFloat(form.estimated) || 0,
      actual: parseFloat(form.actual) || 0,
      notes: form.notes || undefined,
    };
    setCategories((prev) =>
      prev.map((c) => (c.id === catId ? { ...c, items: [...c.items, newItem] } : c))
    );
    resetForm();
  };

  const handleEdit = (catId: string, itemId: string) => {
    if (!form.name) return;
    setCategories((prev) =>
      prev.map((c) =>
        c.id === catId
          ? {
              ...c,
              items: c.items.map((item) =>
                item.id === itemId
                  ? { ...item, name: form.name, estimated: parseFloat(form.estimated) || 0, actual: parseFloat(form.actual) || 0, notes: form.notes || undefined }
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

  const startEdit = (item: RevenueItem) => {
    setEditingItem(item.id);
    setAddingTo(null);
    setForm({ name: item.name, estimated: String(item.estimated), actual: String(item.actual), notes: item.notes || "" });
  };

  return (
    <div className="min-h-screen pb-24">
      <div className="bg-card px-4 pb-4 pt-12 border-b border-border">
        <h1 className="font-heading text-2xl font-bold text-foreground">Entrate</h1>
        <p className="text-sm text-muted-foreground">Color Fest 14 — Edizione 2025</p>
      </div>

      <div className="mx-auto max-w-lg px-4 mt-4 space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <StatCard label="Stimate" value={formatCurrency(totals.estimated)} variant="default" />
          <StatCard label="Effettive" value={formatCurrency(totals.actual)} variant="success" />
        </div>

        {categories.map((cat, i) => {
          const catTot = getRevenueCategoryTotal(cat);
          return (
            <CategoryCard
              key={cat.id}
              icon={cat.icon}
              label={cat.label}
              total={formatCurrency(catTot.actual)}
              subtitle={cat.items.length === 0 ? "Nessuna voce — aggiungi dati" : `Stimato: ${formatCurrency(catTot.estimated)}`}
              className={`[animation-delay:${i * 50}ms]`}
            >
              <div className="space-y-3">
                {cat.items.map((item) => (
                  <div key={item.id}>
                    {editingItem === item.id ? (
                      <RevenueItemForm
                        form={form}
                        setForm={setForm as any}
                        onSubmit={() => handleEdit(cat.id, item.id)}
                        onCancel={resetForm}
                        submitLabel="Salva"
                      />
                    ) : (
                      <RevenueItemDetail
                        item={item}
                        onEdit={() => startEdit(item)}
                        onDelete={() => handleDelete(cat.id, item.id)}
                      />
                    )}
                  </div>
                ))}

                {addingTo === cat.id ? (
                  <RevenueItemForm
                    form={form}
                    setForm={setForm as any}
                    onSubmit={() => handleAdd(cat.id)}
                    onCancel={resetForm}
                    submitLabel="Aggiungi"
                  />
                ) : (
                  <button
                    onClick={() => { resetForm(); setAddingTo(cat.id); }}
                    className="mt-1 flex w-full items-center justify-center gap-1.5 rounded-md border border-dashed border-border py-2.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors"
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
