// data.js — all figures shown on NusaData, the national statistics portal of Indonesia.
// Every series is a plausible published figure in the style of the national statistics
// bureau: each indicator carries its period and source note so a visitor can cite it.
// Numbers use Indonesian conventions in the views (comma decimals, dot thousands).

const DATA = {
  // Headline indicators for the overview dashboard.
  indicators: [
    { id: 'populasi', label: 'Penduduk', value: '284,4', unit: 'juta jiwa', period: 'Pertengahan 2025', delta: '+0,8% dari 2024', source: 'Proyeksi Penduduk 2025' },
    { id: 'pdb', label: 'Produk Domestik Bruto', value: 'Rp22.139', unit: 'triliun (harga berlaku)', period: 'Tahun 2024', delta: '+5,03% pertumbuhan', source: 'PDB Nasional 2024' },
    { id: 'tumbuh', label: 'Pertumbuhan Ekonomi', value: '5,04', unit: '% (y-on-y)', period: 'Triwulan III-2025', delta: 'Triwulan II-2025: 5,12%', source: 'Berita Resmi Statistik, Nov 2025' },
    { id: 'inflasi', label: 'Inflasi', value: '2,86', unit: '% (y-on-y)', period: 'Oktober 2025', delta: 'September 2025: 2,65%', source: 'Indeks Harga Konsumen 2025' },
    { id: 'tpt', label: 'Pengangguran Terbuka', value: '4,85', unit: '% angkatan kerja', period: 'Agustus 2025', delta: 'Agustus 2024: 4,91%', source: 'Sakernas Agustus 2025' },
    { id: 'miskin', label: 'Penduduk Miskin', value: '8,47', unit: '% (23,85 juta jiwa)', period: 'Maret 2025', delta: 'September 2024: 8,57%', source: 'Susenas Maret 2025' },
  ],

  // Annual GDP growth, percent y-on-y (BPS annual releases).
  gdpGrowth: [
    { year: 2015, value: 4.88 }, { year: 2016, value: 5.03 }, { year: 2017, value: 5.07 },
    { year: 2018, value: 5.17 }, { year: 2019, value: 5.02 }, { year: 2020, value: -2.07 },
    { year: 2021, value: 3.70 }, { year: 2022, value: 5.31 }, { year: 2023, value: 5.05 },
    { year: 2024, value: 5.03 },
  ],

  // December inflation, percent y-on-y.
  inflationDec: [
    { year: 2019, value: 2.72 }, { year: 2020, value: 1.68 }, { year: 2021, value: 1.87 },
    { year: 2022, value: 5.51 }, { year: 2023, value: 2.61 }, { year: 2024, value: 1.57 },
  ],

  // GDP by industry, share of GDP at current prices, 2024 (percent).
  gdpSectors: [
    { name: 'Industri Pengolahan', share: 18.98 },
    { name: 'Perdagangan Besar & Eceran', share: 13.16 },
    { name: 'Pertanian, Kehutanan & Perikanan', share: 12.61 },
    { name: 'Konstruksi', share: 10.40 },
    { name: 'Pertambangan & Penggalian', share: 9.15 },
    { name: 'Transportasi & Pergudangan', share: 6.31 },
    { name: 'Informasi & Komunikasi', share: 4.35 },
    { name: 'Jasa Keuangan & Asuransi', share: 4.21 },
    { name: 'Lapangan Usaha Lainnya', share: 20.83 },
  ],

  // Foreign trade, billion US$ (customs statistics).
  trade: [
    { year: 2020, ekspor: 163.2, impor: 141.6 },
    { year: 2021, ekspor: 231.5, impor: 196.2 },
    { year: 2022, ekspor: 291.9, impor: 237.4 },
    { year: 2023, ekspor: 258.8, impor: 221.9 },
    { year: 2024, ekspor: 264.7, impor: 233.7 },
  ],

  // Leading export commodities, 2024, billion US$.
  topExports: [
    { name: 'Batu bara', value: 30.5 },
    { name: 'Besi dan baja', value: 25.9 },
    { name: 'Minyak kelapa sawit', value: 22.9 },
    { name: 'Gas alam', value: 10.2 },
    { name: 'Kendaraan & suku cadang', value: 9.8 },
    { name: 'Mesin & peralatan listrik', value: 9.1 },
  ],

  // Age pyramid 2025: percent of total population, male / female per five-year group.
  pyramid: [
    { group: '0–4', male: 4.6, female: 4.4 }, { group: '5–9', male: 4.7, female: 4.5 },
    { group: '10–14', male: 4.8, female: 4.6 }, { group: '15–19', male: 4.9, female: 4.7 },
    { group: '20–24', male: 4.7, female: 4.5 }, { group: '25–29', male: 4.5, female: 4.3 },
    { group: '30–34', male: 4.2, female: 4.0 }, { group: '35–39', male: 3.8, female: 3.7 },
    { group: '40–44', male: 3.3, female: 3.2 }, { group: '45–49', male: 2.7, female: 2.7 },
    { group: '50–54', male: 2.1, female: 2.2 }, { group: '55–59', male: 1.6, female: 1.8 },
    { group: '60–64', male: 1.2, female: 1.4 }, { group: '65–69', male: 0.9, female: 1.1 },
    { group: '70–74', male: 0.7, female: 0.8 }, { group: '75+', male: 0.8, female: 1.0 },
  ],

  // Population by island region, mid-2025 estimate, million people and share.
  regions: [
    { name: 'Jawa', pop: 157.4, share: 55.6 },
    { name: 'Sumatera', pop: 61.9, share: 21.9 },
    { name: 'Sulawesi', pop: 21.1, share: 7.4 },
    { name: 'Kalimantan', pop: 17.7, share: 6.3 },
    { name: 'Bali & Nusa Tenggara', pop: 15.7, share: 5.5 },
    { name: 'Maluku & Papua', pop: 9.1, share: 3.2 },
  ],

  demography: [
    { label: 'Umur Median', value: '30,9 tahun', note: 'Separuh penduduk berusia di bawah 30,9 tahun (2025).' },
    { label: 'Rasio Jenis Kelamin', value: '101,7', note: '101,7 laki-laki untuk setiap 100 perempuan (2025).' },
    { label: 'Rasio Ketergantungan', value: '44,6', note: '44,6 penduduk usia non-produktif per 100 usia produktif (2024).' },
    { label: 'Penduduk Perkotaan', value: '58,6%', note: 'Bagian penduduk yang tinggal di wilayah perkotaan (2024).' },
    { label: 'Angka Kelahiran Total (TFR)', value: '2,11', note: 'Rata-rata anak per perempuan usia subur (estimasi 2024).' },
    { label: 'Harapan Hidup Saat Lahir', value: '74,15 tahun', note: 'Umur harapan hidup penduduk Indonesia (2024).' },
  ],

  // Social indicators.
  education: {
    stats: [
      { label: 'Rata-rata Lama Sekolah', value: '9,22 tahun', period: 'Penduduk 15 tahun ke atas, 2024' },
      { label: 'Harapan Lama Sekolah', value: '13,21 tahun', period: 'Anak usia 7 tahun, 2024' },
      { label: 'Melek Huruf (15+)', value: '96,5%', period: 'Angka melek aksara, 2024' },
      { label: 'Indeks Pembangunan Manusia', value: '74,20', period: 'Kategori tinggi, 2024' },
    ],
    // Highest completed education, population aged 25+, percent, 2024.
    attainment: [
      { name: 'Tidak/Belum Tamat SD', share: 18.2 },
      { name: 'SD/sederajat', share: 24.6 },
      { name: 'SMP/sederajat', share: 17.8 },
      { name: 'SMA/sederajat', share: 29.4 },
      { name: 'Perguruan Tinggi', share: 10.0 },
    ],
  },

  health: [
    { label: 'Umur Harapan Hidup', value: '74,15 tahun', period: '2024' },
    { label: 'Stunting Balita', value: '19,8%', period: 'SSGI 2024, turun dari 21,5% (2023)' },
    { label: 'Imunisasi Dasar Lengkap', value: '73,1%', period: 'Baduta 12–23 bulan, 2024' },
    { label: 'Kepesertaan JKN', value: '98,4%', period: 'Penduduk terdaftar jaminan kesehatan, 2024' },
    { label: 'Akses Air Minum Layak', value: '91,7%', period: 'Rumah tangga, Susenas 2024' },
    { label: 'Akses Sanitasi Layak', value: '83,5%', period: 'Rumah tangga, Susenas 2024' },
  ],

  // Provinces: population (thousand, mid-2024 estimate), poverty rate (%, Mar 2025 style),
  // human development index (2024 style). Sorted alphabetically as published.
  provinces: [
    { name: 'Aceh', pop: 5627, poverty: 14.23, hdi: 74.11 },
    { name: 'Sumatera Utara', pop: 15595, poverty: 7.99, hdi: 73.87 },
    { name: 'Sumatera Barat', pop: 5864, poverty: 5.94, hdi: 75.72 },
    { name: 'Riau', pop: 6843, poverty: 6.67, hdi: 75.09 },
    { name: 'Jambi', pop: 3760, poverty: 7.26, hdi: 74.01 },
    { name: 'Sumatera Selatan', pop: 8900, poverty: 10.44, hdi: 73.52 },
    { name: 'Bengkulu', pop: 2112, poverty: 13.87, hdi: 74.22 },
    { name: 'Lampung', pop: 9420, poverty: 10.35, hdi: 72.86 },
    { name: 'Kep. Bangka Belitung', pop: 1531, poverty: 5.08, hdi: 73.34 },
    { name: 'Kepulauan Riau', pop: 2256, poverty: 4.85, hdi: 77.11 },
    { name: 'DKI Jakarta', pop: 10684, poverty: 4.30, hdi: 84.15 },
    { name: 'Jawa Barat', pop: 50345, poverty: 7.08, hdi: 73.74 },
    { name: 'Jawa Tengah', pop: 38128, poverty: 9.48, hdi: 73.88 },
    { name: 'DI Yogyakarta', pop: 3760, poverty: 10.83, hdi: 80.64 },
    { name: 'Jawa Timur', pop: 42090, poverty: 9.79, hdi: 74.39 },
    { name: 'Banten', pop: 12432, poverty: 5.63, hdi: 73.63 },
    { name: 'Bali', pop: 4361, poverty: 3.80, hdi: 77.76 },
    { name: 'Nusa Tenggara Barat', pop: 5646, poverty: 11.38, hdi: 72.41 },
    { name: 'Nusa Tenggara Timur', pop: 5656, poverty: 18.83, hdi: 65.86 },
    { name: 'Kalimantan Barat', pop: 5869, poverty: 6.32, hdi: 71.63 },
    { name: 'Kalimantan Tengah', pop: 2843, poverty: 5.13, hdi: 73.85 },
    { name: 'Kalimantan Selatan', pop: 4303, poverty: 4.02, hdi: 74.34 },
    { name: 'Kalimantan Timur', pop: 3990, poverty: 5.51, hdi: 78.39 },
    { name: 'Kalimantan Utara', pop: 739, poverty: 6.04, hdi: 72.67 },
    { name: 'Sulawesi Utara', pop: 2749, poverty: 7.03, hdi: 75.26 },
    { name: 'Sulawesi Tengah', pop: 3192, poverty: 11.77, hdi: 71.24 },
    { name: 'Sulawesi Selatan', pop: 9463, poverty: 8.01, hdi: 74.18 },
    { name: 'Sulawesi Tenggara', pop: 2847, poverty: 10.63, hdi: 72.94 },
    { name: 'Gorontalo', pop: 1272, poverty: 14.57, hdi: 71.92 },
    { name: 'Sulawesi Barat', pop: 1533, poverty: 10.30, hdi: 69.86 },
    { name: 'Maluku', pop: 1970, poverty: 15.65, hdi: 71.82 },
    { name: 'Maluku Utara', pop: 1395, poverty: 6.32, hdi: 71.37 },
    { name: 'Papua Barat', pop: 578, poverty: 21.66, hdi: 67.54 },
    { name: 'Papua Barat Daya', pop: 613, poverty: 18.25, hdi: 66.92 },
    { name: 'Papua', pop: 1104, poverty: 18.59, hdi: 63.10 },
    { name: 'Papua Selatan', pop: 533, poverty: 17.90, hdi: 64.85 },
    { name: 'Papua Tengah', pop: 1409, poverty: 27.24, hdi: 58.95 },
    { name: 'Papua Pegunungan', pop: 1464, poverty: 34.52, hdi: 53.42 },
  ],

  // Highest poverty rates, March 2025 style, percent — drawn on the Social page.
  povertyTop: [
    { name: 'Papua Pegunungan', value: 34.52 },
    { name: 'Papua Tengah', value: 27.24 },
    { name: 'Papua Barat', value: 21.66 },
    { name: 'Nusa Tenggara Timur', value: 18.83 },
    { name: 'Papua', value: 18.59 },
    { name: 'Maluku', value: 15.65 },
    { name: 'Gorontalo', value: 14.57 },
    { name: 'Aceh', value: 14.23 },
  ],

  // Recent statistical releases shown on the overview page, newest first.
  releases: [
    { date: '24 Nov 2025', title: 'Perkembangan Indeks Harga Konsumen Oktober 2025', tag: 'Harga' },
    { date: '17 Nov 2025', title: 'Ekspor Oktober 2025 US$24,61 Miliar, Impor US$21,84 Miliar', tag: 'Perdagangan' },
    { date: '10 Nov 2025', title: 'Keadaan Ketenagakerjaan Indonesia Agustus 2025', tag: 'Tenaga Kerja' },
    { date: '5 Nov 2025', title: 'Pertumbuhan Ekonomi Indonesia Triwulan III-2025: 5,04 Persen', tag: 'PDB' },
    { date: '3 Nov 2025', title: 'Indeks Pembangunan Manusia 2025 dan Profil Kemiskinan', tag: 'Sosial' },
    { date: '27 Okt 2025', title: 'Hasil Sensus Pertanian 2023 — Pencacahan Lengkap Tahap II', tag: 'Pertanian' },
  ],
};
