export interface CostItem {
  id: string;
  name: string;
  amount: number;
  paid: number;
  toPay: number;
  notes?: string;
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

// Color Fest 13 data as reference for Color Fest 14
export const costCategories: CostCategory[] = [
  {
    id: "cachet",
    label: "Cachet Artisti",
    icon: "🎤",
    items: [
      { id: "c1", name: "Lucio Corsi", amount: 22000, paid: 22000, toPay: 0 },
      { id: "c2", name: "Marco Castello", amount: 16500, paid: 16500, toPay: 0 },
      { id: "c3", name: "Isaac Delusion", amount: 4400, paid: 4400, toPay: 0 },
      { id: "c4", name: "Delicatoni", amount: 2200, paid: 2200, toPay: 0 },
      { id: "c5", name: "Anna and Vulkan", amount: 1650, paid: 1650, toPay: 0 },
      { id: "c6", name: "Fenoaltea", amount: 780, paid: 780, toPay: 0 },
      { id: "c7", name: "Joan Thiele", amount: 13200, paid: 13200, toPay: 0 },
      { id: "c8", name: "Chalk", amount: 3850, paid: 3850, toPay: 0 },
      { id: "c9", name: "Dissidio", amount: 800, paid: 800, toPay: 0 },
      { id: "c10", name: "MACE", amount: 16500, paid: 16500, toPay: 0 },
      { id: "c11", name: "Giorgio Poi", amount: 8800, paid: 8800, toPay: 0 },
      { id: "c12", name: "OKgiorgio", amount: 12100, paid: 12100, toPay: 0 },
      { id: "c13", name: "Murder Capital", amount: 25300, paid: 25300, toPay: 0 },
      { id: "c14", name: "Mind Enterprises", amount: 3500, paid: 3500, toPay: 0 },
      { id: "c15", name: "Shame", amount: 22000, paid: 22000, toPay: 0 },
      { id: "c16", name: "Ekkstacy", amount: 5500, paid: 5500, toPay: 0 },
      { id: "c17", name: "Offlaga Disco", amount: 11000, paid: 11000, toPay: 0 },
      { id: "c18", name: "Populous", amount: 2460, paid: 2460, toPay: 0 },
      { id: "c19", name: "Marley", amount: 1500, paid: 1500, toPay: 0 },
      { id: "c20", name: "Contest", amount: 750, paid: 750, toPay: 0 },
      { id: "c21", name: "DJ Set", amount: 850, paid: 850, toPay: 0, notes: "Giustra + Robertino" },
      { id: "c22", name: "VJ", amount: 500, paid: 500, toPay: 0 },
    ],
  },
  {
    id: "alloggi",
    label: "Alloggi & Vitto",
    icon: "🏨",
    items: [
      { id: "a1", name: "Alloggi Band + Staff", amount: 15352, paid: 15352, toPay: 0, notes: "Grand Hotel Lamezia + T-Hotel" },
      { id: "a2", name: "Vitto Band + Staff + Catering", amount: 4345, paid: 4345, toPay: 0 },
      { id: "a3", name: "Catering", amount: 3500, paid: 1482, toPay: 2018 },
      { id: "a4", name: "B&B Pineta Mare (Staff)", amount: 6500, paid: 4000, toPay: 2500 },
      { id: "a5", name: "Vitto Staff", amount: 500, paid: 500, toPay: 0 },
    ],
  },
  {
    id: "tecnico",
    label: "Service Tecnico",
    icon: "🔊",
    items: [
      { id: "t1", name: "Bertucci (Audio/Luci/Palchi)", amount: 30000, paid: 20050, toPay: 9950 },
      { id: "t2", name: "Marco Mix", amount: 30000, paid: 4000, toPay: 26000 },
      { id: "t3", name: "Backline", amount: 4308, paid: 4308, toPay: 0 },
      { id: "t4", name: "Guaglianone", amount: 10736, paid: 10736, toPay: 0 },
      { id: "t5", name: "Assicurazione Palco", amount: 4054, paid: 4054, toPay: 0 },
      { id: "t6", name: "Impresa Elettrica", amount: 16100, paid: 11100, toPay: 5000 },
    ],
  },
  {
    id: "staff",
    label: "Staff & Collaboratori",
    icon: "👥",
    items: [
      { id: "s1", name: "Ciccio D'Amico + 2", amount: 2450, paid: 2450, toPay: 0 },
      { id: "s2", name: "Laura", amount: 700, paid: 854, toPay: 0 },
      { id: "s3", name: "Ufficio Stampa", amount: 3120, paid: 3120, toPay: 0 },
      { id: "s4", name: "Pippo Calleri", amount: 2500, paid: 0, toPay: 2500 },
      { id: "s5", name: "Barmen & Responsabili Bar", amount: 4695, paid: 4695, toPay: 0 },
      { id: "s6", name: "Foto/Video Team", amount: 1900, paid: 1900, toPay: 0 },
      { id: "s7", name: "Altro Staff", amount: 8820, paid: 8820, toPay: 0 },
    ],
  },
  {
    id: "sicurezza",
    label: "Sicurezza & Sanitario",
    icon: "🛡️",
    items: [
      { id: "sec1", name: "Security", amount: 19000, paid: 19000, toPay: 0 },
      { id: "sec2", name: "Ingegnere", amount: 5500, paid: 3550, toPay: 2000 },
      { id: "sec3", name: "Ingegnere Acustico", amount: 500, paid: 500, toPay: 0 },
      { id: "sec4", name: "Croce Rossa + Medico", amount: 2170, paid: 450, toPay: 1720 },
      { id: "sec5", name: "Anti Incendio", amount: 2800, paid: 2800, toPay: 0 },
    ],
  },
  {
    id: "allestimenti",
    label: "Allestimenti",
    icon: "🎪",
    items: [
      { id: "al1", name: "Bagni Chimici", amount: 4197, paid: 4197, toPay: 0 },
      { id: "al2", name: "Portale", amount: 3050, paid: 3050, toPay: 0 },
      { id: "al3", name: "Stampe (banner, braccialetti)", amount: 3025, paid: 3590, toPay: 0 },
      { id: "al4", name: "Merch Produzione", amount: 2579, paid: 2579, toPay: 0 },
      { id: "al5", name: "Gazebo", amount: 8466, paid: 8466, toPay: 0 },
      { id: "al6", name: "Facchini", amount: 5580, paid: 5580, toPay: 0 },
    ],
  },
  {
    id: "altro",
    label: "Altro",
    icon: "📦",
    items: [
      { id: "o1", name: "SIAE", amount: 10000, paid: 0, toPay: 10000 },
      { id: "o2", name: "Pubblicità", amount: 7000, paid: 7000, toPay: 0 },
      { id: "o3", name: "Spesa Bar (Eurodrink)", amount: 20370, paid: 14925, toPay: 5445 },
      { id: "o4", name: "Cristian Romeo", amount: 1750, paid: 1750, toPay: 0 },
      { id: "o5", name: "Camping Ulisse", amount: 4160, paid: 1130, toPay: 3030 },
      { id: "o6", name: "Materiali Vari", amount: 4316, paid: 4316, toPay: 0 },
    ],
  },
];

export const revenueCategories: RevenueCategory[] = [
  {
    id: "biglietti",
    label: "Biglietti",
    icon: "🎫",
    items: [
      { id: "b1", name: "Giorno 1", estimated: 92500, actual: 69107 },
      { id: "b2", name: "Abbonamento 12-13", estimated: 0, actual: 26538 },
      { id: "b3", name: "Giorno 2", estimated: 55500, actual: 41292 },
      { id: "b4", name: "Abbonamento 13-14", estimated: 0, actual: 6923 },
      { id: "b5", name: "Giorno 3", estimated: 37000, actual: 19211 },
      { id: "b6", name: "Abbonamento Full", estimated: 0, actual: 31207 },
    ],
  },
  {
    id: "bar",
    label: "Bar & Food",
    icon: "🍺",
    items: [
      { id: "bar1", name: "Bar POS", estimated: 40500, actual: 72693 },
      { id: "bar2", name: "Bar Cash", estimated: 18000, actual: 20440 },
      { id: "bar3", name: "Food", estimated: 8000, actual: 0 },
    ],
  },
  {
    id: "sponsor",
    label: "Sponsor",
    icon: "🤝",
    items: [
      { id: "sp1", name: "Sponsor PagoPA", estimated: 5500, actual: 5000 },
      { id: "sp2", name: "Velo", estimated: 14500, actual: 14500 },
      { id: "sp3", name: "Sardanelli", estimated: 4880, actual: 4880 },
      { id: "sp4", name: "Forst", estimated: 5260, actual: 5260 },
      { id: "sp5", name: "Suzuki", estimated: 15000, actual: 15000 },
      { id: "sp6", name: "PM Servizi (Merch)", estimated: 1624, actual: 1624 },
    ],
  },
  {
    id: "altro_entrate",
    label: "Altro",
    icon: "💰",
    items: [
      { id: "ae1", name: "Merch", estimated: 1000, actual: 1000 },
      { id: "ae2", name: "Contest", estimated: 7000, actual: 7000 },
      { id: "ae3", name: "Bando Regione", estimated: 98000, actual: 0, notes: "Da ricevere" },
      { id: "ae4", name: "Saldo Valdesi", estimated: 4400, actual: 4400 },
      { id: "ae5", name: "Fondo Cassa", estimated: 25000, actual: 25000 },
      { id: "ae6", name: "Bando 2024 (saldo)", estimated: 29940, actual: 0, notes: "Da ricevere" },
      { id: "ae7", name: "Bando Camera di Commercio", estimated: 12000, actual: 0, notes: "Da ricevere" },
    ],
  },
];

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
