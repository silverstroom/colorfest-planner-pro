import { useState, useEffect } from "react";
import { CategoryCard } from "@/components/CategoryCard";
import { getRevenueCategoryTotal, type RevenueItem } from "@/data/businessPlan";
import { formatCurrency } from "@/lib/format";
import { StatCard } from "@/components/StatCard";
import { Plus, Check, X, Pencil, Trash2, RefreshCw, Ticket, ExternalLink, ChevronUp, ChevronDown, TrendingUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useRevenueCategories } from "@/hooks/useBusinessData";

// Types for DICE data
interface DiceTicketType {
  name: string;
  price: number;
  count: number;
  revenue: number;
}

interface DiceEvent {
  id: string;
  name: string;
  startDatetime: string;
  endDatetime: string;
  url: string;
  totalAllocation: number;
  totalSold: number;
  totalRevenue: number;
  ticketTypes: DiceTicketType[];
}

interface DiceData {
  events: DiceEvent[];
  totals: { totalSold: number; totalAllocation: number; totalRevenue: number };
}

// --- Shared form components ---

function RevenueItemForm({
  form, setForm, onSubmit, onCancel, submitLabel,
}: {
  form: { name: string; estimated: string; actual: string; notes: string; isEstimate: boolean };
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
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={form.isEstimate}
          onChange={(e) => setForm((f) => ({ ...f, isEstimate: e.target.checked }))}
          className="rounded border-border h-4 w-4 accent-primary"
        />
        <span className="text-xs font-medium text-muted-foreground flex items-center gap-1">
          <TrendingUp className="h-3 w-3" /> Stima incasso (previsione)
        </span>
      </label>
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
    <div className={`rounded-lg border p-3 space-y-2 ${item.isEstimate ? 'border-accent bg-accent/10' : 'border-border/50 bg-background/50'}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <p className="font-semibold text-card-foreground">{item.name}</p>
          {item.isEstimate && (
            <span className="inline-flex items-center gap-1 rounded-full bg-accent/20 px-2 py-0.5 text-[10px] font-medium text-accent-foreground">
              <TrendingUp className="h-2.5 w-2.5" /> Stima
            </span>
          )}
        </div>
        <div className="flex gap-1">
          <button onClick={onEdit} className="rounded p-1 text-muted-foreground hover:text-foreground hover:bg-muted"><Pencil className="h-3.5 w-3.5" /></button>
          <button onClick={onDelete} className="rounded p-1 text-muted-foreground hover:text-destructive hover:bg-muted"><Trash2 className="h-3.5 w-3.5" /></button>
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
      {item.notes && <p className="text-xs text-muted-foreground bg-muted/40 rounded p-2 italic">{item.notes}</p>}
    </div>
  );
}

// --- DICE Section ---

function DiceSection({ diceData, loading, error, onRefresh }: {
  diceData: DiceData | null;
  loading: boolean;
  error: string | null;
  onRefresh: () => void;
}) {
  const [expanded, setExpanded] = useState(false);

  if (loading) {
    return (
      <div className="rounded-lg bg-card shadow-sm p-4 animate-pulse">
        <div className="flex items-center gap-2 mb-3">
          <Ticket className="h-5 w-5 text-primary" />
          <span className="font-heading font-semibold text-card-foreground">Biglietti DICE</span>
        </div>
        <div className="h-20 bg-muted rounded" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg bg-card shadow-sm p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Ticket className="h-5 w-5 text-destructive" />
            <span className="font-heading font-semibold text-card-foreground">Biglietti DICE</span>
          </div>
          <button onClick={onRefresh} className="rounded p-1 text-muted-foreground hover:text-foreground">
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
        <p className="text-sm text-destructive">{error}</p>
      </div>
    );
  }

  if (!diceData) return null;

  return (
    <div className="rounded-lg bg-card shadow-sm overflow-hidden">
      <button onClick={() => setExpanded(!expanded)} className="flex w-full items-center justify-between p-4 text-left">
        <div className="flex items-center gap-2">
          <Ticket className="h-5 w-5 text-primary" />
          <div>
            <p className="font-heading font-semibold text-card-foreground">Biglietti DICE — Live</p>
            <p className="text-xs text-muted-foreground">{diceData.totals.totalSold} venduti • {formatCurrency(diceData.totals.totalRevenue)}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={(e) => { e.stopPropagation(); onRefresh(); }} className="rounded p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
            <RefreshCw className="h-4 w-4" />
          </button>
          {expanded ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
        </div>
      </button>

      {expanded && (
        <div className="border-t border-border px-4 pb-4 pt-3 space-y-3">
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="rounded bg-muted/60 p-2 text-center">
              <p className="text-muted-foreground">Venduti</p>
              <p className="font-heading text-lg font-bold text-primary">{diceData.totals.totalSold}</p>
            </div>
            <div className="rounded bg-muted/60 p-2 text-center">
              <p className="text-muted-foreground">Allocazione</p>
              <p className="font-heading text-lg font-bold text-card-foreground">{diceData.totals.totalAllocation.toLocaleString()}</p>
            </div>
            <div className="rounded bg-muted/60 p-2 text-center">
              <p className="text-muted-foreground">Incasso</p>
              <p className="font-heading text-lg font-bold text-primary">{formatCurrency(diceData.totals.totalRevenue)}</p>
            </div>
          </div>

          {diceData.events.map((event) => (
            <div key={event.id} className="rounded-lg border border-border/50 bg-background/50 p-3 space-y-2">
              <div className="flex items-start justify-between">
                <p className="font-semibold text-sm text-card-foreground">{event.name}</p>
                <a href={event.url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="rounded bg-muted/60 p-2">
                  <p className="text-muted-foreground">Venduti</p>
                  <p className="font-heading font-bold text-card-foreground">{event.totalSold}</p>
                </div>
                <div className="rounded bg-muted/60 p-2">
                  <p className="text-muted-foreground">Allocazione</p>
                  <p className="font-heading font-bold text-card-foreground">{event.totalAllocation.toLocaleString()}</p>
                </div>
                <div className="rounded bg-muted/60 p-2">
                  <p className="text-muted-foreground">Incasso</p>
                  <p className="font-heading font-bold text-primary">{formatCurrency(event.totalRevenue)}</p>
                </div>
              </div>
              {event.ticketTypes.length > 0 && (
                <div className="space-y-1">
                  {event.ticketTypes.map((tt, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{tt.name}</span>
                      <span>{tt.count} × {formatCurrency(tt.price)} = {formatCurrency(tt.revenue)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function EntratePage() {
  const { categories, loading, addItem, updateItem, deleteItem } = useRevenueCategories();
  const [addingTo, setAddingTo] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const emptyForm = { name: "", estimated: "", actual: "", notes: "", isEstimate: false };
  const [form, setForm] = useState(emptyForm);

  const [diceData, setDiceData] = useState<DiceData | null>(null);
  const [diceLoading, setDiceLoading] = useState(true);
  const [diceError, setDiceError] = useState<string | null>(null);

  const fetchDice = async () => {
    setDiceLoading(true);
    setDiceError(null);
    try {
      const { data, error } = await supabase.functions.invoke('dice-sales');
      if (error) throw new Error(error.message);
      if (!data?.success) throw new Error(data?.error || 'Errore sconosciuto');
      setDiceData({ events: data.events, totals: data.totals });
    } catch (e: any) {
      setDiceError(e.message);
    } finally {
      setDiceLoading(false);
    }
  };

  useEffect(() => { fetchDice(); }, []);

  const totals = categories.reduce(
    (acc, cat) => {
      const t = getRevenueCategoryTotal(cat);
      return { estimated: acc.estimated + t.estimated, actual: acc.actual + t.actual };
    },
    { estimated: 0, actual: 0 }
  );

  const totalWithDice = {
    estimated: totals.estimated,
    actual: totals.actual + (diceData?.totals.totalRevenue || 0),
  };

  const resetForm = () => { setForm(emptyForm); setAddingTo(null); setEditingItem(null); };

  const handleAdd = async (catId: string) => {
    if (!form.name) return;
    await addItem(catId, {
      name: form.name,
      estimated: parseFloat(form.estimated) || 0,
      actual: parseFloat(form.actual) || 0,
      notes: form.notes || undefined,
      isEstimate: form.isEstimate,
    });
    resetForm();
  };

  const handleEdit = async (catId: string, itemId: string) => {
    if (!form.name) return;
    await updateItem(itemId, {
      name: form.name,
      estimated: parseFloat(form.estimated) || 0,
      actual: parseFloat(form.actual) || 0,
      notes: form.notes || undefined,
      isEstimate: form.isEstimate,
    });
    resetForm();
  };

  const handleDelete = async (catId: string, itemId: string) => {
    await deleteItem(itemId);
  };

  const startEdit = (item: RevenueItem) => {
    setEditingItem(item.id); setAddingTo(null);
    setForm({ name: item.name, estimated: String(item.estimated), actual: String(item.actual), notes: item.notes || "", isEstimate: item.isEstimate || false });
  };

  if (loading) {
    return (
      <div className="min-h-screen pb-24">
        <div className="bg-card px-4 pb-4 pt-12 border-b border-border">
          <h1 className="font-heading text-2xl font-bold text-foreground">Entrate</h1>
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
        <h1 className="font-heading text-2xl font-bold text-foreground">Entrate</h1>
        <p className="text-sm text-muted-foreground">Color Fest 14 — Edizione 2026</p>
      </div>

      <div className="mx-auto max-w-lg px-4 mt-4 space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <StatCard label="Stimate" value={formatCurrency(totalWithDice.estimated)} variant="default" />
          <StatCard label="Effettive" value={formatCurrency(totalWithDice.actual)} variant="success" />
        </div>

        <DiceSection diceData={diceData} loading={diceLoading} error={diceError} onRefresh={fetchDice} />

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
                      <RevenueItemForm form={form} setForm={setForm as any} onSubmit={() => handleEdit(cat.id, item.id)} onCancel={resetForm} submitLabel="Salva" />
                    ) : (
                      <RevenueItemDetail item={item} onEdit={() => startEdit(item)} onDelete={() => handleDelete(cat.id, item.id)} />
                    )}
                  </div>
                ))}
                {addingTo === cat.id ? (
                  <RevenueItemForm form={form} setForm={setForm as any} onSubmit={() => handleAdd(cat.id)} onCancel={resetForm} submitLabel="Aggiungi" />
                ) : (
                  <button onClick={() => { resetForm(); setAddingTo(cat.id); }} className="mt-1 flex w-full items-center justify-center gap-1.5 rounded-md border border-dashed border-border py-2.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors">
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
