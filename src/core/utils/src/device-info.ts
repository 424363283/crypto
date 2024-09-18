// import { getPlatform } from './get';

// 定义一个函数，输出浏览器的类型和版本
function getBrowserInfo() {
  // 获取浏览器的userAgent字符串
  var ua: any = navigator.userAgent;

  // 定义一个对象，存储各种浏览器的标识
  var browser: any = {
    ie: /MSIE|Trident/i.test(ua), // IE浏览器，包括IE11
    edge: /Edge/i.test(ua), // Edge浏览器
    firefox: /Firefox/i.test(ua), // Firefox浏览器
    chrome: /Chrome|CriOS/i.test(ua), // Chrome浏览器
    safari: /Safari/i.test(ua) && !/Chrome|CriOS/i.test(ua), // Safari浏览器，排除Chrome
    opera: /Opera|OPR/i.test(ua), // Opera浏览器
    wechat: /MicroMessenger/i.test(ua), // 微信内置浏览器
    qq: /QQBrowser|MQQBrowser/i.test(ua), // QQ浏览器
    uc: /UCBrowser/i.test(ua), // UC浏览器
    mobile: /Mobile|Android|iPhone|iPad|iPod/i.test(ua), // 移动设备的浏览器
  };
  var name = 'Unknown'; // 浏览器名称
  var version = 'Unknown'; // 浏览器版本

  // 遍历browser对象，找到匹配的标识
  for (var key in browser) {
    if (browser[key]) {
      name = key; // 获取浏览器名称
      // 根据不同的浏览器，使用不同的正则表达式来提取版本号
      switch (key) {
        case 'ie':
          version = ua.match(/(MSIE |rv:)(\d+(\.\d+)?)/)[2];
          break;
        case 'edge':
          version = ua.match(/Edge\/(\d+(\.\d+)?)/)[1];
          break;
        case 'firefox':
          version = ua.match(/Firefox\/(\d+(\.\d+)?)/)[1];
          break;
        case 'chrome':
          version = ua.match(/Chrome\/(\d+(\.\d+)?)/)[1];
          break;
        case 'safari':
          version = ua.match(/Version\/(\d+(\.\d+)?)/)[1];
          break;
        case 'opera':
          version = ua.match(/(Opera|OPR)\/(\d+(\.\d+)?)/)[2];
          break;
        case 'wechat':
          version = ua.match(/MicroMessenger\/(\d+(\.\d+)?)/)[1];
          break;
        case 'qq':
          version = ua.match(/(QQBrowser|MQQBrowser)\/(\d+(\.\d+)?)/)[2];
          break;
        case 'uc':
          version = ua.match(/UCBrowser\/(\d+(\.\d+)?)/)[1];
          break;
      }

      break; // 找到匹配的标识后，退出循环
    }
  }

  // 返回浏览器的类型和版本
  return {
    name,
    version,
  };
}

export const DeviceInfo = {
  str: '',
  cache: null as any,
  _data: null as any,
  _latlng: String as any,
  data() {
    if (this._data) return this._data;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const txt = 'http://www.baidu.com';
    ctx!.textBaseline = 'top';
    ctx!.font = "14px 'Arial'";
    ctx!.textBaseline = 'alphabetic';
    ctx!.fillStyle = '#f60';
    ctx!.fillRect(125, 1, 62, 20);
    ctx!.fillStyle = '#069';
    ctx!.fillText(txt, 2, 15);
    ctx!.fillStyle = 'rgba(102, 204, 0, 0.7)';
    ctx!.fillText(txt, 4, 17);
    const b64 = canvas.toDataURL().replace('data:image/png;base64,', '');
    const bin = window.atob(b64);
    let crc = bin2hex(bin.slice(-16, -12));
    // @ts-ignore
    function bin2hex(s) {
      var i,
        l,
        o = '',
        n;
      s += '';
      for (i = 0, l = s.length; i < l; i++) {
        n = s.charCodeAt(i).toString(16);
        o += n.length < 2 ? '0' + n : n;
      }
      return o;
    }

    let offset = new Date().getTimezoneOffset(); // 获取本地时区和 UTC 时区的分钟差
    let gmt = -offset / 60; // 计算本地时区和 GMT 时区的小时差
    const timezone = 'GMT' + (gmt >= 0 ? '+' : '') + gmt;
    const data: any = {
      device_id: '',
      device_name: getBrowserInfo().name,
      // model: getPlatform(),
      system_lang: navigator.language,
      system_version: getBrowserInfo().version,
      timezone: timezone,
      user_agent: navigator.userAgent,
      // @ts-ignore
      platform: navigator.userAgentData?.platform || navigator.platform || 'unknown',
    };
    let fingerprint = '';
    Object.values(data).forEach((item, i) => {
      if (item) {
        const str = window.btoa(item.toString());
        fingerprint += str.slice(0, 3);
      }
    });
    data['fingerprint'] = (crc + fingerprint).slice(0, 32);
    this._data = data;
    return data;
  },

   getbase64() {
    try {
      const _latlng = localStorage.getItem('_latlng');
      if (_latlng && this._latlng === _latlng && this.str) {
        return this.str;
      }
      this._latlng = _latlng;
      const data = this.data();
      data['latlng'] = _latlng || '';
      this.str = window.btoa(JSON.stringify(data));
      // console.log('DeviceInfo', data);
      return this.str;
    } catch (e) {
      return '';
    }
  },
};
