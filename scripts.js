// CANS - List of the cans, eddit this to modify the can selection(palette)

const CANS = [
  { id: "monster", name: "Monster", abv: "MO" },
  { id: "mezzomix", name: "Mezzo Mix", abv: "MM" },
  { id: "redbullberry", name: "Red Bull Berry", abv: "RB" },
  { id: "redbullgreen", name: "Red Bull Green", abv: "RG" },
  { id: "redbulldarkblue", name: "Red Bull Dark Blue", abv: "RD" },
  { id: "redbullclassic", name: "Red Bull Classic", abv: "RC" },
  { id: "redbullapple2", name: "Red Bull Apple", abv: "RA" },
  { id: "redbullpink", name: "Red Bull Pink", abv: "RP" },
  { id: "monsterwhite", name: "Monster White", abv: "MW" },
  { id: "cokezero", name: "Coca-Cola Zero", abv: "CZ" },
  { id: "pepsiclassic", name: "Pepsi Classic", abv: "PC" },
  { id: "cokeclassic", name: "Coca-Cola Classic", abv: "CC" },
  { id: "fantaorange", name: "Fanta Orange", abv: "FO" },
  { id: "fantalemon", name: "Fanta Lemon", abv: "FL" },
  { id: "pepsistraberrycream", name: "Pepsi Strawberry Cream", abv: "PS" },
  { id: "pepsilemonlime", name: "Pepsi Lemon Lime", abv: "PL" },
  { id: "spriteclassic", name: "Sprite Classic", abv: "SC" },
  { id: "redbullwhite", name: "Red Bull White", abv: "RW" },
  { id: "pepsizero", name: "Pepsi Zero", abv: "PZ" },
  { id: "pepsicream", name: "Pepsi Cream", abv: "PC" },
];

const CAN_BY_ID = {};
CANS.forEach((c) => {
  CAN_BY_ID[c.id] = c;
});

let gridWidth = 0;
let gridHeight = 0;
let grid = []; // array of can ids or null
let selectedCan = null;
let isPainting = false;
let isErasing = false;

const gridEl = document.getElementById("grid");

// Palette construction(showing the cans available)
function fillPalette() {
  const palette = document.getElementById("palette");
  palette.innerHTML = "";
  CANS.forEach((can) => {
    const el = document.createElement("div");
    el.className =
      "can-option" + (selectedCan?.id === can.id ? " selected" : "");
    el.id = "opt-" + can.id;
    el.innerHTML = `
      <div class="can-preview">
        <img class="canprevimg" src="images/${can.id}.png" alt="${can.name}">
      </div>
      <div class="can-label">${can.name}</div>
    `;
    el.addEventListener("click", () => selectCan(can));
    palette.appendChild(el);
  });
}

// Building the can grid i.e. canvas to make the art
function gridConst() {
  document.getElementById("input").style.display = "none";
  document.getElementById("layout").style.display = "flex";
  document.getElementById("matrix-section").style.display = "block";
  document.getElementById("counts-section").style.display = "block";
  document.getElementById("print-bar").style.display = "flex";

  gridWidth = parseInt(document.getElementById("width").value) || 15;
  gridHeight = parseInt(document.getElementById("height").value) || 10;

  document
    .querySelectorAll("cols")
    .forEach((el) => (el.textContent = gridWidth));
  document
    .querySelectorAll("rows")
    .forEach((el) => (el.textContent = gridHeight));
  document
    .querySelectorAll(".canCount")
    .forEach((el) => (el.textContent = gridWidth * gridHeight));
  document
    .querySelectorAll(".structurew")
    .forEach((el) => (el.textContent = gridWidth * 66));
  document
    .querySelectorAll(".structureh")
    .forEach((el) => (el.textContent = gridHeight * 120));

  const gridCount = gridWidth * gridHeight;
  grid = new Array(gridCount).fill(null);

  gridEl.innerHTML = "";
  gridEl.style.gridTemplateColumns = `repeat(${gridWidth}, 1fr)`;

  for (let i = 0; i < gridCount; i++) {
    const cell = document.createElement("div");
    cell.className = "can-cell";
    cell.dataset.index = i;
    cell.addEventListener("mousedown", () => {
      isPainting = true;
      paint(i);
    });
    cell.addEventListener("mouseover", () => {
      if (isPainting) paint(i);
    });
    gridEl.appendChild(cell);
  }

  buildMatrixShell();
  buildScreenLegend();
  refreshMatrix();
  refreshCounts();
}

document.addEventListener("mouseup", () => {
  isPainting = false;
});

//Function to actually paint the grid
function paint(i) {
  const cells = gridEl.querySelectorAll(".can-cell");

  if (isErasing) {
    grid[i] = null;
    cells[i].innerHTML = "";
    cells[i].title = "";
  } else {
    if (!selectedCan) return;
    grid[i] = selectedCan.id;
    cells[i].innerHTML = "";
    const img = document.createElement("img");
    img.src = `images/${selectedCan.id}.png`;
    img.alt = selectedCan.name;
    img.classList.add("can-img");
    cells[i].appendChild(img);
    cells[i].title = selectedCan.name;
  }

  updateMatrixCell(i);
  refreshCounts();
}

//Functions to select a can or eraser from the palette
function selectCan(can) {
  selectedCan = can;
  isErasing = false;
  document
    .querySelectorAll(".can-option")
    .forEach((el) => el.classList.remove("selected"));
  document.getElementById("opt-" + can.id)?.classList.add("selected");
  document.getElementById("eraser-btn").classList.remove("selected");
  document.getElementById("mode-hint").textContent =
    `Mode: Paint · ${can.name}`;
}

function selectEraser() {
  isErasing = true;
  document
    .querySelectorAll(".can-option")
    .forEach((el) => el.classList.remove("selected"));
  document.getElementById("eraser-btn").classList.add("selected");
  document.getElementById("mode-hint").textContent = "Mode: Erase";
}

//fill & clear all functions
function fillAll() {
  if (!selectedCan) return;
  for (let i = 0; i < grid.length; i++) paint(i);
}

function clearAll() {
  const cells = gridEl.querySelectorAll(".can-cell");
  for (let i = 0; i < grid.length; i++) {
    grid[i] = null;
    cells[i].innerHTML = "";
    cells[i].title = "";
  }
  refreshMatrix();
  refreshCounts();
}

// 3 presets - Diagonal(hard coded, cans can be changed)
// making German Flag and random printer
function loadPreset(name) {
  clearAll();

  function set(i, canId) {
    const can = CAN_BY_ID[canId];
    if (!can) return;
    const oldCan = selectedCan;
    selectedCan = can;
    paint(i);
    selectedCan = oldCan;
  }

  if (name === "diagonal") {
    for (let r = 0; r < gridHeight; r++) {
      for (let c = 0; c < gridWidth; c++) {
        const i = r * gridWidth + c;
        const d = (r + c) % 7;
        if (d < 3) set(i, "cokezero");
        else if (d < 5) set(i, "spriteclassic");
        else set(i, "monster");
      }
    }
  } else if (name === "flag") {
    const third = gridHeight / 3;
    for (let r = 0; r < gridHeight; r++) {
      for (let c = 0; c < gridWidth; c++) {
        const i = r * gridWidth + c;
        if (r < third) set(i, "monster");
        else if (r < third * 2) set(i, "cokezero");
        else set(i, "fantalemon");
      }
    }
  } else if (name === "chaos") {
    const ids = CANS.map((c) => c.id);
    for (let i = 0; i < grid.length; i++) {
      set(i, ids[Math.floor(Math.random() * ids.length)]);
    }
  }
}

//Matrix that shows the painting as a table
function buildMatrixShell() {
  const table = document.getElementById("matrix-table");
  table.innerHTML = "";

  const thead = table.createTHead();
  const hr = thead.insertRow();
  const th0 = document.createElement("th");
  th0.textContent = "#";
  hr.appendChild(th0);
  for (let c = 1; c <= gridWidth; c++) {
    const th = document.createElement("th");
    th.textContent = `C${c}`;
    hr.appendChild(th);
  }

  const tbody = table.createTBody();
  for (let r = 0; r < gridHeight; r++) {
    const tr = tbody.insertRow();
    tr.id = `mrow-${r}`;

    const lbl = document.createElement("td");
    lbl.className = "row-lbl";
    lbl.textContent = `R${r + 1}`;
    tr.appendChild(lbl);

    for (let c = 0; c < gridWidth; c++) {
      const td = document.createElement("td");
      td.id = `mcell-${r}-${c}`;
      td.className = "empty-cell";
      td.textContent = "—";
      tr.appendChild(td);
    }
  }
}

function updateMatrixCell(i) {
  const r = Math.floor(i / gridWidth);
  const c = i % gridWidth;
  const td = document.getElementById(`mcell-${r}-${c}`);
  if (!td) return;

  const canId = grid[i];
  if (!canId) {
    td.textContent = "—";
    td.className = "empty-cell";
    td.style.background = "";
    td.style.color = "";
  } else {
    const can = CAN_BY_ID[canId];
    td.textContent = can.abv;
    td.title = can.name; // full name on hover
    td.className = "";
    const color = cellColor(canId);
    td.style.background = color.bg;
    td.style.color = color.fg;
  }
}

function refreshMatrix() {
  for (let i = 0; i < grid.length; i++) {
    updateMatrixCell(i);
  }
}

//colour coding the matrix cells, categorised by brands
function cellColor(id) {
  if (id.startsWith("coke") || id === "cokeclassic")
    return { bg: "#2a0005", fg: "#ff9999" };
  if (id.startsWith("pepsi")) return { bg: "#001030", fg: "#88aaff" };
  if (id.startsWith("fanta")) return { bg: "#251000", fg: "#ffbb55" };
  if (id === "spriteclassic") return { bg: "#002200", fg: "#66ee44" };
  if (id === "monster") return { bg: "#060606", fg: "#44ee55" };
  if (id === "monsterwhite") return { bg: "#1a1a22", fg: "#cccccc" };
  if (id === "mezzomix") return { bg: "#1a0800", fg: "#ffaa44" };
  if (id.startsWith("redbull")) return { bg: "#1a001a", fg: "#ffaadd" };
  return { bg: "#111", fg: "#888" };
}

//Shopping list - counts the cans and their types to
// give you the list to which and how many cans you need to buy
function refreshCounts() {
  const counts = {};
  grid.forEach((id) => {
    if (id) counts[id] = (counts[id] || 0) + 1;
  });

  const el = document.getElementById("counts-grid");
  el.innerHTML = "";

  if (Object.keys(counts).length === 0) {
    el.innerHTML =
      '<span style="font-size:0.6rem;color:#333;letter-spacing:0.1em;text-transform:uppercase;">Paint the grid to see your shopping list</span>';
    return;
  }

  Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .forEach(([id, n]) => {
      const can = CAN_BY_ID[id];
      const card = document.createElement("div");
      card.className = "count-card";
      card.innerHTML = `
        <div class="count-thumb">
          <img src="imaegs/${id}.png" alt="${can.name}">
        </div>
        <div class="count-info">
          <strong>${n}</strong>
          ${can.name}
        </div>
      `;
      el.appendChild(card);
    });
}

//Print function to make a print of the art,
//shoppting list, and the matrix to
//use as a checklist and tracker
function doPrint() {
  document
    .querySelectorAll(".print-chunk, .chunk-label")
    .forEach((el) => el.remove());

  if (!gridWidth || !gridHeight) {
    window.print();
    return;
  }

  //for A4 paper
  const COLS_PER_CHUNK = 40; // 2-char abvs are much narrower than full names
  const totalChunks = Math.ceil(gridWidth / COLS_PER_CHUNK);
  const matrixSection = document.getElementById("matrix-section");

  for (let chunk = 0; chunk < totalChunks; chunk++) {
    const colStart = chunk * COLS_PER_CHUNK;
    const colEnd = Math.min(colStart + COLS_PER_CHUNK, gridWidth);

    const label = document.createElement("div");
    label.className = "chunk-label";
    label.textContent =
      totalChunks > 1
        ? "Columns " + (colStart + 1) + "\u2013" + colEnd + " of " + gridWidth
        : "All " + gridWidth + " columns";
    matrixSection.appendChild(label);

    const wrapper = document.createElement("div");
    wrapper.className = "print-chunk";
    const tbl = document.createElement("table");

    const thead = tbl.createTHead();
    const hrow = thead.insertRow();
    const th0 = document.createElement("th");
    th0.textContent = "#";
    hrow.appendChild(th0);
    for (let c = colStart; c < colEnd; c++) {
      const th = document.createElement("th");
      th.textContent = "C" + (c + 1);
      hrow.appendChild(th);
    }

    const tbody = tbl.createTBody();
    for (let r = 0; r < gridHeight; r++) {
      const tr = tbody.insertRow();
      const lbl = document.createElement("td");
      lbl.className = "row-lbl";
      lbl.textContent = "R" + (r + 1);
      tr.appendChild(lbl);
      for (let c = colStart; c < colEnd; c++) {
        const canId = grid[r * gridWidth + c];
        const td = document.createElement("td");
        if (!canId) {
          td.className = "empty-cell";
          td.textContent = "\u2014";
        } else {
          const can = CAN_BY_ID[canId];
          td.textContent = can.abv;
          td.title = can.name;
          const color = cellColor(canId);
          td.style.background = color.bg;
          td.style.color = color.fg;
        }
        tr.appendChild(td);
      }
    }

    wrapper.appendChild(tbl);
    matrixSection.appendChild(wrapper);
  }

  //lists all the abbreviations and their full forms
  const legendWrap = document.createElement("div");
  legendWrap.className = "print-chunk";
  legendWrap.id = "print-legend";

  const legendTitle = document.createElement("div");
  legendTitle.className = "chunk-label";
  legendTitle.textContent = "Legend — Abbreviation Key";
  matrixSection.appendChild(legendTitle);

  const legendTable = document.createElement("table");
  legendTable.style.width = "100%";
  const lthead = legendTable.createTHead();
  const lhrow = lthead.insertRow();
  ["ABV", "Full Name", "ABV", "Full Name", "ABV", "Full Name"].forEach(
    (txt) => {
      const th = document.createElement("th");
      th.textContent = txt;
      lhrow.appendChild(th);
    },
  );

  const ltbody = legendTable.createTBody();
  const LEGEND_COLS = 3;
  for (let i = 0; i < CANS.length; i += LEGEND_COLS) {
    const ltr = ltbody.insertRow();
    for (let j = 0; j < LEGEND_COLS; j++) {
      const can = CANS[i + j];
      const tdAbv = document.createElement("td");
      const tdName = document.createElement("td");
      if (can) {
        const color = cellColor(can.id);
        tdAbv.textContent = can.abv;
        tdAbv.style.background = color.bg;
        tdAbv.style.color = color.fg;
        tdAbv.style.fontWeight = "bold";
        tdName.textContent = can.name;
        tdName.style.color = "#333";
      }
      ltr.appendChild(tdAbv);
      ltr.appendChild(tdName);
    }
  }

  legendWrap.appendChild(legendTable);
  matrixSection.appendChild(legendWrap);

  setTimeout(function () {
    window.print();
    setTimeout(function () {
      document
        .querySelectorAll(".print-chunk, .chunk-label, #print-legend")
        .forEach((el) => el.remove());
    }, 1500);
  }, 150);
}

//same legend as above, but just for the display
function buildScreenLegend() {
  const wrap = document.getElementById("screen-legend");
  wrap.style.display = "block";
  wrap.innerHTML = "";

  const title = document.createElement("div");
  title.className = "leg-title";
  title.textContent = "Abbreviation Key";
  wrap.appendChild(title);

  const grid = document.createElement("div");
  grid.className = "leg-grid";

  CANS.forEach((can) => {
    const color = cellColor(can.id);
    const row = document.createElement("div");
    row.className = "leg-row";
    row.innerHTML = `
      <span class="leg-abv" style="background:${color.bg};color:${color.fg}">${can.abv}</span>
      <span class="leg-name">${can.name}</span>
    `;
    grid.appendChild(row);
  });

  wrap.appendChild(grid);
}

//enjoy
fillPalette();
refreshCounts();
