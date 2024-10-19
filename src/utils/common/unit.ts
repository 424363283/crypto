import * as math from 'mathjs';
import { isServerSideRender } from '../validator';
import { digits } from './digit';
import { format } from './format';
import { getGlobalConfig } from '../config';

/**
 * 法币估值
 * 计算公式= rates[token][moneys[choose][1]]*value
 * @param {object} rates 所有汇率 { BTC:{ BTC:1, CNY: 4000, USD: 3000} }
 * @param {number} value token的值, 如 33.2
 * @param {string} token tokenId, 如BTC，ETH
 * @param {string} choose 转换成何种法币，如 en-us, zh-cn， 默认en-us
 * @param {bool} suffix 是否返回后货币符号，默认false返回如[¥, 100]，为true时返回如[CNY, 100]
 * @return {array} [法币标志,法币估值], 如 ['usd',2323.231] , 法币估值保留2位小数，如果小于0.01，保留5位小数, 如果估值为负数, value返回'--';
 */
export function currencyValue(
  rates: { [key: string]: any },
  value: number,
  token: string,
  choose = isServerSideRender() ? '' : window.localStorage.unit,
  suffix = false,
  canNegative = false
) {
  const money = isServerSideRender() ? [] : getGlobalConfig('appConfig')?.supportLanguages;

  if (!rates || !money || !money.length || (!value && value !== 0) || !token || !rates[token]) {
    return suffix ? ['', '--', ''] : ['', '--'];
  }

  const moneys = money.reduce(
    (acc: any, cur: any) => ({
      ...acc,
      [cur.lang.toLowerCase()]: [cur.prefix, cur.suffix]
    }),
    {}
  );

  // 要获取的法币是否有汇率，如果没有，默认获取en-us
  const realChoose = moneys[choose] && moneys[choose][0] ? choose : 'en-us';
  if (!moneys[realChoose]) {
    return suffix ? ['', '--', ''] : ['', '--'];
  }
  const name = moneys[realChoose][0];
  const endName = moneys[realChoose][1];
  let v = rates[token.toUpperCase()][moneys[realChoose][1]];
  //选择币对的汇率不存在
  if (!v) {
    return suffix ? [name, '--', endName] : [name, '--'];
  }
  v = math
    .chain(v)
    .multiply(Number(value) || 0)
    .format({ notation: 'fixed' })
    .done();

  const fix = Math.abs(v - 0.1) < 0 && Number(v) !== 0 ? 5 : 2;
  v = digits(v, fix);

  if (Number(v) < 0 && !canNegative) {
    v = '--';
  } else {
    v = `${v < 0 ? '-' : ''}${format(math.abs(v), fix)}`;
  }

  return suffix ? [name, v, endName] : [name, v];
}

/**
 * 估值单位转换 比如将USDT转化为BTC 用来处理极端情况下，btc估值为0，但是usdt估值不为0的情况
 * 会损失一定的精度
 * @param {object} rates 所有汇率 { BTC:{ BTC:1, CNY: 4000, USD: 3000} }
 * @param {number} value token的值, 如 33.2
 * @param {string} sourceToken 转换前tokenId, 如BTC，ETH
 * @param {string} targetToken 转换后tokenId, 如BTC，ETH
 */
export function convertValuationUnit(
  rates: { [key: string]: any },
  value: number,
  sourceToken: string,
  targetToken: string
) {
  return math
    .chain(value)
    .multiply(Number(rates[sourceToken][targetToken]) || 0)
    .format({ notation: 'fixed' })
    .done();
}

export function unitConversion(item: number, d = 3) {
  let count = Number(item);

  if (isNaN(count)) count = 0;

  // let result = count;
  let unit = '';

  if (count >= 1000 && count < 1000000) {
    count = count / 1000;
    unit = 'K';
  } else if (count >= 1000000 && count < 1000000000) {
    count = count / 1000000;
    unit = 'M';
  } else if (count >= 1000000000 && count < 1000000000000) {
    count = count / 1000000000;
    unit = 'B';
  } else if (count >= 1000000000000) {
    count = count / 1000000000000;
    unit = 'B';
  }
  // result = digits(count, d);
  return digits(count, d) + unit;
}
