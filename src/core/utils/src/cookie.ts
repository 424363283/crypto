const windowJudgment = () => typeof window === 'undefined';

export function setCookie(name: string, value: string, exp: number = 365): void {
  if (windowJudgment()) return;
  let d = new Date();
  d.setTime(d.getTime() + exp * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${d.toUTCString()};path=/;SameSite=None; Secure=true`;
}

export function getCookie(name: string): string | null {
  if (windowJudgment()) return null;
  let v = window.document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
  return v ? v[2] : null;
}

export function removeCookie(name: string): void {
  if (windowJudgment()) return;
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;SameSite=None; Secure=true`;
}
