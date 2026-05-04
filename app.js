const STORAGE_KEY = "mermaidQuestStateV2";
const dayNames = ["日", "月", "火", "水", "木", "金", "土"];
const categories = ["思いやり", "ひらめき", "習慣力", "考える力", "ふりかえり力", "継続力", "夢を描く力"];

const mermaids = [
  { id: "miina", name: "ミーナ", avatarClass: "miina", color: "#ff8fa3", type: "協調のマーメイド", category: "思いやり", copy: "みんなを助けるやさしい力", line: "あなたのおかげで、みんなが助かったよ。" },
  { id: "luna", name: "ルナ", avatarClass: "luna", color: "#aa8de8", type: "ひらめきのマーメイド", category: "ひらめき", copy: "楽しくひらめく自由な力", line: "そのひらめき、すごく素敵！" },
  { id: "leefa", name: "リーファ", avatarClass: "leefa", color: "#47b98e", type: "積み重ねのマーメイド", category: "習慣力", copy: "毎日つづける確かな力", line: "順番にできたね。確実に力になっているよ。" },
  { id: "selena", name: "セレナ", avatarClass: "selena", color: "#2e73c6", type: "知恵のマーメイド", category: "考える力", copy: "未来を考える知恵の力", line: "その考え方、未来につながっているね。" }
];

const defaultTasks = [
  { id: "homework", name: "宿題", days: ["月", "火", "水", "木", "金"], time: "17:00", minutes: 30, category: "習慣力", character: "タコ先生", life: 10, pearl: 5, coin: 1 },
  { id: "prepare", name: "明日の準備", days: ["毎日"], time: "20:00", minutes: 10, category: "習慣力", character: "リッキー", life: 5, pearl: 3, coin: 1 },
  { id: "help", name: "お手伝い", days: ["毎日"], time: "18:30", minutes: 10, category: "思いやり", character: "お母さん", life: 10, pearl: 5, coin: 1 },
  { id: "lesson", name: "習い事の練習", days: ["火", "木"], time: "18:00", minutes: 20, category: "ひらめき", character: "フィーナ", life: 15, pearl: 8, coin: 1 },
  { id: "reading", name: "読書", days: ["月", "水", "金"], time: "19:30", minutes: 15, category: "考える力", character: "タコ先生", life: 10, pearl: 5, coin: 1 },
  { id: "reflect", name: "ふりかえり", days: ["毎日"], time: "20:30", minutes: 5, category: "ふりかえり力", character: "クラゲ博士", life: 5, pearl: 3, coin: 0 }
];

const advice = {
  "習慣力": { character: "タコ先生", text: "今日のコツコツは、自分の力になって、家族も安心できて、明日の自分を助けてくれるよ。" },
  "思いやり": { character: "お母さん", text: "手伝ってくれてありがとう。自分のやさしさが育って、家族の時間もあたたかくなったね。" },
  "ひらめき": { character: "フィーナ", text: "チャレンジしたことがすごいよ。自分の勇気が育って、未来の楽しみも増えたね。" },
  "考える力": { character: "タコ先生", text: "考えた時間は、自分の力になって、明日の学びにもつながるよ。" },
  "ふりかえり力": { character: "クラゲ博士", text: "今日をふりかえれたことが、自分にも、家族にも、未来にもよい光をくれたね。" },
  "継続力": { character: "お父さん", text: "続けられたことは大きな力だよ。今の自分にも未来の自分にもつながっているね。" },
  "夢を描く力": { character: "王子様ノア", text: "君の努力が、海の世界をまた輝かせたね。夢に近づく一歩になったよ。" }
};

let state = loadState();

function todayKey(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function loadState() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) return JSON.parse(saved);
  return {
    child: { name: "みお", mermaidId: "luna", life: 0, pearl: 0, coin: 0, weeklyCoin: 0, savedCoin: 0, streak: 0, lastFinishedDate: "" },
    tasks: defaultTasks,
    completions: [],
    settlements: []
  };
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function selectedMermaid() {
  return mermaids.find((item) => item.id === state.child.mermaidId) || mermaids[1];
}

function getTodayTasks() {
  const today = dayNames[new Date().getDay()];
  return state.tasks.filter((task) => task.days.includes("毎日") || task.days.includes(today)).sort((a, b) => a.time.localeCompare(b.time));
}

function isDoneToday(taskId) {
  const key = todayKey();
  return state.completions.some((item) => item.taskId === taskId && item.date === key);
}

function getTodayCompletions() {
  const key = todayKey();
  return state.completions.filter((item) => item.date === key);
}

function completeTask(taskId) {
  const task = state.tasks.find((item) => item.id === taskId);
  if (!task || isDoneToday(taskId)) return;
  const now = new Date();
  state.completions.push({ taskId: task.id, taskName: task.name, date: todayKey(now), time: now.toTimeString().slice(0, 5), category: task.category, character: task.character, life: task.life, pearl: task.pearl, coin: task.coin });
  state.child.life += task.life;
  state.child.pearl += task.pearl;
  state.child.coin += task.coin;
  state.child.weeklyCoin += task.coin;
  saveState();
  showReward(task);
  render();
}

function showReward(task) {
  const mermaid = selectedMermaid();
  const message = advice[task.category]?.text || mermaid.line;
  document.getElementById("rewardTitle").textContent = `${task.name}クリア！`;
  document.getElementById("rewardMessage").textContent = `${mermaid.name}：${mermaid.line}\n${task.character}：${message}`;
  document.getElementById("rewardValues").innerHTML = `<div>${task.life}<br><small>ライフpt</small></div><div>${task.pearl}<br><small>パール</small></div><div>${task.coin}<br><small>コイン</small></div>`;
  document.getElementById("rewardDialog").showModal();
}

function selectMermaid(id) {
  state.child.mermaidId = id;
  saveState();
  render();
}

function dominantCategory() {
  const counts = {};
  getTodayCompletions().forEach((item) => counts[item.category] = (counts[item.category] || 0) + 1);
  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || selectedMermaid().category;
}

function finishDay() {
  const doneCount = getTodayCompletions().length;
  const key = todayKey();
  if (doneCount === 0 || state.child.lastFinishedDate === key) return;
  state.child.streak = doneCount >= Math.ceil(getTodayTasks().length * 0.7) ? state.child.streak + 1 : 0;
  state.child.lastFinishedDate = key;
  saveState();
  render();
}

function addTask(event) {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  state.tasks.push({
    id: `task-${Date.now()}`,
    name: data.get("name"),
    days: [data.get("day")],
    time: data.get("time"),
    minutes: 10,
    category: data.get("category"),
    character: data.get("character"),
    life: Number(data.get("life")),
    pearl: Number(data.get("pearl")),
    coin: Number(data.get("coin"))
  });
  saveState();
  event.currentTarget.reset();
  render();
  switchTab("tasks");
}

function cashOut() {
  if (state.child.weeklyCoin <= 0) return;
  state.settlements.push({ date: todayKey(), type: "今週もらう", coin: state.child.weeklyCoin, yen: state.child.weeklyCoin * 10 });
  state.child.coin -= state.child.weeklyCoin;
  state.child.weeklyCoin = 0;
  saveState();
  render();
}

function saveCoins() {
  if (state.child.weeklyCoin <= 0) return;
  state.settlements.push({ date: todayKey(), type: "月末まで貯める", coin: state.child.weeklyCoin, yen: 0 });
  state.child.savedCoin += state.child.weeklyCoin;
  state.child.weeklyCoin = 0;
  saveState();
  render();
}

function exportBackup() {
  const payload = { app: "マーメイド・クエスト", version: 2, exportedAt: new Date().toISOString(), state };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `mermaid-quest-backup-${todayKey()}.json`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

function importBackup(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.addEventListener("load", () => {
    try {
      const payload = JSON.parse(String(reader.result));
      if (!payload.state?.child || !Array.isArray(payload.state?.tasks) || !Array.isArray(payload.state?.completions)) throw new Error("invalid");
      if (!confirm("現在のデータを、選んだバックアップで置き換えますか？")) return;
      state = payload.state;
      saveState();
      render();
      alert("バックアップを読み込みました。");
    } catch {
      alert("バックアップファイルを読み込めませんでした。");
    } finally {
      event.target.value = "";
    }
  });
  reader.readAsText(file, "utf-8");
}

function resetState() {
  if (!confirm("試作データをリセットしますか？")) return;
  localStorage.removeItem(STORAGE_KEY);
  state = loadState();
  render();
}

function renderHeader() {
  const tasks = getTodayTasks();
  const done = getTodayCompletions();
  const upcoming = tasks.find((task) => !isDoneToday(task.id));
  const mermaid = selectedMermaid();
  document.getElementById("selectedMermaidIcon").className = `mermaid-fullbody hero-mermaid ${mermaid.avatarClass}`;
  document.getElementById("selectedMermaidName").textContent = `${mermaid.name}｜${mermaid.copy}`;
  document.getElementById("todayDone").textContent = `${done.length}/${tasks.length}`;
  document.getElementById("streakDays").textContent = `${state.child.streak}日`;
  document.getElementById("nextTask").textContent = upcoming ? upcoming.time : "完了";
  document.getElementById("todayLabel").textContent = `${todayKey().replaceAll("-", "/")} ${dayNames[new Date().getDay()]}曜日`;
  document.getElementById("lifePt").textContent = state.child.life;
  document.getElementById("pearls").textContent = state.child.pearl;
  document.getElementById("coins").textContent = state.child.coin;
  document.getElementById("weeklyCoins").textContent = state.child.weeklyCoin;
  document.getElementById("savedCoins").textContent = state.child.savedCoin;
  document.getElementById("yenAmount").textContent = `${state.child.weeklyCoin * 10}円`;
}

function renderTasks() {
  const tasks = getTodayTasks();
  document.getElementById("taskList").innerHTML = tasks.map((task) => {
    const done = isDoneToday(task.id);
    return `<article class="task-card ${done ? "done" : ""}"><div><h3>${task.name}</h3><div class="task-meta"><span class="pill">${task.time}</span><span class="pill">${task.minutes}分</span><span class="pill">${task.category}</span><span class="pill">${task.character}</span><span class="pill">${task.life}pt / ${task.pearl}P / ${task.coin}C</span></div></div><button class="done-button" ${done ? "disabled" : ""} data-task="${task.id}">${done ? "達成済み" : "できた！"}</button></article>`;
  }).join("") || `<div class="task-card"><div><h3>今日は登録されたミッションがありません</h3><p>親設定から追加できます。</p></div></div>`;
}

function renderMermaids() {
  document.getElementById("mermaidList").innerHTML = mermaids.map((mermaid) => `<article class="mermaid-card ${state.child.mermaidId === mermaid.id ? "selected" : ""}" style="border-top-color:${mermaid.color}"><div class="mermaid-top"><div class="mermaid-fullbody mermaid-icon ${mermaid.avatarClass}" aria-hidden="true"></div><div><h3>${mermaid.name}</h3><small>${mermaid.type}</small></div></div><p>${mermaid.copy}</p><p>${mermaid.line}</p><button class="secondary-button" data-mermaid="${mermaid.id}">${state.child.mermaidId === mermaid.id ? "選択中" : "この子にする"}</button></article>`).join("");
}

function renderReflection() {
  const done = getTodayCompletions();
  const category = dominantCategory();
  const selected = advice[category] || { character: selectedMermaid().name, text: selectedMermaid().line };
  document.getElementById("reflectionCharacter").textContent = done.length ? selected.character : selectedMermaid().name;
  document.getElementById("reflectionText").textContent = done.length ? selected.text : `${selectedMermaid().name}：${selectedMermaid().line}`;
}

function renderGrowth() {
  const counts = Object.fromEntries(categories.map((category) => [category, 0]));
  state.completions.forEach((item) => counts[item.category] = (counts[item.category] || 0) + 1);
  const max = Math.max(1, ...Object.values(counts));
  document.getElementById("growthList").innerHTML = categories.map((category) => `<div class="growth-row"><strong>${category}</strong><div class="bar-track"><div class="bar-fill" style="width:${Math.max(5, Math.round((counts[category] / max) * 100))}%"></div></div><span>${counts[category]}</span></div>`).join("");
}

function render() {
  renderHeader();
  renderTasks();
  renderMermaids();
  renderReflection();
  renderGrowth();
}

function switchTab(tabId) {
  document.querySelectorAll(".tab").forEach((tab) => tab.classList.toggle("active", tab.dataset.tab === tabId));
  document.querySelectorAll(".screen").forEach((screen) => screen.classList.toggle("active-screen", screen.id === tabId));
}

document.addEventListener("click", (event) => {
  const taskButton = event.target.closest("[data-task]");
  if (taskButton) completeTask(taskButton.dataset.task);
  const mermaidButton = event.target.closest("[data-mermaid]");
  if (mermaidButton) selectMermaid(mermaidButton.dataset.mermaid);
});

document.querySelectorAll(".tab").forEach((button) => button.addEventListener("click", () => switchTab(button.dataset.tab)));
document.getElementById("closeDialog").addEventListener("click", () => document.getElementById("rewardDialog").close());
document.getElementById("finishDayButton").addEventListener("click", finishDay);
document.getElementById("taskForm").addEventListener("submit", addTask);
document.getElementById("cashOutButton").addEventListener("click", cashOut);
document.getElementById("saveCoinButton").addEventListener("click", saveCoins);
document.getElementById("resetButton").addEventListener("click", resetState);
document.getElementById("exportButton").addEventListener("click", exportBackup);
document.getElementById("importFile").addEventListener("change", importBackup);

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => navigator.serviceWorker.register("./sw.js").catch(() => {}));
}

render();
