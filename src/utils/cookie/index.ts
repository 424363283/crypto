import { isServerSideRender } from '../validator';

interface CookieOptions {
  name?: string
  value: any
  domain?: string
  path?: string
  day?: number
  expires?: Date
}

export function read(name: string) {
  if (isServerSideRender()) return null;

  const value = document.cookie.match('(?:^|;)\\s*' + name + '=([^;]*)');
  return value ? decodeURIComponent(value[1]) : null;
}

export function write(value: CookieOptions) {
  if (isServerSideRender()) return;

  let str = `${value.name}=${encodeURIComponent(value.value)}`;
  if (value.domain) {
    str += '; domain=' + value.domain;
  }
  str += '; path=' + (value.path || '/');
  if (value.day) {
    const time = new Date();
    time.setTime(time.getTime() + value.day * 24 * 60 * 60 * 1000);
    str += '; expires=' + time.toUTCString();
  }
  if (value.expires) {
    str += '; expires=' + value.expires.toUTCString();
  }
  document.cookie = str;
  return;
}

export function del(name: string, options: CookieOptions) {
  const opt = options || {};
  opt.name = name;
  opt.day = -1;
  opt.value = 'a';
  write(opt);
  return;
}
