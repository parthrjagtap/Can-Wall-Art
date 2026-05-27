const CANS = [
  { id: "monster", name: "Monster" },
  { id: "mezzomix", name: "Mezzo Mix" },
  { id: "redbullberry", name: "Red Bull Berry" },
  { id: "redbullgreen", name: "Red Bull Green" },
  { id: "redbulldarkblue", name: "Red Bull Dark Blue" },
  { id: "redbullclassic", name: "Red Bull Classic" },
  { id: "redbullapple2", name: "Red Bull Apple" },
  { id: "redbullpink", name: "Red Bull Pink" },
  { id: "monsterwhite", name: "Monster White" },
  { id: "cokezero", name: "Coca-Cola Zero" },
  { id: "pepsiclassic", name: "Pepsi Classic" },
  { id: "cokeclassic", name: "Coca-Cola Classic" },
  { id: "fantaorange", name: "Fanta Orange" },
  { id: "fantalemon", name: "Fanta Lemon" },
  { id: "pepsistraberrycream", name: "Pepsi Strawberry Cream" },
  { id: "pepsilemonlime", name: "Pepsi Lemon Lime" },
  { id: "spriteclassic", name: "Sprite Classic" },
  { id: "redbullwhite", name: "Red Bull White" },
];

// function paint(i) {
//   const cells = gridEl.querySelectorAll(".can-cell");
//   if (isErasing) {
//     grid[i] = null;
//     cells[i].style.background = "#1a1a1a";
//     cells[i].title = "";
//   } else {
//     grid[i] = selectedCan.id;
//     cells[i].style.background = `url(images/'${grid[i]}.png')`;
//     cells[i].style.backgroundSize = "cover";
//     cells[i].title = selectedCan.name;
//   }
// }

let gridWidth = 0;
let gridHeight = 0;

let grid = [];
let selectedCan = null;

let isPainting = false;
let isErasing = false;

const gridEl = document.getElementById("grid");

// let selectedCan = CANS[0];
// let isErasing = false;
// let isPainting = false;
// let grid = Array(150).fill(null); // null = empty

// Build palette

// BUILD GRID
function gridConst() {
  document.getElementById("input").style.display = "none";
  document.getElementById("layout").style.display = "flex";

  gridWidth = parseInt(document.getElementById("width").value);
  gridHeight = parseInt(document.getElementById("height").value);

  // cols.innerHTML = gridWidth;
  // rows.innerHTML = gridHeight;
  for (let i = 0; i < 2; i++) {
    document.getElementsByClassName("canCount")[i].innerHTML =
      gridWidth * gridHeight;
    document.getElementsByClassName("cols")[i].innerHTML = gridWidth;
    document.getElementsByClassName("rows")[i].innerHTML = gridHeight;
    document.getElementsByClassName("structureh")[i].innerHTML =
      (gridHeight * 120) / 10;

    document.getElementsByClassName("structurew")[i].innerHTML =
      (gridWidth * 66) / 10;
  }
  const gridCount = gridWidth * gridHeight;

  grid = new Array(gridCount).fill(null);

  gridEl.innerHTML = "";

  gridEl.style.display = "grid";
  gridEl.style.gridTemplateColumns = `repeat(${gridWidth},1fr)`;

  for (let i = 0; i < gridCount; i++) {
    const cell = document.createElement("div");

    cell.className = "can-cell";
    cell.dataset.index = i;

    cell.addEventListener("mousedown", () => {
      isPainting = true;
      paint(i);
    });

    cell.addEventListener("mouseover", () => {
      if (isPainting) {
        paint(i);
      }
    });

    gridEl.appendChild(cell);
  }
}

fillPalette();

document.addEventListener("mouseup", () => {
  isPainting = false;
});

function fillPalette() {
  //   const palette = document.getElementById('palette');
  //   CANS.forEach(can => {
  //   const el = document.createElement('div');
  //   el.className = 'can-option' + (can.id === selectedCan.id ? ' selected' : '');
  //   el.id = 'opt-' + can.id;
  //   el.innesrHTML = `
  //     <div class="can-preview" ">
  //       <img class="canprevimg" src="${can.id}.png" alt="${can.name}">
  //       </div>
  //     <div class="can-label">${can.name}</div>
  //   `;
  //   el.addEventListener('click', () => selectCan(can));
  //   palette.appendChild(el);
  // });

  const palette = document.getElementById("palette");

  palette.innerHTML = "";

  CANS.forEach((can) => {
    const el = document.createElement("div");

    el.className =
      "can-option" + (selectedCan?.id === can.id ? " selected" : "");

    el.id = "opt-" + can.id;

    el.innerHTML = `
        <div class="can-preview">
            <img
                class="canprevimg"
                src="images/${can.id}.png"
                alt="${can.name}"
            >
        </div>

        <div class="can-label">
            ${can.name}
        </div>
    `;

    el.addEventListener("click", () => {
      selectCan(can);
    });

    palette.appendChild(el);
  });
}
// PAINT CELL
function paint(i) {
  const cells = gridEl.querySelectorAll(".can-cell");

  if (isErasing) {
    grid[i] = null;

    cells[i].innerHTML = "";
    cells[i].title = "";
  } else {
    grid[i] = selectedCan.id;

    cells[i].innerHTML = "";

    const img = document.createElement("img");

    img.src = `images/${selectedCan.id}.png`;
    img.alt = selectedCan.name;
    img.classList.add("can-img");

    cells[i].appendChild(img);

    cells[i].title = selectedCan.name;
  }
}

// SELECT CAN
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

// FILL GRID
function fillAll() {
  if (!selectedCan) return;

  for (let i = 0; i < grid.length; i++) {
    paint(i);
  }
}

// CLEAR GRID
function clearAll() {
  const cells = gridEl.querySelectorAll(".can-cell");

  for (let i = 0; i < grid.length; i++) {
    grid[i] = null;

    cells[i].innerHTML = "";
    cells[i].title = "";
  }
}

// PRESETS
function loadPreset(name) {
  clearAll();

  function set(i, canId) {
    const can = CANS.find((c) => c.id === canId);

    if (!can) return;

    const oldCan = selectedCan;

    selectedCan = can;

    paint(i);

    selectedCan = oldCan;
  }

  if (name === "diagonal") {
    for (let r = 0; r < gridHeight; r++) {
      for (let c = 0; c < gridWidth; c++) {
        let i = r * gridWidth + c;

        let d = (r + c) % 7;

        if (d < 3) set(i, "cokezero");
        else if (d < 5) set(i, "spriteclassic");
        else set(i, "monster");
      }
    }
  } else if (name === "flag") {
    let third = gridHeight / 3;

    for (let r = 0; r < gridHeight; r++) {
      for (let c = 0; c < gridWidth; c++) {
        let i = r * gridWidth + c;

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
