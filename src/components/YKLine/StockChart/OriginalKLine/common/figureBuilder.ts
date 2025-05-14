import { Coordinate, OverlayTemplate, Precision, utils, YAxis } from "klinecharts"

// 创建Y轴
export const buildYAxisFigures = (coordinate:Coordinate, overlay:OverlayTemplate, precision:Precision, yAxis:YAxis, thousandsSeparator:String, styles:any) => {
    const width = yAxis.getAutoSize()
    const price = `${utils.formatThousands(overlay.points[0].value!.toFixed(precision.price), thousandsSeparator)}`
    const textWidth = utils.calcTextWidth(price)
    // 剩余边距 = 总长度 - 文本长度 - border厚度 - 右边距
    const paddingLeftRight = (width - textWidth - 2 - 4)/2
    const fontSize = 12
    const borderSize = 1
    const height = 20
    const paddingTopBottom = (height - borderSize*2 - fontSize) / 2 

    return [
      {
        type: 'text',
        attrs: {
          x: coordinate.x,
          y: coordinate.y,
          baseline: 'middle',
          text: price
        },
        styles: {
          // 样式，可选项`fill`，`stroke`，`stroke_fill`
          style: 'stroke_fill',
          // 颜色
          color: styles.color,
          // 尺寸
          size: fontSize,
          // 字体
          family: 'HarmonyOS Sans SC',
          // 粗细
          weight: 'normal',
          // 左内边距
          paddingLeft: paddingLeftRight,
          // 右内边距
          paddingRight: paddingLeftRight,
          // 上内边距
          paddingTop: paddingTopBottom,
          // 下内边距
          paddingBottom: paddingTopBottom,
          // 边框样式
          borderStyle: 'solid',
          // 边框颜色
          borderColor: styles.borderColor,
          // 边框尺寸
          borderSize: borderSize,
          // 边框虚线参数
          borderDashedValue: [2, 2],
          // 边框圆角值
          borderRadius: 4,
          // 背景色
          backgroundColor: styles.backgroundColor
        }
      }
    ];
}

// 创建提示框
export const  buildTooltipFigure = (coordinate:Coordinate, message:String, styles:any) => {
  return {
        type: 'popText',
        attrs: {
          x: coordinate.x,
          y: coordinate.y,
          // 文字内容
          text: message,
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
          style: 'stroke_fill',
          size: 10,
          // 左内边距
          paddingLeft: 10,
          paddingTop: 6,
          paddingRight: 10,
          paddingBottom: 6,
          borderColor: styles.borderColor,
          borderStyle: 'solid',
          // 边框样式
          borderSize: 1,
          borderDashedValue: [5, 5],
          color: styles.color,
          family: 'HarmonyOS Sans SC',
          weight: 'normal',
          borderRadius: 4,
          backgroundColor: styles.backgroundColor,
          placement: 'top',
          arrowSize: 5
        }
      }
}

// 创建操作
export const buildOperationFigure = (coordinate:Coordinate, operationText:String ,styles:any) => {
   const borderColor = styles.borderColor
   const color = styles.color
   const backgroundColor = styles.backgroundColor
   return {
      type: 'text',
      attrs: {
        x: coordinate.x,
        y: coordinate.y,
        baseline: 'middle',
        text: operationText
      },
      styles: {
        // 样式，可选项`fill`，`stroke`，`stroke_fill`
        style: 'stroke_fill',
        // 颜色
        color: color,
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
        borderColor: borderColor,
        // 边框尺寸
        borderSize: 0,
        // 边框虚线参数
        borderDashedValue: [2, 2],
        // 边框圆角值
        borderRadius: 0,
        // 背景色
        backgroundColor: backgroundColor
      },
    };
}