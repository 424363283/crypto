

import type { CircleAttrs, Coordinate, PolygonAttrs, RectAttrs, TextAttrs, TextStyle }  from '@/components/YKLine/StockChart/OriginalKLine/index.esm';

// import type { CircleAttrs, Coordinate, PolygonAttrs, RectAttrs, TextAttrs, TextStyle } from "klinecharts"
import { calcTextWidth } from "../../common/utils/canvas"



/**
 以下方法全部来自于KLineChart/src/extension/figure
 中figure绑定的时间，用于验证鼠标事件是否在图形区域上
 */

// circle----------------------------------------------------------- 
export function checkCoordinateOnCircle (coordinate: Coordinate, attrs: CircleAttrs | CircleAttrs[]): boolean {
  let circles: CircleAttrs[] = []
  circles = circles.concat(attrs)

  for (const circle of circles) {
    const { x, y, r } = circle
    const difX = coordinate.x - x
    const difY = coordinate.y - y
    if (!(difX * difX + difY * difY > r * r)) {
      return true
    }
  }
  return false
}
// text ------------------------------------------------------------

export function getTextRect (attrs: TextAttrs, styles: Partial<TextStyle>): RectAttrs {
  const { size = 12, paddingLeft = 0, paddingTop = 0, paddingRight = 0, paddingBottom = 0, weight = 'normal', family } = styles
  const { x, y, text, align = 'left', baseline = 'top', width: w, height: h } = attrs
  const width = w ?? (paddingLeft + calcTextWidth(text, size, weight, family) + paddingRight)
  const height = h ?? (paddingTop + size + paddingBottom)
  let startX = 0
  switch (align) {
    case 'left':
    case 'start': {
      startX = x
      break
    }
    case 'right':
    case 'end': {
      startX = x - width
      break
    }
    default: {
      startX = x - width / 2
      break
    }
  }
  let startY = 0
  switch (baseline) {
    case 'top':
    case 'hanging': {
      startY = y
      break
    }
    case 'bottom':
    case 'ideographic':
    case 'alphabetic': {
      startY = y - height
      break
    }
    default: {
      startY = y - height / 2
      break
    }
  }
  return { x: startX, y: startY, width, height }
}

export function checkCoordinateOnText (coordinate: Coordinate, attrs: TextAttrs | TextAttrs[], styles: Partial<TextStyle>): boolean {
  let texts: TextAttrs[] = []
  texts = texts.concat(attrs)
  for (const text of texts) {
    const { x, y, width, height } = getTextRect(text, styles)
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


// rect ------------------------------------------------------------
export const DEVIATION = 2
export function checkCoordinateOnRect (coordinate: Coordinate, attrs: RectAttrs | RectAttrs[]): boolean {
  let rects: RectAttrs[] = []
  rects = rects.concat(attrs)
  for (const rect of rects) {
    let x = rect.x
    let width = rect.width
    if (width < DEVIATION * 2) {
      x -= DEVIATION
      width = DEVIATION * 2
    }
    let y = rect.y
    let height = rect.height
    if (height < DEVIATION * 2) {
      y -= DEVIATION
      height = DEVIATION * 2
    }
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

// Polygon ------------------------------------------------------------
export function checkCoordinateOnPolygon (coordinate: Coordinate, attrs: PolygonAttrs | PolygonAttrs[]): boolean {
  let polygons: PolygonAttrs[] = []
  polygons = polygons.concat(attrs)
  for (const polygon of polygons) {
    let on = false
    const { coordinates } = polygon
    for (let i = 0, j = coordinates.length - 1; i < coordinates.length; j = i++) {
      if (
        (coordinates[i].y > coordinate.y) !== (coordinates[j].y > coordinate.y) &&
        (coordinate.x < (coordinates[j].x - coordinates[i].x) * (coordinate.y - coordinates[i].y) / (coordinates[j].y - coordinates[i].y) + coordinates[i].x)
      ) {
        on = !on
      }
    }
    if (on) {
      return true
    }
  }
  return false
}
