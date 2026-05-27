const CANS = [
  { id: 'diet-coke',    name: 'Diet Coke',       colors: ['#c8102e','#c8102e','#222','#888','#c8102e'], type: 'gradient' },
  { id: 'coke',         name: 'Coca-Cola',        colors: ['#e2001a','#e2001a','#fff','#e2001a','#e2001a'], type: 'gradient' },
  { id: 'coke-zero',    name: 'Coke Zero',        colors: ['#111','#111','#e2001a','#e2001a','#111'], type: 'gradient' },
  { id: 'fanta',        name: 'Fanta Orange',     colors: ['#ff6a00','#ff6a00','#fff','#ff6a00','#ff9200'], type: 'gradient' },
  { id: 'fanta-lemon',  name: 'Fanta Lemon',      colors: ['#ffe400','#ffe400','#fff','#ffe400','#ffe400'], type: 'gradient' },
  { id: 'sprite',       name: 'Sprite',           colors: ['#00a651','#00a651','#fff','#ffe500','#00a651'], type: 'gradient' },
  { id: 'red-bull',     name: 'Red Bull',         colors: ['#c8102e','#c8102e','#212121','#212121','#c8102e'], type: 'gradient' },
  { id: 'red-bull-sf',  name: 'Red Bull SF',      colors: ['#95d0f5','#95d0f5','#fff','#95d0f5','#b8e0fa'], type: 'gradient' },
  { id: 'mezzo',        name: 'Mezzo Mix',        colors: ['#ff6a00','#c8102e','#c8102e','#ff6a00','#c8102e'], type: 'gradient' },
  { id: 'monster',      name: 'Monster',          colors: ['#1a1a1a','#1a1a1a','#3ddc56','#1a1a1a','#1a1a1a'], type: 'gradient' },
  { id: 'monster-ul',   name: 'Monster Ultra',    colors: ['#fff','#e8e8e8','#3ddc56','#e8e8e8','#fff'], type: 'gradient' },
  { id: 'becks',        name: "Beck's (beer)",    colors: ['#006633','#006633','#fff','#ffd700','#006633'], type: 'gradient' },
  { id: 'warsteiner',   name: 'Warsteiner',       colors: ['#b8960c','#b8960c','#fff','#b8960c','#d4a017'], type: 'gradient' },
  { id: 'schweppes',    name: 'Schweppes Tonic',  colors: ['#f5f5f5','#ddd','#1a1a1a','#ddd','#f5f5f5'], type: 'gradient' },
  { id: 'volvic-lemon', name: 'Volvic Lemon',     colors: ['#ffe400','#ffe400','#005baa','#ffe400','#ffe400'], type: 'gradient' },
  { id: 'fritz-cola',   name: 'fritz-kola',       colors: ['#1a1a1a','#1a1a1a','#e2001a','#1a1a1a','#1a1a1a'], type: 'gradient' },
];

function canGradient(can) {
  const c = can.colors;
  return `linear-gradient(to bottom, ${c[0]} 0%, ${c[0]} 8%, ${c[1]} 20%, ${c[2]} 48%, ${c[3]} 80%, ${c[4]} 100%)`;
}

function canBg(can) {
  return canGradient(can);
}

let selectedCan = CANS[0];
let isErasing = false;
let isPainting = false;
let grid = Array(150).fill(null); // null = empty


const palette = document.getElementById('palette');
CANS.forEach(can => {
  const el = document.createElement('div');
  el.className = 'can-option' + (can.id === selectedCan.id ? ' selected' : '');
  el.id = 'opt-' + can.id;
  el.innerHTML = `
    <div class="can-preview" style="background:${canGradient(can)};"></div>
    <div class="can-label">${can.name}</div>
  `;
  el.addEventListener('click', () => selectCan(can));
  palette.appendChild(el);
});


const gridEl = document.getElementById('grid');
for (let i = 0; i < 150; i++) {
  const cell = document.createElement('div');
  cell.className = 'can-cell';
  cell.dataset.index = i;
  cell.style.background = '#1a1a1a';
  cell.addEventListener('mousedown', (e) => { isPainting = true; paint(i); });
  cell.addEventListener('mouseover', (e) => { if (isPainting) paint(i); });
  gridEl.appendChild(cell);
}
document.addEventListener('mouseup', () => { isPainting = false; });

function paint(i) {
  const cells = gridEl.querySelectorAll('.can-cell');
  if (isErasing) {
    grid[i] = null;
    cells[i].style.background = '#1a1a1a';
    cells[i].title = '';
  } else {
    grid[i] = selectedCan.id;
    cells[i].style.background = canBg(selectedCan);
    cells[i].title = selectedCan.name;
  }
}

function selectCan(can) {
  selectedCan = can;
  isErasing = false;
  document.querySelectorAll('.can-option').forEach(el => el.classList.remove('selected'));
  document.getElementById('opt-' + can.id)?.classList.add('selected');
  document.getElementById('eraser-btn').classList.remove('selected');
  document.getElementById('mode-hint').textContent = 'Mode: Paint · ' + can.name;
}

function selectEraser() {
  isErasing = true;
  document.querySelectorAll('.can-option').forEach(el => el.classList.remove('selected'));
  document.getElementById('eraser-btn').classList.add('selected');
  document.getElementById('mode-hint').textContent = 'Mode: Erase';
}

function fillAll() {
  for (let i = 0; i < 150; i++) paint(i);
}

function clearAll() {
  const cells = gridEl.querySelectorAll('.can-cell');
  for (let i = 0; i < 150; i++) {
    grid[i] = null;
    cells[i].style.background = '#1a1a1a';
    cells[i].title = '';
  }
}

function loadPreset(name) {
  clearAll();
  const cells = gridEl.querySelectorAll('.can-cell');

  function set(i, canId) {
    const can = CANS.find(c => c.id === canId);
    if (!can) return;
    grid[i] = canId;
    cells[i].style.background = canBg(can);
    cells[i].title = can.name;
  }

  if (name === 'diagonal') {
    // Diet Coke dominant, diagonal stripe of Coke Zero, Sprite accent
    for (let r = 0; r < 10; r++) {
      for (let c = 0; c < 15; c++) {
        const i = r * 15 + c;
        const d = (r + c) % 7;
        if (d < 3) set(i, 'diet-coke');
        else if (d < 5) set(i, 'coke-zero');
        else set(i, 'sprite');
      }
    }
  } else if (name === 'flag') {
    // German flag: black top, red middle, gold (Warsteiner/Fanta lemon) bottom
    for (let r = 0; r < 10; r++) {
      for (let c = 0; c < 15; c++) {
        const i = r * 15 + c;
        if (r < 3) set(i, 'coke-zero');        // black
        else if (r < 6) set(i, 'diet-coke');   // red (Diet Coke)
        else if (r < 9) set(i, 'fanta-lemon'); // gold
        else set(i, 'fanta');                   // orange bottom border
      }
    }
  } else if (name === 'chaos') {
    const ids = CANS.map(c => c.id);
    // Diet Coke biased random
    const biasedPool = [...ids, ...Array(6).fill('diet-coke'), 'coke-zero', 'monster', 'red-bull'];
    for (let i = 0; i < 150; i++) {
      set(i, biasedPool[Math.floor(Math.random() * biasedPool.length)]);
    }
  }
}


const legend = document.getElementById('legend');
CANS.forEach(can => {
  const item = document.createElement('div');
  item.className = 'legend-item';
  item.innerHTML = `<div class="legend-dot" style="background:${can.colors[1]};"></div>${can.name}`;
  legend.appendChild(item);
});


loadPreset('diagonal');
