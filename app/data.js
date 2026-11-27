// Hearth Ledger — the Harper family's own records. Every figure on the site comes
// from here: no network, no placeholder numbers. November 2026 is the current month;
// October 2026 is kept so the dashboard can compare the two months.

export const household = {
  name: 'The Harper household',
  members: 'Maya & Tom Harper, Leo (9) and June (6)',
  home: 'A three-bedroom house in Maplewood',
  month: '2026-11',
  monthLabel: 'November 2026',
  prevMonth: '2026-10',
  prevMonthLabel: 'October 2026',
};

export const income = [
  { month: '2026-11', source: "Maya's salary — school office manager", amount: 4600 },
  { month: '2026-11', source: "Tom's salary — bus mechanic", amount: 2850 },
  { month: '2026-11', source: 'Tom’s weekend repair jobs', amount: 400 },
  { month: '2026-10', source: "Maya's salary — school office manager", amount: 4600 },
  { month: '2026-10', source: "Tom's salary — bus mechanic", amount: 2850 },
  { month: '2026-10', source: 'Tom’s weekend repair jobs', amount: 200 },
];

// Monthly plan per category. `group` drives the 50/30/20 split: needs / wants / savings.
export const categories = [
  { id: 'housing', name: 'Housing', planned: 1850, group: 'needs', note: 'Mortgage, tax and insurance escrow' },
  { id: 'groceries', name: 'Groceries', planned: 720, group: 'needs', note: 'Weekly shop at GreenMart' },
  { id: 'utilities', name: 'Utilities', planned: 310, group: 'needs', note: 'Power, water, internet, phones' },
  { id: 'transport', name: 'Transport', planned: 420, group: 'needs', note: 'Fuel, bus passes, car upkeep' },
  { id: 'kids', name: 'Kids & school', planned: 380, group: 'needs', note: 'After-school club, lunches, supplies' },
  { id: 'health', name: 'Health', planned: 220, group: 'needs', note: 'Pharmacy, dentist, glasses fund' },
  { id: 'dining', name: 'Dining out', planned: 260, group: 'wants', note: 'Friday pizza + one meal out' },
  { id: 'fun', name: 'Fun & streaming', planned: 180, group: 'wants', note: 'Streaming, games, family outings' },
  { id: 'clothing', name: 'Clothing', planned: 150, group: 'wants', note: 'Kids grow fast; buy second-hand first' },
  { id: 'home', name: 'Home & garden', planned: 200, group: 'wants', note: 'Small repairs and the garden' },
  { id: 'misc', name: 'Everyday misc', planned: 160, group: 'wants', note: 'Gifts, haircuts, odds and ends' },
  { id: 'savings', name: 'Savings', planned: 1200, group: 'savings', note: 'Auto-transfer on payday' },
];

export const transactions = [
  // November 2026 — money out, newest first
  { id: 't41', month: '2026-11', date: '2026-11-26', payee: 'GreenMart weekly shop', category: 'groceries', amount: 148.20, kind: 'out' },
  { id: 't40', month: '2026-11', date: '2026-11-25', payee: 'Metro Transit — bus passes', category: 'transport', amount: 96.00, kind: 'out' },
  { id: 't39', month: '2026-11', date: '2026-11-24', payee: 'Riverside Pharmacy', category: 'health', amount: 42.50, kind: 'out' },
  { id: 't38', month: '2026-11', date: '2026-11-23', payee: 'Maple Cinema — family film', category: 'fun', amount: 38.00, kind: 'out' },
  { id: 't37', month: '2026-11', date: '2026-11-22', payee: 'GreenMart weekly shop', category: 'groceries', amount: 132.75, kind: 'out' },
  { id: 't36', month: '2026-11', date: '2026-11-21', payee: 'City Power — electricity', category: 'utilities', amount: 141.80, kind: 'out' },
  { id: 't35', month: '2026-11', date: '2026-11-21', payee: 'Shell — fuel', category: 'transport', amount: 58.40, kind: 'out' },
  { id: 't34', month: '2026-11', date: '2026-11-20', payee: 'Pizza Friday — Tony’s', category: 'dining', amount: 34.50, kind: 'out' },
  { id: 't33', month: '2026-11', date: '2026-11-19', payee: 'After-school club — Leo & June', category: 'kids', amount: 120.00, kind: 'out' },
  { id: 't32', month: '2026-11', date: '2026-11-18', payee: 'Water Board', category: 'utilities', amount: 63.90, kind: 'out' },
  { id: 't31', month: '2026-11', date: '2026-11-17', payee: 'Thrift store — winter coats', category: 'clothing', amount: 54.00, kind: 'out' },
  { id: 't30', month: '2026-11', date: '2026-11-15', payee: 'GreenMart weekly shop', category: 'groceries', amount: 141.30, kind: 'out' },
  { id: 't29', month: '2026-11', date: '2026-11-15', payee: 'NorthNet internet', category: 'utilities', amount: 79.00, kind: 'out' },
  { id: 't28', month: '2026-11', date: '2026-11-14', payee: 'Hardware store — tap washers', category: 'home', amount: 23.60, kind: 'out' },
  { id: 't27', month: '2026-11', date: '2026-11-13', payee: 'Pizza Friday — Tony’s', category: 'dining', amount: 31.00, kind: 'out' },
  { id: 't26', month: '2026-11', date: '2026-11-12', payee: 'Dentist — June check-up', category: 'health', amount: 65.00, kind: 'out' },
  { id: 't25', month: '2026-11', date: '2026-11-11', payee: 'Shell — fuel', category: 'transport', amount: 61.20, kind: 'out' },
  { id: 't24', month: '2026-11', date: '2026-11-08', payee: 'GreenMart weekly shop', category: 'groceries', amount: 127.40, kind: 'out' },
  { id: 't23', month: '2026-11', date: '2026-11-07', payee: 'Garden centre — bulbs', category: 'home', amount: 41.90, kind: 'out' },
  { id: 't22', month: '2026-11', date: '2026-11-06', payee: 'Pizza Friday — Tony’s', category: 'dining', amount: 29.75, kind: 'out' },
  { id: 't21', month: '2026-11', date: '2026-11-05', payee: 'School lunches — November', category: 'kids', amount: 110.00, kind: 'out' },
  { id: 't20', month: '2026-11', date: '2026-11-04', payee: 'Streaming — StreamBox + music', category: 'fun', amount: 27.98, kind: 'out' },
  { id: 't19', month: '2026-11', date: '2026-11-03', payee: 'Haircuts — Tom & Leo', category: 'misc', amount: 36.00, kind: 'out' },
  { id: 't18', month: '2026-11', date: '2026-11-02', payee: 'Shell — fuel', category: 'transport', amount: 55.60, kind: 'out' },
  { id: 't17', month: '2026-11', date: '2026-11-01', payee: 'Mortgage — First Maple Bank', category: 'housing', amount: 1850.00, kind: 'out' },
  { id: 't16', month: '2026-11', date: '2026-11-01', payee: 'Auto-transfer to savings', category: 'savings', amount: 1200.00, kind: 'out' },
  { id: 't15', month: '2026-11', date: '2026-11-01', payee: 'GreenMart weekly shop', category: 'groceries', amount: 118.90, kind: 'out' },
  // November money in
  { id: 't14', month: '2026-11', date: '2026-11-01', payee: "Maya's salary", category: 'income', amount: 4600.00, kind: 'in' },
  { id: 't13', month: '2026-11', date: '2026-11-01', payee: "Tom's salary", category: 'income', amount: 2850.00, kind: 'in' },
  { id: 't12', month: '2026-11', date: '2026-11-14', payee: 'Tom’s weekend repair jobs', category: 'income', amount: 400.00, kind: 'in' },
  // October 2026 — the full month, for the month comparison
  { id: 'o16', month: '2026-10', date: '2026-10-29', payee: 'GreenMart weekly shop', category: 'groceries', amount: 146.80, kind: 'out' },
  { id: 't11', month: '2026-10', date: '2026-10-28', payee: 'GreenMart weekly shop', category: 'groceries', amount: 139.10, kind: 'out' },
  { id: 'o15', month: '2026-10', date: '2026-10-27', payee: 'Shell — fuel', category: 'transport', amount: 59.90, kind: 'out' },
  { id: 'o14', month: '2026-10', date: '2026-10-26', payee: 'Pizza Friday — Tony’s', category: 'dining', amount: 32.50, kind: 'out' },
  { id: 't10', month: '2026-10', date: '2026-10-24', payee: 'Pizza Friday — Tony’s', category: 'dining', amount: 33.00, kind: 'out' },
  { id: 'o13', month: '2026-10', date: '2026-10-23', payee: 'NorthMobile phones', category: 'utilities', amount: 112.00, kind: 'out' },
  { id: 'o12', month: '2026-10', date: '2026-10-22', payee: 'School lunches — October', category: 'kids', amount: 110.00, kind: 'out' },
  { id: 't09', month: '2026-10', date: '2026-10-21', payee: 'City Power — electricity', category: 'utilities', amount: 158.30, kind: 'out' },
  { id: 'o11', month: '2026-10', date: '2026-10-19', payee: 'Dentist — Tom check-up', category: 'health', amount: 85.00, kind: 'out' },
  { id: 'o10', month: '2026-10', date: '2026-10-17', payee: 'GreenMart weekly shop', category: 'groceries', amount: 147.30, kind: 'out' },
  { id: 'o09', month: '2026-10', date: '2026-10-16', payee: 'Car insurance — SafeDrive', category: 'transport', amount: 186.00, kind: 'out' },
  { id: 't08', month: '2026-10', date: '2026-10-15', payee: 'GreenMart weekly shop', category: 'groceries', amount: 152.60, kind: 'out' },
  { id: 'o08', month: '2026-10', date: '2026-10-14', payee: 'StreamBox + music', category: 'fun', amount: 27.98, kind: 'out' },
  { id: 'o07', month: '2026-10', date: '2026-10-12', payee: 'Water Board', category: 'utilities', amount: 61.40, kind: 'out' },
  { id: 'o06', month: '2026-10', date: '2026-10-10', payee: 'GreenMart weekly shop', category: 'groceries', amount: 144.20, kind: 'out' },
  { id: 'o05', month: '2026-10', date: '2026-10-09', payee: 'NorthNet internet', category: 'utilities', amount: 79.00, kind: 'out' },
  { id: 't07', month: '2026-10', date: '2026-10-08', payee: 'Shell — fuel', category: 'transport', amount: 63.80, kind: 'out' },
  { id: 'o04', month: '2026-10', date: '2026-10-06', payee: 'Pizza Friday — Tony’s', category: 'dining', amount: 30.75, kind: 'out' },
  { id: 't06', month: '2026-10', date: '2026-10-05', payee: 'After-school club — Leo & June', category: 'kids', amount: 120.00, kind: 'out' },
  { id: 'o03', month: '2026-10', date: '2026-10-03', payee: 'Haircuts — Maya & June', category: 'misc', amount: 38.00, kind: 'out' },
  { id: 'o02', month: '2026-10', date: '2026-10-02', payee: 'Shell — fuel', category: 'transport', amount: 57.30, kind: 'out' },
  { id: 'o01', month: '2026-10', date: '2026-10-02', payee: 'Halloween costumes — Leo & June', category: 'misc', amount: 64.50, kind: 'out' },
  { id: 't05', month: '2026-10', date: '2026-10-01', payee: 'Mortgage — First Maple Bank', category: 'housing', amount: 1850.00, kind: 'out' },
  { id: 't04', month: '2026-10', date: '2026-10-01', payee: 'Auto-transfer to savings', category: 'savings', amount: 1200.00, kind: 'out' },
  { id: 't03', month: '2026-10', date: '2026-10-01', payee: "Maya's salary", category: 'income', amount: 4600.00, kind: 'in' },
  { id: 't02', month: '2026-10', date: '2026-10-01', payee: "Tom's salary", category: 'income', amount: 2850.00, kind: 'in' },
  { id: 't01', month: '2026-10', date: '2026-10-20', payee: 'Tom’s weekend repair jobs', category: 'income', amount: 200.00, kind: 'in' },
];

export const bills = [
  { id: 'b01', name: 'Mortgage — First Maple Bank', amount: 1850.00, due: '2026-11-01', autopay: true, paid: true },
  { id: 'b02', name: 'Auto-transfer to savings', amount: 1200.00, due: '2026-11-01', autopay: true, paid: true },
  { id: 'b03', name: 'City Power — electricity', amount: 141.80, due: '2026-11-12', autopay: false, paid: true },
  { id: 'b04', name: 'NorthNet internet', amount: 79.00, due: '2026-11-15', autopay: true, paid: true },
  { id: 'b05', name: 'Water Board', amount: 63.90, due: '2026-11-18', autopay: false, paid: true },
  { id: 'b06', name: 'Car insurance — SafeDrive', amount: 186.00, due: '2026-11-21', autopay: true, paid: true },
  { id: 'b07', name: 'Phones — NorthMobile (2 lines)', amount: 112.00, due: '2026-11-24', autopay: true, paid: true },
  { id: 'b08', name: 'Gym — Maple Fitness', amount: 45.00, due: '2026-11-27', autopay: true, paid: false },
  { id: 'b09', name: 'StreamBox + music', amount: 27.98, due: '2026-11-28', autopay: true, paid: false },
  { id: 'b10', name: 'Credit card — Maple Rewards', amount: 412.35, due: '2026-11-29', autopay: false, paid: false },
  { id: 'b11', name: 'Home insurance — SafeDrive', amount: 98.00, due: '2026-12-02', autopay: true, paid: false },
];

export const goals = [
  { id: 'g1', name: 'Emergency fund', target: 10000, saved: 6450, note: 'Three months of essentials, for a broken boiler or a lost job.' },
  { id: 'g2', name: 'Summer holiday — the coast', target: 2400, saved: 1180, note: 'A week by the sea in July; $40 a week gets us there.' },
  { id: 'g3', name: 'Leo’s new bike', target: 520, saved: 310, note: 'Leo outgrew his last bike in September.' },
  { id: 'g4', name: 'Kitchen refresh', target: 3000, saved: 640, note: 'Paint, new handles and a second-hand table.' },
];

// Six months of totals, for the trend chart in Reports. October and November are
// the sums of the transaction records above (money out, savings transfer included);
// June–September are the family's kept monthly totals.
export const months = [
  { month: '2026-06', label: 'Jun', income: 7450, spent: 5980 },
  { month: '2026-07', label: 'Jul', income: 7450, spent: 6410 },
  { month: '2026-08', label: 'Aug', income: 7650, spent: 6230 },
  { month: '2026-09', label: 'Sep', income: 7650, spent: 5890 },
  { month: '2026-10', label: 'Oct', income: 7650, spent: 5099 },
  { month: '2026-11', label: 'Nov', income: 7850, spent: 4929 },
];

export const tips = [
  { title: 'Pay yourself first', body: 'The $1,200 savings transfer leaves on payday, before any spending. What never lands in the current account never gets spent.' },
  { title: 'One shop, one list', body: 'Groceries run $51 under plan this month. A list and a single weekly shop beat three top-up trips — the top-ups are where the snacks creep in.' },
  { title: 'The Friday pizza rule', body: 'Pizza Friday costs about $32 a week and the kids love it. It stays — the budget protects the fun things, it does not ban them.' },
  { title: 'Check the autopays', body: 'Four bills leave by autopay. Once a month, open each one and check the amount — a price rise hides in autopay.' },
];
