export function matchUrl(name: string) {
  const reg = new RegExp('(^|&)' + name + '=(.*?)(&|$)');
  const r = window.location.search.substring(1).match(reg);
  if (r !== null) return unescape(r[2]);
  return null;
}

/**
 * 回调地址过滤
 * 1、非当前域地址，返回当前域首页
 * 2、回调为空，返回当前域首页
 * @param {string} _url 回调地址
 * @return {string} url
 */
export function filterRedirect(schema: string) {
  const host = window.location.host.toLowerCase();
  const protocol = window.location.protocol;
  const url = decodeURIComponent(schema || '').toLowerCase();

  // url不存在，非http,https开头
  if (!url || !/^https?\:\/\//i.test(url)) {
    return protocol + '//' + host;
  }

  const url_host = url.replace(/^https?\:\/\//i, '').split('/');

  if (url_host[0] != host) {
    return protocol + '//' + host;
  }

  return schema;
}
