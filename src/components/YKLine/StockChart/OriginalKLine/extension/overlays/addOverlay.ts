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

import type {OverlayTemplate } from '../../index.esm';
// import type { OverlayTemplate } from "klinecharts"




const addOverlay: OverlayTemplate = {
  name: 'addOverlay',
  totalStep: 2,
  needDefaultPointFigure: true,
  needDefaultXAxisFigure: true,
  needDefaultYAxisFigure: true,
  createPointFigures: ({ coordinates, bounding, overlay, xAxis, yAxis }) => {

    const figure = {
      type: 'text',
      attrs: {
        x: bounding.width - 20, 
        y: overlay.extendData.point.y,
        text: '⨁',
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
    
    return [figure]
  },
  onClick: (e:any) => {
    // console.log(overlay.extendData.point.y)
    e.overlay.extendData.onClick(e)
    return true;
  }
}

export default addOverlay
