var tabStack = [];

chrome.commands.onCommand.addListener(function(command) {
  switch (command) {
    case 'toggle-tabs':
      chrome.tabs.update(tabStack[1], {active: true});
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
  this.removeIdFromArray(tabStack, activeInfo.tabId);
  tabStack.unshift(activeInfo.tabId);
});

chrome.tabs.onRemoved.addListener(function(tabId) {
  for (var i = 0; i <= tabStack.length; i++) {
    if (tabStack[i] === tabId) {
      tabStack.splice(i, 1);
      return;
    }
  }
});

function removeIdFromArray(arr, id) {
  arr.forEach(function(tabId, index) {
    if (id === tabId) {
      arr.splice(index, 1);
      return;
    }
  });
};

function moveTab(dir) {
  chrome.tabs.getSelected(function(tab) {
    console.log(tab);
    chrome.tabs.move(tab.id, {index: tab.index+dir});
  });
}

function popTabOut() {
  chrome.tabs.getSelected(function(tab) {
    chrome.windows.create({tabId: tab.id, state: 'maximized'});
  });
}

function duplicateTab() {
  chrome.tabs.getSelected(function(tab) {
    chrome.tabs.duplicate(tab.id);
  });
}
