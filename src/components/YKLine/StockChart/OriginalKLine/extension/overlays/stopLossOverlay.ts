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

// import { getFigureClass, type OverlayEvent, type OverlayTemplate } from "klinecharts"
import {
  getFigureClass,
  type OverlayEvent,
  type OverlayTemplate
} from '@/components/YKLine/StockChart/OriginalKLine/index.esm';
// import type { OverlayEvent, OverlayTemplate } from "klinecharts"
import { calcTextWidth } from '../../common/utils/canvas';
import { checkCoordinateOnText } from '../../common/utils/checkEventOn';
import { LANG } from '@/core/i18n';
const stopLossOverlay: OverlayTemplate = {
  name: 'stopLossOverlay',
  totalStep: 2,
  // 需要默认的点位图形,选中覆盖物时会有个蓝点，表示选中，这个可以控制蓝点是否显示
  needDefaultPointFigure: false,
  needDefaultXAxisFigure: false,
  needDefaultYAxisFigure: false,
  extendData: {
    marginLeft: 10,
    position: { dataIndex: 900, timestamp: 1743688800000, value: 81172.2 }
  },
  createPointFigures: ({ coordinates, bounding, overlay, xAxis, yAxis }) => {
    const positonExtendData: any = overlay.extendData.positionOverlay;
    const takeProfitExtendData: any = overlay.extendData.takeProfitOverlay;
    const stopLossExtendData: any = overlay.extendData.stopLossOverlay;
    const positionPoint = { x: 50, y: yAxis.convertToPixel(positonExtendData.positionData.value) };

    const lineColor = overlay.styles?.stopLossOverlayLineColor;
    const color = overlay.styles?.stopLossOverlayColor;
    const borderColor = overlay.styles?.stopLossOverlayBorderColor;
    const backgroundColor = overlay.styles?.stopLossOverlayBackgroundColor;

    const btnSpace = 10;
    // const text = '止损:' + yAxis?.convertFromPixel(coordinates[0].y).toFixed(2);
    const text = LANG('止损');
    const marginLeft =
      positonExtendData.positionBtnFigure.styles.width +
      positonExtendData.changeBtnFigure.styles.width +
      positonExtendData.closePositionBtnFigure.styles.width +
      takeProfitExtendData.takeProfitBtnFigure.styles.width +
      btnSpace +
      btnSpace +
      80;
    const figures = [];
    const lineFigure = {
      type: 'line',
      attrs: {
        coordinates: [
          { x: positionPoint.x + marginLeft, y: coordinates[0].y },
          { x: bounding.width, y: coordinates[0].y }
        ]
      },
      styles: {
        // 样式，可选项`solid`，`dashed`
        style: 'solid',
        // 尺寸
        size: 1,
        // 颜色
        color: lineColor,
        // 虚线参数
        dashedValue: [5, 5]
      }
    };

    const stopLossBtnFigure = {
      type: 'text',
      attrs: {
        x: positionPoint.x + marginLeft,
        y: coordinates[0].y,
        text: text,
        baseline: 'middle'
      },
      styles: {
        // 样式，可选项`fill`，`stroke`，`stroke_fill`
        style: 'stroke_fill',
        // 颜色
        color: color,
        // 尺寸
        size: 10,
        // 字体
        family: 'Lexend',
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
        borderColor: borderColor,
        // 边框尺寸
        borderSize: 1,
        // 边框虚线参数
        borderDashedValue: [2, 2],
        // 边框圆角值
        borderRadius: 4,
        // 背景色
        backgroundColor: backgroundColor
      },
      zLevel: 10
    };

    const stopLossBtnWidth =
      stopLossBtnFigure.styles.paddingLeft +
      calcTextWidth(
        stopLossBtnFigure.attrs.text,
        stopLossBtnFigure.styles.size,
        stopLossBtnFigure.styles.weight,
        stopLossBtnFigure.styles.family
      ) +
      stopLossBtnFigure.styles.paddingRight;
    stopLossExtendData.stopLossBtnFigure.option = stopLossBtnFigure;
    stopLossExtendData.stopLossBtnFigure.styles.width = stopLossBtnWidth;

    const addBtnFigure = {
      type: 'text',
      attrs: {
        x: bounding.width - 20,
        y: coordinates[0].y,
        text: '⨁',
        baseline: 'middle'
      },
      styles: {
        // 样式，可选项`fill`，`stroke`，`stroke_fill`
        style: 'fill',
        // 颜色
        color: '#F0BA30',
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
        borderRadius: 2,
        // 背景色
        backgroundColor: 'rgba(0, 0, 0, 0.8)'
      },
      zLevel: 500
    };
    stopLossExtendData.addBtnFigure.option = addBtnFigure;

    // figures.push(lineFigure, stopLossBtnFigure, addBtnFigure)
    figures.push(lineFigure, stopLossBtnFigure);

    return figures;
  },
  onClick: (e: any) => {
    const textFigure = getFigureClass('text');
    const stopLossExtendData: any = e.overlay.extendData.stopLossOverlay;
    if (
      textFigure?.prototype.checkEventOnImp(
        { x: e.x, y: e.y },
        stopLossExtendData.stopLossBtnFigure.option.attrs,
        stopLossExtendData.stopLossBtnFigure.option.styles
      )
    ) {
      e.overlay.extendData.stopLossOverlay.stopLossBtnFigure.onClick(e);
    }
    if (
      textFigure?.prototype.checkEventOnImp(
        { x: e.x, y: e.y },
        stopLossExtendData.addBtnFigure.option.attrs,
        stopLossExtendData.addBtnFigure.option.styles
      )
    ) {
      e.overlay.extendData.stopLossOverlay.addBtnFigure.onClick(e);
    }
    return true;
  },
  onPressedMoveEnd2: (e: OverlayEvent) => {
    const textFigure = getFigureClass('text');
    const stopLossExtendData: any = e.overlay.extendData.stopLossOverlay;
    if (
      textFigure?.prototype.checkEventOnImp(
        { x: e.x, y: e.y },
        stopLossExtendData.stopLossBtnFigure.option.attrs,
        stopLossExtendData.stopLossBtnFigure.option.styles
      )
    ) {
      e.overlay.extendData.stopLossOverlay.stopLossBtnFigure.onPressedMoveEnd(e);
    }
    if (
      textFigure?.prototype.checkEventOnImp(
        { x: e.x, y: e.y },
        stopLossExtendData.addBtnFigure.option.attrs,
        stopLossExtendData.addBtnFigure.option.styles
      )
    ) {
      e.overlay.extendData.stopLossOverlay.addBtnFigure.onPressedMoveEnd(e);
    }
    return true;
  },

  onPressedMoveEnd: (e: OverlayEvent) => {
    const stopLossExtendData: any = e.overlay.extendData.stopLossOverlay;
    const textFigure = getFigureClass('text');
    if (
      textFigure?.prototype.checkEventOnImp(
        { x: e.x, y: e.y },
        stopLossExtendData.stopLossBtnFigure.option.attrs,
        stopLossExtendData.stopLossBtnFigure.option.styles
      )
    ) {
      return stopLossExtendData.stopLossBtnFigure.onPressedMoveEnd(e);
    }
    if (
      textFigure?.prototype.checkEventOnImp(
        { x: e.x, y: e.y },
        stopLossExtendData.addBtnFigure.option.attrs,
        stopLossExtendData.addBtnFigure.option.styles
      )
    ) {
      return stopLossExtendData.addBtnFigure.onPressedMoveEnd(e);
    }
    stopLossExtendData.stopLossBtnFigure.onPressedMoveEnd(e);
  }
};

export default stopLossOverlay;
