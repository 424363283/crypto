export const MARKETS = {
  /**
   * @description 计算行情涨跌幅公式：涨跌幅 = (最新价 - 昨收价) / 昨收价 * 100%
   * @param {string | number} lastPrice  最新价
   * @param {string | number} prevClose  昨收价
   * @returns {string}  涨跌幅
   */
  getChangeRate: (lastPrice: string | number, prevClose: string | number): string => lastPrice.sub(prevClose).div(prevClose).mul(100).toFixed(2),
  /**
   * @description 计算行情涨跌额公式：涨跌额 = 最新价 - 昨收价
   * @param {string | number} lastPrice 最新价
   * @param {string | number} prevClose 昨收价
   * @returns {string} 涨跌额
   */
  getChangeValue: (lastPrice: string | number, prevClose: string | number): string => lastPrice.sub(prevClose),
};
