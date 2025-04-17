/**
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at

 * http://www.apache.org/licenses/LICENSE-2.0

 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { OverlayFigure, utils, Coordinate } from '@/components/YKLine/StockChart/OriginalKLine/index.esm';
// import { getFigureClass, OverlayMode, type OverlayEvent, type OverlayTemplate } from "klinecharts"
import {
  getFigureClass,
  OverlayMode,
  type OverlayEvent,
  type OverlayTemplate
} from '@/components/YKLine/StockChart/OriginalKLine/index.esm';
// import { OverlayMode, type OverlayEvent, type OverlayTemplate } from "klinecharts"
import { calcTextWidth } from '../../common/utils/canvas';
import { checkCoordinateOnText } from '../../common/utils/checkEventOn';
import { Swap } from '@/core/shared';

export const PositionLineFigureKey = {
  Close: 'close',
  Reverse: 'reverse'
};

const positionOverlay: OverlayTemplate = {
  name: 'positionOverlay',
  totalStep: 2,
  // 需要默认的点位图形,选中覆盖物时会有个蓝点，表示选中，这个可以控制蓝点是否显示
  needDefaultPointFigure: false,
  needDefaultXAxisFigure: true,
  needDefaultYAxisFigure: true,
  createPointFigures: ({ coordinates, bounding, overlay, xAxis, yAxis }) => {
    // debugger
    const positonExtendData: any = overlay.extendData.positionOverlay;
    // const profitLoss=overlay.extendData.extendsConfig.profitLoss
    const volume = overlay.extendData.extendsConfig.volume;

    const positionText = overlay.extendData.extendsConfig.profitLoss;
    const changeText = '↑↓';
    const closePositionText = 'x';
    const HEIGHT = 22;
    let isLongProfit = false;
    const closeColor = isLongProfit ? '#A5A8AC' : '#A5A8AC'; //关闭按钮色
    const closeBg = isLongProfit ? '#34343B' : '#34343B'; //关闭按钮内容背景色

    const PADDING = 8;
    const backgroundColor = overlay.styles?.backgroundColor;
    const directionColor = overlay.styles?.directionColor;
    const profitLossColor = overlay.styles?.profitLossColor;
    const tooltipColor = overlay.styles?.tooltipColor;
    const openDirectionBg = overlay.styles?.openDirectionBg;
    const offsetLeft = overlay.styles?.offsetLeft ?? 2;
    const { y } = coordinates[0];
    const profitLossText = overlay.extendData.extendsConfig.direction;
    //  overlay.extendData.extendsConfig.direction;
    const profitLossTextWidth = utils.calcTextWidth(profitLossText);
    const volumeText = `${overlay.extendData.volume ?? 0}`;
    const volumeTextWidth = utils.calcTextWidth(volumeText);
    const volumeTextRectWidth = Math.max(volumeTextWidth + PADDING * 2, 22);
    const openDirectionColor = overlay.styles?.openDirectionColor;
    // const profitLossTextWidth = utils.calcTextWidth(profitLossText) + PADDING * 2;

    let sideBg = '#2AB26C'; //方向背景
    let sideColor = '#FFFFFF'; //方向颜色

    let qtyBg = '#121212'; //方向背景
    let qtyColor = '#FFFFFF'; //方向颜色

    // console.log('profitLossTextWidth', profitLossTextWidth);

    // 持仓位置固定
    const positionPoint = { x: 30, y: yAxis.convertToPixel(positonExtendData.positionData.value) };
    // console.log(positionPoint)
    const figures = [];
    const twoWayMode = Swap.Trade.twoWayMode;

    // 注意，样式要写全，特别是边框，宽高，边距之类的属性，必须要填值，否则事件检测的时候会出问题
    const positionLineFigure = {
      type: 'line',
      attrs: { coordinates: [positionPoint, { x: bounding.width, y: positionPoint.y }] },
      styles: {
        // 样式，可选项`solid`，`dashed`
        style: 'solid',
        // 尺寸
        size: 1,
        // 颜色
        color: '#399BA2',
        // 虚线参数
        dashedValue: [5, 5]
      }
    };

    //持仓方向

    const positionSide = {
      type: 'text',
      // ignoreEvent: ['mouseDownEvent', 'mouseRightClickEvent'],
      attrs: {
        x: positionPoint.x - 20,
        y: positionPoint.y,
        height: HEIGHT,
        width: 40,
        align: 'left',
        baseline: 'middle',
        text: profitLossText
      },
      styles: {
        style: 'stroke_fill',
        color: sideColor,
        size: 12,
        cursor: 'pointer',
        borderColor: 'transparent',
        backgroundColor: sideBg,
        // // 左内边距
        paddingLeft: 4,
        // // 右内边距
        paddingRight: 4,
        // // 上内边距
        paddingTop: 4,
        // // 下内边距
        paddingBottom: 4,
        borderRadius: 2
      }
    };

    // 持仓按钮--------------------------------------------------
    const positionBtnFigure = {
      type: 'text',
      attrs: {
        x: positionPoint.x,
        height: HEIGHT,
        y: positionPoint.y,
        text: positionText,
        baseline: 'middle'
      },
      styles: {
        // 样式，可选项`fill`，`stroke`，`stroke_fill`
        style: 'fill',
        // 颜色
        color: '#2AB26C',
        // 尺寸
        size: 12,
        // 字体
        family: 'Helvetica Neue',
        // 粗细
        weight: 'normal',
        // 左内边距
        paddingLeft: 4,
        // 右内边距
        paddingRight: 4,
        // 上内边距
        paddingTop: 4,
        // 下内边距
        paddingBottom: 4,
        // 边框样式
        borderStyle: 'solid',
        // 边框颜色
        borderColor: 'transparent',
        // 边框尺寸
        borderSize: 0,
        // 边框虚线参数
        borderDashedValue: [2, 2],
        // 边框圆角值
        borderRadius: 0,
        // 背景色
        backgroundColor: '#14221B'
      }
    };

    // console.log(positionBtnFigure);
    const positionBtnWidth =
      positionBtnFigure.styles.paddingLeft +
      calcTextWidth(
        positionBtnFigure.attrs.text,
        positionBtnFigure.styles.size,
        positionBtnFigure.styles.weight,
        positionBtnFigure.styles.family
      ) +
      positionBtnFigure.styles.paddingRight;
    // console.log(positionBtnWidth)
    positonExtendData.positionBtnFigure.option = positionBtnFigure;
    positonExtendData.positionBtnFigure.styles.width = positionBtnWidth;

    // 持仓数量-----
    const positionQtyFigure = {
      type: 'text',
      attrs: {
        x: positionPoint.x + positionBtnWidth,
        height: HEIGHT,
        y: positionPoint.y,
        text: volume,
        baseline: 'middle'
      },
      styles: {
        // 样式，可选项`fill`，`stroke`，`stroke_fill`
        style: 'fill',
        // 颜色
        color: qtyColor,
        // 尺寸
        size: 12,
        // 字体
        family: 'Helvetica Neue',
        // 粗细
        weight: '500',
        // 左内边距
        paddingLeft: 4,
        // 右内边距
        paddingRight: 4,
        // 上内边距
        paddingTop: 4,
        // 下内边距
        paddingBottom: 4,
        // 边框样式
        borderStyle: 'solid',
        // 边框颜色
        borderColor: 'transparent',
        // 边框尺寸
        borderSize: 0,
        // 边框虚线参数
        borderDashedValue: [2, 2],
        // 边框圆角值
        borderRadius: 0,
        // 背景色
        backgroundColor: qtyBg
      }
    };
    const positionQtyWidth =
      positionQtyFigure.styles.paddingLeft +
      calcTextWidth(
        positionQtyFigure.attrs.text,
        positionQtyFigure.styles.size,
        positionQtyFigure.styles.weight,
        positionQtyFigure.styles.family
      ) +
      positionQtyFigure.styles.paddingRight;
    // console.log(positionBtnWidth)
    positonExtendData.positionQtyFigure.option = positionQtyFigure;
    positonExtendData.positionQtyFigure.styles.width = positionBtnWidth;

    // 反手开仓-----
    // const positionReverseFigure = {
    //   key: 'reverse',
    //   type: 'rect',
    //   ignoreEvent: ['mouseDownEvent', 'mouseRightClickEvent'],
    //   attrs: {
    //     x: positionPoint.x + positionQtyWidth + positionBtnWidth,
    //     y: positionPoint.y - HEIGHT / 2,
    //     width: 28,
    //     height: HEIGHT
    //   },
    //   styles: {
    //     style: 'stroke_fill',
    //     // borderColor: 'red',
    //     // color: '#FFFFFF'
    //   }
    // };
    // const positionQtyWidth = positionQtyFigure.styles.paddingLeft + calcTextWidth(positionQtyFigure.attrs.text, positionQtyFigure.styles.size, positionQtyFigure.styles.weight, positionQtyFigure.styles.family) + positionQtyFigure.styles.paddingRight
    // console.log(positionBtnWidth)
    // positonExtendData.positionQtyFigure.option = positionQtyFigure
    // positonExtendData.positionQtyFigure.styles.width = positionBtnWidth

    // 切换按钮--------------------------------------------------
    const changeBtnFigure = {
      type: 'text',
      attrs: {
        x: positionPoint.x + positionBtnWidth + positionQtyWidth,
        y: positionPoint.y,
        text: changeText,
        height: HEIGHT,
        width: 24,
        baseline: 'middle'
      },
      styles: {
        style: 'stroke_fill',
        color: '#FFFFFF',
        size: 12,
        cursor: 'pointer',
        borderColor: closeBg,
        backgroundColor: closeBg,
        paddingTop: 7,
        paddingLeft: 7,
        paddingRight: 7,
        borderRadius: 0
      }
    };

    const changeBtnWidth =
      changeBtnFigure.styles.paddingLeft +
      calcTextWidth(
        changeBtnFigure.attrs.text,
        changeBtnFigure.styles.size,
        changeBtnFigure.styles.weight,
        changeBtnFigure.styles.family
      ) +
      changeBtnFigure.styles.paddingRight;
    if (!twoWayMode) {
      positonExtendData.changeBtnFigure.option = changeBtnFigure;
      positonExtendData.changeBtnFigure.styles.width = changeBtnWidth;
    }

    // 平仓按钮--------------------------------------------------
    const closePositionBtnFigure = {
      // key: PositionTPSLLineFigureKey.Close,
      type: 'text',
      // ignoreEvent: ['mouseDownEvent', 'mouseRightClickEvent'],
      attrs: {
        x: positionPoint.x + positionQtyWidth + positionBtnWidth + (twoWayMode ? 0 : 24),
        y: positionPoint.y,
        height: HEIGHT,
        width: HEIGHT,
        align: 'left',
        baseline: 'middle',
        text: '✕'
      },
      styles: {
        style: 'stroke_fill',
        color: closeColor,
        size: 12,
        cursor: 'pointer',
        borderColor: closeBg,
        backgroundColor: closeBg,
        paddingTop: 7,
        paddingLeft: 7,
        paddingRight: 7,
        borderRadius: 0
      }
      // type: 'text',
      // attrs: {
      //   x: positionPoint.x + positionBtnWidth + changeBtnWidth,
      //   y: positionPoint.y,
      //   text: closePositionText,
      //   baseline: 'middle'
      // },
      // styles: {
      //   // 样式，可选项`fill`，`stroke`，`stroke_fill`
      //   style: 'fill',
      //   // 颜色
      //   color: '#A5A8AC',
      //   // 尺寸
      //   size: 12,
      //   // 字体
      //   family: 'Helvetica Neue',
      //   // 粗细
      //   weight: 'normal',
      //   // 左内边距
      //   paddingLeft: 4,
      //   // 右内边距
      //   paddingRight: 4,
      //   // 上内边距
      //   paddingTop: 4,
      //   // 下内边距
      //   paddingBottom: 4,
      //   // 边框样式
      //   borderStyle: 'solid',
      //   // 边框颜色
      //   borderColor: 'transparent',
      //   // 边框尺寸
      //   borderSize: 0,
      //   // 边框虚线参数
      //   borderDashedValue: [2, 2],
      //   // 边框圆角值
      //   borderRadius: 0,
      //   // 背景色
      //   backgroundColor: '#121212'
      // },
    };
    const closePositionBtnWidth =
      closePositionBtnFigure.styles.paddingLeft +
      calcTextWidth(
        closePositionBtnFigure.attrs.text,
        closePositionBtnFigure.styles.size,
        closePositionBtnFigure.styles.weight,
        closePositionBtnFigure.styles.family
      ) +
      closePositionBtnFigure.styles.paddingRight;
    positonExtendData.closePositionBtnFigure.option = closePositionBtnFigure;
    positonExtendData.closePositionBtnFigure.styles.width = closePositionBtnWidth;

    positonExtendData.positionBtnFigure.styles.width = positionBtnWidth;
    // positonExtendData.positionSide.styles.width = 20

    positonExtendData.changeBtnFigure.styles.width = changeBtnWidth;

    positonExtendData.closePositionBtnFigure.styles.width = closePositionBtnWidth;

    const figureElements = [positionLineFigure, positionBtnFigure];
    if (!twoWayMode) {
      figureElements.push(...figureElements, positionQtyFigure, changeBtnFigure, closePositionBtnFigure);
    } else {
      figureElements.push(...figureElements, positionQtyFigure, closePositionBtnFigure);
    }
    // figureElements.push(...figureElements, positionQtyFigure, changeBtnFigure, closePositionBtnFigure);
    return figureElements;
  },
  onClick: (e: any) => {
    // console.log(e)
    // 判断是否在区域内figure checkEventOn中的函数
    const textFigure = getFigureClass('text');

    const positionExtendData = e.overlay.extendData.positionOverlay;
    const takeProfitExtendData = e.overlay.extendData.takeProfitOverlay;
    const stopLossExtendData = e.overlay.extendData.stopLossOverlay;

    // 是否点击了持仓按钮
    if (
      textFigure?.prototype.checkEventOnImp(
        { x: e.x, y: e.y },
        positionExtendData.positionBtnFigure.option.attrs,
        positionExtendData.positionBtnFigure.option.styles
      )
    ) {
      console.log('点击了持仓按钮');
      if (takeProfitExtendData.show) {
        takeProfitExtendData.show = false;
        e.overlay.extendData.chart.removeOverlay({ id: takeProfitExtendData.id });
      } else {
        takeProfitExtendData.show = true;
        const takeProfitOverlay = e.overlay.extendData.chart.createOverlay({
          name: 'takeProfitOverlay',
          paneId: 'candle_pane',
          visible: true,
          lock: false,
          mode: OverlayMode.Normal,
          points: [
            {
              dataIndex: positionExtendData.positionData.dataIndex,
              timestamp: positionExtendData.positionData.timestamp,
              value: positionExtendData.positionData.value
            }
          ],
          extendData: e.overlay.extendData
        });
        takeProfitExtendData.id = takeProfitOverlay;
      }

      if (stopLossExtendData.show) {
        stopLossExtendData.show = false;
        e.overlay.extendData.chart.removeOverlay({ id: stopLossExtendData.id });
      } else {
        stopLossExtendData.show = true;
        const stopLossOverlay = e.overlay.extendData.chart.createOverlay({
          name: 'stopLossOverlay',
          paneId: 'candle_pane',
          visible: true,
          lock: false,
          mode: OverlayMode.Normal,
          points: [
            {
              dataIndex: positionExtendData.positionData.dataIndex,
              timestamp: positionExtendData.positionData.timestamp,
              value: positionExtendData.positionData.value
            }
          ],
          extendData: e.overlay.extendData
        });
        stopLossExtendData.id = stopLossOverlay;
      }
      return true;
    }

    // 是否点击了切换按钮
    if (
      positionExtendData.changeBtnFigure.option &&
      textFigure?.prototype.checkEventOnImp(
        { x: e.x, y: e.y },
        positionExtendData.changeBtnFigure.option.attrs,
        positionExtendData.changeBtnFigure.option.styles
      )
    ) {
      e.overlay.extendData.positionOverlay.changeBtnFigure.onClick(e.overlay.extendData.positionOverlay.positionData);
      console.log('点击了切换按钮');
      return true;
    }
    // 是否点击了平仓按钮
    if (
      textFigure?.prototype.checkEventOnImp(
        { x: e.x, y: e.y },
        positionExtendData.closePositionBtnFigure.option.attrs,
        positionExtendData.closePositionBtnFigure.option.styles
      )
    ) {
      e.overlay.extendData.positionOverlay.closePositionBtnFigure.onClick(
        e.overlay.extendData.positionOverlay.positionData
      );
      return true;
    }
    return true;
  }
};

export default positionOverlay;
