// Hearth Ledger — the arithmetic. Every figure the pages show is computed here from
// the records in data.js, so the dashboard, budgets and reports can never disagree.

export const money = (n) =>
  '$' + Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export const money0 = (n) => '$' + Math.round(Number(n)).toLocaleString('en-US');

export const shortDate = (iso) => {
  const d = new Date(iso + 'T12:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

export function monthIncome(month, incomeRows) {
  return incomeRows.filter((r) => r.month === month).reduce((s, r) => s + r.amount, 0);
}

export function monthOut(month, txs) {
  return txs.filter((t) => t.month === month && t.kind === 'out').reduce((s, t) => s + t.amount, 0);
}

export function monthSpent(month, txs) {
  // Day-to-day spending: money out except the savings transfer.
  return txs
    .filter((t) => t.month === month && t.kind === 'out' && t.category !== 'savings')
    .reduce((s, t) => s + t.amount, 0);
}

export function monthSaved(month, txs) {
  return txs
    .filter((t) => t.month === month && t.kind === 'out' && t.category === 'savings')
    .reduce((s, t) => s + t.amount, 0);
}

export function categoryActual(month, txs, categoryId) {
  return txs
    .filter((t) => t.month === month && t.kind === 'out' && t.category === categoryId)
    .reduce((s, t) => s + t.amount, 0);
}

export function groupTotals(month, txs, cats) {
  // Needs / wants / savings, actuals against the 50/30/20 plan.
  const out = { needs: 0, wants: 0, savings: 0 };
  for (const c of cats) out[c.group] += categoryActual(month, txs, c.id);
  return out;
}

export function unpaidBillsTotal(billRows) {
  return billRows.filter((b) => !b.paid).reduce((s, b) => s + b.amount, 0);
}

// Money left after everything recorded, minus bills still to pay: what the family
// can still spend before the month ends without touching savings.
export function safeToSpend(month, txs, incomeRows, billRows) {
  const left = monthIncome(month, incomeRows) - monthOut(month, txs);
  return { left, unpaid: unpaidBillsTotal(billRows), safe: left - unpaidBillsTotal(billRows) };
}

// The 50/30/20 split for a take-home pay, and how the month's actuals compare.
export function fiftyThirtyTwenty(takeHome, actuals) {
  const plan = {
    needs: takeHome * 0.5,
    wants: takeHome * 0.3,
    savings: takeHome * 0.2,
  };
  return {
    plan,
    actual: actuals,
    diff: {
      needs: actuals.needs - plan.needs,
      wants: actuals.wants - plan.wants,
      savings: actuals.savings - plan.savings,
    },
  };
}

// Where a spare $200 could come from: categories furthest under plan this month.
export function findSavings(month, txs, cats, target = 200) {
  const picks = cats
    .filter((c) => c.group !== 'savings')
    .map((c) => ({ name: c.name, headroom: c.planned - categoryActual(month, txs, c.id) }))
    .filter((p) => p.headroom > 0)
    .sort((a, b) => b.headroom - a.headroom);
  let found = 0;
  const chosen = [];
  for (const p of picks) {
    if (found >= target) break;
    const take = Math.min(p.headroom, target - found);
    chosen.push({ name: p.name, take });
    found += take;
  }
  return { chosen, found };
}

export function savingsRate(month, txs, incomeRows) {
  const inc = monthIncome(month, incomeRows);
  return inc === 0 ? 0 : (monthSaved(month, txs) / inc) * 100;
}
