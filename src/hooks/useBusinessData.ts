import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { defaultCostCategories, defaultRevenueCategories, type CostCategory, type CostItem, type RevenueCategory, type RevenueItem } from "@/data/businessPlan";

// Map DB rows into the category structure
function mapCostRows(rows: any[]): CostCategory[] {
  const cats = defaultCostCategories.map((c) => ({ ...c, items: [] as CostItem[] }));
  for (const row of rows) {
    const cat = cats.find((c) => c.id === row.category_id);
    if (cat) {
      cat.items.push({
        id: row.id,
        name: row.name,
        amount: Number(row.amount),
        paid: Number(row.paid),
        toPay: Number(row.to_pay),
        notes: row.notes || undefined,
        confirmed: row.confirmed,
        date: row.date || undefined,
      });
    }
  }
  return cats;
}

function mapRevenueRows(rows: any[]): RevenueCategory[] {
  const cats = defaultRevenueCategories.map((c) => ({ ...c, items: [] as RevenueItem[] }));
  for (const row of rows) {
    const cat = cats.find((c) => c.id === row.category_id);
    if (cat) {
      cat.items.push({
        id: row.id,
        name: row.name,
        estimated: Number(row.estimated),
        actual: Number(row.actual),
        notes: row.notes || undefined,
      });
    }
  }
  return cats;
}

export function useCostCategories() {
  const [categories, setCategories] = useState<CostCategory[]>(defaultCostCategories);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    const { data, error } = await supabase
      .from("cost_items")
      .select("*")
      .order("created_at", { ascending: true });
    if (!error && data && data.length > 0) {
      setCategories(mapCostRows(data));
    } else if (!error && data && data.length === 0) {
      // DB empty, keep defaults (will be seeded)
      setCategories(defaultCostCategories);
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const addItem = async (categoryId: string, item: Omit<CostItem, "id">) => {
    const { data, error } = await supabase.from("cost_items").insert({
      category_id: categoryId,
      name: item.name,
      amount: item.amount,
      paid: item.paid,
      to_pay: item.toPay,
      notes: item.notes || null,
      confirmed: item.confirmed || false,
      date: item.date || null,
    }).select().single();
    if (!error && data) {
      await fetchData();
      return data.id;
    }
    return null;
  };

  const updateItem = async (itemId: string, item: Partial<CostItem>) => {
    const updates: any = {};
    if (item.name !== undefined) updates.name = item.name;
    if (item.amount !== undefined) updates.amount = item.amount;
    if (item.paid !== undefined) updates.paid = item.paid;
    if (item.toPay !== undefined) updates.to_pay = item.toPay;
    if (item.notes !== undefined) updates.notes = item.notes || null;
    if (item.confirmed !== undefined) updates.confirmed = item.confirmed;
    if (item.date !== undefined) updates.date = item.date;

    const { error } = await supabase.from("cost_items").update(updates).eq("id", itemId);
    if (!error) await fetchData();
  };

  const deleteItem = async (itemId: string) => {
    const { error } = await supabase.from("cost_items").delete().eq("id", itemId);
    if (!error) await fetchData();
  };

  return { categories, loading, addItem, updateItem, deleteItem, refetch: fetchData };
}

export function useRevenueCategories() {
  const [categories, setCategories] = useState<RevenueCategory[]>(defaultRevenueCategories);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    const { data, error } = await supabase
      .from("revenue_items")
      .select("*")
      .order("created_at", { ascending: true });
    if (!error && data && data.length > 0) {
      setCategories(mapRevenueRows(data));
    } else if (!error && data && data.length === 0) {
      setCategories(defaultRevenueCategories);
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const addItem = async (categoryId: string, item: Omit<RevenueItem, "id">) => {
    const { data, error } = await supabase.from("revenue_items").insert({
      category_id: categoryId,
      name: item.name,
      estimated: item.estimated,
      actual: item.actual,
      notes: item.notes || null,
    }).select().single();
    if (!error && data) {
      await fetchData();
      return data.id;
    }
    return null;
  };

  const updateItem = async (itemId: string, item: Partial<RevenueItem>) => {
    const updates: any = {};
    if (item.name !== undefined) updates.name = item.name;
    if (item.estimated !== undefined) updates.estimated = item.estimated;
    if (item.actual !== undefined) updates.actual = item.actual;
    if (item.notes !== undefined) updates.notes = item.notes || null;

    const { error } = await supabase.from("revenue_items").update(updates).eq("id", itemId);
    if (!error) await fetchData();
  };

  const deleteItem = async (itemId: string) => {
    const { error } = await supabase.from("revenue_items").delete().eq("id", itemId);
    if (!error) await fetchData();
  };

  return { categories, loading, addItem, updateItem, deleteItem, refetch: fetchData };
}
