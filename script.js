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

// ===== Time Blocks (Stage 4) =====

// Select the time block list
const timeBlockList = document.querySelector("#time-block-list");
const completedWorkList = document.querySelector("#completed-work-list");

const completedRecords = JSON.parse(
  localStorage.getItem("completedRecords") || "[]",
);

completedRecords.forEach((record) => {
  const recordItem = document.createElement("li");

  recordItem.textContent = `${record.taskName}：用了 ${record.durationMinutes} 分鐘`;

  completedWorkList.appendChild(recordItem);
});

// Helper function: create one time block
function createTimeBlock(timeText, taskText, status) {
  const li = document.createElement("li");
  let startTime = null;
  let toolsShown = false;

  const toolsByTask = {
    寫作業: ["筆記本", "原子筆"],
    休息: ["水"],
    複習數學: ["數學筆記", "計算機"],
  };

  const taskTools = toolsByTask[taskText] || [];

  const timeSpan = document.createElement("span");
  timeSpan.classList.add("block-time");
  timeSpan.textContent = timeText;

  const taskSpan = document.createElement("span");
  taskSpan.classList.add("block-task");
  taskSpan.textContent = taskText;

  const statusSpan = document.createElement("span");
  statusSpan.classList.add("block-status");
  statusSpan.textContent = status;

  const startTimeSpan = document.createElement("span");
  startTimeSpan.classList.add("block-start-time");

  const toolsSpan = document.createElement("span");
  toolsSpan.classList.add("block-tools");

  li.append(
    timeSpan,
    " | ",
    taskSpan,
    " (",
    statusSpan,
    ") ",
    startTimeSpan,
    toolsSpan,
  );

  if (status === "已過") {
    li.classList.add("past-block");
  } else if (status === "而家") {
    li.classList.add("current-block");
  } else if (status === "未到") {
    li.classList.add("upcoming-block");

    const startButton = document.createElement("button");
    startButton.type = "button";
    startButton.textContent = "準備工具";

    const completeButton = document.createElement("button");
    completeButton.type = "button";
    completeButton.textContent = "完成";
    completeButton.hidden = true;

    startButton.addEventListener("click", () => {
      if (!toolsShown) {
        if (taskTools.length > 0) {
          toolsSpan.textContent = `需要工具: ${taskTools.join("、")}`;
        } else {
          toolsSpan.textContent = "呢個任務未設定工具";
        }

        toolsShown = true;
        startButton.textContent = "工具齊, 開始";

        return;
      }

      startTime = Date.now();

      const startTimeText = new Date(startTime).toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
      });

      startTimeSpan.textContent = `開始於 ${startTimeText} `;

      console.log("開始時間: ", startTime);

      const currentBlock = timeBlockList.querySelector(".current-block");

      if (currentBlock) {
        currentBlock.classList.remove("current-block");
        currentBlock.classList.add("past-block");

        const currentStatus = currentBlock.querySelector(".block-status");

        currentStatus.textContent = "已過";
      }

      li.classList.remove("upcoming-block");
      li.classList.add("current-block");
      statusSpan.textContent = "而家";

      startButton.disabled = true;
      completeButton.hidden = false;
    });

    completeButton.addEventListener("click", () => {
      const endTime = Date.now();
      const durationMs = endTime - startTime;
      const durationMinutes = Math.ceil(durationMs / 60000);

      const completedRecord = {
        taskName: taskText,
        durationMinutes: durationMinutes,
        startTime: startTime,
        endTime: endTime,
      };

      completedRecords.push(completedRecord);

      localStorage.setItem(
        "completedRecords",
        JSON.stringify(completedRecords),
      );

      const recordItem = document.createElement("li");
      recordItem.textContent = `${taskText}:用了 ${durationMinutes} 分鐘`;

      completedWorkList.appendChild(recordItem);

      statusSpan.textContent = `完成: 用了 ${durationMinutes} 分鐘`;

      li.classList.remove("current-block");
      li.classList.add("past-block");

      completeButton.disabled = true;
    });
    li.append(" ", startButton, " ", completeButton);
  }

  timeBlockList.appendChild(li);
}

// Manually add a few example blocks (hardcoded for now)
createTimeBlock("09:00 - 09:20", "寫作業", "已過");
createTimeBlock("09:20 - 09:40", "休息", "而家");
createTimeBlock("09:40 - 10:00", "複習數學", "未到");
