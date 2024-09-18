// @ts-ignore
const IGNORE_THEME_PATH = [ 'copy-trading', ];
function matchFirstWordAfterSlash(path) {
  const match = path.match(/\/(\w+)/);
  return match ? match[1] : null;
}

try {
  const pathname = window.location.pathname;
  const systemLightThemeMode  = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light': 'dark';
  const theme = localStorage.getItem('theme') || systemLightThemeMode;
  const locale = matchFirstWordAfterSlash(pathname);
  if(locale === 'ko') {
    document.documentElement.setAttribute("data-skin", "blue");
    localStorage.setItem('data-skin', 'blue');
  }else{
    document.documentElement.setAttribute("data-skin", "primary");
    localStorage.setItem('data-skin', 'primary');
  }
  const isInCluded = IGNORE_THEME_PATH.find((item) => pathname?.match(item));
  if(pathname && isInCluded) {
    document.documentElement.setAttribute("theme", "light");
  }
  else if (theme === 'dark' || theme === 'light') {
    document.documentElement.setAttribute("theme", theme);
  } else {
    document.documentElement.setAttribute("theme", "dark");
    localStorage.setItem('theme', 'dark');
  }
} catch { 
  console.error('theme error')
}