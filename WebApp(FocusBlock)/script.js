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
