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

export const cacheTPSLineFigureKey = {};

const positionOverlay: OverlayTemplate = {
  name: 'positionOverlay',
  totalStep: 2,
  // 需要默认的点位图形,选中覆盖物时会有个蓝点，表示选中，这个可以控制蓝点是否显示
  needDefaultPointFigure: false,
  needDefaultXAxisFigure: true,
  needDefaultYAxisFigure: true,
  createPointFigures: ({ coordinates, bounding, overlay, xAxis, yAxis }) => {
    const positonExtendData: any = overlay.extendData.positionOverlay;
    // const profitLoss=overlay.extendData.extendsConfig.profitLoss
    const volume = overlay.extendData.extendsConfig.volume;

    const positionText = overlay.extendData.extendsConfig.profitLoss;
    const changeText = '\ue900';
    const closePositionText = '\ue901';
    const HEIGHT = 20;
    let isLongProfit = overlay.extendData.extendsConfig.isLong;
    // const closeColor = isLongProfit ? '#2AB26C' : '#A5A8AC'; //关闭按钮色
    const closeColor = '#A5A8AC'; //关闭按钮色
    const changeColor = '#A5A8AC'; //切换按钮色
    const closeBg = isLongProfit ? '#34343B' : '#34343B'; //关闭按钮内容背景色
    let sideBg = isLongProfit ? '#2AB26C' : '#EF454A'; //方向背景
    let sideColor = isLongProfit ? '#FFFFFF' : '#FFFFFF'; //方向颜色

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

    let qtyBg = '#121212'; //方向背景
    let qtyColor = '#FFFFFF'; //方向颜色

    // console.log('profitLossTextWidth', profitLossTextWidth);
    const crosshairPoint = overlay.extendData.crosshairPoint

    // console.log(overlay.extendData.crosshairPoint)

    // 持仓位置固定
    const positionPoint = { x: 30, y: yAxis.convertToPixel(positonExtendData.positionData.value) };
    // console.log(positionPoint)
    const twoWayMode = Swap.Trade.twoWayMode;

    // console.log(`cordinate${coordinates[0].x}-${coordinates[0].y}`)
    // 注意，样式要写全，特别是边框，宽高，边距之类的属性，必须要填值，否则事件检测的时候会出问题
    // 持仓线--------------------------------------------------
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

    // 持仓方向--------------------------------------------------

    const positionDirectionBtnFigure = {
      type: 'text',
      // ignoreEvent: ['mouseDownEvent', 'mouseRightClickEvent'],
      attrs: {
        x: positionPoint.x,
        y: positionPoint.y,
        // height: HEIGHT,
        // width: 40,
        // align: 'left',
        baseline: 'middle',
        text: profitLossText
      },
      styles: {
        style: 'stroke_fill',
        color: sideColor,
        // 尺寸
        size: 10,
         // 字体
        family: 'HarmonyOS Sans SC',
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
        borderRadius: [4, 0, 0, 4],
        // 边框颜色
        backgroundColor: sideBg
      }
    };

    const positionDirectionBtnWidth =
      positionDirectionBtnFigure.styles.paddingLeft +
      calcTextWidth(
        positionDirectionBtnFigure.attrs.text,
        positionDirectionBtnFigure.styles.size,
        positionDirectionBtnFigure.styles.weight,
        positionDirectionBtnFigure.styles.family
      ) +
      positionDirectionBtnFigure.styles.paddingRight;
    positonExtendData.positionDirectionBtnFigure.option = positionDirectionBtnFigure;
    positonExtendData.positionDirectionBtnFigure.styles.width = positionDirectionBtnWidth;

    

    // 持仓按钮--------------------------------------------------
    const positionBtnFigure = {
      type: 'text',
      attrs: {
        x: positionPoint.x + positionDirectionBtnWidth,
        // height: HEIGHT,
        y: positionPoint.y,
        text: positionText,
        baseline: 'middle'
      },
      styles: {
        // 样式，可选项`fill`，`stroke`，`stroke_fill`
        style: 'fill',
        // 颜色
        color: sideColor,
        // 尺寸
        size: 10,
        // 字体
        family: 'HarmonyOS Sans SC',
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
        backgroundColor: sideBg
      }
    };

    const positionBtnWidth =
      positionBtnFigure.styles.paddingLeft +
      calcTextWidth(
        positionBtnFigure.attrs.text,
        positionBtnFigure.styles.size,
        positionBtnFigure.styles.weight,
        positionBtnFigure.styles.family
      ) +
      positionBtnFigure.styles.paddingRight;
    positonExtendData.positionBtnFigure.option = positionBtnFigure;
    positonExtendData.positionBtnFigure.styles.width = positionBtnWidth;


    // 判断是否在本区域内，如果在的话显示tip figure
    let positionTipFigure = null
    if (crosshairPoint.x >= positionDirectionBtnFigure.attrs.x && crosshairPoint.x <= positionDirectionBtnFigure.attrs.x + positionDirectionBtnWidth + positionBtnWidth
     && crosshairPoint.y >= positionDirectionBtnFigure.attrs.y - HEIGHT/2 && crosshairPoint.y <= positionDirectionBtnFigure.attrs.y + HEIGHT/2
    ){
      positionTipFigure = {
        type: 'popText',
        attrs: {
          x: positionPoint.x + (positionDirectionBtnWidth + positionBtnWidth)/2,
          y: positionPoint.y - HEIGHT/2,
          // 文字内容
          text: `点击止盈止损`,
          // 指定宽
          // width: 20,
          // 指定高
          // height: 20,
          // 对齐方式
          align: 'center',
          // 基准
          baseline: 'middle'
        },
        styles: {
          style: 'fill',
          size: 10,
          // 左内边距
          paddingLeft: 10,
          paddingTop: 6,
          paddingRight: 10,
          paddingBottom: 6,
          borderColor: '#FFFFFF',
          borderStyle: 'solid',
          // 边框样式
          borderSize: 1,
          borderDashedValue: [5, 5],
          color: '#FFFFFF',
          family: 'HarmonyOS Sans SC',
          weight: 'normal',
          borderRadius: 4,
          backgroundColor: '#F0BA30',
          placement: 'top',
          arrowSize: 5
        }
      }
    }

    // 持仓数量--------------------------------------------------
    const positionQtyFigure = {
      type: 'text',
      attrs: {
        x: positionPoint.x + positionDirectionBtnWidth + positionBtnWidth,
        // height: HEIGHT,
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
        size: 10,
        // 字体
        family: 'HarmonyOS Sans SC',
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
    positonExtendData.positionQtyFigure.option = positionQtyFigure;
    positonExtendData.positionQtyFigure.styles.width = positionQtyWidth;

    // 切换按钮--------------------------------------------------
    const changeBtnFigure = {
      type: 'text',
      attrs: {
        x: positionPoint.x + positionDirectionBtnWidth + positionBtnWidth + positionQtyWidth,
        y: positionPoint.y,
        text: changeText,
        // height: HEIGHT,
        // width: 20,
        baseline: 'middle'
      },
      styles: {
        // 样式，可选项`fill`，`stroke`，`stroke_fill`
        style: 'stroke_fill',
        // 颜色
        color: changeColor,
        // 尺寸
        size: 12,
        // 字体
        family: 'cryptofont',
        // 粗细
        weight: 'normal',
        // 左内边距
        paddingLeft: 4,
        // 右内边距
        paddingRight: 4,
        // 上内边距
        paddingTop: 3,
        // 下内边距
        paddingBottom: 3,
        // 边框样式
        borderStyle: 'solid',
        // 边框颜色
        borderColor: '#A5A8AC',
        // 边框尺寸
        borderSize: 0,
        // 边框虚线参数
        borderDashedValue: [2, 2],
        // 边框圆角值
        borderRadius: 0,
        // 背景色
        backgroundColor: '#121212'
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
        x: positionPoint.x + positionDirectionBtnWidth + positionQtyWidth + positionBtnWidth + (twoWayMode ? 0 : changeBtnWidth),
        y: positionPoint.y,
        // height: HEIGHT,
        // width: HEIGHT,
        // align: 'left',
        baseline: 'middle',
        text: closePositionText
      },
      styles: {
        // 样式，可选项`fill`，`stroke`，`stroke_fill`
        style: 'stroke_fill',
        // 颜色
        color: closeColor,
        // 尺寸
        size: 16,
        // 字体
        family: 'cryptofont',
        // 粗细
        weight: 'normal',
        // 左内边距
        paddingLeft: 4,
        // 右内边距
        paddingRight: 4,
        // 上内边距
        paddingTop: 1,
        // 下内边距
        paddingBottom: 1,
        // 边框样式
        borderStyle: 'solid',
        // 边框颜色
        borderColor: closeBg,
        // 边框尺寸
        borderSize: 0,
        // 边框虚线参数
        borderDashedValue: [2, 2],
        // 边框圆角值
        borderRadius: 0,
        // 背景色
        backgroundColor: '#121212'
      },
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

    const figureElements = [positionLineFigure, positionDirectionBtnFigure, positionBtnFigure];
    if (!twoWayMode) {
      figureElements.push(...figureElements, positionQtyFigure, changeBtnFigure, closePositionBtnFigure);
    } else {
      figureElements.push(...figureElements, positionQtyFigure, closePositionBtnFigure);
    }
    // figureElements.push(...figureElements, positionQtyFigure, changeBtnFigure, closePositionBtnFigure);

    // tip 
    if (positionTipFigure) {
      figureElements.push(positionTipFigure)
    }
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
      ) ||
      textFigure?.prototype.checkEventOnImp(
        { x: e.x, y: e.y },
        positionExtendData.positionDirectionBtnFigure.option.attrs,
        positionExtendData.positionDirectionBtnFigure.option.styles
      )
    ) {
      console.log('点击了持仓按钮');
      // if (positionExtendData.positionData.stopProfit && positionExtendData.positionData.stopLoss) {
      //   return;
      // }
      const currentCacheTPSLine = cacheTPSLineFigureKey[positionExtendData.positionData.positionId];
      if (currentCacheTPSLine) {
        stopLossExtendData.show = false;
        takeProfitExtendData.show = false;
        // 移除现有的overlay
        ['takeProfitOverlayId', 'stopLossOverlayId'].forEach(key => {
          if (currentCacheTPSLine[key]) {
            e.overlay.extendData.chart.removeOverlay({ id: currentCacheTPSLine[key] });
          }
        });
        Object.assign(cacheTPSLineFigureKey, {
          takeProfitOverlayId: null,
          stopLossOverlayId: null,
          id: null,
          [positionExtendData.positionData.positionId]: null
        });
      } else {
        const createOverlayConfig = {
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
        };

        // 缓存overlayId
        let cacheOverlayId = {
          takeProfitOverlayId: null,
          stopLossOverlayId: null
        };

        // 创建止盈overlay
        if (!positionExtendData.positionData.stopProfit) {
          if (!positionExtendData.positionData.stopProfit) {
            const takeProfitOverlay = e.overlay.extendData.chart.createOverlay({
              name: 'takeProfitOverlay',
              ...createOverlayConfig
            });
            takeProfitExtendData.show = true;
            cacheOverlayId.takeProfitOverlayId = cacheTPSLineFigureKey.takeProfitOverlayId = takeProfitOverlay;
          }
        }
        // 创建止损overlay
        if (!positionExtendData.positionData.stopLoss) {
          const stopLossOverlay = e.overlay.extendData.chart.createOverlay({
            name: 'stopLossOverlay',
            ...createOverlayConfig
          });
          stopLossExtendData.show = true;
          stopLossExtendData.stopLossOverlayId =
            cacheOverlayId.stopLossOverlayId =
            cacheTPSLineFigureKey.stopLossOverlayId =
              stopLossOverlay;
        }
        cacheTPSLineFigureKey[positionExtendData.positionData.positionId] = cacheOverlayId;
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
  },
  onMouseEnter: (e:any) => { 
    const textFigure = getFigureClass('text');
    const positionExtendData = e.overlay.extendData.positionOverlay;
    if (
      textFigure?.prototype.checkEventOnImp(
        { x: e.x, y: e.y },
        positionExtendData.positionBtnFigure.option.attrs,
        positionExtendData.positionBtnFigure.option.styles
      ) ||
      textFigure?.prototype.checkEventOnImp(
        { x: e.x, y: e.y },
        positionExtendData.positionDirectionBtnFigure.option.attrs,
        positionExtendData.positionDirectionBtnFigure.option.styles
      )
    ) {
      // 创建tip
      console.log(111)
    } else {
      // 去掉tip
    }
  },
  onMouseLeave: (e:any) => {
    // 移除tip
  }
};

export default positionOverlay;
