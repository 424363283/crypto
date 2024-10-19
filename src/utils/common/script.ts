export function loadScript(url: string, id: string, cls?: string) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.src = url;
    script.id = id;
    script.className = cls || '';
    script.onload = resolve;
    script.onerror = function () {
      reject(new Error('Script load error: ' + url));
    };
    document.getElementsByTagName('head')[0].appendChild(script);
  });
}
