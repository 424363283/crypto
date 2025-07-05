// import { OverlayFigure, OverlayTemplate, utils, Coordinate } from 'klinecharts';

import {
  OverlayFigure,
  OverlayTemplate,
  utils,
  Coordinate
} from '@/components/YKLine/StockChart/OriginalKLine/index.esm';
import { calcTextWidth } from '../common/utils/canvas';
export const PositionTPSLLineFigureKey = {
  Close: 'close',
  Reverse: 'reverse'
};

function createOverlayTooltipFigures(coordinate: Coordinate, text: string, color: string, backgroundColor: string) {
  const GAP = 2;
  const PADDING = 10;
  const textWidth = utils.calcTextWidth(text) + PADDING * 2;
  const paddingTop = 5;
  const paddingBottom = 5;
  return [
    {
      type: 'polygon',
      attrs: {
        coordinates: [
          { x: coordinate.x, y: coordinate.y - GAP },
          { x: coordinate.x + 3, y: coordinate.y - GAP - 5 },
          { x: coordinate.x - 3, y: coordinate.y - GAP - 5 }
        ]
      },
      styles: {
        style: 'fill',
        color: backgroundColor
      }
    },
    {
      type: 'text',
      attrs: {
        x: coordinate.x,
        y: coordinate.y - GAP - 5,
        width: textWidth,
        height: 22,
        align: 'center',
        baseline: 'bottom',
        text
      },
      styles: {
        style: 'fill',
        backgroundColor,
        color,
        paddingLeft: PADDING,
        paddingTop: 6
      }
    }
  ];
}

const positionTPTLLine: OverlayTemplate = {
  name: 'positionTPTLLine',
  totalStep: 2,
  createPointFigures: ({ coordinates, bounding, overlay }) => {
    const PADDING = 4;
    const HEIGHT = 20;
    // 边距线颜色
    const marginLineColor = overlay.styles?.marginLineColor
    // 止盈止损颜色
    const profitLossBackgroundColor = overlay.styles?.profitLossBackgroundColor;
    const profitLossColor = overlay.styles?.profitLossColor;
    // 持仓量颜色
    const expectProfitLossBackgroundColor = overlay.styles?.expectProfitLossBackgroundColor
    const expectProfitLossColor = overlay.styles?.expectProfitLossColor
    // 平仓颜色
    const closeText = '\ue901';
    const closeColor = overlay.styles?.closeColor
    const closeBackgroundColor= overlay.styles?.closeBackgroundColor
    // tip颜色
    const tipColor = overlay.styles?.tipColor
    const tipBackgroundColor = overlay.styles?.tipBackgroundColor


    const offsetLeft = overlay.styles?.offsetLeft ?? 2;
    const { y } = coordinates[0];
    const profitLossText = `${overlay.extendData.profitLoss}`;
    const profitLossTextWidth = utils.calcTextWidth(profitLossText) + PADDING * 2;
    const volumeText = `${overlay.extendData.volume ?? 0}`;
    const volumeTextWidth = utils.calcTextWidth(volumeText);
    const volumeTextRectWidth = Math.max(volumeTextWidth + PADDING * 2, 22);

    const reverseTooltip = overlay.extendData.reverseTooltip;
    const closeTooltip = overlay.extendData.closeTooltip;

    let tipsWidth = bounding.width - volumeTextRectWidth - 87; // 爆仓文案的距离左边边的距离
    let tpSlWidth = bounding.width - (volumeTextRectWidth + 68 + profitLossTextWidth) + profitLossTextWidth + 12; // 爆仓文案方向距离左边的距离
    let closeWidth = bounding.width - 33; // 爆仓文案方向距离左边的距离
    const marginLineWidth = 33
    const closePositionText = '\ue901';
    const figures:OverlayFigure[] = []
    const crosshairPoint = overlay.extendData.crosshairPoint
    
    

    // 边距线-----------------------------------------
    const marginLineFigure = {
        // key: PositionTPSLLineFigureKey.Close,
        type: 'line',
        // ignoreEvent: true,
        attrs: {
          coordinates: [
            { x: bounding.width - marginLineWidth, y },
            { x: bounding.width, y }
          ]
        },
        styles: {
          cursor: 'pointer',
          color: marginLineColor
        }
      }
    
    // 平仓按钮--------------------------------------------------
    const closePositionBtnFigure = {
      type: 'text',
      key: PositionTPSLLineFigureKey.Close,
      attrs: {
        x: 0,
        y: y,
        baseline: 'middle',
        text: closeText
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
        borderColor: closeBackgroundColor,
        // 边框尺寸
        borderSize: 0,
        // 边框虚线参数
        borderDashedValue: [2, 2],
        // 边框圆角值
        borderRadius: 0,
        // 背景色
        backgroundColor: closeBackgroundColor
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
    closePositionBtnFigure.attrs.x = bounding.width - (marginLineWidth + closePositionBtnWidth)
    
    // 预计止盈/预计止损 ------------------------------------------
    const expectProfitLossFigure = {
        type: 'text',
        // ignoreEvent: ['mouseDownEvent', 'mouseRightClickEvent'],
        attrs: {
          x: 0,
          y: y,
          baseline: 'middle',
          text: volumeText
        },
        styles: {
          // 样式，可选项`fill`，`stroke`，`stroke_fill`
          style: 'stroke_fill',
          // 颜色
          color: expectProfitLossColor,
          // 尺寸
          size: 10,
          // 字体
          family: 'Lexend',
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
          borderColor: expectProfitLossBackgroundColor,
          // 边框尺寸
          borderSize: 0,
          // 边框虚线参数
          borderDashedValue: [2, 2],
          // 边框圆角值
          borderRadius: 0,
          // 背景色
          backgroundColor: expectProfitLossBackgroundColor
        },
      }
    // 计算文本宽度
    const expectProfitLossWidth =
          expectProfitLossFigure.styles.paddingLeft +
          calcTextWidth(
            expectProfitLossFigure.attrs.text,
            expectProfitLossFigure.styles.size,
            expectProfitLossFigure.styles.weight,
            expectProfitLossFigure.styles.family
          ) +
          expectProfitLossFigure.styles.paddingRight;
    expectProfitLossFigure.attrs.x = bounding.width - (marginLineWidth + closePositionBtnWidth + expectProfitLossWidth)

    // 止盈 ------------------------------------------
    const profitLossFigure = {
        type: 'text',
        attrs: {
          x: 0,
          y: y,
          baseline: 'middle',
          text: profitLossText
        },
        styles: {
          // 样式，可选项`fill`，`stroke`，`stroke_fill`
          style: 'fill',
          // 颜色
          color: profitLossColor,
          // 尺寸
          size: 10,
          // 字体
          family: 'Lexend',
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
          borderRadius: [4, 0, 0, 4],
          // 背景色
          backgroundColor: profitLossBackgroundColor
        },
      }
    
    const profitLossWidth =
          profitLossFigure.styles.paddingLeft +
          calcTextWidth(
            profitLossFigure.attrs.text,
            profitLossFigure.styles.size,
            profitLossFigure.styles.weight,
            profitLossFigure.styles.family
          ) +
          profitLossFigure.styles.paddingRight;
    profitLossFigure.attrs.x = bounding.width - (marginLineWidth + closePositionBtnWidth + expectProfitLossWidth + profitLossWidth)

    // 平仓按钮提示 ----------------------------------
    let closeBtnTipFigure = null
    if (crosshairPoint.x >= closePositionBtnFigure.attrs.x && crosshairPoint.x <= closePositionBtnFigure.attrs.x + closePositionBtnWidth
     && crosshairPoint.y >= closePositionBtnFigure.attrs.y - HEIGHT/2 && crosshairPoint.y <= closePositionBtnFigure.attrs.y + HEIGHT/2
    ){
      closeBtnTipFigure = {
        type: 'popText',
        attrs: {
          x: closePositionBtnFigure.attrs.x + closePositionBtnWidth/2,
          y: closePositionBtnFigure.attrs.y - HEIGHT/2,
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
          borderColor: tipBackgroundColor,
          borderStyle: 'solid',
          // 边框样式
          borderSize: 1,
          borderDashedValue: [5, 5],
          color: tipColor,
          family: 'Lexend',
          weight: 'normal',
          borderRadius: 4,
          backgroundColor: tipBackgroundColor,
          placement: 'top',
          arrowSize: 5
        }
      }
    }
    figures.push(profitLossFigure,expectProfitLossFigure,closePositionBtnFigure,marginLineFigure)
    if (closeBtnTipFigure) {
      figures.push(closeBtnTipFigure)
    }
    return figures;
  },
  createYAxisFigures: ({ coordinates, overlay, precision, thousandsSeparator, yAxis}) => {
    const width = yAxis.getAutoSize()
    const price = `${utils.formatThousands(overlay.points[0].value!.toFixed(precision.price), thousandsSeparator)}`
    const textWidth = utils.calcTextWidth(price)
    // 剩余边距 = 总长度 - 文本长度 - border厚度 - 右边距
    const padding = (width - textWidth - 2 - 4)/2
    const profitLossYAxisMarkColor = overlay.styles?.profitLossYAxisMarkColor
    const profitLossYAxisMarkBorderColor = overlay.styles?.profitLossYAxisMarkBorderColor
    const profitLossYAxisMarkBackgroundColor = overlay.styles?.profitLossYAxisMarkBackgroundColor
    // console.log(overlay.points[0].value)
    
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
          color: profitLossYAxisMarkColor,
          // 尺寸
          size: 12,
          // 字体
          family: 'Lexend',
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
          borderColor: profitLossYAxisMarkBorderColor,
          // 边框尺寸
          borderSize: 1,
          // 边框虚线参数
          borderDashedValue: [2, 2],
          // 边框圆角值
          borderRadius: 4,
          // 背景色
          backgroundColor: profitLossYAxisMarkBackgroundColor
        }
      }
    ];
  }
};

export default positionTPTLLine;
