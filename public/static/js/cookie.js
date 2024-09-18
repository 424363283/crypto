
try {
    function getCookie(name) {
        let v = window.document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
        return v ? v[2] : null;
    }
    const pathname = window.location.pathname;
    const pathWithoutLocale = pathname.slice(3)
    const token = getCookie('TOKEN');
    if(token) document.documentElement.setAttribute('token', token);
    if(pathWithoutLocale.startsWith('/account') || pathWithoutLocale.startsWith('/affiliate') || pathWithoutLocale.startsWith('/feedback')) {
      if(!token) {
        window.location.href = pathname.slice(0,3) +'/login';
      }
    }
  } catch { 
    console.error('getCookie error')
  }
  