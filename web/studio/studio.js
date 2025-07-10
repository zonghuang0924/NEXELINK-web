// ===== 裝置與登入檢查 =====
window.onload = () => {
  const isMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);
  if (isMobile) {
    alert("Nexelink Studio 僅限桌機／筆電使用，請使用電腦開啟。")
    window.location.href = "/";
  }

  firebase.auth().onAuthStateChanged(user => {
    if (!user) {
      alert("請先登入後使用 Nexelink Studio");
      window.location.href = "/login.html";
    } else {
      loadSavedBlocks();
    }
  });
};

// ===== LOGO 點擊返回首頁前警告 =====
document.getElementById("logo").addEventListener("click", (e) => {
  e.preventDefault();
  const confirmLeave = confirm("⚠️ 離開前請確認是否已儲存專案！");
  if (confirmLeave) {
    window.location.href = "/";
  }
});

// ===== 拖曳模組插入邏輯 =====
const canvas = document.getElementById("canvas");
const modules = document.querySelectorAll(".module[draggable]");

modules.forEach(mod => {
  mod.addEventListener("dragstart", (e) => {
    e.dataTransfer.setData("text/plain", mod.dataset.type);
  });
});

canvas.addEventListener("dragover", (e) => {
  e.preventDefault();
});

canvas.addEventListener("drop", (e) => {
  e.preventDefault();
  const type = e.dataTransfer.getData("text/plain");
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  createBlock(x, y, type);
});

// ===== 建立畫布區塊 =====
function createBlock(x, y, type, id = generateID()) {
  const block = document.createElement("div");
  block.className = "canvas-block";
  block.style.left = `${x}px`;
  block.style.top = `${y}px`;
  block.id = id;

  const tools = document.createElement("div");
  tools.className = "block-tools";
  tools.innerHTML = `
    <button onclick="changeBlockColor(this)">🎨</button>
    <button onclick="removeBlock(this)">🗑️</button>
  `;
  block.appendChild(tools);

  const content = document.createElement("div");
  content.innerHTML = generateContent(type);
  block.appendChild(content);

  const label = document.createElement("div");
  label.className = "block-label";
  label.innerText = `ID: ${id}`;
  block.appendChild(label);

  canvas.appendChild(block);
  saveBlocks();
}

// ===== 產生模組內容 =====
function generateContent(type) {
  switch (type) {
    case "圖片":
      return `<img src="https://placekitten.com/160/100" style="width:100%;" />`;
    case "文字":
      return `<p>這是一段文字</p>`;
    case "影片":
      return `<iframe width="100%" height="100" src="https://www.youtube.com/embed/dQw4w9WgXcQ" frameborder="0"></iframe>`;
    case "音樂":
      return `<audio controls><source src="your-music.mp3" type="audio/mpeg" /></audio>`;
    case "按鈕":
      return `<button>點我</button>`;
    case "表單":
      return `<input type="text" placeholder="輸入內容" style="width:100%;" />`;
    case "地圖":
      return `<iframe width="100%" height="100" src="https://maps.google.com/maps?q=Taipei&t=&z=13&ie=UTF8&iwloc=&output=embed"></iframe>`;
    default:
      return `<p>[${type}] 模組</p>`;
  }
}

// ===== 區塊儲存與載入功能 =====
function saveBlocks() {
  const blocks = Array.from(document.querySelectorAll(".canvas-block")).map(block => ({
    id: block.id,
    x: block.style.left,
    y: block.style.top,
    html: block.innerHTML
  }));
  localStorage.setItem("studio_blocks", JSON.stringify(blocks));
}

function loadSavedBlocks() {
  const data = JSON.parse(localStorage.getItem("studio_blocks") || "[]");
  data.forEach(b => {
    const div = document.createElement("div");
    div.className = "canvas-block";
    div.id = b.id;
    div.style.left = b.x;
    div.style.top = b.y;
    div.innerHTML = b.html;
    canvas.appendChild(div);
  });
}

// ===== 工具功能 =====
function removeBlock(btn) {
  const block = btn.closest(".canvas-block");
  block.remove();
  saveBlocks();
}

function changeBlockColor(btn) {
  const block = btn.closest(".canvas-block");
  const color = prompt("請輸入背景顏色 HEX／英文名：", "#fff");
  if (color) block.style.backgroundColor = color;
  saveBlocks();
}

function generateID() {
  return Math.random().toString(36).substring(2, 10);
}

// ===== 畫布縮放功能（Ctrl + 滾輪） =====
let zoomLevel = 1;
canvas.addEventListener("wheel", (e) => {
  if (e.ctrlKey) {
    e.preventDefault();
    zoomLevel += e.deltaY * -0.001;
    zoomLevel = Math.min(Math.max(zoomLevel, 0.5), 2);
    canvas.style.transform = `scale(${zoomLevel})`;
    canvas.style.transformOrigin = "0 0";
  }
});
