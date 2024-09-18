function modifyImagePath(url: string, enableSkin: boolean, skin: string) {
    if (!enableSkin || skin === 'primary') return url;
    const newFolderName = skin;
    // 匹配/static/images/后的第一个路径
    const match = url.match(/\/static\/images\/([^\/]+)\//);
    if (match && match[1]) {
      let newPath = url.replace('/static/images/', '/static/skins/' + newFolderName + '/');
      const fileName = url.split('/').pop() || '';
      const newFileName = fileName;
      // 替换文件名
      newPath = newPath.replace(fileName, newFileName);
      return newPath;
    }
    return url;
  }
  
  function extractLastTwoWords(url: string) {
    let pathSegments = url.split('/');
    // 过滤掉空字符串
    pathSegments = pathSegments.filter(function (segment) {
      return segment !== '';
    });
  
    if (pathSegments.length < 4) {
      return '';
    }
    // 获取倒数第二和倒数第一个路径段
    let lastTwoWords = pathSegments[pathSegments.length - 2] + '-' + pathSegments[pathSegments.length - 1];
  
    // 如果包含 ".png" 或 ".svg" 后缀，去掉后缀
    if (lastTwoWords.endsWith('.png') || lastTwoWords.endsWith('.svg')) {
      lastTwoWords = lastTwoWords.slice(0, -4);
    }
  
    return lastTwoWords + '-img';
  }
  
  export { extractLastTwoWords, modifyImagePath };
  