import { useState } from "react";
import { CategoryCard } from "@/components/CategoryCard";
import { getCategoryTotalWithIva, withIva, type CostItem } from "@/data/businessPlan";
import { formatCurrency } from "@/lib/format";
import { StatCard } from "@/components/StatCard";
import { Plus, Check, X, Pencil, Trash2, ChevronUp, ChevronDown, HandCoins } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useCostCategories } from "@/hooks/useBusinessData";

function CostItemForm({
  form, setForm, onSubmit, onCancel, submitLabel, showConfirmed,
}: {
  form: { name: string; amount: string; paid: string; toPay: string; notes: string; confirmed: boolean; anticipoPersona: string; anticipoImporto: string; ivaRate: string };
  setForm: React.Dispatch<React.SetStateAction<typeof form>>;
  onSubmit: () => void;
  onCancel: () => void;
  submitLabel: string;
  showConfirmed?: boolean;
}) {
  const amount = parseFloat(form.amount) || 0;
  const paid = parseFloat(form.paid) || 0;
  const autoToPay = Math.max(0, amount - paid);

  return (
    <div className="space-y-3 rounded-lg bg-muted/50 p-3">
      <Input placeholder="Nome voce" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
      <div className="grid grid-cols-3 gap-2">
        <div>
          <Label className="text-xs text-muted-foreground mb-1 block">Importo (€)</Label>
          <Input placeholder="0" type="number" value={form.amount} onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))} />
        </div>
        <div>
          <Label className="text-xs text-muted-foreground mb-1 block">Pagato (€)</Label>
          <Input placeholder="0" type="number" value={form.paid} onChange={(e) => setForm((f) => ({ ...f, paid: e.target.value }))} />
        </div>
        <div>
          <Label className="text-xs text-muted-foreground mb-1 block">Da pagare (€)</Label>
          <Input placeholder="auto" type="number" value={form.toPay || String(autoToPay)} onChange={(e) => setForm((f) => ({ ...f, toPay: e.target.value }))} />
        </div>
      </div>
      <div>
        <Label className="text-xs text-muted-foreground mb-1 block">Note / Dettagli</Label>
        <Textarea placeholder="Dettagli pagamento, fornitori, riferimenti..." value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} rows={2} />
      </div>
      {showConfirmed && (
        <div className="flex items-center gap-2">
          <Switch checked={form.confirmed} onCheckedChange={(v) => setForm((f) => ({ ...f, confirmed: v }))} />
          <Label className="text-sm">Confermato</Label>
        </div>
      )}
      <div className="flex items-center gap-2 mt-1">
        <Switch checked={parseFloat(form.ivaRate) > 0} onCheckedChange={(v) => setForm((f) => ({ ...f, ivaRate: v ? "10" : "0" }))} />
        <Label className="text-sm">IVA {parseFloat(form.ivaRate) > 0 ? `${form.ivaRate}%` : "esclusa"}</Label>
      </div>
        <Label className="text-xs font-semibold text-primary flex items-center gap-1"><HandCoins className="h-3 w-3" /> Anticipo</Label>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label className="text-xs text-muted-foreground mb-1 block">Chi anticipa</Label>
            <Input placeholder="Nome persona" value={form.anticipoPersona} onChange={(e) => setForm((f) => ({ ...f, anticipoPersona: e.target.value }))} />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground mb-1 block">Importo (€)</Label>
            <Input placeholder="0" type="number" value={form.anticipoImporto} onChange={(e) => setForm((f) => ({ ...f, anticipoImporto: e.target.value }))} />
          </div>
        </div>
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

function CostItemDetail({ item, onEdit, onDelete, onMoveUp, onMoveDown, isFirst, isLast }: { item: CostItem; onEdit: () => void; onDelete: () => void; onMoveUp?: () => void; onMoveDown?: () => void; isFirst?: boolean; isLast?: boolean }) {
  return (
    <div className="rounded-lg border border-border/50 bg-background/50 p-3 space-y-2">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-1.5">
          <p className="font-semibold text-card-foreground">{item.name}</p>
          {"confirmed" in item && item.confirmed && (
            <span className="inline-flex items-center gap-0.5 rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary">
              <Check className="h-3 w-3" /> Confermato
            </span>
          )}
        </div>
        <div className="flex gap-1">
          {!isFirst && onMoveUp && (
            <button onClick={onMoveUp} className="rounded p-1 text-muted-foreground hover:text-foreground hover:bg-muted">
              <ChevronUp className="h-3.5 w-3.5" />
            </button>
          )}
          {!isLast && onMoveDown && (
            <button onClick={onMoveDown} className="rounded p-1 text-muted-foreground hover:text-foreground hover:bg-muted">
              <ChevronDown className="h-3.5 w-3.5" />
            </button>
          )}
          <button onClick={onEdit} className="rounded p-1 text-muted-foreground hover:text-foreground hover:bg-muted">
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button onClick={onDelete} className="rounded p-1 text-muted-foreground hover:text-destructive hover:bg-muted">
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2 text-xs">
        <div className="rounded bg-muted/60 p-2">
          <p className="text-muted-foreground">Importo {item.ivaRate ? `+IVA ${item.ivaRate}%` : ""}</p>
          <p className="font-heading font-bold text-card-foreground">{formatCurrency(withIva(item.amount, item.ivaRate ?? 10))}</p>
          {(item.ivaRate ?? 10) > 0 && <p className="text-[10px] text-muted-foreground">Netto: {formatCurrency(item.amount)}</p>}
        </div>
        <div className="rounded bg-muted/60 p-2">
          <p className="text-muted-foreground">Pagato</p>
          <p className="font-heading font-bold text-primary">{formatCurrency(withIva(item.paid, item.ivaRate ?? 10))}</p>
        </div>
        <div className="rounded bg-muted/60 p-2">
          <p className="text-muted-foreground">Da pagare</p>
          <p className={`font-heading font-bold ${item.toPay > 0 ? "text-accent" : "text-card-foreground"}`}>
            {formatCurrency(withIva(item.toPay, item.ivaRate ?? 10))}
          </p>
        </div>
      </div>
      {item.notes && (
        <p className="text-xs text-muted-foreground bg-muted/40 rounded p-2 italic">{item.notes}</p>
      )}
      {item.anticipoPersona && item.anticipoImporto && item.anticipoImporto > 0 && (
        <div className="flex items-center gap-1.5 text-xs bg-primary/10 rounded p-2">
          <HandCoins className="h-3 w-3 text-primary" />
          <span className="text-primary font-medium">Anticipo: {formatCurrency(item.anticipoImporto)} da {item.anticipoPersona}</span>
        </div>
      )}
    </div>
  );
}

export default function CostiPage() {
  const { categories, loading, addItem, updateItem, deleteItem, moveItem } = useCostCategories();
  const [addingTo, setAddingTo] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const emptyForm = { name: "", amount: "", paid: "", toPay: "", notes: "", confirmed: false, anticipoPersona: "", anticipoImporto: "", ivaRate: "10" };
  const [form, setForm] = useState(emptyForm);

  const totals = categories.reduce(
    (acc, cat) => {
      const t = getCategoryTotalWithIva(cat);
      return { amount: acc.amount + t.amount, paid: acc.paid + t.paid, toPay: acc.toPay + t.toPay };
    },
    { amount: 0, paid: 0, toPay: 0 }
  );

  const resetForm = () => { setForm(emptyForm); setAddingTo(null); setEditingItem(null); };
  const isCachetCategory = (catId: string) => catId.startsWith("cachet");

  const handleAdd = async (catId: string) => {
    if (!form.name) return;
    const amount = parseFloat(form.amount) || 0;
    const paid = parseFloat(form.paid) || 0;
    const toPay = form.toPay ? parseFloat(form.toPay) : Math.max(0, amount - paid);
    await addItem(catId, {
      name: form.name,
      amount,
      paid,
      toPay,
      notes: form.notes || undefined,
      confirmed: isCachetCategory(catId) ? form.confirmed : undefined,
      anticipoPersona: form.anticipoPersona || undefined,
      anticipoImporto: parseFloat(form.anticipoImporto) || undefined,
    });
    resetForm();
  };

  const handleEdit = async (catId: string, itemId: string) => {
    if (!form.name) return;
    const amount = parseFloat(form.amount) || 0;
    const paid = parseFloat(form.paid) || 0;
    const toPay = form.toPay ? parseFloat(form.toPay) : Math.max(0, amount - paid);
    await updateItem(itemId, {
      name: form.name,
      amount,
      paid,
      toPay,
      notes: form.notes || undefined,
      confirmed: isCachetCategory(catId) ? form.confirmed : undefined,
      anticipoPersona: form.anticipoPersona || undefined,
      anticipoImporto: parseFloat(form.anticipoImporto) || undefined,
    });
    resetForm();
  };

  const handleDelete = async (catId: string, itemId: string) => {
    await deleteItem(itemId);
  };

  const startEdit = (item: CostItem) => {
    setEditingItem(item.id);
    setAddingTo(null);
    setForm({
      name: item.name,
      amount: String(item.amount),
      paid: String(item.paid),
      toPay: String(item.toPay),
      notes: item.notes || "",
      confirmed: item.confirmed || false,
      anticipoPersona: item.anticipoPersona || "",
      anticipoImporto: item.anticipoImporto ? String(item.anticipoImporto) : "",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen pb-24">
        <div className="bg-card px-4 pb-4 pt-12 border-b border-border">
          <h1 className="font-heading text-2xl font-bold text-foreground">Costi</h1>
        </div>
        <div className="flex items-center justify-center mt-20">
          <p className="text-muted-foreground">Caricamento...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24">
      <div className="bg-card px-4 pb-4 pt-12 border-b border-border">
        <h1 className="font-heading text-2xl font-bold text-foreground">Costi</h1>
        <p className="text-sm text-muted-foreground">Color Fest 14 — Edizione 2026</p>
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
                  ? "Nessuna voce — aggiungi dati"
                  : catTot.toPay > 0
                  ? `Da pagare: ${formatCurrency(catTot.toPay)}`
                  : "Saldato"
              }
              className={`[animation-delay:${i * 50}ms]`}
            >
              <div className="space-y-3">
                {cat.items.map((item, itemIdx) => (
                  <div key={item.id}>
                    {editingItem === item.id ? (
                      <CostItemForm
                        form={form}
                        setForm={setForm as any}
                        onSubmit={() => handleEdit(cat.id, item.id)}
                        onCancel={resetForm}
                        submitLabel="Salva"
                        showConfirmed={isCachetCategory(cat.id)}
                      />
                    ) : (
                      <CostItemDetail
                        item={item}
                        onEdit={() => startEdit(item)}
                        onDelete={() => handleDelete(cat.id, item.id)}
                        onMoveUp={() => moveItem(cat.id, item.id, "up")}
                        onMoveDown={() => moveItem(cat.id, item.id, "down")}
                        isFirst={itemIdx === 0}
                        isLast={itemIdx === cat.items.length - 1}
                      />
                    )}
                  </div>
                ))}

                {addingTo === cat.id ? (
                  <CostItemForm
                    form={form}
                    setForm={setForm as any}
                    onSubmit={() => handleAdd(cat.id)}
                    onCancel={resetForm}
                    submitLabel="Aggiungi"
                    showConfirmed={isCachetCategory(cat.id)}
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
