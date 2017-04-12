var tabStack = {};

chrome.commands.onCommand.addListener(function(command) {
  switch (command) {
    case 'toggle-tabs':
      toggleTabs();
      break;
    case 'pop-tab-out':
      popTabOut();
      break;
    case 'duplicate-tab':
      duplicateTab();
      break;
  }
});

chrome.tabs.onActivated.addListener(function(activeInfo) {
  chrome.windows.getCurrent(function(window) {
    if (! tabStack[window.id]) {
      tabStack[window.id] = [];
    }
    var arr = removeIdFromArray(tabStack[window.id], activeInfo.tabId);
    arr.unshift(activeInfo.tabId);
    tabStack[window.id] = arr;
  });
});

chrome.tabs.onRemoved.addListener(function(tabId) {
  chrome.windows.getCurrent(function(window) {
    removeIdFromArray(tabStack[window.id], tabId);
  });
});

chrome.windows.onRemoved.addListener(function(window) {
  delete tabStack[window];
});

function toggleTabs() {
  chrome.windows.getCurrent(function(window) {
    if (tabStack[window.id]) {
      chrome.tabs.update(tabStack[window.id][1], {active: true});
    }
  });
};

function removeIdFromArray(arr, id) {
  arr.forEach(function(tabId, index) {
    if (id === tabId) {
      arr.splice(index, 1);
      return;
    }
  });
  return arr;
};

function moveTab(dir) {
  chrome.tabs.getSelected(function(tab) {
    chrome.tabs.move(tab.id, {index: tab.index+dir});
  });
};

function popTabOut() {
  chrome.tabs.getSelected(function(tab) {
    chrome.windows.create({tabId: tab.id, state: 'maximized'});
  });
};

function duplicateTab() {
  chrome.tabs.getSelected(function(tab) {
    chrome.tabs.duplicate(tab.id);
  });
};
