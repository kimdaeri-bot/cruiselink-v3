/* ===== CruiseLink V3 Main JS ===== */

// ── Header scroll effect ──
const header = document.querySelector('.header');
window.addEventListener('scroll', () => {
  header?.classList.toggle('scrolled', window.scrollY > 60);
});

// ── Hero BG loaded ──
window.addEventListener('load', () => {
  document.querySelector('.hero-bg')?.classList.add('loaded');
});

// ── Scroll fade-in ──
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.12 });
document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

// ── Hero search ──
function doHeroSearch() {
  const dest = document.getElementById('hDest')?.value || '';
  const port = document.getElementById('hPort')?.value || '';
  const month = document.getElementById('hMonth')?.value || '';
  const dur = document.getElementById('hDur')?.value || '';
  const params = new URLSearchParams();
  if (dest) params.set('dest', dest);
  if (port) params.set('ports', port);
  if (month) params.set('month', month);
  if (dur) params.set('duration', dur);
  location.href = 'search.html?' + params.toString();
}

// ── Generic slider ──
function makeSlider(trackId, arrowLeftId, arrowRightId, visibleCount = 4) {
  let pos = 0;
  const track = document.getElementById(trackId);
  if (!track) return;
  function cardW() {
    const c = track.querySelector('[data-slide]');
    if (!c) return 0;
    return c.offsetWidth + parseInt(getComputedStyle(track).gap || '16');
  }
  function maxPos() { return Math.max(0, track.querySelectorAll('[data-slide]').length - visibleCount); }
  function apply() {
    track.style.transform = 'translateX(-' + (pos * cardW()) + 'px)';
    const lBtn = document.getElementById(arrowLeftId);
    const rBtn = document.getElementById(arrowRightId);
    if (lBtn) lBtn.style.opacity = pos <= 0 ? '0.35' : '1';
    if (rBtn) rBtn.style.opacity = pos >= maxPos() ? '0.35' : '1';
  }
  document.getElementById(arrowLeftId)?.addEventListener('click', () => { pos = Math.max(0, pos - 1); apply(); });
  document.getElementById(arrowRightId)?.addEventListener('click', () => { pos = Math.min(maxPos(), pos + 1); apply(); });
  return { apply, reset: () => { pos = 0; apply(); } };
}

// ── Destination slider ──
const destSlider = makeSlider('destTrackV3', 'destLeft', 'destRight', 4);

// ── Ship slider ──
const shipSlider = makeSlider('shipTrack', 'shipLeft', 'shipRight', 4);

// ── Featured sliders ──
const feat1 = makeSlider('featTrack1', 'feat1Left', 'feat1Right', 3);
const feat2 = makeSlider('featTrack2', 'feat2Left', 'feat2Right', 3);

// ── Build destination card ──
const DEST_IMAGES = {
  korea: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&q=80',
  mediterranean: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=600&q=80',
  alaska: 'https://images.unsplash.com/photo-1504893524553-b855bce32c67?w=600&q=80',
  caribbean: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&q=80',
  'northern-europe': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
  asia: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&q=80',
  'south-america': 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=600&q=80',
  oceania: 'https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?w=600&q=80',
  hawaii: 'https://images.unsplash.com/photo-1505852679233-d9fd70aff56d?w=600&q=80',
};
const DEST_NAMES = {
  korea: '한국/일본', mediterranean: '지중해', alaska: '알래스카',
  caribbean: '카리브해', 'northern-europe': '북유럽', asia: '아시아/중동',
  'south-america': '남미', oceania: '오세아니아', hawaii: '하와이',
};

function buildDestCards() {
  const track = document.getElementById('destTrackV3');
  if (!track) return;
  track.innerHTML = Object.entries(DEST_IMAGES).map(([key, img]) => `
    <a href="search.html?dest=${key}" class="dest-card-v3" data-slide>
      <img src="${img}" alt="${DEST_NAMES[key]}" loading="lazy">
      <div class="dest-card-v3-overlay"></div>
      <div class="dest-card-v3-info">
        <span class="dest-card-v3-name">${DEST_NAMES[key]}</span>
      </div>
    </a>
  `).join('');
}

// ── Build V3 cruise card ──
function v3CruiseCard(c) {
  const DEST_TAG = {
    korea:'아시아', mediterranean:'지중해', alaska:'알래스카',
    caribbean:'카리브해', 'northern-europe':'북유럽', asia:'아시아/중동',
    'south-america':'남미', oceania:'오세아니아', hawaii:'하와이',
  };
  const img = c.image || 'https://images.unsplash.com/photo-1548574505-5e239809ee19?w=600&q=70';
  const tag = c.regionKo || c.region || '크루즈';
  const operator = c.operatorKo || c.operator || '';
  const ship = c.shipKo || c.ship || '';
  const title = c.nameKo || c.name || '크루즈 상품';
  const route = c.ports ? c.ports.map(p => p.nameKo || p.name).join(' → ') : '';
  const date = c.dateFrom ? c.dateFrom.replace(/-/g,'.') : '';
  const nights = c.duration ? c.duration + '박' : '';
  const price = c.priceFrom ? '$' + Number(c.priceFrom).toLocaleString() + '~' : '';
  const ref = c.ref || '';
  return `
    <div class="v3-cruise-card" data-slide>
      <div class="v3-cruise-card-img">
        <img src="${img}" alt="${title}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1548574505-5e239809ee19?w=600&q=60'">
        <span class="v3-cruise-card-tag">${tag}</span>
      </div>
      <div class="v3-cruise-card-body">
        <div class="v3-cruise-card-operator">${operator}${ship ? ' · ' + ship : ''}</div>
        <div class="v3-cruise-card-title">${title}</div>
        <div class="v3-cruise-card-route">${route}</div>
        <div class="v3-cruise-card-footer">
          <span class="v3-cruise-card-date">📅 ${date}${nights ? ' · ' + nights : ''}</span>
          <span class="v3-cruise-card-price">${price}</span>
        </div>
      </div>
      <a href="cruise-view.html?ref=${ref}" class="v3-cruise-card-btn">자세히 보기</a>
    </div>
  `;
}

// ── Ship data ──
const SHIPS = [
  { name: 'MSC 벨리시마', operator: 'MSC', img: 'https://images.unsplash.com/photo-1578894381163-e72c17f2d45f?w=600&q=80' },
  { name: 'MSC 월드 유로파', operator: 'MSC', img: 'https://images.unsplash.com/photo-1548574505-5e239809ee19?w=600&q=80' },
  { name: 'NCL 앙코르', operator: 'NCL', img: 'https://images.unsplash.com/photo-1622394806591-089cac94ee3e?w=600&q=80' },
  { name: 'NCL 조이', operator: 'NCL', img: 'https://images.unsplash.com/photo-1580541832626-2a7131ee809f?w=600&q=80' },
];

function buildShipCards() {
  const track = document.getElementById('shipTrack');
  if (!track) return;
  track.innerHTML = SHIPS.map(s => `
    <div class="ship-card" data-slide>
      <div class="ship-card-img"><img src="${s.img}" alt="${s.name}" loading="lazy"></div>
      <div class="ship-card-body">
        <div class="ship-card-operator">${s.operator}</div>
        <div class="ship-card-name">${s.name}</div>
      </div>
    </div>
  `).join('');
}

// ── Load cruises ──
async function loadDeals() {
  const grid = document.getElementById('dealsGrid');
  if (!grid) return;
  try {
    const cruises = await API.getRecommendedCruises(6);
    if (!cruises.length) { grid.innerHTML = '<p style="text-align:center;color:#999">크루즈 정보를 불러오는 중입니다...</p>'; return; }
    grid.innerHTML = cruises.map(c => v3CruiseCard(c)).join('');
  } catch(e) { console.error(e); }
}

async function loadFeat1() {
  const track = document.getElementById('featTrack1');
  if (!track) return;
  try {
    const cruises = await API.getRecommendedCruises(12);
    track.innerHTML = cruises.map(c => v3CruiseCard(c)).join('');
    feat1?.apply();
  } catch(e) {}
}

async function loadFeat2() {
  const track = document.getElementById('featTrack2');
  if (!track) return;
  try {
    const cruises = await API.getRecommendedCruises2(12);
    track.innerHTML = cruises.map(c => v3CruiseCard(c)).join('');
    feat2?.apply();
  } catch(e) {}
}

// ── Init ──
buildDestCards();
buildShipCards();
loadDeals();
loadFeat1();
loadFeat2();
setTimeout(() => { destSlider?.apply(); shipSlider?.apply(); feat1?.apply(); feat2?.apply(); }, 500);
