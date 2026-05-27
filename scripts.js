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

const gridEl = document.getElementById("grid");

let selectedCan = CANS[0];
let isErasing = false;
let isPainting = false;
let grid = Array(150).fill(null);
const palette = document.getElementById("palette");
CANS.forEach((can) => {
  const el = document.createElement("div");
  el.className = "can-option" + (can.id === selectedCan.id ? " selected" : "");
  el.id = "opt-" + can.id;
  el.innerHTML = `
    <div class="can-preview" ">
      <img class="canprevimg" src="images/${can.id}.png" alt="${can.name}">
      </div>
    <div class="can-label">${can.name}</div>
  `;
  el.addEventListener("click", () => selectCan(can));
  palette.appendChild(el);
});

function gridConst() {
 
  const gridEl = document.getElementById("grid");
  for (let i = 0; i < 150; i++) {
    const cell = document.createElement("div");
    cell.className = "can-cell";
    cell.dataset.index = i;
    cell.style.background = "#1a1a1a";
    cell.addEventListener("mousedown", (e) => {
      isPainting = true;
      paint(i);
    });
    cell.addEventListener("mouseover", (e) => {
      if (isPainting) paint(i);
    });
    gridEl.appendChild(cell);
  }
  document.addEventListener("mouseup", () => {
    isPainting = false;
  });
}
gridConst();
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

function paint(i) {
  const cells = gridEl.querySelectorAll(".can-cell");

  if (isErasing) {
    grid[i] = null;

    cells[i].innerHTML = ""; // remove image
    cells[i].title = "";
  } else {
    grid[i] = selectedCan.id;

    // Remove previous image if one exists
    cells[i].innerHTML = "";

    const img = document.createElement("img");
    img.src = `images/${grid[i]}.png`;
    img.alt = selectedCan.name;
    img.classList.add("can-img");

    cells[i].appendChild(img);

    cells[i].title = selectedCan.name;
  }
}

function selectCan(can) {
  selectedCan = can;
  isErasing = false;
  document
    .querySelectorAll(".can-option")
    .forEach((el) => el.classList.remove("selected"));
  document.getElementById("opt-" + can.id)?.classList.add("selected");
  document.getElementById("eraser-btn").classList.remove("selected");
  document.getElementById("mode-hint").textContent =
    "Mode: Paint · " + can.name;
}

function selectEraser() {
  isErasing = true;
  document
    .querySelectorAll(".can-option")
    .forEach((el) => el.classList.remove("selected"));
  document.getElementById("eraser-btn").classList.add("selected");
  document.getElementById("mode-hint").textContent = "Mode: Erase";
}

function fillAll() {
  for (let i = 0; i < 225; i++) paint(i);
}

function clearAll() {
  const cells = gridEl.querySelectorAll(".can-cell");
  for (let i = 0; i < 225; i++) {
    grid[i] = null;
    cells[i].innerHTML = "";
    cells[i].title = "";
  }
}

function loadPreset(name) {
  clearAll();
  const cells = gridEl.querySelectorAll(".can-cell");

  function set(i, canId) {
    const can = CANS.find((c) => c.id === canId);
    if (!can) return;
    grid[i] = canId;
    cells[i].style.background = canBg(can);
    cells[i].title = can.name;
  }

  if (name === "diagonal") {
    // Diet Coke dominant, diagonal stripe of Coke Zero, Sprite accent
    for (let r = 0; r < 10; r++) {
      for (let c = 0; c < 15; c++) {
        const i = r * 15 + c;
        const d = (r + c) % 7;
        if (d < 3) set(i, "diet-coke");
        else if (d < 5) set(i, "coke-zero");
        else set(i, "sprite");
      }
    }
  } else if (name === "flag") {
    // German flag: black top, red middle, gold (Warsteiner/Fanta lemon) bottom
    for (let r = 0; r < 10; r++) {
      for (let c = 0; c < 15; c++) {
        const i = r * 15 + c;
        if (r < 3)
          set(i, "redbullwhite"); // black
        else if (r < 6)
          set(i, "cokezero"); // red (Diet Coke)
        else if (r < 9)
          set(i, "fantalemon"); // gold
        else set(i, "fantaorange"); // orange bottom border
      }
    }
  } else if (name === "chaos") {
    const ids = CANS.map((c) => c.id);
    // Diet Coke biased random
    const biasedPool = [
      ...ids,
      ...Array(6).fill("diet-coke"),
      "coke-zero",
      "monster",
      "red-bull",
    ];
    for (let i = 0; i < 150; i++) {
      set(i, biasedPool[Math.floor(Math.random() * biasedPool.length)]);
    }
  }
}



