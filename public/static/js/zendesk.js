import { isCrawler, isMobile } from './util.js';

window.addEventListener('load', function () {
  if(isCrawler() || isMobile()) return;
  var script = document.createElement('script');
  script.id = 'ze-snippet';
  script.src = '//static.zdassets.com/ekr/snippet.js?key=bf250843-c111-4410-9bf5-8deeb04c1af2';
  script.defer = true;
  document.body.appendChild(script);
  script.onload = function () {
    try {
      var languages = {
        zh: 'zh-TW',
        en: 'en-US',
        vi: 'vi-VN',
        ru: 'ru-RU',
        ja: 'ja-JP',
        id: 'in-ID',
        pt: 'pt-PT',
      };
      var lang = document.documentElement.lang;
      window.zendeskMessengerZIndex = 987654321;
      if(/\/swap\/|\/lite\/|\/spot\//.test(window.location.href)) {
        zE('messenger', 'hide');
      }
      zE('messenger', 'close');
      zE("messenger:set", "zIndex", window.zendeskMessengerZIndex)
      zE('messenger:set', 'locale', languages[lang] || 'en-us');
    } catch { }
  };
});
