import isObject from 'lodash/isObject';
import omit from 'lodash/omit';
import { read as CookieRead, isServerSideRender } from '@/utils';

type ObjStrKeyAny = {
  [key: string]: any
};

export function getOptions(schema: string, options: ObjStrKeyAny = {} as any) {
  const CToken = CookieRead('c_token');
  const channel = CookieRead('channel');
  const lang = isServerSideRender() ? '' : localStorage.lang;
  const headers: ObjStrKeyAny = {};

  const params: ObjStrKeyAny = {};
  if (CToken) params.c_token = CToken;
  if (lang) params.language = lang;

  let url = schema;

  headers['x-requested-with'] = 'XMLHttpRequest';
  headers['accept-language'] = window.localStorage.lang;

  if (!options.upload) {
    headers['content-type'] = 'application/x-www-form-urlencoded';
  }

  if (channel) {
    headers.channel = channel;
  }

  if (options.headers) {
    for (const key in options.headers) {
      if (Object.prototype.hasOwnProperty.call(options.headers, key)) {
        headers[key] = (options.headers as any)[key];
      }
    }
  }

  const opts: { [key: string]: any } = {
    headers,
    ...omit(options, ['headers']),
    credential: options.credentials || 'include',
    method: options.method || 'POST',
    params
  };

  if (opts.data && !opts.body) {
    opts.body = opts.data;
  }

  if (opts.body && isObject(opts.body) && !opts.upload) {
    let str = '';

    // opts.headers
    for (const key in opts.body) {
      if ({}.hasOwnProperty.call(opts.body, key)) {
        const v = (opts.body as any)[key];
        if (Array.isArray(v)) {
          for (let i = 0, l = v.length; i < l; i += 1) {
            str += `${v[i]}[]=${key}&`;
          }
        } else {
          str += `${key}=${(opts.body as any)[key]}&`;
        }
      }
    }

    str = str.replace(/&$/, '');

    if (/get/i.test(opts.method)) {
      if (str) {
        url += url.indexOf('?') > -1 ? `&${str}` : `?${str}`;
      }
      delete opts.body;
    }

    if (/post/i.test(opts.method)) {
      const contentType = (headers as any)['content-type'];

      if (contentType && contentType.indexOf('application/json') !== -1) {
        opts.body = JSON.stringify(opts.body);
      } else {
        opts.body = str;
      }
    }
  }

  return { url, options: opts };
}
