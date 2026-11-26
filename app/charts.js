// charts.js — hand-rolled SVG charts for NusaData. No library: every chart is a
// string of SVG built from the data, with hover points wired to one shared tooltip.

const ChartTip = {
  el: null,
  init() {
    this.el = document.getElementById('chart-tip');
  },
  show(html, x, y) {
    if (!this.el) return;
    this.el.innerHTML = html;
    this.el.style.display = 'block';
    const pad = 14;
    let left = x + pad;
    let top = y + pad;
    const r = this.el.getBoundingClientRect();
    if (left + r.width > window.innerWidth - 8) left = x - r.width - pad;
    if (top + r.height > window.innerHeight - 8) top = y - r.height - pad;
    this.el.style.left = left + 'px';
    this.el.style.top = top + 'px';
  },
  hide() {
    if (this.el) this.el.style.display = 'none';
  },
};

// Bind tooltip behaviour to every element carrying data-tip inside a container.
function bindTips(root) {
  root.querySelectorAll('[data-tip]').forEach((node) => {
    node.addEventListener('mousemove', (ev) => ChartTip.show(node.getAttribute('data-tip'), ev.clientX, ev.clientY));
    node.addEventListener('mouseleave', () => ChartTip.hide());
    node.addEventListener('touchstart', (ev) => {
      const t = ev.touches[0];
      ChartTip.show(node.getAttribute('data-tip'), t.clientX, t.clientY);
    }, { passive: true });
  });
}

function fmtPct(v) {
  return String(v.toFixed(2)).replace('.', ',') + '%';
}

function fmtNum(v) {
  return String(v).replace('.', ',');
}

// Line chart of {year, value} points. opts: {color, unit, zero}
function lineChart(points, opts) {
  const w = 640, h = 260, padL = 44, padR = 14, padT = 16, padB = 30;
  const iw = w - padL - padR, ih = h - padT - padB;
  const values = points.map((p) => p.value);
  let min = Math.min(...values), max = Math.max(...values);
  if (opts.zero) min = Math.min(0, min);
  const span = (max - min) || 1;
  min -= span * 0.12; max += span * 0.12;
  const x = (i) => padL + (iw * i) / (points.length - 1);
  const y = (v) => padT + ih - ((v - min) / (max - min)) * ih;
  let grid = '';
  for (let g = 0; g <= 4; g++) {
    const gv = min + ((max - min) * g) / 4;
    const gy = y(gv);
    grid += `<line x1="${padL}" y1="${gy}" x2="${w - padR}" y2="${gy}" class="grid"/>` +
      `<text x="${padL - 6}" y="${gy + 4}" class="axis" text-anchor="end">${fmtNum(gv.toFixed(1))}</text>`;
  }
  const zeroY = (min < 0 && max > 0)
    ? `<line x1="${padL}" y1="${y(0)}" x2="${w - padR}" y2="${y(0)}" class="zero"/>` : '';
  const path = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(1)},${y(p.value).toFixed(1)}`).join(' ');
  const area = `${path} L${x(points.length - 1).toFixed(1)},${y(min)} L${x(0).toFixed(1)},${y(min)} Z`;
  const dots = points.map((p, i) =>
    `<circle cx="${x(i)}" cy="${y(p.value)}" r="9" class="hit" data-tip="<b>${p.year}</b><br>${opts.label}: <b>${fmtNum(p.value.toFixed(2))}${opts.unit}</b>"/>` +
    `<circle cx="${x(i)}" cy="${y(p.value)}" r="3.5" class="dot" fill="${opts.color}"/>` +
    `<text x="${x(i)}" y="${h - 8}" class="axis" text-anchor="middle">${p.year}</text>`).join('');
  return `<svg viewBox="0 0 ${w} ${h}" class="chart" role="img" aria-label="${opts.label}">${grid}${zeroY}` +
    `<path d="${area}" fill="${opts.color}" opacity="0.10"/><path d="${path}" class="line" stroke="${opts.color}"/>${dots}</svg>`;
}

// Vertical bars of {name, value}. opts: {color, unit, suffix}
function barChart(items, opts) {
  const w = 640, h = 280, padL = 44, padR = 10, padT = 20, padB = 56;
  const iw = w - padL - padR, ih = h - padT - padB;
  const max = Math.max(...items.map((d) => d.value)) * 1.12;
  const bw = iw / items.length;
  let grid = '';
  for (let g = 0; g <= 4; g++) {
    const gv = (max * g) / 4, gy = padT + ih - (ih * g) / 4;
    grid += `<line x1="${padL}" y1="${gy}" x2="${w - padR}" y2="${gy}" class="grid"/>` +
      `<text x="${padL - 6}" y="${gy + 4}" class="axis" text-anchor="end">${fmtNum(gv.toFixed(0))}</text>`;
  }
  const bars = items.map((d, i) => {
    const bh = (d.value / max) * ih;
    const bx = padL + i * bw + bw * 0.18, by = padT + ih - bh;
    const label = d.name.length > 14 ? d.name.slice(0, 13) + '…' : d.name;
    return `<rect x="${bx}" y="${by}" width="${bw * 0.64}" height="${bh}" rx="3" fill="${opts.color}" class="bar" data-tip="<b>${d.name}</b><br>${opts.label}: <b>${fmtNum(d.value)}${opts.unit}</b>"/>` +
      `<text x="${bx + bw * 0.32}" y="${by - 5}" class="val" text-anchor="middle">${fmtNum(d.value)}</text>` +
      `<text x="${bx + bw * 0.32}" y="${h - 34}" class="axis" text-anchor="middle">${label}</text>`;
  }).join('');
  return `<svg viewBox="0 0 ${w} ${h}" class="chart" role="img" aria-label="${opts.label}">${grid}${bars}</svg>`;
}

// Grouped bars (two series) of {year, a, b}. opts: {aLabel, bLabel, aColor, bColor, unit}
function groupedBars(rows, opts) {
  const w = 640, h = 280, padL = 44, padR = 10, padT = 26, padB = 30;
  const iw = w - padL - padR, ih = h - padT - padB;
  const max = Math.max(...rows.flatMap((r) => [r.a, r.b])) * 1.12;
  const bw = iw / rows.length;
  let grid = '';
  for (let g = 0; g <= 4; g++) {
    const gv = (max * g) / 4, gy = padT + ih - (ih * g) / 4;
    grid += `<line x1="${padL}" y1="${gy}" x2="${w - padR}" y2="${gy}" class="grid"/>` +
      `<text x="${padL - 6}" y="${gy + 4}" class="axis" text-anchor="end">${fmtNum(gv.toFixed(0))}</text>`;
  }
  const bars = rows.map((r, i) => {
    const gx = padL + i * bw;
    const ha = (r.a / max) * ih, hb = (r.b / max) * ih;
    return `<rect x="${gx + bw * 0.14}" y="${padT + ih - ha}" width="${bw * 0.32}" height="${ha}" rx="3" fill="${opts.aColor}" class="bar" data-tip="<b>${r.year}</b><br>${opts.aLabel}: <b>${fmtNum(r.a)}${opts.unit}</b>"/>` +
      `<rect x="${gx + bw * 0.52}" y="${padT + ih - hb}" width="${bw * 0.32}" height="${hb}" rx="3" fill="${opts.bColor}" class="bar" data-tip="<b>${r.year}</b><br>${opts.bLabel}: <b>${fmtNum(r.b)}${opts.unit}</b>"/>` +
      `<text x="${gx + bw / 2}" y="${h - 8}" class="axis" text-anchor="middle">${r.year}</text>`;
  }).join('');
  const legend = `<span class="lg"><i style="background:${opts.aColor}"></i>${opts.aLabel}</span>` +
    `<span class="lg"><i style="background:${opts.bColor}"></i>${opts.bLabel}</span>`;
  return `<div class="legend">${legend}</div><svg viewBox="0 0 ${w} ${h}" class="chart" role="img">${grid}${bars}</svg>`;
}

// Horizontal bars of {name, value}. opts: {color, unit, highlight} — highlight adds a reference note.
function hbarChart(items, opts) {
  const rowH = 27, w = 640, padL = 168, padR = 52, padT = 6;
  const h = items.length * rowH + padT + 8;
  const max = Math.max(...items.map((d) => d.value)) * 1.05;
  const iw = w - padL - padR;
  const rows = items.map((d, i) => {
    const y0 = padT + i * rowH;
    const bw = (d.value / max) * iw;
    return `<text x="${padL - 8}" y="${y0 + 16}" class="axis hlabel" text-anchor="end">${d.name}</text>` +
      `<rect x="${padL}" y="${y0 + 4}" width="${bw}" height="16" rx="3" fill="${opts.color}" class="bar" data-tip="<b>${d.name}</b><br>${opts.label}: <b>${fmtNum(d.value)}${opts.unit}</b>"/>` +
      `<text x="${padL + bw + 6}" y="${y0 + 17}" class="val">${fmtNum(d.value)}${opts.unit}</text>`;
  }).join('');
  return `<svg viewBox="0 0 ${w} ${h}" class="chart" role="img" aria-label="${opts.label}">${rows}</svg>`;
}

// Donut of {name, share} with a palette; returns svg + legend html.
function donutChart(items, palette, label) {
  const size = 230, r = 92, cx = size / 2, cy = size / 2, ir = 56;
  let acc = 0;
  const total = items.reduce((s, d) => s + d.share, 0);
  const arcs = items.map((d, i) => {
    const a0 = (acc / total) * Math.PI * 2 - Math.PI / 2;
    acc += d.share;
    const a1 = (acc / total) * Math.PI * 2 - Math.PI / 2;
    const large = a1 - a0 > Math.PI ? 1 : 0;
    const x0 = cx + r * Math.cos(a0), y0 = cy + r * Math.sin(a0);
    const x1 = cx + r * Math.cos(a1), y1 = cy + r * Math.sin(a1);
    const xi1 = cx + ir * Math.cos(a1), yi1 = cy + ir * Math.sin(a1);
    const xi0 = cx + ir * Math.cos(a0), yi0 = cy + ir * Math.sin(a0);
    return `<path d="M${x0.toFixed(1)},${y0.toFixed(1)} A${r},${r} 0 ${large} 1 ${x1.toFixed(1)},${y1.toFixed(1)} ` +
      `L${xi1.toFixed(1)},${yi1.toFixed(1)} A${ir},${ir} 0 ${large} 0 ${xi0.toFixed(1)},${yi0.toFixed(1)} Z" ` +
      `fill="${palette[i % palette.length]}" class="slice" data-tip="<b>${d.name}</b><br>Pangsa PDB: <b>${fmtPct(d.share)}</b>"/>`;
  }).join('');
  const legend = items.map((d, i) =>
    `<span class="lg"><i style="background:${palette[i % palette.length]}"></i>${d.name} — ${fmtPct(d.share)}</span>`).join('');
  return `<div class="donut-wrap"><svg viewBox="0 0 ${size} ${size}" class="chart donut" role="img" aria-label="${label}">${arcs}` +
    `<text x="${cx}" y="${cy - 2}" class="donut-c">PDB 2024</text><text x="${cx}" y="${cy + 16}" class="donut-c2">Harga Berlaku</text></svg>` +
    `<div class="legend col">${legend}</div></div>`;
}

// Population pyramid: rows of {group, male, female} in percent of total population.
function pyramidChart(rows) {
  const w = 640, rowH = 24, padT = 24, padB = 22;
  const h = rows.length * rowH + padT + padB;
  const mid = w / 2, maxBar = 218;
  const max = Math.max(...rows.flatMap((r) => [r.male, r.female])) * 1.08;
  let out = `<text x="${mid - 10}" y="16" class="pyr-h" text-anchor="end" fill="#2563eb">Laki-laki</text>` +
    `<text x="${mid + 10}" y="16" class="pyr-h" fill="#db2777">Perempuan</text>`;
  rows.forEach((r, i) => {
    const y0 = padT + i * rowH;
    const mw = (r.male / max) * maxBar, fw = (r.female / max) * maxBar;
    out += `<rect x="${mid - mw}" y="${y0 + 3}" width="${mw}" height="16" rx="3" fill="#2563eb" class="bar" data-tip="<b>${r.group} tahun</b><br>Laki-laki: <b>${fmtPct(r.male)}</b>"/>` +
      `<rect x="${mid}" y="${y0 + 3}" width="${fw}" height="16" rx="3" fill="#db2777" class="bar" data-tip="<b>${r.group} tahun</b><br>Perempuan: <b>${fmtPct(r.female)}</b>"/>` +
      `<text x="${mid - mw - 6}" y="${y0 + 16}" class="val" text-anchor="end">${fmtNum(r.male)}</text>` +
      `<text x="${mid + fw + 6}" y="${y0 + 16}" class="val">${fmtNum(r.female)}</text>` +
      `<text x="${mid}" y="${y0 + 16}" class="axis pyr-g" text-anchor="middle">${r.group}</text>`;
  });
  out += `<text x="${mid}" y="${h - 4}" class="axis" text-anchor="middle">Kelompok umur — % dari total penduduk (2025)</text>`;
  return `<svg viewBox="0 0 ${w} ${h}" class="chart" role="img" aria-label="Piramida penduduk">${out}</svg>`;
}

// Tiny inline sparkline of plain numbers, for dashboard cards.
function sparkline(values, color) {
  const w = 120, h = 34, pad = 3;
  const min = Math.min(...values), max = Math.max(...values);
  const span = (max - min) || 1;
  const pts = values.map((v, i) => {
    const x = pad + ((w - pad * 2) * i) / (values.length - 1);
    const y = pad + (h - pad * 2) * (1 - (v - min) / span);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });
  return `<svg viewBox="0 0 ${w} ${h}" class="spark" aria-hidden="true"><polyline points="${pts.join(' ')}" fill="none" stroke="${color}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/></svg>`;
}
