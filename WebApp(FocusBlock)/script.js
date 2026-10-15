console.log("script.js 己載入");

// Select the three elements
const ideaInput = document.querySelector("#idea-input");
const saveIdeaBtn = document.querySelector("#save-idea-btn");
const ideaList = document.querySelector("#idea-list");

// Test if the elements are found correctly
console.log(ideaInput);
console.log(saveIdeaBtn);
console.log(ideaList);

// When the "Park" button is clicked
saveIdeaBtn.addEventListener("click", function () {
  // 1. Get the text from the input and remove extra spaces
  const text = ideaInput.value.trim();

  // 2. If the input is empty, do nothing
  if (text === "") {
    return;
  }

  // 3. Create a new list item
  const li = document.createElement("li");
  li.textContent = text;

  // 4. Add the new item to the tool list
  ideaList.appendChild(li);

  // 5. Clear the input box
  ideaInput.value = "";
});

// Select the tool input, button, and list
const toolInput = document.querySelector("#tool-input");
const saveToolBtn = document.querySelector("#save-tool-btn");
const toolList = document.querySelector("#tool-list");

// Test if the elements are found correctly
console.log(toolInput);
console.log(saveToolBtn);
console.log(toolList);

// When the "Add" button is clicked
saveToolBtn.addEventListener("click", function () {
  // 1. Get the text from the input and remove extra spaces
  const text = toolInput.value.trim();

  // 2. If the input is empty, do nothing
  if (text === "") {
    return;
  }

  // 3. Create a new list item
  const li = document.createElement("li");
  li.textContent = text;

  // 4. Add the new item to the tool list
  toolList.appendChild(li);

  // 5. Clear the input box
  toolInput.value = "";
});

// ===== Time Blocks：修正版 ======

const timeBlockList = document.querySelector("#time-block-list");
const completedWorkList = document.querySelector("#completed-work-list");

// 同一時間只可以有一個時間塊進行中
let activeTimeBlock = null;

// 記錄每個時間開始按鈕，方便統一更新
const timeBlockControls = [];

// 如果舊資料讀取失敗，唔自動覆寫佢
let canSaveRecords = true;

// ===== 讀取舊完成紀錄 =====
function loadCompletedRecords() {
  try {
    const raw = localStorage.getItem("completedRecords");

    if (raw === null) {
      return [];
    }

    const records = JSON.parse(raw);

    const isValid =
      Array.isArray(records) &&
      records.every((record) => {
        return (
          record !== null &&
          typeof record === "object" &&
          typeof record.taskName === "string" &&
          Number.isFinite(record.durationMinutes) &&
          record.durationMinutes >= 0 &&
          Number.isFinite(record.startTime) &&
          Number.isFinite(record.endTime) &&
          record.endTime >= record.startTime
        );
      });

    if (!isValid) {
      throw new Error("完成紀錄格式不正確");
    }

    return records;
  } catch (error) {
    console.error("完成紀錄讀取失敗：", error);

    canSaveRecords = false;

    alert(
      "無法讀取舊完成紀錄，已停止覆寫舊資料。" +
        "目前仍可試用，但新完成紀錄只會暫存今次的頁面裏。",
    );

    return [];
  }
}

const completedRecords = loadCompletedRecords();

// ===== 時間顯示 =====

function formatDuration(durationMs) {
  const totalSeconds = Math.floor(Math.max(0, durationMs) / 1000);

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return [hours, minutes, seconds]
    .map((number) => String(number).padStart(2, "0"))
    .join(":");
}

// ===== 顯示完成紀錄 =====
function renderCompletedRecords() {
  completedWorkList.replaceChildren();

  completedRecords.forEach((record) => {
    const recordItem = document.createElement("li");

    const durationMs = record.endTime - record.startTime;

    recordItem.textContent = `${record.taskName}：實際用了 ${formatDuration(durationMs)}`;

    completedWorkList.appendChild(recordItem);
  });
}

renderCompletedRecords();

// ===== 儲存完成紀錄 =====
function saveCompletedRecords() {
  if (!canSaveRecords) {
    alert(
      "任務已完成，但未儲存至本機：" +
        "舊資料之前讀取失敗，新紀錄目前只留喺今次嘅頁面。",
    );
    return;
  }

  try {
    localStorage.setItem("completedRecords", JSON.stringify(completedRecords));
  } catch (error) {
    console.error("完成紀錄儲存失敗：", error);

    alert(
      "任務已完成，但本機儲存失敗。" +
        "目前紀錄仍會喺頁面顯示，不過重新整理後可能會遺失。",
    );
  }
}
// ===== 讀取共用工具清單 =====

// 直接使用你現有「工作/溫習要用嘅工具」清單
function getSessionTools() {
  return [...toolList.querySelectorAll("li")]
    .map((item) => item.textContent.trim())
    .filter((name) => name !== "");
}

// ===== 更新開始按鈕 =====

function updateStartButtons() {
  timeBlockControls.forEach((control) => {
    const anotherTaskIsRunning =
      activeTimeBlock !== null && activeTimeBlock !== control.element;

    control.startButton.disabled =
      control.getStatus() !== "pending" || anotherTaskIsRunning;

    control.startButton.title = anotherTaskIsRunning ? "請先完成目前任務" : "";
  });
}

// ===== 建立一個時間塊 =====

function createTimeBlock(timeText, taskText, plannedMinutes = 20) {
  const li = document.createElement("li");

  // 真正嘅操正狀態，唔依賴 CSS class 判斷
  let status = "pending";
  let startTime = null;
  let toolsShown = false;
  let taskTools = [];
  let timerId = null;

  li.classList.add("upcoming-block");

  const timeSpan = document.createElement("span");
  timeSpan.classList.add("block-time");
  timeSpan.textContent = `${timeText}  · 預計 ${plannedMinutes} 分鐘`;

  const taskSpan = document.createElement("span");
  taskSpan.classList.add("block-task");
  taskSpan.textContent = taskText;

  const statusSpan = document.createElement("span");
  statusSpan.classList.add("block-status");
  statusSpan.textContent = "待開始";

  const startTimeSpan = document.createElement("span");
  startTimeSpan.classList.add("block-start-time");

  const toolsSpan = document.createElement("span");
  toolsSpan.classList.add("block-tools");

  const timerSpan = document.createElement("span");
  timerSpan.classList.add("block-timer");

  const actions = document.createElement("div");
  actions.classList.add("block-actions");

  const startButton = document.createElement("button");
  startButton.type = "button";
  startButton.textContent = "準備工具";

  const completeButton = document.createElement("button");
  completeButton.type = "button";
  completeButton.textContent = "完成";
  completeButton.hidden = true;

  actions.append(startButton, completeButton);

  li.append(
    timeSpan,
    taskSpan,
    "(",
    statusSpan,
    ")",
    startTimeSpan,
    toolsSpan,
    timerSpan,
    actions,
  );

  // ===== 即時更新時用 =====
  function updateTimer() {
    if (status !== "running" || startTime === null) {
      return;
    }

    const elapsedMs = Math.max(0, Date.now() - startTime);
    const remainingMs = plannedMinutes * 60000 - elapsedMs;

    if (remainingMs >= 0) {
      timerSpan.textContent =
        `已用 ${formatDuration(elapsedMs)}` +
        ` ‧ 剩餘 ${formatDuration(remainingMs)}`;
    } else {
      timerSpan.textContent =
        `已用 ${formatDuration(elapsedMs)}` +
        ` ‧ 超時 ${formatDuration(Math.abs(remainingMs))}`;
    }
  }

  // ===== 準備 → 開始 =====

  startButton.addEventListener("click", () => {
    if (status !== "pending") {
      return;
    }

    if (activeTimeBlock !== null) {
      alert("請先完成目前任務，再開始下一個任務。");
      return;
    }

    // 第一次按：讀取及顯示工具
    if (!toolsShown) {
      taskTools = getSessionTools();

      toolsSpan.textContent =
        taskTools.length > 0
          ? `需要工具：${taskTools.join("、")}`
          : "未加入工具；如果唔需要工具，可以直接開始。";

      toolsShown = true;
      startButton.textContent = "工具齊，開始";
      return;
    }

    // 如果準備期間改過工具清單，先顯示新版本，再確認
    const latestTools = getSessionTools();

    if (JSON.stringify(latestTools) !== JSON.stringify(taskTools)) {
      taskTools = latestTools;

      toolsSpan.textContent =
        taskTools.length > 0
          ? `工具清單已更新，請再確認：${taskTools.join("、")}`
          : "工具清單已清空；確認唔需要工具後可以開始。";

      return;
    }
    // 第二次按：正式開始
    status = "running";
    startTime = Date.now();
    activeTimeBlock = li;

    const startTimeText = new Date(startTime).toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    });

    startTimeSpan.textContent = `開始於 ${startTimeText}`;

    li.classList.remove("upcoming-block");
    li.classList.add("current-block");
    statusSpan.textContent = "進行中";

    completeButton.hidden = false;

    updateStartButtons();
    updateTimer();

    timerId = setInterval(updateTimer, 1000);

    completeButton.focus();
  });

  // ===== 完成 =====

  completeButton.addEventListener("click", () => {
    // 已完成或未開始都唔可以再次紀錄
    if (status !== "running" || startTime === null || activeTimeBlock !== li) {
      return;
    }

    const endTime = Math.max(Date.now(), startTime);
    const durationMs = endTime - startTime;
    const durationMinutes = Math.ceil(durationMs / 60000);

    // 先改狀態，阻止重複完成
    status = "done";

    clearInterval(timerId);
    timerId = null;

    completedRecords.push({
      taskName: taskText,
      durationMinutes,
      startTime,
      endTime,
      tools: [...taskTools],
    });

    activeTimeBlock = null;

    li.classList.remove("current-block");
    li.classList.add("past-block");

    statusSpan.textContent = "已完成";
    timerSpan.textContent = `實際用時 ${formatDuration(durationMs)}`;

    startButton.hidden = true;
    completeButton.disabled = true;
    completeButton.textContent = "已完成";

    renderCompletedRecords();
    updateStartButtons();
    saveCompletedRecords();
  });

  timeBlockControls.push({
    element: li,
    startButton,
    getStatus: () => status,
  });

  timeBlockList.appendChild(li);
}

// ==== 示例時間塊 =====

// 呢啲時間點暫時只時計劃標籤，唔會自動開始任務。
// 第三個參數改為預計分鐘，唔再傳入「已過/而家/未到」。

createTimeBlock("09:00 - 09:20", "寫作業", 20);
createTimeBlock("09:20 - 09:40", "休息", 20);
createTimeBlock("09:40 - 10:00", "複習數學", 20);
