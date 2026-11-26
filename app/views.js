// views.js — one renderer per page of NusaData. Each returns the HTML for <main>;
// main.js swaps it in on hash navigation and then calls the page's init hook.

const PALETTE = ['#b91c1c', '#2563eb', '#059669', '#d97706', '#7c3aed', '#0891b2', '#db2777', '#65a30d', '#64748b'];

function kpiCard(ind, spark) {
  return `<article class="kpi">
    <div class="kpi-top"><span class="kpi-label">${ind.label}</span>${spark || ''}</div>
    <div class="kpi-value">${ind.value} <span class="kpi-unit">${ind.unit}</span></div>
    <div class="kpi-meta">${ind.period} · ${ind.delta}</div>
    <div class="kpi-src">Sumber: ${ind.source}</div>
  </article>`;
}

function statCards(items) {
  return `<div class="stat-grid">${items.map((s) => `
    <article class="stat">
      <div class="stat-label">${s.label}</div>
      <div class="stat-value">${s.value}</div>
      <div class="stat-note">${s.note || s.period || ''}</div>
    </article>`).join('')}</div>`;
}

function pageHead(kicker, title, lead) {
  return `<div class="page-head"><div class="kicker">${kicker}</div><h1>${title}</h1><p class="lead">${lead}</p></div>`;
}

function viewOverview() {
  const sparks = {
    tumbuh: sparkline(DATA.gdpGrowth.map((d) => d.value), '#059669'),
    inflasi: sparkline(DATA.inflationDec.map((d) => d.value), '#d97706'),
  };
  const kpis = DATA.indicators.map((ind) => kpiCard(ind, sparks[ind.id])).join('');
  const top5 = [...DATA.provinces].sort((a, b) => b.pop - a.pop).slice(0, 5)
    .map((p) => ({ name: p.name, value: Math.round(p.pop / 100) / 10 }));
  const releases = DATA.releases.map((r) => `
    <li><span class="rel-date">${r.date}</span><span class="rel-tag">${r.tag}</span>
    <a href="#/overview" class="rel-title">${r.title}</a></li>`).join('');
  return `
  <section class="hero">
    <div class="hero-in">
      <div class="kicker light">Portal Statistik Nasional · Republik Indonesia</div>
      <h1>Data resmi untuk 284 juta penduduk Indonesia</h1>
      <p>NusaData menyajikan statistik kependudukan, ekonomi, dan sosial dari 38 provinsi —
      dikumpulkan lewat sensus dan survei nasional, diterbitkan terbuka agar siapa pun dapat
      memeriksa, mengutip, dan mengambil keputusan dari angka yang sama.</p>
      <div class="hero-links">
        <a class="btn solid" href="#/provinces">Jelajahi 38 Provinsi</a>
        <a class="btn ghost" href="#/economy">Lihat Ekonomi</a>
      </div>
    </div>
  </section>
  <section class="wrap">
    <h2 class="sec-title">Indikator Utama</h2>
    <div class="kpi-grid">${kpis}</div>
    <div class="cols">
      <article class="card grow">
        <h3>Pertumbuhan Ekonomi 2015–2024</h3>
        <p class="card-sub">PDB atas dasar harga konstan, % y-on-y. Ekonomi Indonesia pulih dari kontraksi 2020 dan tumbuh stabil di kisaran 5%.</p>
        ${lineChart(DATA.gdpGrowth, { color: '#059669', unit: '%', label: 'Pertumbuhan PDB', zero: true })}
        <p class="src">Sumber: PDB Nasional, diolah dari rilis tahunan 2015–2024.</p>
      </article>
      <article class="card">
        <h3>Provinsi Terpadat</h3>
        <p class="card-sub">Penduduk per provinsi, juta jiwa (2024). Tiga provinsi di Jawa menampung hampir setengah penduduk Indonesia.</p>
        ${hbarChart(top5, { color: '#b91c1c', unit: ' jt', label: 'Penduduk' })}
        <p class="src">Sumber: Estimasi Penduduk Antar-Sensus 2024. <a href="#/provinces">Semua provinsi →</a></p>
      </article>
    </div>
    <div class="cols">
      <article class="card grow">
        <h3>Rilis Terbaru</h3>
        <ul class="releases">${releases}</ul>
      </article>
      <article class="card">
        <h3>Jelajahi Statistik</h3>
        <div class="explore">
          <a href="#/population"><b>Kependudukan</b><span>Piramida umur, sebaran wilayah, dan demografi.</span></a>
          <a href="#/economy"><b>Ekonomi</b><span>PDB per sektor, perdagangan luar negeri, inflasi.</span></a>
          <a href="#/social"><b>Sosial</b><span>Pendidikan, kesehatan, dan kemiskinan.</span></a>
          <a href="#/provinces"><b>Provinsi</b><span>Tabel 38 provinsi — cari dan urutkan sendiri.</span></a>
        </div>
      </article>
    </div>
  </section>`;
}

function viewPopulation() {
  return `
  <section class="wrap">
    ${pageHead('Kependudukan', 'Penduduk Indonesia', 'Hasil proyeksi penduduk 2025: 284,4 juta jiwa, tumbuh 0,8% setahun. Struktur umur masih didominasi usia produktif — jendela bonus demografi yang mulai menyempit setelah 2030.')}
    ${statCards(DATA.demography)}
    <div class="cols">
      <article class="card grow">
        <h3>Piramida Penduduk 2025</h3>
        <p class="card-sub">% penduduk per kelompok umur lima tahunan. Basis piramida yang menyempit menunjukkan kelahiran yang terus menurun.</p>
        ${pyramidChart(DATA.pyramid)}
        <p class="src">Sumber: Proyeksi Penduduk Indonesia 2025 (hasil Sensus Penduduk 2020, diperbarui).</p>
      </article>
      <article class="card">
        <h3>Penduduk per Wilayah</h3>
        <p class="card-sub">Juta jiwa dan pangsa terhadap total nasional, pertengahan 2025.</p>
        ${hbarChart(DATA.regions.map((r) => ({ name: r.name, value: r.pop })), { color: '#2563eb', unit: ' jt', label: 'Penduduk' })}
        <p class="src">Jawa menampung 55,6% penduduk pada 6,7% luas daratan — kepadatan tertinggi ada di DKI Jakarta (±16.100 jiwa/km²).</p>
      </article>
    </div>
    <article class="card">
      <h3>Membaca piramida</h3>
      <p class="prose">Kelompok umur terbesar adalah 15–19 tahun (9,6% penduduk), sisa gelombang kelahiran
      akhir 2000-an. Di bawahnya, setiap kelompok lima tahunan lebih kecil dari kelompok di atasnya —
      tanda angka kelahiran total turun mendekati level pengganti (2,11 anak per perempuan). Di puncak,
      penduduk 75 tahun ke atas perempuan (1,0%) melebihi laki-laki (0,8%) karena harapan hidup perempuan
      lebih panjang. Bagi perencana, artinya jelas: kebutuhan sekolah dasar menyusut perlahan, sementara
      kebutuhan layanan kesehatan lansia dan jaminan hari tua naik setiap tahun.</p>
    </article>
  </section>`;
}

function viewEconomy() {
  return `
  <section class="wrap">
    ${pageHead('Ekonomi', 'Ekonomi Indonesia', 'PDB 2024 sebesar Rp22.139 triliun atas dasar harga berlaku (sekitar US$1.396 miliar). Ekonomi tumbuh 5,03% pada 2024 dan 5,04% pada Triwulan III-2025, ditopang konsumsi rumah tangga dan investasi.')}
    <div class="card">
      <div class="chart-head">
        <h3 id="econ-chart-title">Pertumbuhan PDB 2015–2024</h3>
        <div class="seg" role="group" aria-label="Pilih seri">
          <button class="seg-btn active" data-series="growth">Pertumbuhan PDB</button>
          <button class="seg-btn" data-series="inflation">Inflasi Desember</button>
        </div>
      </div>
      <p class="card-sub" id="econ-chart-sub">% y-on-y, harga konstan 2010. Arahkan kursor ke titik untuk nilai per tahun.</p>
      <div id="econ-chart">${lineChart(DATA.gdpGrowth, { color: '#059669', unit: '%', label: 'Pertumbuhan PDB', zero: true })}</div>
      <p class="src" id="econ-chart-src">Sumber: PDB Nasional 2015–2024.</p>
    </div>
    <div class="cols">
      <article class="card grow">
        <h3>PDB Menurut Lapangan Usaha 2024</h3>
        <p class="card-sub">Pangsa terhadap PDB harga berlaku. Industri pengolahan tetap penyumbang terbesar, diikuti perdagangan dan pertanian.</p>
        ${donutChart(DATA.gdpSectors, PALETTE, 'PDB menurut lapangan usaha')}
        <p class="src">Sumber: PDB Menurut Lapangan Usaha 2024.</p>
      </article>
      <article class="card">
        <h3>Komoditas Ekspor Utama 2024</h3>
        <p class="card-sub">Nilai ekspor nonmigas dan migas terpilih, miliar US$.</p>
        ${hbarChart(DATA.topExports, { color: '#d97706', unit: '', label: 'Ekspor (miliar US$)' })}
        <p class="src">Sumber: Statistik Perdagangan Luar Negeri 2024.</p>
      </article>
    </div>
    <article class="card">
      <h3>Perdagangan Luar Negeri 2020–2024</h3>
      <p class="card-sub">Ekspor dan impor barang, miliar US$. Indonesia mencatat surplus neraca perdagangan setiap tahun sejak 2020; surplus 2024 sebesar US$31,0 miliar.</p>
      ${groupedBars(DATA.trade.map((t) => ({ year: t.year, a: t.ekspor, b: t.impor })), { aLabel: 'Ekspor', bLabel: 'Impor', aColor: '#059669', bColor: '#b91c1c', unit: ' M' })}
      <p class="src">Sumber: Dokumen kepabeanan (PEB/PIB), Statistik Perdagangan Luar Negeri.</p>
    </article>
  </section>`;
}

function viewSocial() {
  return `
  <section class="wrap">
    ${pageHead('Sosial', 'Pendidikan, Kesehatan & Kemiskinan', 'Indikator sosial dari Susenas, Sakernas, dan Survei Status Gizi: bagaimana penduduk Indonesia belajar, berobat, dan keluar dari kemiskinan.')}
    <h2 class="sec-title">Pendidikan</h2>
    ${statCards(DATA.education.stats)}
    <div class="cols">
      <article class="card grow">
        <h3>Tamat Pendidikan Penduduk 25 Tahun ke Atas</h3>
        <p class="card-sub">Jenjang tertinggi yang ditamatkan, % penduduk usia 25+, 2024. Hampir tiga dari sepuluh tamat SMA, satu dari sepuluh tamat perguruan tinggi.</p>
        ${hbarChart(DATA.education.attainment.map((a) => ({ name: a.name, value: a.share })), { color: '#7c3aed', unit: '%', label: 'Pangsa' })}
        <p class="src">Sumber: Susenas Maret 2024, modul pendidikan.</p>
      </article>
      <article class="card">
        <h3>Kesehatan dalam Angka</h3>
        ${statCards(DATA.health)}
      </article>
    </div>
    <article class="card">
      <h3>Kemiskinan Tertinggi per Provinsi</h3>
      <p class="card-sub">Persentase penduduk miskin, Maret 2025. Garis nasional berada di 8,47% — ketimpangan antarwilayah masih lebar: Papua Pegunungan (34,52%) berbanding Bali (3,80%).</p>
      ${hbarChart(DATA.povertyTop, { color: '#b91c1c', unit: '%', label: 'Penduduk miskin' })}
      <p class="src">Sumber: Susenas Maret 2025. Garis kemiskinan nasional Maret 2025: Rp595.242 per kapita per bulan. <a href="#/provinces">Lihat semua provinsi →</a></p>
    </article>
    <article class="card">
      <h3>Apa artinya bagi warga</h3>
      <p class="prose">Rata-rata lama sekolah 9,22 tahun berarti penduduk dewasa rata-rata tamat SMP dan masuk
      SMA — target wajib belajar 12 tahun belum tercapai, dan kesenjangan kota–desa masih sekitar dua tahun.
      Di kesehatan, stunting turun ke 19,8% tetapi satu dari lima balita masih tumbuh di bawah standar;
      cakupan JKN 98,4% membuat hambatan utamanya bukan lagi biaya berobat, melainkan jarak ke fasilitas
      di wilayah timur. Kemiskinan nasional turun perlahan (8,47%), namun 60% penduduk miskin tinggal di
      Jawa dalam jumlah jiwa — sementara secara persentase, kemiskinan terdalam terkonsentrasi di Papua dan NTT.</p>
    </article>
  </section>`;
}

function provinceRows(list) {
  return list.map((p, i) => `<tr>
    <td class="num">${i + 1}</td>
    <td class="pname">${p.name}</td>
    <td class="num">${String(p.pop).replace(/\B(?=(\d{3})+(?!\d))/g, '.')}</td>
    <td class="num">${fmtPct(p.poverty)}</td>
    <td class="num">${fmtNum(p.hdi.toFixed(2))}</td>
    <td><span class="hdi-band ${p.hdi >= 80 ? 'very' : p.hdi >= 70 ? 'high' : p.hdi >= 60 ? 'mid' : 'low'}">${p.hdi >= 80 ? 'Sangat tinggi' : p.hdi >= 70 ? 'Tinggi' : p.hdi >= 60 ? 'Sedang' : 'Rendah'}</span></td>
  </tr>`).join('');
}

function viewProvinces() {
  return `
  <section class="wrap">
    ${pageHead('Data Provinsi', '38 Provinsi dalam Satu Tabel', 'Penduduk (ribu jiwa, estimasi pertengahan 2024), persentase penduduk miskin (Maret 2025), dan Indeks Pembangunan Manusia (2024) untuk seluruh provinsi. Klik judul kolom untuk mengurutkan; ketik untuk menyaring.')}
    <article class="card">
      <div class="table-tools">
        <label class="search">Cari provinsi
          <input id="prov-search" type="search" placeholder="mis. Jawa, Papua, Bali…" autocomplete="off">
        </label>
        <div class="table-count" id="prov-count"></div>
      </div>
      <div class="table-scroll">
        <table class="prov" id="prov-table">
          <thead><tr>
            <th class="num">No</th>
            <th data-key="name" class="sortable">Provinsi <span class="arrow"></span></th>
            <th data-key="pop" class="sortable num">Penduduk (ribu) <span class="arrow"></span></th>
            <th data-key="poverty" class="sortable num">Miskin (%) <span class="arrow"></span></th>
            <th data-key="hdi" class="sortable num">IPM <span class="arrow"></span></th>
            <th>Kategori IPM</th>
          </tr></thead>
          <tbody id="prov-body">${provinceRows(DATA.provinces)}</tbody>
        </table>
      </div>
      <p class="src">Sumber: Estimasi Penduduk 2024; Susenas Maret 2025; IPM 2024. Kategori IPM: ≥80 sangat tinggi, 70–79 tinggi, 60–69 sedang, &lt;60 rendah. Total penduduk tabel ini ±282,9 juta (estimasi pertengahan 2024).</p>
    </article>
  </section>`;
}

// Wires the provinces table: live search filter + click-to-sort columns.
function initProvinces() {
  const input = document.getElementById('prov-search');
  const body = document.getElementById('prov-body');
  const count = document.getElementById('prov-count');
  let sortKey = null, sortDir = 1;
  function render() {
    const q = (input.value || '').toLowerCase();
    let list = DATA.provinces.filter((p) => p.name.toLowerCase().includes(q));
    if (sortKey) {
      list = [...list].sort((a, b) => {
        const va = a[sortKey], vb = b[sortKey];
        return (typeof va === 'string' ? va.localeCompare(vb) : va - vb) * sortDir;
      });
    }
    body.innerHTML = list.length
      ? provinceRows(list)
      : '<tr><td colspan="6" class="empty">Tidak ada provinsi yang cocok dengan pencarian itu. Coba kata kunci lain.</td></tr>';
    count.textContent = `Menampilkan ${list.length} dari 38 provinsi`;
    document.querySelectorAll('#prov-table th.sortable').forEach((th) => {
      const arrow = th.querySelector('.arrow');
      if (arrow) arrow.textContent = th.dataset.key === sortKey ? (sortDir === 1 ? '▲' : '▼') : '';
    });
  }
  input.addEventListener('input', render);
  document.querySelectorAll('#prov-table th.sortable').forEach((th) => {
    th.addEventListener('click', () => {
      const key = th.dataset.key;
      if (sortKey === key) sortDir = -sortDir; else { sortKey = key; sortDir = key === 'name' ? 1 : -1; }
      render();
    });
  });
  render();
}

// Wires the economy page's series toggle (GDP growth vs December inflation).
function initEconomy() {
  const chart = document.getElementById('econ-chart');
  if (!chart) return;
  const title = document.getElementById('econ-chart-title');
  const sub = document.getElementById('econ-chart-sub');
  const src = document.getElementById('econ-chart-src');
  document.querySelectorAll('.seg-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.seg-btn').forEach((b) => b.classList.toggle('active', b === btn));
      if (btn.dataset.series === 'inflation') {
        chart.innerHTML = lineChart(DATA.inflationDec, { color: '#d97706', unit: '%', label: 'Inflasi Desember', zero: false });
        title.textContent = 'Inflasi Desember 2019–2024';
        sub.textContent = '% y-on-y per Desember. Lonjakan 2022 (5,51%) dipicu harga energi dan pangan global; sejak 2023 inflasi kembali ke sasaran 2,5±1%. Oktober 2025 tercatat 2,86%.';
        src.textContent = 'Sumber: Indeks Harga Konsumen, Desember 2019–2024.';
      } else {
        chart.innerHTML = lineChart(DATA.gdpGrowth, { color: '#059669', unit: '%', label: 'Pertumbuhan PDB', zero: true });
        title.textContent = 'Pertumbuhan PDB 2015–2024';
        sub.textContent = '% y-on-y, harga konstan 2010. Arahkan kursor ke titik untuk nilai per tahun.';
        src.textContent = 'Sumber: PDB Nasional 2015–2024.';
      }
      bindTips(chart);
    });
  });
}
