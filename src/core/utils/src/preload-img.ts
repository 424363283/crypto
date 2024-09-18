const URL_CACHES: string[] = [];

const getLoadImagePromise = (url: string, { cache }: { cache?: boolean } = {}) => {
  return new Promise((res, rej) => {
    if (cache && URL_CACHES.includes(url)) {
      res(null);
    }
    try {
      let img = new window.Image();
      img.onload = () => {
        URL_CACHES.push(url);
        img.style.display = 'none';
        if (!/.gif/.test(url)) {
          document.body.appendChild(img);
        }
        res(null);
      };
      img.onerror = () => {
        rej();
      };
      img.src = url;
      // time out
      setTimeout(() => res(null), 3000);
    } catch {
      rej();
    }
  });
};

export const preloadImg = (url: string | string[], options: { cache?: boolean } = {}) => {
  if (Array.isArray(url)) {
    return Promise.all(url.map((v) => getLoadImagePromise(v, options)));
  } else {
    return getLoadImagePromise(url, options);
  }
};
