export const initLogan = async () => {
  if (typeof window !== 'undefined') {
    const { initConfig } = (await import('logan-web')).default;

    // 确保代码运行在浏览器环境
    initConfig({
      // reportUrl: "https://logan.bvsqa.com/logs/upload/web/upload.json",
      reportUrl: 'https://logan.x1mo.com/logs/upload/web/upload.json',
      publicKey:
        'MIGeMA0GCSqGSIb3DQEBAQUAA4GMADCBiAKBgG2m5VVtZ4mHml3FB9foDRpDW7Pw\n' +
        'Foa+1eYN777rNmIdnmezQqHWIRVcnTRVjrgGt2ndP2cYT7MgmWpvr8IjgN0PZ6ng\n' +
        'MmKYGpapMqkxsnS/6Q8UZO4PQNlnsK2hSPoIDeJcHxDvo6Nelg+mRHEpD6K+1FIq\n' +
        'zvdwVPCcgK7UbZElAgMBAAE=\n',
      // errorHandler: function (e) {
      //   // console.log('初始化用户行为日志失败', e);
      // },
      succHandler: function () {
        // const content = logItem.content;
        // const logType = logItem.logType;
        // const encrypted = logItem.encrypted;
      }
    });
  }
  // Logan.logWithEncryption("confidentialLogContent", 1)
};

export const SetLogan = async (logs, type) => {
  // 确保代码只在客户端执行
  if (typeof window !== 'undefined') {
    // 动态导入 Logan，确保它在客户端被加载
    const Logan = (await import('logan-web')).default;
    // 确保 Logan 已经被加载
    if (Logan) {
      const logContent = JSON.stringify(logs);
      // 使用 Logan 记录日志
      Logan.log(logContent, type);
    }
  }
};
