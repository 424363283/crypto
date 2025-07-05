
try {
  function getCookie(name) {
    let v = window.document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
    return v ? v[2] : null;
  }
  const pathname = window.location.pathname;
  const regex = /\/.*?(\/)/;
  const match = regex.exec(pathname);
  const slash2Index = match ? match.index + match[0].length - 1 : -1;
  const pathWithoutLocale = pathname.slice(slash2Index)
  const token = getCookie('TOKEN');
  if (token) document.documentElement.setAttribute('token', token);
  if (pathWithoutLocale.startsWith('/account') || pathWithoutLocale.startsWith('/affiliate') || pathWithoutLocale.startsWith('/feedback')) {
    if (!token) {
      window.location.href = pathname.slice(0, slash2Index) + '/login';
    }
  }
} catch {
  console.error('getCookie error')
}
  
