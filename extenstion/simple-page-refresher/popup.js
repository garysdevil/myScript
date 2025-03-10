// 使用箭头函数监听 DOM 加载完成
document.addEventListener('DOMContentLoaded', () => {
    // 获取当前页面标题
    chrome.tabs.query({ active: true, currentWindow: true }, ([{ title, id }]) => {
        document.getElementById('page-title').textContent = `${title}`;
    });

  // 使用 const 声明按钮并绑定事件
  const refreshButton = document.getElementById('refresh-button');
  refreshButton.addEventListener('click', () => {
      chrome.tabs.query({ active: true, currentWindow: true }, ([{ id }]) => {
        chrome.tabs.reload(id);
      });
  });
});