import CryptoJS from 'crypto-js';
import md5 from 'md5';

export function encryptPassport(obj: any) {
  let matrix = ['T', 'h', 'i', 's', ' ', 'a', 't', 'o', 'r', 'y', ',', 'b', 'u', 'H', 'w', 'P', 'e', 'v', 'W', 'l', 'd', 'f', 'm', 'V', '!', 'A', 'k', 'n', 'c', 'g', 'p', '.'];
  let key = '13-16-19-19-7-10-4-20-16-5-8-4-21-8-2-16-27-20-3-24-4-18-16-19-28-7-22-16-4-6-7-4-11-2-6-9-5-8-20-24' as any;
  key = key.split('-');
  key = key.map((e: any) => matrix[e]);
  key = key.join('');
  let book = [];
  for (let [k, value] of Object.entries(obj)) {
    book.push(`${k}=${value}`);
  }
  book.sort();
  book.push(`key=${key}`);
  return md5(book.join('&'));
}
export function getIdentity(len: number) {
  let SEED = '0Aa1Bb2Cc3Dd4Ee5Ff6Gg7Hh8Ii9Jj0Kk1Ll2Mm3Nn4Oo5Pp6Qq7Rr8Ss9Tt0Uu1Vv2Ww3Xx4Yy5Zz6789'.split('');
  let SIZE = SEED.length;
  let LEN = 20;
  if (!len || typeof len !== 'number') {
    len = LEN;
  }

  let uid = '';
  while (len-- > 0) {
    uid += SEED[(Math.random() * SIZE) | 0];
  }

  return uid;
}


//修改成From Data传参
export const getFromData = (data:any)=> {
  let str = "";
  data = data || {};
  Object.keys(data).forEach((item) => {
    str += `${item}=${data[item]}&`;
  });
  str = str.replace(/&$/, "");
  return str;
}

// 域名解密
export const decodeDomain = (domain: string): Array<string> => {
  const key = CryptoJS.enc.Utf8.parse('1111111122222222');
  const iv = CryptoJS.enc.Utf8.parse('');
  let encryptedHexStr = CryptoJS.enc.Hex.parse(domain);
  let srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr);
  let decrypt = CryptoJS.AES.decrypt(srcs, key, { iv, mode: CryptoJS.mode.ECB });
  let decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
  const pattern = RegExp('http://|https://|//');
  let _domain = decryptedStr.split(';');
  _domain = _domain.map((item: string) => item.replace(pattern, 'wss://'));
  return _domain;
};
