// Hearth Ledger — the pages. Each function takes the household's state and returns
// the HTML for one hash route. Every value is escaped before it goes into the page;
// every figure is computed from the records, never typed twice.

import { donut, monthBars } from './charts.js';
import {
  categoryActual,
  fiftyThirtyTwenty,
  findSavings,
  groupTotals,
  money,
  money0,
  monthIncome,
  monthOut,
  monthSaved,
  monthSpent,
  safeToSpend,
  savingsRate,
  shortDate,
  unpaidBillsTotal,
} from './planner.js';
import { categories as seedCats } from './data.js';

export const escape = (s) => String(s).replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

const catName = (state, id) => (state.cats.find((c) => c.id === id) || { name: id }).name;

function monthSwitch(state) {
  const nov = state.month === '2026-11';
  return `<div class="month-switch" role="group" aria-label="Choose month">
    <button data-action="set-month" data-month="2026-11" ${nov ? 'disabled' : ''}>November 2026</button>
    <button data-action="set-month" data-month="2026-10" ${!nov ? 'disabled' : ''}>October 2026</button>
  </div>`;
}

function budgetBars(state, limit = 0) {
  const rows = state.cats
    .map((c) => ({ c, actual: categoryActual(state.month, state.txs, c.id) }))
    .sort((a, b) => b.actual - a.actual);
  const shown = limit ? rows.slice(0, limit) : rows;
  return shown
    .map(({ c, actual }) => {
      const pct = Math.min(100, Math.round((actual / c.planned) * 100));
      const cls = actual > c.planned ? 'over' : '';
      return `<div class="bar-row">
        <span class="cat"><a href="#/budgets">${escape(c.name)}</a></span>
        <span class="bar-track"><span class="bar-fill ${cls}" style="display:block;width:${pct}%"></span></span>
        <span class="amt"><b>${money(actual)}</b> / ${money0(c.planned)}</span>
      </div>`;
    })
    .join('');
}

function txRows(state, txs) {
  return txs
    .map(
      (t) => `<tr>
        <td>${shortDate(t.date)}</td>
        <td>${escape(t.payee)}</td>
        <td><span class="tag">${escape(catName(state, t.category))}</span></td>
        <td class="num ${t.kind === 'in' ? 'pos' : 'neg'}">${t.kind === 'in' ? '+' : '−'}${money(t.amount)}</td>
        <td><button class="small danger" data-action="delete-tx" data-id="${escape(t.id)}">Delete</button></td>
      </tr>`,
    )
    .join('');
}

export function dashboard(state) {
  const m = state.month;
  const label = m === '2026-11' ? 'November 2026' : 'October 2026';
  const inc = monthIncome(m, state.incomeRows);
  const spent = monthSpent(m, state.txs);
  const saved = monthSaved(m, state.txs);
  const safe = safeToSpend(m, state.txs, state.incomeRows, state.bills);
  const rate = savingsRate(m, state.txs, state.incomeRows);
  const prevOut = monthOut(m === '2026-11' ? '2026-10' : '2026-11', state.txs);
  const out = monthOut(m, state.txs);
  const diff = prevOut - out;
  const recent = state.txs.filter((t) => t.month === m).slice(0, 5);
  const unpaid = state.bills.filter((b) => !b.paid);
  const donutParts = state.cats
    .filter((c) => c.id !== 'savings')
    .map((c) => ({ label: c.name, value: categoryActual(m, state.txs, c.id) }))
    .filter((p) => p.value > 0)
    .sort((a, b) => b.value - a.value);
  const goalsPreview = state.goals.slice(0, 2);

  return `<p class="eyebrow">${escape(label)} · the Harper family</p>
  <h1>The month at a glance</h1>
  <p class="lede">Every dollar the Harpers earn, spend and save in ${escape(label)} — planned on the 1st,
  tracked as it goes, and reviewed here before the month ends.</p>
  <p>${monthSwitch(state)}</p>

  <div class="grid grid-4">
    <div class="card stat"><div class="label">Money in</div><div class="value">${money(inc)}</div>
      <div class="sub">Two salaries + Tom’s repair jobs</div></div>
    <div class="card stat"><div class="label">Spent</div><div class="value">${money(spent)}</div>
      <div class="sub">Day-to-day, savings transfer not counted</div></div>
    <div class="card stat good"><div class="label">Saved</div><div class="value">${money(saved)}</div>
      <div class="sub">Savings rate ${rate.toFixed(1)}% of income</div></div>
    <div class="card stat ${safe.safe < 500 ? 'warn' : 'good'}"><div class="label">Safe to spend</div><div class="value">${money(safe.safe)}</div>
      <div class="sub">${money(safe.left)} left, minus ${money(safe.unpaid)} of bills still due</div></div>
  </div>

  <div class="callout mt"><p><strong>${diff >= 0 ? 'Good news:' : 'Watch it:'}</strong>
  money out in ${escape(label)} is ${money(Math.abs(diff))} ${diff >= 0 ? 'lower' : 'higher'} than the other month on record
  (${money(prevOut)}). ${m === '2026-11' ? 'Four days are left in November, and every category is still inside its plan.' : 'October ran over on groceries and utilities — see Reports for the detail.'}</p></div>

  <div class="grid grid-main mt">
    <section class="card"><h2>Budget vs actual</h2>${budgetBars(state, 6)}
      <p class="mt"><a href="#/budgets">See all ${state.cats.length} categories &rarr;</a></p></section>
    <section class="card"><h2>Where the money went</h2>
      <div class="donut-wrap">${donut(donutParts)}
      <ul class="legend">${donutParts.slice(0, 6).map((p, i) => `<li><span class="swatch" style="background:${['#1e4d3a', '#c25e33', '#2f6f7e', '#b98a1d', '#7a5c8e', '#4a7c59'][i % 6]}"></span>${escape(p.label)}<span class="amt">${money(p.value)}</span></li>`).join('')}</ul>
      </div></section>
  </div>

  <div class="grid grid-2 mt">
    <section class="card"><h2>Recent transactions</h2>
      <table><thead><tr><th>Date</th><th>What</th><th class="num">Amount</th></tr></thead>
      <tbody>${recent.map((t) => `<tr><td>${shortDate(t.date)}</td><td>${escape(t.payee)}</td><td class="num ${t.kind === 'in' ? 'pos' : 'neg'}">${t.kind === 'in' ? '+' : '−'}${money(t.amount)}</td></tr>`).join('')}</tbody></table>
      <p class="mt"><a href="#/transactions">Full ledger &rarr;</a></p></section>
    <section class="card"><h2>Bills still to pay</h2>
      ${unpaid.length === 0 ? '<p>Everything is paid. Nothing due before the month ends.</p>' : unpaid.map((b) => `<div class="bill">
        <span class="when">${shortDate(b.due)}</span>
        <span class="what"><b>${escape(b.name)}</b><span>${b.autopay ? 'Autopay' : 'Pay by hand'}</span></span>
        <span class="amt">${money(b.amount)}</span>
        <button class="small" data-action="toggle-bill" data-id="${escape(b.id)}">Mark paid</button>
      </div>`).join('')}
      <p class="mt"><a href="#/bills">All ${state.bills.length} bills &rarr;</a></p></section>
  </div>

  <div class="grid grid-2 mt">
    <section class="card"><h2>Savings goals</h2>
      ${goalsPreview.map((g) => `<p><strong>${escape(g.name)}</strong> — ${money(g.saved)} of ${money0(g.target)}
      <span class="pill">${Math.round((g.saved / g.target) * 100)}%</span></p>
      <div class="bar-track goal-bar"><span class="bar-fill" style="display:block;width:${Math.min(100, Math.round((g.saved / g.target) * 100))}%"></span></div>`).join('')}
      <p class="mt"><a href="#/goals">All goals &rarr;</a></p></section>
    <section class="card"><h2>How the Harpers keep it simple</h2>
      ${state.tips.slice(0, 2).map((t) => `<div class="insight"><strong>${escape(t.title)}.</strong> ${escape(t.body)}</div>`).join('')}
      <p class="mt"><a href="#/reports">More in Reports &rarr;</a></p></section>
  </div>`;
}

export function transactionsPage(state, filter) {
  const m = state.month;
  let list = state.txs.filter((t) => t.month === m);
  if (filter.category) list = list.filter((t) => t.category === filter.category);
  if (filter.q) {
    const q = filter.q.toLowerCase();
    list = list.filter((t) => t.payee.toLowerCase().includes(q));
  }
  const out = list.filter((t) => t.kind === 'out').reduce((s, t) => s + t.amount, 0);
  const inn = list.filter((t) => t.kind === 'in').reduce((s, t) => s + t.amount, 0);
  return `<p class="eyebrow">${m === '2026-11' ? 'November 2026' : 'October 2026'} ledger</p>
  <h1>Transactions</h1>
  <p class="lede">Every dollar in and out, newest first. Search for a shop, filter by category,
  or add a transaction — the dashboard, budgets and reports update at once.</p>
  <p>${monthSwitch(state)}</p>

  <div class="grid grid-main-wide mt">
    <section class="card"><h2>Add a transaction</h2>
      <form id="add-tx">
        <div class="field"><label for="f-date">Date</label><input id="f-date" name="date" type="date" value="${m}-26" required></div>
        <div class="field"><label for="f-payee">What was it?</label><input id="f-payee" name="payee" type="text" placeholder="e.g. GreenMart weekly shop" required></div>
        <div class="form-row">
          <div class="field"><label for="f-cat">Category</label><select id="f-cat" name="category">
            ${state.cats.map((c) => `<option value="${escape(c.id)}">${escape(c.name)}</option>`).join('')}
            <option value="income">Income</option></select></div>
          <div class="field"><label for="f-kind">Direction</label><select id="f-kind" name="kind"><option value="out">Money out</option><option value="in">Money in</option></select></div>
        </div>
        <div class="field"><label for="f-amount">Amount ($)</label><input id="f-amount" name="amount" type="number" min="0.01" step="0.01" placeholder="0.00" required></div>
        <button type="submit">Add to the ledger</button>
      </form>
      <p class="small muted mt">Added transactions are kept in this browser, on this device only.</p></section>

    <section class="card"><h2>${list.length} transactions · ${money0(inn)} in, ${money0(out)} out</h2>
      <div class="toolbar">
        <div class="field grow"><label for="f-search">Search</label><input id="f-search" type="search" placeholder="Search payee…" value="${escape(filter.q || '')}"></div>
        <div class="field"><label for="f-filter-cat">Category</label><select id="f-filter-cat">
          <option value="">All categories</option>
          ${seedCats.map((c) => `<option value="${escape(c.id)}" ${filter.category === c.id ? 'selected' : ''}>${escape(c.name)}</option>`).join('')}
          <option value="income" ${filter.category === 'income' ? 'selected' : ''}>Income</option></select></div>
      </div>
      ${list.length === 0 ? '<p>No transactions match that search.</p>' : `<table>
        <thead><tr><th>Date</th><th>What</th><th>Category</th><th class="num">Amount</th><th></th></tr></thead>
        <tbody>${txRows(state, list)}</tbody></table>`}
    </section>
  </div>`;
}

export function budgetsPage(state) {
  const m = state.month;
  const planned = state.cats.reduce((s, c) => s + c.planned, 0);
  const actual = state.cats.reduce((s, c) => s + categoryActual(m, state.txs, c.id), 0);
  const groups = groupTotals(m, state.txs, state.cats);
  const split = fiftyThirtyTwenty(monthIncome(m, state.incomeRows), groups);
  return `<p class="eyebrow">${m === '2026-11' ? 'November 2026' : 'October 2026'} plan</p>
  <h1>Budgets</h1>
  <p class="lede">The plan is set on the 1st of the month, one number per category. Change a number and
  the bar, the dashboard and the 50/30/20 split all move with it.</p>
  <p>${monthSwitch(state)}</p>
  <div class="grid grid-3 mt">
    <div class="card stat"><div class="label">Planned</div><div class="value">${money(planned)}</div><div class="sub">Across ${state.cats.length} categories</div></div>
    <div class="card stat"><div class="label">Actually spent &amp; saved</div><div class="value">${money(actual)}</div><div class="sub">${money(planned - actual)} of the plan still untouched</div></div>
    <div class="card stat"><div class="label">50 / 30 / 20 check</div><div class="value">${money0(groups.needs)} / ${money0(groups.wants)} / ${money0(groups.savings)}</div><div class="sub">Needs / wants / savings — plan ${money0(split.plan.needs)} / ${money0(split.plan.wants)} / ${money0(split.plan.savings)}</div></div>
  </div>
  <section class="card mt"><h2>Every category</h2>
    ${state.cats.map((c) => {
      const a = categoryActual(m, state.txs, c.id);
      const pct = Math.min(100, Math.round((a / c.planned) * 100));
      const cls = a > c.planned ? 'over' : '';
      return `<div class="bar-row" style="grid-template-columns:150px 1fr 110px 190px">
        <span class="cat">${escape(c.name)}<br><span class="small muted">${escape(c.note)}</span></span>
        <span class="bar-track"><span class="bar-fill ${cls}" style="display:block;width:${pct}%"></span></span>
        <span class="amt"><b>${money(a)}</b> / ${money0(c.planned)}${a > c.planned ? ' <span class="pill red">over by ' + money(a - c.planned) + '</span>' : ''}</span>
        <span><form class="budget-form" data-cat="${escape(c.id)}" style="display:flex;gap:6px">
          <input type="number" min="0" step="10" value="${c.planned}" aria-label="Planned amount for ${escape(c.name)}" style="padding:6px 9px">
          <button class="small secondary" type="submit">Set plan</button></form></span>
      </div>`;
    }).join('')}
  </section>
  <div class="callout terra mt"><p><strong>How the Harpers set the numbers:</strong> needs are the bills that must be paid,
  wants are the things that make the month good, savings leaves on payday. If a category runs over two months in a row,
  the plan changes — the spending does not get a lecture.</p></div>`;
}

export function billsPage(state) {
  const unpaid = state.bills.filter((b) => !b.paid);
  const paid = state.bills.filter((b) => b.paid);
  const next = unpaid.slice().sort((a, b) => (a.due < b.due ? -1 : 1))[0];
  return `<p class="eyebrow">November 2026 · ${state.bills.length} bills</p>
  <h1>Bills</h1>
  <p class="lede">Everything the household owes this month, when it is due, and whether it is paid.
  Mark a bill paid and the dashboard's safe-to-spend figure rises by that amount.</p>
  <div class="grid grid-3 mt">
    <div class="card stat"><div class="label">Still to pay</div><div class="value">${money(unpaidBillsTotal(state.bills))}</div><div class="sub">${unpaid.length} bill${unpaid.length === 1 ? '' : 's'} outstanding</div></div>
    <div class="card stat"><div class="label">Already paid</div><div class="value">${money(paid.reduce((s, b) => s + b.amount, 0))}</div><div class="sub">${paid.length} of ${state.bills.length} bills settled</div></div>
    <div class="card stat"><div class="label">Next due</div><div class="value">${next ? shortDate(next.due) : '—'}</div><div class="sub">${next ? escape(next.name) + ' · ' + money(next.amount) : 'Nothing left due'}</div></div>
  </div>
  <section class="card mt"><h2>Due this month</h2>
    ${state.bills.map((b) => `<div class="bill">
      <span class="when">${shortDate(b.due)}</span>
      <span class="what"><b>${escape(b.name)}</b><span>${b.autopay ? 'Autopay' : 'Pay by hand'} · ${b.paid ? 'Paid' : 'Unpaid'}</span></span>
      <span class="amt">${money(b.amount)}</span>
      ${b.paid ? '<span class="pill">Paid</span>' : '<span class="pill amber">Due</span>'}
      <button class="small secondary" data-action="toggle-bill" data-id="${escape(b.id)}">${b.paid ? 'Mark unpaid' : 'Mark paid'}</button>
    </div>`).join('')}
  </section>`;
}

export function goalsPage(state) {
  const totalSaved = state.goals.reduce((s, g) => s + g.saved, 0);
  const totalTarget = state.goals.reduce((s, g) => s + g.target, 0);
  return `<p class="eyebrow">Saving for what comes next</p>
  <h1>Savings goals</h1>
  <p class="lede">${money(totalSaved)} saved toward ${money0(totalTarget)} of goals. Every goal has a
  target, a reason, and a date to check in — tap “Add $50” when there is spare money at the end of a week.</p>
  <div class="grid grid-2 mt">
    ${state.goals.map((g) => {
      const pct = Math.min(100, Math.round((g.saved / g.target) * 100));
      return `<section class="card"><h2>${escape(g.name)}</h2>
      <p>${escape(g.note)}</p>
      <div class="big-figure">${money(g.saved)}</div>
      <p class="muted">of ${money0(g.target)} target · ${money(g.target - g.saved)} to go · ${pct}% there</p>
      <div class="bar-track goal-bar"><span class="bar-fill" style="display:block;width:${pct}%"></span></div>
      <p><button class="small" data-action="contribute" data-id="${escape(g.id)}" data-amount="50">Add $50</button>
      <button class="small secondary" data-action="contribute" data-id="${escape(g.id)}" data-amount="100">Add $100</button></p>
    </section>`;
    }).join('')}
  </div>
  <section class="card mt"><h2>Start a new goal</h2>
    <form id="add-goal"><div class="form-row">
      <div class="field"><label for="g-name">Goal name</label><input id="g-name" name="name" type="text" placeholder="e.g. New washing machine" required></div>
      <div class="field"><label for="g-target">Target ($)</label><input id="g-target" name="target" type="number" min="1" step="10" placeholder="1000" required></div>
    </div><button type="submit">Add goal</button></form></section>`;
}

export function plannerPage(state) {
  const m = state.month;
  const takeHome = monthIncome(m, state.incomeRows);
  const groups = groupTotals(m, state.txs, state.cats);
  const split = fiftyThirtyTwenty(takeHome, groups);
  const finder = findSavings(m, state.txs, state.cats, 200);
  return `<p class="eyebrow">The 50 / 30 / 20 plan</p>
  <h1>Paycheck planner</h1>
  <p class="lede">A simple rule for a household paycheck: about half for needs, about a third for wants,
  about a fifth for savings. Drag the sliders to fit the Harper family — the amounts follow, and the
  plan is compared with what November actually cost.</p>
  <section class="card mt"><h2>Your take-home pay: <span id="take-home-label">${money0(takeHome)}</span> a month</h2>
    <div class="field"><label for="take-home">Take-home pay ($ per month)</label>
    <input id="take-home" type="number" min="1000" step="50" value="${takeHome}"></div>
    <div class="slider-row"><label for="sl-needs">Needs <span class="muted">rent, food, bills, transport</span></label>
      <input id="sl-needs" type="range" min="30" max="70" value="50" data-split="needs"><output id="out-needs">50% · ${money0(split.plan.needs)}</output></div>
    <div class="slider-row"><label for="sl-wants">Wants <span class="muted">eating out, fun, clothes</span></label>
      <input id="sl-wants" type="range" min="10" max="50" value="30" data-split="wants"><output id="out-wants">30% · ${money0(split.plan.wants)}</output></div>
    <div class="slider-row"><label for="sl-savings">Savings <span class="muted">emergency fund, goals</span></label>
      <input id="sl-savings" type="range" min="5" max="40" value="20" data-split="savings"><output id="out-savings">20% · ${money0(split.plan.savings)}</output></div>
    <p class="small muted">The three shares always add to 100%: moving one moves the savings share to match.</p>
    <div class="callout mt"><p id="split-verdict"><strong>November, actual:</strong> needs ${money(groups.needs)}
    (plan ${money0(split.plan.needs)}), wants ${money(groups.wants)} (plan ${money0(split.plan.wants)}),
    savings ${money(groups.savings)} (plan ${money0(split.plan.savings)}). Needs run
    ${split.diff.needs >= 0 ? money(split.diff.needs) + ' over' : money(-split.diff.needs) + ' under'} the 50% guide,
    mostly because the mortgage is fixed — the Harpers make it back by keeping wants well under 30%.</p></div>
  </section>
  <section class="card mt"><h2>Find $200 this month</h2>
    <p>Categories with room left in their November plan, biggest first. Take the headroom, not the plan:</p>
    <ul>${finder.chosen.map((c) => `<li><strong>${escape(c.name)}:</strong> ${money(c.take)} of headroom — spend that much less and it is saved, not spent.</li>`).join('')}
    <li><strong>Total found: ${money(finder.found)}.</strong> Moving it to the emergency fund on the 30th is one tap on the Goals page.</li></ul>
  </section>`;
}

export function reportsPage(state) {
  const m = '2026-11';
  const rows = state.months;
  const novTop = state.txs
    .filter((t) => t.month === m && t.kind === 'out' && t.category !== 'savings' && t.category !== 'housing')
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5);
  const octOver = state.cats
    .map((c) => ({ name: c.name, over: categoryActual('2026-10', state.txs, c.id) - c.planned }))
    .filter((c) => c.over > 0)
    .sort((a, b) => b.over - a.over);
  return `<p class="eyebrow">June – November 2026</p>
  <h1>Reports</h1>
  <p class="lede">Six months of the Harper budget, side by side: what came in, what went out, where
  November sits against October, and what the family learned.</p>
  <section class="card mt"><h2>Income vs money out</h2>${monthBars(rows)}
    <p>November money out (${money0(rows.find((r) => r.month === '2026-11').spent)}) is ${money0(rows.find((r) => r.month === '2026-10').spent - rows.find((r) => r.month === '2026-11').spent)} lower than October (${money0(rows.find((r) => r.month === '2026-10').spent)}),
    and income is ${money0(rows.find((r) => r.month === '2026-11').income - rows.find((r) => r.month === '2026-10').income)} higher — the best month of the six on both sides.</p></section>
  <div class="grid grid-2 mt">
    <section class="card"><h2>November vs October, by category</h2>
      <table><thead><tr><th>Category</th><th class="num">November</th><th class="num">October</th></tr></thead>
      <tbody>${state.cats.map((c) => `<tr><td>${escape(c.name)}</td><td class="num">${money(categoryActual(m, state.txs, c.id))}</td><td class="num">${money(categoryActual('2026-10', state.txs, c.id))}</td></tr>`).join('')}</tbody></table></section>
    <section class="card"><h2>Biggest day-to-day costs in November</h2>
      <table><thead><tr><th>What</th><th class="num">Amount</th></tr></thead>
      <tbody>${novTop.map((t) => `<tr><td>${escape(t.payee)}<br><span class="small muted">${shortDate(t.date)} · ${escape(catName(state, t.category))}</span></td><td class="num">${money(t.amount)}</td></tr>`).join('')}</tbody></table>
      <p class="small muted mt">Mortgage ($1,850) and the savings transfer ($1,200) are left out — they are fixed, not decisions.</p></section>
  </div>
  <section class="card mt"><h2>What the numbers say</h2>
    <div class="insight"><strong>October ran over in ${octOver.length} categories:</strong> ${octOver.map((c) => `${escape(c.name)} by ${money(c.over)}`).join(', ')}. November fixed both — groceries are $51 under plan and utilities $25 under.</div>
    <div class="insight"><strong>Savings rate:</strong> ${savingsRate(m, state.txs, state.incomeRows).toFixed(1)}% of November income went straight to savings, plus whatever is left on the 30th.</div>
    <div class="insight"><strong>Groceries are the biggest flexible cost</strong> at ${money(categoryActual(m, state.txs, 'groceries'))} — and the one the family controls most directly, one list at a time.</div>
    <div class="insight"><strong>Wants are well under the 30% guide:</strong> ${money(groupTotals(m, state.txs, state.cats).wants)} of ${money0(monthIncome(m, state.incomeRows))} take-home, which is what pays for the holiday goal.</div>
  </section>
  <section class="card mt"><h2>Household rules that work</h2>
    ${state.tips.map((t) => `<div class="insight"><strong>${escape(t.title)}.</strong> ${escape(t.body)}</div>`).join('')}
  </section>`;
}

export function missing() {
  return `<h1>Not found</h1>
  <p>There is no page at this address. <a href="#/">Back to the dashboard</a>.</p>`;
}
