import Store from './store';
const store = new Store();

const capture = (tab) => {
  chrome.tabs.captureVisibleTab(null, { format: 'png' }, imageUrl => {
    chrome.tabs.sendMessage(tab.id, {
      type: 'postinternet:load',
      imageUrl: imageUrl,
      shader: store.getActiveShader(),
    });
  });
}

chrome.browserAction.onClicked.addListener(tab => {
  chrome.tabs.executeScript(tab.id, {file: 'content.js'}, () => {
    capture(tab);
  });
});
