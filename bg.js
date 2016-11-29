var tabStack = [];

chrome.commands.onCommand.addListener(function(command) {
  if (command === 'toggle-tabs') {
    chrome.tabs.update(tabStack[1], {active: true});
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
  })
}
