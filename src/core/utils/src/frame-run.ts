// 浏览器空余时间运行函数
export function frameRun(fn: Function) {
    const start = Date.now();
    requestAnimationFrame(() => {
      if (Date.now() - start < 16.6) {
        fn();
      } else {
        frameRun(fn);
      }
    });
  }
  