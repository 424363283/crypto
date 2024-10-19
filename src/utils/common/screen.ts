export function getScrollHeight() {
  return Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
}

//窗口滚动条高度
export function getScrollTop() {
  return document.documentElement.scrollTop || document.body.scrollTop;
}

// 窗口可视范围的高度
export function getClientHeight() {
let clientHeight = 0;

  if (document.body.clientHeight && document.documentElement.clientHeight) {
    clientHeight =
      document.body.clientHeight < document.documentElement.clientHeight
        ? document.body.clientHeight
        : document.documentElement.clientHeight;
  } else {
    clientHeight =
      document.body.clientHeight > document.documentElement.clientHeight
        ? document.body.clientHeight
        : document.documentElement.clientHeight;
  }
  return clientHeight;
}

export function isScrollBottom() {
  return getScrollHeight() - getScrollTop() - getClientHeight() < 10;
}
