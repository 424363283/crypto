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
  needDefaultXAxisFigure: false,
  needDefaultYAxisFigure: false,
  createPointFigures: ({ coordinates, bounding, overlay, xAxis, yAxis }) => {
    const positonExtendData: any = overlay.extendData.positionOverlay;
    const volume = overlay.extendData.extendsConfig.volume;

    // 方向
    const directionColor = overlay.styles?.directionColor;
    const directionBackgroundColor = overlay.styles?.directionBackgroundColor;
    // 收益
    const profitLossColor = overlay.styles?.profitLossColor;
    const profitLossBackgroundColor = overlay.styles?.profitLossBackgroundColor;
    // 持仓量
    const volumeColor = overlay.styles?.volumeColor;
    const volumeBackgroundColor = overlay.styles?.volumeBackgroundColor;
    // 操作按钮
    const operationColor = overlay.styles?.operationColor;
    const operationBackgroundColor = overlay.styles?.operationBackgroundColor;
    // 提示
    const tipColor = overlay.styles?.tipColor;
    const tipBorderColor = overlay.styles?.tipBorderColor;
    const tipBackgroundColor = overlay.styles?.tipBackgroundColor;

    //持仓线
    const positionLineColor = overlay.styles?.positionLineColor;


    const positionText = overlay.extendData.extendsConfig.profitLoss;
    const changeText = '\ue900';
    const closePositionText = '\ue901';
    const HEIGHT = 20;
    let isLongProfit = overlay.extendData.extendsConfig.isLong;
    const PADDING = 4;
   
    const offsetLeft = overlay.styles?.offsetLeft ?? 2;
    const { y } = coordinates[0];
    const profitLossText = overlay.extendData.extendsConfig.direction;
    //  overlay.extendData.extendsConfig.direction;
    const volumeText = `${overlay.extendData.volume ?? 0}`;

    const crosshairPoint = overlay.extendData.crosshairPoint

    // console.log(overlay.extendData.crosshairPoint)

    // 持仓位置固定
    console.log('------', positonExtendData.positionData.value)
    const positionPoint = { x: 30, y: yAxis.convertToPixel(positonExtendData.positionData.value) };
    const twoWayMode = Swap.Trade.twoWayMode;

    // console.log(`cordinate${coordinates[0].x}-${coordinates[0].y}`)
    // 注意，样式要写全，特别是边框，宽高，边距之类的属性，必须要填值，否则事件检测的时候会出问题
    

    // 持仓方向--------------------------------------------------

    const positionDirectionBtnFigure = {
      type: 'text',
      // ignoreEvent: ['mouseDownEvent', 'mouseRightClickEvent'],
      attrs: {
        x: positionPoint.x,
        y: positionPoint.y,
        baseline: 'middle',
        text: profitLossText
      },
      styles: {
        style: 'fill',
        color: directionColor,
        // 尺寸
        size: 10,
         // 字体
        family: 'HarmonyOS Sans SC',
        // 粗细
        weight: 'normal',
        // 左内边距
        paddingLeft: PADDING,
        // 右内边距
        paddingRight: PADDING,
        // 上内边距
        paddingTop: PADDING,
        // 下内边距
        paddingBottom: PADDING,
        // 边框样式
        borderStyle: 'solid',
        // 边框颜色
        borderColor: directionBackgroundColor,
        // 边框尺寸
        borderSize: 0,
        // 边框虚线参数
        borderDashedValue: [2, 2],
        // 边框圆角值
        borderRadius: [4, 0, 0, 4],
        // 边框颜色
        backgroundColor: directionBackgroundColor
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

    

    // 收益--------------------------------------------------
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
        color: profitLossColor,
        // 尺寸
        size: 10,
        // 字体
        family: 'HarmonyOS Sans SC',
        // 粗细
        weight: 'normal',
        // 左内边距
        paddingLeft: PADDING,
        // 右内边距
        paddingRight: PADDING,
        // 上内边距
        paddingTop: PADDING,
        // 下内边距
        paddingBottom: PADDING,
        // 边框样式
        borderStyle: 'solid',
        // 边框颜色
        borderColor: profitLossBackgroundColor,
        // 边框尺寸
        borderSize: 0,
        // 边框虚线参数
        borderDashedValue: [2, 2],
        // 边框圆角值
        borderRadius: 0,
        // 背景色
        backgroundColor: profitLossBackgroundColor
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
          borderColor: tipBorderColor,
          borderStyle: 'solid',
          // 边框样式
          borderSize: 1,
          borderDashedValue: [5, 5],
          color: tipColor,
          family: 'HarmonyOS Sans SC',
          weight: 'normal',
          borderRadius: 4,
          backgroundColor: tipBackgroundColor,
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
        color: volumeColor,
        // 尺寸
        size: 10,
        // 字体
        family: 'HarmonyOS Sans SC',
        // 粗细
        weight: 'normal',
        // 左内边距
        paddingLeft: PADDING,
        // 右内边距
        paddingRight: PADDING,
        // 上内边距
        paddingTop: PADDING,
        // 下内边距
        paddingBottom: PADDING,
        // 边框样式
        borderStyle: 'solid',
        // 边框颜色
        borderColor: volumeBackgroundColor,
        // 边框尺寸
        borderSize: 0,
        // 边框虚线参数
        borderDashedValue: [2, 2],
        // 边框圆角值
        borderRadius: 0,
        // 背景色
        backgroundColor: volumeBackgroundColor
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
        color: operationColor,
        // 尺寸
        size: 12,
        // 字体
        family: 'cryptofont',
        // 粗细
        weight: 'normal',
        // 左内边距
        paddingLeft: PADDING,
        // 右内边距
        paddingRight: PADDING,
        // 上内边距
        paddingTop: 3,
        // 下内边距
        paddingBottom: 3,
        // 边框样式
        borderStyle: 'solid',
        // 边框颜色
        borderColor: operationBackgroundColor,
        // 边框尺寸
        borderSize: 0,
        // 边框虚线参数
        borderDashedValue: [2, 2],
        // 边框圆角值
        borderRadius: 0,
        // 背景色
        backgroundColor: operationBackgroundColor
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
        color: operationColor,
        // 尺寸
        size: 16,
        // 字体
        family: 'cryptofont',
        // 粗细
        weight: 'normal',
        // 左内边距
        paddingLeft: 1,
        // 右内边距
        paddingRight: 1,
        // 上内边距
        paddingTop: 1,
        // 下内边距
        paddingBottom: 1,
        // 边框样式
        borderStyle: 'solid',
        // 边框颜色
        borderColor: operationBackgroundColor,
        // 边框尺寸
        borderSize: 0,
        // 边框虚线参数
        borderDashedValue: [2, 2],
        // 边框圆角值
        borderRadius: 0,
        // 背景色
        backgroundColor: operationBackgroundColor
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

    // 持仓线--------------------------------------------------
    const positionLineFigure = {
      type: 'line',
      attrs: { coordinates: [{x: closePositionBtnFigure.attrs.x + closePositionBtnWidth, y: positionPoint.y}, { x: bounding.width, y: positionPoint.y }] },
      styles: {
        // 样式，可选项`solid`，`dashed`
        style: 'solid',
        // 尺寸
        size: 1,
        // 颜色
        color: positionLineColor,
        // 虚线参数
        dashedValue: [5, 5]
      }
    };

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
  createYAxisFigures: ({ coordinates, overlay, precision, thousandsSeparator, yAxis}) => {
    const width = yAxis.getAutoSize()
    const price = `${utils.formatThousands(overlay.points[0].value!.toFixed(precision.price), thousandsSeparator)}`
    const textWidth = utils.calcTextWidth(price)
    // 剩余边距 = 总长度 - 文本长度 - border厚度 - 右边距
    const padding = (width - textWidth - 2 - 4)/2
    const yAxisMarkColor = overlay.styles?.yAxisMarkColor
    const yAxisMarkBorderColor = overlay.styles?.yAxisMarkBorderColor
    const yAxisMarkBackgroundColor = overlay.styles?.yAxisMarkBackgroundColor
    console.log(overlay.points[0].value)
    
    return [
      {
        type: 'text',
        attrs: {
          x: 0,
          y: coordinates[0].y,
          baseline: 'middle',
          text: price
          // text: overlay?.points[0]?.value
        },
        styles: {
          // 样式，可选项`fill`，`stroke`，`stroke_fill`
          style: 'stroke_fill',
          // 颜色
          color: yAxisMarkColor,
          // 尺寸
          size: 12,
          // 字体
          family: 'HarmonyOS Sans SC',
          // 粗细
          weight: 400,
          // 左内边距
          paddingLeft: padding,
          // 右内边距
          paddingRight: padding,
          // 上内边距
          paddingTop: 4,
          // 下内边距
          paddingBottom: 4,
          // 边框样式
          borderStyle: 'solid',
          // 边框颜色
          borderColor: yAxisMarkBorderColor,
          // 边框尺寸
          borderSize: 1,
          // 边框虚线参数
          borderDashedValue: [2, 2],
          // 边框圆角值
          borderRadius: 4,
          // 背景色
          backgroundColor: yAxisMarkBackgroundColor
        }
      }
    ];
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
  }
};

export default positionOverlay;
