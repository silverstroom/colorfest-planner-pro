export interface CostItem {
  id: string;
  name: string;
  amount: number;
  paid: number;
  toPay: number;
  notes?: string;
  confirmed?: boolean;
  date?: string;
  anticipoPersona?: string;
  anticipoImporto?: number;
  ivaRate?: number; // percentage, default 10
}

// Calculate amount with IVA
export function withIva(amount: number, ivaRate: number = 10): number {
  return amount * (1 + ivaRate / 100);
}

// Get category total with IVA applied
export function getCategoryTotalWithIva(cat: CostCategory): { amount: number; paid: number; toPay: number } {
  return cat.items.reduce(
    (a, item) => {
      const iva = item.ivaRate ?? 10;
      return {
        amount: a.amount + withIva(item.amount, iva),
        paid: a.paid + withIva(item.paid, iva),
        toPay: a.toPay + withIva(item.toPay, iva),
      };
    },
    { amount: 0, paid: 0, toPay: 0 }
  );
}

export interface CostCategory {
  id: string;
  label: string;
  icon: string;
  items: CostItem[];
}

export interface RevenueItem {
  id: string;
  name: string;
  estimated: number;
  actual: number;
  notes?: string;
}

export interface RevenueCategory {
  id: string;
  label: string;
  icon: string;
  items: RevenueItem[];
}

// Color Fest 14 data
export const defaultCostCategories: CostCategory[] = [
  {
    id: "cachet_11ago",
    label: "Cachet 11 Agosto",
    icon: "🎤",
    items: [
      { id: "c1", name: "Apparat", amount: 35000, paid: 0, toPay: 35000, confirmed: true, date: "11 agosto" },
      { id: "c2", name: "C'mon Tigre", amount: 6000, paid: 0, toPay: 6000, confirmed: true, date: "11 agosto" },
      { id: "c3", name: "Gaia Banfi", amount: 1300, paid: 0, toPay: 1300, confirmed: true, date: "11 agosto" },
      { id: "c4", name: "Prima Stanza a Destra", amount: 5000, paid: 0, toPay: 5000, confirmed: true, date: "11 agosto" },
      { id: "c5", name: "James Holden + Zimpel", amount: 5500, paid: 0, toPay: 5500, confirmed: true, date: "11 agosto" },
      { id: "c6", name: "Marley", amount: 0, paid: 0, toPay: 0, confirmed: false, date: "11 agosto", notes: "Da definire" },
    ],
  },
  {
    id: "cachet_12ago",
    label: "Cachet 12 Agosto",
    icon: "🎤",
    items: [
      { id: "c7", name: "Zen Circus", amount: 15000, paid: 0, toPay: 15000, confirmed: true, date: "12 agosto", notes: "Fino a 1500 spettatori" },
      { id: "c8", name: "Yin Yin", amount: 6000, paid: 0, toPay: 6000, confirmed: true, date: "12 agosto" },
      { id: "c9", name: "Tutti Fenomeni", amount: 9000, paid: 0, toPay: 9000, confirmed: true, date: "12 agosto" },
      { id: "c10", name: "Nico Arezzo + Anna Castiglia", amount: 2000, paid: 0, toPay: 2000, confirmed: true, date: "12 agosto" },
      { id: "c11", name: "Marley", amount: 0, paid: 0, toPay: 0, confirmed: false, date: "12 agosto", notes: "Da definire" },
    ],
  },
  {
    id: "cachet_13ago",
    label: "Cachet 13 Agosto",
    icon: "🎤",
    items: [
      { id: "c12", name: "La Niña", amount: 30000, paid: 0, toPay: 30000, confirmed: true, date: "13 agosto" },
      { id: "c13", name: "Populous", amount: 2000, paid: 0, toPay: 2000, confirmed: true, date: "13 agosto" },
      { id: "c14", name: "Dimartino", amount: 5500, paid: 0, toPay: 5500, confirmed: true, date: "13 agosto" },
      { id: "c15", name: "Maimaimai", amount: 800, paid: 0, toPay: 800, confirmed: true, date: "13 agosto" },
      { id: "c16", name: "Dead Letters", amount: 5000, paid: 0, toPay: 5000, confirmed: true, date: "13 agosto" },
    ],
  },
  {
    id: "alloggi",
    label: "Alloggi & Vitto",
    icon: "🏨",
    items: [],
  },
  {
    id: "tecnico",
    label: "Service Tecnico",
    icon: "🔊",
    items: [],
  },
  {
    id: "staff",
    label: "Staff & Collaboratori",
    icon: "👥",
    items: [],
  },
  {
    id: "sicurezza",
    label: "Sicurezza & Sanitario",
    icon: "🛡️",
    items: [],
  },
  {
    id: "allestimenti",
    label: "Allestimenti",
    icon: "🎪",
    items: [],
  },
  {
    id: "altro",
    label: "Altro",
    icon: "📦",
    items: [],
  },
];

export const defaultRevenueCategories: RevenueCategory[] = [
  {
    id: "bar",
    label: "Bar & Food",
    icon: "🍺",
    items: [],
  },
  {
    id: "sponsor",
    label: "Sponsor",
    icon: "🤝",
    items: [],
  },
  {
    id: "altro_entrate",
    label: "Altro",
    icon: "💰",
    items: [],
  },
];

// Keep backward-compatible exports for pages that use them directly
export let costCategories = defaultCostCategories;
export let revenueCategories = defaultRevenueCategories;

export function getTotalCosts() {
  return costCategories.reduce(
    (acc, cat) => {
      const catTotal = cat.items.reduce(
        (a, item) => ({
          amount: a.amount + item.amount,
          paid: a.paid + item.paid,
          toPay: a.toPay + item.toPay,
        }),
        { amount: 0, paid: 0, toPay: 0 }
      );
      return {
        amount: acc.amount + catTotal.amount,
        paid: acc.paid + catTotal.paid,
        toPay: acc.toPay + catTotal.toPay,
      };
    },
    { amount: 0, paid: 0, toPay: 0 }
  );
}

export function getCategoryTotal(cat: CostCategory) {
  return cat.items.reduce(
    (a, item) => ({
      amount: a.amount + item.amount,
      paid: a.paid + item.paid,
      toPay: a.toPay + item.toPay,
    }),
    { amount: 0, paid: 0, toPay: 0 }
  );
}

export function getTotalRevenue() {
  return revenueCategories.reduce(
    (acc, cat) => {
      const catTotal = cat.items.reduce(
        (a, item) => ({
          estimated: a.estimated + item.estimated,
          actual: a.actual + item.actual,
        }),
        { estimated: 0, actual: 0 }
      );
      return {
        estimated: acc.estimated + catTotal.estimated,
        actual: acc.actual + catTotal.actual,
      };
    },
    { estimated: 0, actual: 0 }
  );
}

export function getRevenueCategoryTotal(cat: RevenueCategory) {
  return cat.items.reduce(
    (a, item) => ({
      estimated: a.estimated + item.estimated,
      actual: a.actual + item.actual,
    }),
    { estimated: 0, actual: 0 }
  );
}
