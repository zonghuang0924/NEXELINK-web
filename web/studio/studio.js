// 假設你使用 Firebase Auth
firebase.auth().onAuthStateChanged(user => {
  if (!user) {
    alert("請先登入後使用 Nexelink Studio");
    window.location.href = "/login.html";
  }
});

// 返回首頁前的提示
document.getElementById("logo").addEventListener("click", (e) => {
  e.preventDefault();
  const confirmLeave = confirm("⚠️ 離開前請確認是否已儲存專案！");
  if (confirmLeave) {
    window.location.href = "/";
  }
});

// 產生 30x30 的畫布格子
const canvas = document.getElementById("canvas");
const ROWS = 30, COLS = 30;
for (let i = 0; i < ROWS * COLS; i++) {
  const cell = document.createElement("div");
  cell.classList.add("grid-cell");
  canvas.appendChild(cell);
}

// 框選格子行為
let isSelecting = false;
let selectedCells = [];

canvas.addEventListener("mousedown", (e) => {
  if (!e.target.classList.contains("grid-cell")) return;
  clearSelection();
  isSelecting = true;
  e.target.classList.add("selected");
  selectedCells.push(e.target);
});

canvas.addEventListener("mouseover", (e) => {
  if (isSelecting && e.target.classList.contains("grid-cell")) {
    if (!selectedCells.includes(e.target)) {
      e.target.classList.add("selected");
      selectedCells.push(e.target);
    }
  }
});

canvas.addEventListener("mouseup", () => {
  isSelecting = false;
});

// 清除框選狀態
function clearSelection() {
  selectedCells.forEach(cell => cell.classList.remove("selected"));
  selectedCells = [];
}

// 拖拉模組插入區塊
const modules = document.querySelectorAll(".module[draggable]");
modules.forEach(mod => {
  mod.addEventListener("dragstart", (e) => {
    e.dataTransfer.setData("text/plain", mod.title);
  });
});

canvas.addEventListener("dragover", (e) => {
  e.preventDefault();
});

canvas.addEventListener("drop", (e) => {
  e.preventDefault();
  const type = e.dataTransfer.getData("text/plain");
  if (selectedCells.length === 0) {
    alert("請先框選畫布區塊再拖入模組！");
    return;
  }
  insertModule(type, selectedCells);
  clearSelection();
});

// 插入模組區塊
function insertModule(type, cells) {
  const firstCell = cells[0];
  const block = document.createElement("div");
  block.classList.add("block");

  // 工具欄（三個點）
  const tools = document.createElement("div");
  tools.classList.add("block-tools");
  tools.innerHTML = `
    <button onclick="changeBlockColor(this)">🎨</button>
    <button onclick="removeBlock(this)">🗑️</button>
  `;
  block.appendChild(tools);

  // 模組內容簡易示意
  switch (type) {
    case "圖片":
      block.innerHTML += `<img src="https://placekitten.com/120/80" alt="示意圖" style="width:100%;">`;
      break;
    case "文字":
      block.innerHTML += `<p>這是一段文字</p>`;
      break;
    case "影片":
      block.innerHTML += `<iframe width="100%" height="100" src="https://www.youtube.com/embed/dQw4w9WgXcQ" frameborder="0" allowfullscreen></iframe>`;
      break;
    case "音樂":
      block.innerHTML += `<audio controls><source src="your-music.mp3" type="audio/mpeg" /></audio>`;
      break;
    case "按鈕":
      block.innerHTML += `<button style="padding: 6px 12px;">點我</button>`;
      break;
    case "Icon":
      block.innerHTML += `<i class="fas fa-star"></i>`;
      break;
    case "表單":
      block.innerHTML += `<input type="text" placeholder="輸入內容" style="width:100%;">`;
      break;
    case "地圖":
      block.innerHTML += `<iframe width="100%" height="100" src="https://maps.google.com/maps?q=Taipei&t=&z=13&ie=UTF8&iwloc=&output=embed" frameborder="0"></iframe>`;
      break;
    default:
      block.innerHTML += `<p>[${type}] 區塊</p>`;
  }

  // 插入位置
  firstCell.innerHTML = "";
  firstCell.appendChild(block);
  firstCell.classList.remove("selected");
}

// 刪除模組區塊
function removeBlock(btn) {
  const block = btn.closest(".block");
  block.parentElement.innerHTML = ""; // 清空 grid-cell
}

// 更改區塊顏色
function changeBlockColor(btn) {
  const block = btn.closest(".block");
  const color = prompt("請輸入區塊背景顏色（可填 HEX、英文色名等）：", "#fcd34d");
  if (color) block.style.backgroundColor = color;
}
