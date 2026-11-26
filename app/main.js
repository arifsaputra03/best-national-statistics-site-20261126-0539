// main.js — hash router and boot for NusaData. Routes are plain hash links, so the
// site works from any static server (and from file://) with no network requests.

const ROUTES = {
  '/overview': { view: viewOverview, title: 'Ringkasan — NusaData Statistik Indonesia' },
  '/population': { view: viewPopulation, title: 'Kependudukan — NusaData Statistik Indonesia' },
  '/economy': { view: viewEconomy, title: 'Ekonomi — NusaData Statistik Indonesia' },
  '/social': { view: viewSocial, title: 'Sosial — NusaData Statistik Indonesia' },
  '/provinces': { view: viewProvinces, title: 'Provinsi — NusaData Statistik Indonesia' },
};

function currentRoute() {
  const hash = window.location.hash.replace(/^#/, '');
  return ROUTES[hash] ? hash : '/overview';
}

function render() {
  const path = currentRoute();
  const route = ROUTES[path];
  const main = document.getElementById('app');
  main.innerHTML = route.view();
  document.title = route.title;
  document.querySelectorAll('.nav a').forEach((a) => {
    a.classList.toggle('active', a.getAttribute('href') === '#' + path);
  });
  bindTips(main);
  if (path === '/provinces') initProvinces();
  if (path === '/economy') initEconomy();
  window.scrollTo(0, 0);
  ChartTip.hide();
}

window.addEventListener('hashchange', render);
window.addEventListener('scroll', () => ChartTip.hide(), { passive: true });
document.addEventListener('DOMContentLoaded', () => {
  ChartTip.init();
  if (!window.location.hash) history.replaceState(null, '', '#/overview');
  render();
});
