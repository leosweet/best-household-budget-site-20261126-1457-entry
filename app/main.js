// Hearth Ledger — the router and the interactions. The pages in views.js are pure
// templates; this file owns the state (the family's records plus anything the user
// changes, kept in this browser's localStorage) and wires every control up.
//
//   #/                dashboard
//   #/transactions    ledger, search, filter, add, delete
//   #/budgets         plan per category, editable
//   #/bills           due dates, mark paid
//   #/goals           savings goals, contribute, add a goal
//   #/planner         50/30/20 sliders and a find-$200 list
//   #/reports         six-month trend, comparisons, lessons
//
// window.__shotReady is false while a page renders and true once it is on screen,
// so a screenshot script knows when to capture.

import { bills as seedBills, categories as seedCats, goals as seedGoals, household, income as seedIncome, months, tips, transactions as seedTxs } from './data.js';
import { budgetsPage, billsPage, dashboard, goalsPage, missing, plannerPage, reportsPage, transactionsPage } from './views.js';
import { money0 } from './planner.js';

const STORE_KEY = 'hearth-ledger-v1';
const app = document.getElementById('app');

function loadOverrides() {
  try {
    return JSON.parse(localStorage.getItem(STORE_KEY) || '{}');
  } catch {
    return {};
  }
}

function saveOverrides(o) {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(o));
  } catch {
    // Private mode or storage full: the site still works for this visit.
  }
}

let overrides = loadOverrides();
let month = household.month;
const filter = { q: '', category: '' };

function buildState() {
  const deleted = new Set(overrides.deletedIds || []);
  const txs = [
    ...seedTxs.filter((t) => !deleted.has(t.id)),
    ...((overrides.addedTx || []).filter((t) => !deleted.has(t.id))),
  ].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
  const cats = seedCats.map((c) => ({
    ...c,
    planned: overrides.budgetPlan && overrides.budgetPlan[c.id] != null ? overrides.budgetPlan[c.id] : c.planned,
  }));
  const bills = seedBills.map((b) => ({
    ...b,
    paid: overrides.billPaid && overrides.billPaid[b.id] != null ? overrides.billPaid[b.id] : b.paid,
  }));
  const goals = [
    ...seedGoals.map((g) => ({
      ...g,
      saved: g.saved + ((overrides.goalExtra && overrides.goalExtra[g.id]) || 0),
    })),
    ...(overrides.addedGoals || []),
  ];
  return { month, txs, cats, bills, goals, incomeRows: seedIncome, months, tips };
}

function route() {
  const hash = location.hash || '#/';
  if (hash.startsWith('#/transactions')) return 'transactions';
  if (hash.startsWith('#/budgets')) return 'budgets';
  if (hash.startsWith('#/bills')) return 'bills';
  if (hash.startsWith('#/goals')) return 'goals';
  if (hash.startsWith('#/planner')) return 'planner';
  if (hash.startsWith('#/reports')) return 'reports';
  return 'dashboard';
}

const pages = {
  dashboard,
  transactions: (s) => transactionsPage(s, filter),
  budgets: budgetsPage,
  bills: billsPage,
  goals: goalsPage,
  planner: plannerPage,
  reports: reportsPage,
};

function render() {
  window.__shotReady = false;
  const name = route();
  const state = buildState();
  const fn = pages[name] || missing;
  document.title = `${name === 'dashboard' ? 'Hearth Ledger' : name[0].toUpperCase() + name.slice(1)} | Hearth Ledger`;
  app.innerHTML = fn(state);
  document.querySelectorAll('[data-nav]').forEach((a) => {
    a.classList.toggle('active', a.dataset.nav === name);
  });
  window.scrollTo(0, 0);
  window.__shotReady = true;
}

function rerenderKeepSearchFocus() {
  const q = document.getElementById('f-search');
  render();
  const again = document.getElementById('f-search');
  if (again && q) {
    again.focus();
    again.setSelectionRange(again.value.length, again.value.length);
  }
}

// One delegated listener for every button the pages render.
app.addEventListener('click', (event) => {
  const el = event.target.closest('[data-action]');
  if (!el) return;
  const action = el.dataset.action;
  if (action === 'set-month') {
    month = el.dataset.month;
    render();
  } else if (action === 'toggle-bill') {
    overrides.billPaid = overrides.billPaid || {};
    const seed = seedBills.find((b) => b.id === el.dataset.id);
    const current = overrides.billPaid[el.dataset.id] != null ? overrides.billPaid[el.dataset.id] : seed.paid;
    overrides.billPaid[el.dataset.id] = !current;
    saveOverrides(overrides);
    render();
  } else if (action === 'contribute') {
    overrides.goalExtra = overrides.goalExtra || {};
    overrides.goalExtra[el.dataset.id] = (overrides.goalExtra[el.dataset.id] || 0) + Number(el.dataset.amount);
    saveOverrides(overrides);
    render();
  } else if (action === 'delete-tx') {
    if (!window.confirm('Delete this transaction?')) return;
    overrides.deletedIds = [...(overrides.deletedIds || []), el.dataset.id];
    overrides.addedTx = (overrides.addedTx || []).filter((t) => t.id !== el.dataset.id);
    saveOverrides(overrides);
    render();
  }
});

// Forms and inputs, delegated so they survive every re-render.
app.addEventListener('submit', (event) => {
  event.preventDefault();
  const form = event.target;
  if (form.id === 'add-tx') {
    const data = new FormData(form);
    const amount = Number(data.get('amount'));
    if (!Number.isFinite(amount) || amount <= 0) return;
    overrides.addedTx = overrides.addedTx || [];
    overrides.addedTx.push({
      id: 'u' + Date.now(),
      month,
      date: String(data.get('date') || month + '-26'),
      payee: String(data.get('payee') || 'Untitled').slice(0, 80),
      category: String(data.get('category') || 'misc'),
      amount: Math.round(amount * 100) / 100,
      kind: String(data.get('kind') || 'out'),
    });
    saveOverrides(overrides);
    render();
  } else if (form.id === 'add-goal') {
    const data = new FormData(form);
    const target = Number(data.get('target'));
    if (!Number.isFinite(target) || target <= 0) return;
    overrides.addedGoals = overrides.addedGoals || [];
    overrides.addedGoals.push({
      id: 'u' + Date.now(),
      name: String(data.get('name') || 'New goal').slice(0, 60),
      target: Math.round(target),
      saved: 0,
      note: 'Added by the family.',
    });
    saveOverrides(overrides);
    render();
  } else if (form.classList.contains('budget-form')) {
    const input = form.querySelector('input');
    const planned = Number(input.value);
    if (!Number.isFinite(planned) || planned < 0) return;
    overrides.budgetPlan = overrides.budgetPlan || {};
    overrides.budgetPlan[form.dataset.cat] = Math.round(planned);
    saveOverrides(overrides);
    render();
  }
});

app.addEventListener('input', (event) => {
  const el = event.target;
  if (el.id === 'f-search') {
    filter.q = el.value;
    rerenderKeepSearchFocus();
  } else if (el.id === 'take-home' || el.dataset.split) {
    updatePlanner();
  }
});

app.addEventListener('change', (event) => {
  if (event.target.id === 'f-filter-cat') {
    filter.category = event.target.value;
    render();
  }
});

// Planner sliders: the three shares always add to 100%. Moving needs or wants
// moves the savings share to match; moving savings moves wants to match.
function updatePlanner() {
  const takeHome = Number(document.getElementById('take-home')?.value) || 0;
  const needs = document.getElementById('sl-needs');
  const wants = document.getElementById('sl-wants');
  const savings = document.getElementById('sl-savings');
  if (!needs || !wants || !savings) return;
  const changed = document.activeElement;
  if (changed === needs || changed === wants) {
    savings.value = String(Math.max(5, Math.min(40, 100 - Number(needs.value) - Number(wants.value))));
  } else if (changed === savings) {
    wants.value = String(Math.max(10, Math.min(50, 100 - Number(needs.value) - Number(savings.value))));
  }
  const label = document.getElementById('take-home-label');
  if (label) label.textContent = money0(takeHome);
  const set = (id, pct) => {
    const out = document.getElementById(id);
    if (out) out.textContent = `${pct}% · ${money0((takeHome * pct) / 100)}`;
  };
  set('out-needs', Number(needs.value));
  set('out-wants', Number(wants.value));
  set('out-savings', Number(savings.value));
}

window.addEventListener('hashchange', render);
render();
