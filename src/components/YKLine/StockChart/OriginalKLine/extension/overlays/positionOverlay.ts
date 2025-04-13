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

import { OverlayMode, type OverlayEvent, type OverlayTemplate } from '../../index.esm';
// import { OverlayMode, type OverlayEvent, type OverlayTemplate } from "klinecharts"
import { calcTextWidth } from "../../utils/canvas";
import { checkCoordinateOnText } from "../../utils/checkEventOn";



const positionOverlay: OverlayTemplate = {
  name: 'positionOverlay',
  totalStep: 2,
  needDefaultPointFigure: true,
  needDefaultXAxisFigure: true,
  needDefaultYAxisFigure: true,
  createPointFigures: ({ coordinates, bounding, overlay,  xAxis, yAxis }) => {
    const positonExtendData:any = overlay.extendData.positionOverlay
    const positionText = '持仓:' + positonExtendData.positionData.value.toFixed(2);
    const changeText = '↑↓';
    const closePositionText = '平仓';
    // 持仓位置固定
    const positionPoint = { x: xAxis.convertToPixel(positonExtendData.positionData.dataIndex), y: yAxis.convertToPixel(positonExtendData.positionData.value) }
    // console.log(positionPoint)
    const figures = [];

    // 注意，样式要写全，特别是边框，宽高，边距之类的属性，必须要填值，否则事件检测的时候会出问题
    const positionLineFigure = {
      type: 'line',
      attrs: { coordinates: [positionPoint, { x: bounding.width, y: positionPoint.y }] },
      styles: {
        // 样式，可选项`solid`，`dashed`
        style: 'dashed',
        // 尺寸
        size: 1,
        // 颜色
        color: '#000000',
        // 虚线参数
        dashedValue: [5, 5]
      }
    }

    // 持仓按钮--------------------------------------------------
    const positionBtnFigure = {
      type: 'text',
      attrs: {
        x: positionPoint.x,
        y: positionPoint.y,
        text: positionText,
        baseline: 'middle'
      },
      styles: {
        // 样式，可选项`fill`，`stroke`，`stroke_fill`
        style: 'fill',
        // 颜色
        color: '#FFFFFF',
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
        backgroundColor: 'rgba(0, 0, 0, 0.8)'
      }
    }

    // console.log(positionBtnFigure)
    const positionBtnWidth = positionBtnFigure.styles.paddingLeft +  calcTextWidth(positionBtnFigure.attrs.text, positionBtnFigure.styles.size, positionBtnFigure.styles.weight, positionBtnFigure.styles.family) + positionBtnFigure.styles.paddingRight
    // console.log(positionBtnWidth)
    positonExtendData.positionBtnFigure.option = positionBtnFigure
    positonExtendData.positionBtnFigure.styles.width = positionBtnWidth

    // 切换按钮--------------------------------------------------
    const changeBtnFigure = {
      type: 'text',
      attrs: {
        x: positionPoint.x + positionBtnWidth,
        y: positionPoint.y,
        text: changeText,
        baseline: 'middle'
      },
      styles: {
        // 样式，可选项`fill`，`stroke`，`stroke_fill`
        style: 'fill',
        // 颜色
        color: '#FFFFFF',
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
        backgroundColor: 'rgba(22, 0, 255, 0.8)'
      }
    }

    const changeBtnWidth = changeBtnFigure.styles.paddingLeft +  calcTextWidth(changeBtnFigure.attrs.text, changeBtnFigure.styles.size, changeBtnFigure.styles.weight, changeBtnFigure.styles.family) + changeBtnFigure.styles.paddingRight
    positonExtendData.changeBtnFigure.option = changeBtnFigure
    positonExtendData.changeBtnFigure.styles.width = changeBtnWidth

    // 平仓按钮--------------------------------------------------
    const closePositionBtnFigure = {
      type: 'text',
      attrs: {
        x: positionPoint.x + positionBtnWidth + changeBtnWidth,
        y: positionPoint.y,
        text: closePositionText,
        baseline: 'middle'
      },
      styles: {
        // 样式，可选项`fill`，`stroke`，`stroke_fill`
        style: 'fill',
        // 颜色
        color: '#FFFFFF',
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
        backgroundColor: 'rgba(10, 170, 64, 0.8)'
      }
    }
    const closePositionBtnWidth = closePositionBtnFigure.styles.paddingLeft +  calcTextWidth(closePositionBtnFigure.attrs.text, closePositionBtnFigure.styles.size, closePositionBtnFigure.styles.weight, closePositionBtnFigure.styles.family) + closePositionBtnFigure.styles.paddingRight
    positonExtendData.closePositionBtnFigure.option = closePositionBtnFigure
    positonExtendData.closePositionBtnFigure.styles.width = closePositionBtnWidth
    

    positonExtendData.positionBtnFigure.styles.width = positionBtnWidth
    positonExtendData.changeBtnFigure.styles.width = changeBtnWidth
    positonExtendData.closePositionBtnFigure.styles.width = closePositionBtnWidth
    figures.push(positionLineFigure,positionBtnFigure,changeBtnFigure,closePositionBtnFigure)
    return figures
  },
  onClick: (e:any) => {
    // console.log(e)
    // 判断是否在区域内figure checkEventOn中的函数
    const positionExtendData = e.overlay.extendData.positionOverlay
    const takeProfitExtendData = e.overlay.extendData.takeProfitOverlay
    const stopLossExtendData = e.overlay.extendData.stopLossOverlay

    // 是否点击了持仓按钮
    if (checkCoordinateOnText({x: e.x, y: e.y}, positionExtendData.positionBtnFigure.option.attrs, positionExtendData.positionBtnFigure.option.styles)) {
      console.log('点击了持仓按钮')
      if (takeProfitExtendData.show) {
        takeProfitExtendData.show = false
        e.overlay.extendData.chart.removeOverlay({id: takeProfitExtendData.id})
      } else {
        takeProfitExtendData.show = true
        const takeProfitOverlay = e.overlay.extendData.chart.createOverlay({ 
          name: 'takeProfitOverlay', 
          paneId: 'candle_pane', 
          visible: true, 
          lock: false, 
          mode: OverlayMode.Normal, 
          points: [{dataIndex: positionExtendData.positionData.dataIndex, timestamp: positionExtendData.positionData.timestamp, value: positionExtendData.positionData.value}],
          extendData: e.overlay.extendData
        })
        takeProfitExtendData.id = takeProfitOverlay
      }

      if (stopLossExtendData.show) {
        stopLossExtendData.show = false
        e.overlay.extendData.chart.removeOverlay({id: stopLossExtendData.id})
      } else {
        stopLossExtendData.show = true
        const stopLossOverlay = e.overlay.extendData.chart.createOverlay({ 
          name: 'stopLossOverlay', 
          paneId: 'candle_pane', 
          visible: true, 
          lock: false, 
          mode: OverlayMode.Normal, 
          points: [{dataIndex: positionExtendData.positionData.dataIndex, timestamp: positionExtendData.positionData.timestamp, value: positionExtendData.positionData.value}],
          extendData: e.overlay.extendData
        })
        stopLossExtendData.id = stopLossOverlay
      }
      return true;
    }

    // 是否点击了切换按钮
    if (checkCoordinateOnText({x: e.x, y: e.y}, positionExtendData.changeBtnFigure.option.attrs, positionExtendData.changeBtnFigure.option.styles)) {
      console.log('点击了切换按钮')
      return true;
    }
    // 是否点击了平仓按钮
    if (checkCoordinateOnText({x: e.x, y: e.y}, positionExtendData.closePositionBtnFigure.option.attrs, positionExtendData.closePositionBtnFigure.option.styles)) {
      console.log('点击了平仓按钮')
      return true;
    }
    return true;
  }
}

export default positionOverlay
