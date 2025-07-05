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

import { LineType, PolygonType, TextAttrs, type Coordinate, type FigureTemplate, type RectAttrs, type RectStyle, type TextStyle } from "klinecharts"
import { calcTextWidth, createFont } from "../../common/utils/canvas"
import { isString } from "../../common/utils/typeChecks";
import { isTransparent } from "../../common/utils/color";


export interface PopRectStyle extends RectStyle {
	placement: string;
  arrowSize: number;
}

export interface PopTextStyle extends TextStyle {
	placement: string;
  arrowSize: number;
}


export function getTextRect (attrs: TextAttrs, styles: Partial<PopTextStyle>): RectAttrs {
  const { size = 12, paddingLeft = 0, paddingTop = 0, paddingRight = 0, paddingBottom = 0, weight = 'normal', family } = styles
  const { x, y, text, align = 'left', baseline = 'top', width: w, height: h } = attrs
  const width = w ?? (paddingLeft + calcTextWidth(text, size, weight, family) + paddingRight)
  let height = h ?? (paddingTop + size + paddingBottom)
  // 高度会比原字体偏大，减1
  height = height - 1
  return { x: x, y: y, width, height }
}

export function checkCoordinateOnText (coordinate: Coordinate, attrs: TextAttrs | TextAttrs[], styles: Partial<PopTextStyle>): boolean {
  let texts: TextAttrs[] = []
  texts = texts.concat(attrs)
  for (let i = 0; i < texts.length; i++) {
    const { x, y, width, height } = getTextRect(texts[i], styles)
    if (
      coordinate.x >= x &&
      coordinate.x <= x + width &&
      coordinate.y >= y &&
      coordinate.y <= y + height
    ) {
      return true
    }
  }
  return false
}

export function drawPopRect (ctx: CanvasRenderingContext2D, attrs: RectAttrs | RectAttrs[], styles: Partial<PopRectStyle>): void {
  let rects: RectAttrs[] = []
  rects = rects.concat(attrs)
  const {
    style = PolygonType.Fill,
    color = 'transparent',
    borderSize = 1,
    borderColor = 'transparent',
    borderStyle = LineType.Solid,
    borderRadius: r = 0,
    borderDashedValue = [2, 2],
    placement = 'bottom',
    arrowSize = 4
  } = styles

  ctx.fillStyle = !isString(color) || !isTransparent(color) ? color : null
  ctx.strokeStyle = !isTransparent(borderColor) ? borderColor : null
  ctx.lineWidth = borderSize > 0 ? borderSize : 0
  ctx.setLineDash(borderStyle === LineType.Dashed ? borderDashedValue : [])
  rects.forEach(({ x, y, width: w, height: h }) => {
    if (placement === 'bottom') {
      placeBottom(ctx, {x, y, r, w, h}, style, arrowSize)
    }
    if (placement === 'top') {
      placeTop(ctx, {x, y, r, w, h}, style, arrowSize)
    }
    if (placement === 'left') {
      placeLeft(ctx, {x, y, r, w, h}, style, arrowSize)
    }
    if (placement === 'right') {
      placeRight(ctx, {x, y, r, w, h}, style, arrowSize)
    }
  })
}


function placeBottom(ctx:any, attrs:any, style:string, p:number) {
  let { x, y, w, h, r } = attrs; // 解构赋值
  ctx.beginPath();
  ctx.moveTo(x, y); // 尖角
  
  // 上边
  ctx.lineTo(x + p, y + p);
  ctx.arcTo(x + w/2, y + p, x + w/2, y + p + r, r); // 右上角
  ctx.arcTo(x + w/2, y + p + h, x + w/2 - r, y + p + h, r)
  ctx.arcTo(x - w/2, y + p + h, x - w/2, y + p + h - r, r)
  ctx.arcTo(x - w/2, y + p, x - w/2 + r, y + p, r)
  ctx.lineTo(x - p, y + p)
  
  ctx.closePath(); // 关闭路径
  if (style === PolygonType.Fill) {
    ctx.fill()
  } else 
  if (style == PolygonType.Stroke) {
    ctx.stroke()
  } else
  if (style == PolygonType.StrokeFill) {
    ctx.fill()
    ctx.stroke()
  }
}

function placeTop(ctx:any, attrs:any, style:string, p:number) {
  let { x, y, w, h, r } = attrs; // 解构赋值
  ctx.beginPath();
  ctx.moveTo(x, y); // 尖角
  
  // 上边
  ctx.lineTo(x - p, y - p);
  ctx.arcTo(x - w/2, y - p, x - w/2, y - p - r, r); 
  ctx.arcTo(x - w/2, y - p - h, x - w/2 + r, y - p - h, r)
  ctx.arcTo(x + w/2, y - p - h, x + w/2, y - p - h + r, r)
  ctx.arcTo(x + w/2, y - p, x + w/2 - r, y - p, r)
  ctx.lineTo(x + p, y - p)
  
  ctx.closePath(); // 关闭路径
  if (style === PolygonType.Fill) {
    ctx.fill()
  } else 
  if (style == PolygonType.Stroke) {
    ctx.stroke()
  } else
  if (style == PolygonType.StrokeFill) {
    ctx.fill()
    ctx.stroke()
  }
}

function placeLeft(ctx:any, attrs:any, style:string, p:number) {
  let { x, y, w, h, r } = attrs; // 解构赋值
  ctx.beginPath();
  ctx.moveTo(x, y); // 尖角
  
  ctx.lineTo(x - p, y + p);
  ctx.arcTo(x - p, y + h/2, x -p-r, y + h/2, r); 
  ctx.arcTo(x - p - w, y + h/2, x - p - w, y + h/2 - r, r)
  ctx.arcTo(x - p - w, y - h/2, x - p - w + r, y - h/2, r)
  ctx.arcTo(x - p, y - h/2, x - p, y - h/2 + r, r)
  ctx.lineTo(x - p, y - p)
  
  ctx.closePath(); // 关闭路径
  if (style === PolygonType.Fill) {
    ctx.fill()
  } else 
  if (style == PolygonType.Stroke) {
    ctx.stroke()
  } else
  if (style == PolygonType.StrokeFill) {
    ctx.fill()
    ctx.stroke()
  }
}

function placeRight(ctx:any, attrs:any, style:string, p:number) {
  let { x, y, w, h, r } = attrs; // 解构赋值
  ctx.beginPath();
  ctx.moveTo(x, y); // 尖角
  
  ctx.lineTo(x + p, y - p);
  ctx.arcTo(x + p, y - h/2, x + p + r, y - h/2, r); 
  ctx.arcTo(x + p + w, y - h/2, x + p + w, y - h/2 + r, r)
  ctx.arcTo(x + p + w, y + h/2, x + p + w - r, y + h/2, r)
  ctx.arcTo(x + p, y + h/2, x + p, y + h/2 -r, r)
  ctx.lineTo(x + p, y + p)
  
  ctx.closePath(); // 关闭路径
  if (style === PolygonType.Fill) {
    ctx.fill()
  } else 
  if (style == PolygonType.Stroke) {
    ctx.stroke()
  } else
  if (style == PolygonType.StrokeFill) {
    ctx.fill()
    ctx.stroke()
  }
}





export function drawText (ctx: CanvasRenderingContext2D, attrs: TextAttrs | TextAttrs[], styles: Partial<PopTextStyle>): void {
  let texts: TextAttrs[] = []
  texts = texts.concat(attrs)
  const {
    color = 'currentColor',
    size = 12,
    family,
    weight,
    paddingLeft = 0,
    paddingTop = 0,
    paddingRight = 0,
    paddingBottom = 0,
    placement = 'bottom',
    arrowSize = 4
  } = styles

  // 绘制边框
  const rects = texts.map(text => getTextRect(text, styles))
  drawPopRect(ctx, rects, { ...styles, color: styles.backgroundColor })

  ctx.textAlign = 'left'
  ctx.textBaseline = 'top'
  ctx.font = createFont(size, weight, family)
  ctx.fillStyle = color

  texts.forEach((text, index) => {
    const rect = rects[index]
    if (placement === 'bottom') {
      ctx.fillText(text.text, rect.x - rect.width/2 + paddingLeft, rect.y + arrowSize + paddingTop, rect.width - paddingLeft - paddingRight)
    }
    if (placement === 'top') {
      ctx.fillText(text.text, rect.x - rect.width/2 + paddingLeft, rect.y - rect.height - arrowSize + paddingTop, rect.width - paddingLeft - paddingRight)
    }
    if (placement === 'left') {
      ctx.fillText(text.text, rect.x - rect.width - arrowSize + paddingLeft, rect.y - rect.height/2 + paddingTop, rect.width - paddingLeft - paddingRight)
    }
    if (placement === 'right') {
      ctx.fillText(text.text, rect.x + arrowSize + paddingLeft, rect.y - rect.height/2 + paddingTop, rect.width - paddingLeft - paddingRight)
    }
  })

}


const popText: FigureTemplate<TextAttrs | TextAttrs[], Partial<PopTextStyle>> = {
  name: 'popText',
  checkEventOn: checkCoordinateOnText,
  draw: (ctx: CanvasRenderingContext2D, attrs: TextAttrs | TextAttrs[], styles: Partial<PopTextStyle>) => {
    drawText(ctx, attrs, styles)
  }
}

export default popText
