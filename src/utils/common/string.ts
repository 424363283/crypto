import { isCN } from '../validator/index';

export function trim(str: string) {
  return (str || '').replace(/^\s+|\s+$/g, '');
}

// 字符串重组
export function dataReform(str: string) {
  let result = '';

  for (let i = 0; i < str.length; i++) {
    const c = str.substring(i, 1);
    if (c == '\n') result = result + '</br>';
    else if (c == ' ' || c == '\\s') result = result + ' ';
    else if (c != '\r') result = result + c;
  }

  return result;
}

// 区分中英文截取规定长度字符串
export function limitText(message: string, MaxLength: number) {
  const txtval = message;
  let strlenght = 0; //初始定义长度为0
  let newStr = '';

  for (let i = 0; i < txtval.length; i++) {
    if (isCN(txtval.charAt(i))) {
      if (strlenght + 2 <= MaxLength) {
        strlenght = strlenght + 2; //中文为2个字符
        newStr += txtval.charAt(i);
      }
    } else {
      if (strlenght + 1 <= MaxLength) {
        strlenght = strlenght + 1; //英文一个字符
        newStr += txtval.charAt(i);
      }
    }
  }
  return {
    text: newStr,
    length: strlenght
  };
}

export function handleChar(str: string) {
  return str
    .replace(/<script>|<\/script>/gi, '')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&amp;/gi, '&')
    .replace(/&#39;/gi, "'");
}

// 数字格式化千分制
export const formatNumberWithCommas = (number: string) => {
  // 将数字分成整数部分和小数部分
  const parts = number.toString().split('.');
  const integerPart = parts[0];
  const decimalPart = parts[1] || ''; // 如果没有小数部分，默认为空字符串

  // 格式化整数部分为千分制
  const formattedIntegerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  // 组合整数部分和小数部分
  const formattedNumber = decimalPart ? `${formattedIntegerPart}.${decimalPart}` : formattedIntegerPart;

  return formattedNumber;
};
