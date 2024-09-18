/**
 * 两个图表公共的一些配置
 * @description 配置文件
 */

export const k_config = (rootColor: any) => ({
  /**
   * 上涨的颜色
   */
  upColor: `rgba(${rootColor['up-color-rgb']},1)`,

  /**
   * 下跌的颜色
   */
  downColor: `rgba(${rootColor['down-color-rgb']},1)`,

  /**
   * 指标上涨颜色
   */
  upColor2: `rgba(${rootColor['up-color-rgb']},0.3)`,

  /**
   * 指标下跌颜色
   */
  downColor2: `rgba(${rootColor['down-color-rgb']},0.3)`,

  /**
   * 边框文字等主颜色
   */
  aColor: 'rgba(129, 146, 157, 1)',

  /**
   * 边框文字等辅颜色
   */
  bColor: 'rgba(131, 140, 154, 0.03)',

  /**
   * 网格线颜色
   */
  gridColor: 'rgba(131, 140, 154, 0.05)',

  /**
   * 主色
   */
  primary: `rgba(${rootColor['active-color-rgb']},1)`,
});
