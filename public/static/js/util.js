function isCrawler() {
    var userAgent = navigator.userAgent.toLowerCase();
    var crawlerKeywords = [
      "bot",
      "crawl",
      "spider",
      "slurp",
      "bingbot",
      "googlebot",
      "msnbot",
      "yandexbot",
      "bingpreview"
    ];
    for (var i = 0; i < crawlerKeywords.length; i++) {
      if (userAgent.indexOf(crawlerKeywords[i]) != -1) {
        return true;
      }
    }
    return false;
  }
  
  
  function isMobile() {
    return  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }

export { isCrawler, isMobile };
