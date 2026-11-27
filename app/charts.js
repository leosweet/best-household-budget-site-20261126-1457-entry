// Hearth Ledger — small SVG charts, drawn from the family's figures. No library,
// no network: plain strings the pages drop into place.

const PALETTE = ['#1e4d3a', '#c25e33', '#2f6f7e', '#b98a1d', '#7a5c8e', '#4a7c59', '#a34d5e', '#5b7fa6'];

const escape = (s) => String(s).replace(/[&<>"]/g, (c) => `&#${c.charCodeAt(0)};`);

// Donut of spending by category (savings transfer left out: it is not spending).
export function donut(parts, size = 190) {
  const total = parts.reduce((s, p) => s + p.value, 0) || 1;
  const r = 70;
  const cx = size / 2;
  const cy = size / 2;
  let angle = -Math.PI / 2;
  const slices = parts.map((p, i) => {
    const frac = p.value / total;
    const a0 = angle;
    const a1 = angle + frac * Math.PI * 2;
    angle = a1;
    const large = frac > 0.5 ? 1 : 0;
    const x0 = cx + r * Math.cos(a0);
    const y0 = cy + r * Math.sin(a0);
    const x1 = cx + r * Math.cos(a1);
    const y1 = cy + r * Math.sin(a1);
    const d = `M ${cx} ${cy} L ${x0.toFixed(1)} ${y0.toFixed(1)} A ${r} ${r} 0 ${large} 1 ${x1.toFixed(1)} ${y1.toFixed(1)} Z`;
    return `<path d="${d}" fill="${PALETTE[i % PALETTE.length]}"><title>${escape(p.label)}: $${p.value.toFixed(0)}</title></path>`;
  });
  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" role="img" aria-label="Spending by category">
    ${slices.join('')}
    <circle cx="${cx}" cy="${cy}" r="42" fill="#fffdf8" />
    <text x="${cx}" y="${cy - 4}" text-anchor="middle" font-size="15" font-weight="700" fill="#22302a">$${Math.round(total).toLocaleString('en-US')}</text>
    <text x="${cx}" y="${cy + 15}" text-anchor="middle" font-size="11" fill="#6b756e">spent in Nov</text>
  </svg>`;
}

// Grouped bars: income vs money out, one pair per month.
export function monthBars(monthRows, height = 210) {
  const w = 560;
  const max = Math.max(...monthRows.map((m) => Math.max(m.income, m.spent))) * 1.08;
  const gap = w / monthRows.length;
  const bw = 26;
  const base = height - 26;
  const bars = monthRows
    .map((m, i) => {
      const x = i * gap + gap / 2;
      const ih = (m.income / max) * (height - 50);
      const sh = (m.spent / max) * (height - 50);
      return `<g>
      <rect x="${(x - bw - 3).toFixed(1)}" y="${(base - ih).toFixed(1)}" width="${bw}" height="${ih.toFixed(1)}" rx="3" fill="#1e4d3a"><title>${m.label} income $${m.income.toLocaleString('en-US')}</title></rect>
      <rect x="${(x + 3).toFixed(1)}" y="${(base - sh).toFixed(1)}" width="${bw}" height="${sh.toFixed(1)}" rx="3" fill="#c25e33"><title>${m.label} money out $${m.spent.toLocaleString('en-US')}</title></rect>
      <text x="${x.toFixed(1)}" y="${height - 8}" text-anchor="middle" font-size="12" fill="#6b756e">${m.label}</text>
    </g>`;
    })
    .join('');
  return `<svg width="100%" viewBox="0 0 ${w} ${height}" role="img" aria-label="Income and spending by month">
    <line x1="0" y1="${base}" x2="${w}" y2="${base}" stroke="#e4dccb" stroke-width="1" />
    ${bars}
  </svg>
  <p class="small muted"><span style="color:#1e4d3a">■</span> Income &nbsp; <span style="color:#c25e33">■</span> Money out</p>`;
}
