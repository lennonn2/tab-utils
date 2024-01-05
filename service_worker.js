chrome.storage.local.set({ tabStack: {} });

chrome.commands.onCommand.addListener(function (command) {
  switch (command) {
    case "toggle-tabs":
      toggleTabs();
      break;
    case "pop-tab-out":
      popTabOut();
      break;
    case "duplicate-tab":
      duplicateTab();
      break;
  }
});

chrome.tabs.onActivated.addListener(function (activeInfo) {
  chrome.windows.getCurrent(async function (window) {
    const { tabStack } = await chrome.storage.local.get("tabStack");
    const newTabStack = tabStack;
    if (!tabStack[window.id]) {
      newTabStack[window.id] = [];
      chrome.storage.local.set({
        tabStack: { ...tabStack, [window.id]: [] },
      });
    }
    const arr = removeIdFromArray(newTabStack[window.id], activeInfo.tabId);
    arr.unshift(activeInfo.tabId);
    chrome.storage.local.set({
      tabStack: { ...tabStack, [window.id]: arr },
    });
  });
});

chrome.tabs.onRemoved.addListener(function (tabId) {
  chrome.windows.getCurrent(async function (window) {
    const { tabStack } = await chrome.storage.local.get("tabStack");
    const newArr = removeIdFromArray(tabStack[window.id], tabId);
    chrome.storage.local.set({
      tabStack: { ...tabStack, [window.id]: newArr },
    });
  });
});

chrome.windows.onRemoved.addListener(async function (window) {
  const { tabStack } = await chrome.storage.local.get("tabStack");
  delete tabStack[window];
  chrome.storage.local.set({ tabStack: tabStack });
});

function toggleTabs() {
  chrome.windows.getCurrent(async function (window) {
    const { tabStack } = await chrome.storage.local.get("tabStack");
    if (tabStack[window.id]) {
      chrome.tabs.update(tabStack[window.id][1], { active: true });
    }
  });
}

function removeIdFromArray(arr, id) {
  arr.forEach(function (tabId, index) {
    if (id === tabId) {
      arr.splice(index, 1);
      return;
    }
  });
  return arr;
}

function moveTab(dir) {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.move(tabs[0].id, { index: tabs[0].index + dir });
  });
}

function popTabOut() {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.windows.create({ tabId: tabs[0].id, state: "maximized" });
  });
}

function duplicateTab() {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.duplicate(tabs[0].id);
  });
}
