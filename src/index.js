const capture = (tab) => {
  chrome.tabs.captureVisibleTab(null, { format: 'png' }, imageUrl => {
    chrome.tabs.sendMessage(tab.id, {
      type: 'postinternet:load',
      imageUrl: imageUrl,
    });
  });
}

chrome.browserAction.onClicked.addListener(tab => {
  chrome.tabs.executeScript(tab.id, {file: 'content.js'}, () => {
    capture(tab);
  });
});
