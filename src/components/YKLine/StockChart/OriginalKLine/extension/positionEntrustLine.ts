// import { OverlayFigure, OverlayTemplate, utils, Coordinate } from 'klinecharts';

//当前委托
import { OverlayFigure, OverlayTemplate, utils, Coordinate } from '@/components/YKLine/StockChart/OriginalKLine/index.esm';
export const PositionEntrustineFigureKey = {
  Close: 'close',
  Reverse: 'reverse'
};

function createOverlayTooltipFigures (coordinate: Coordinate, text: string, color: string, backgroundColor: string) {
  const GAP = 2;
  const PADDING = 10;
  const textWidth = utils.calcTextWidth(text) + PADDING * 2;
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

const currentEntrustLine: OverlayTemplate = {
  name: 'currentEntrustLine',
  totalStep: 2,
  createPointFigures: (args:any) => {
    const PADDING = 4;
    // const HEIGHT = 22;
    // const backgroundColor = overlay.styles?.backgroundColor;
    // const directionColor = overlay.styles?.directionColor;
    // const profitLossColor = overlay.styles?.profitLossColor;
    // const tooltipColor = overlay.styles?.tooltipColor;
    // const offsetLeft = overlay.styles?.offsetLeft ?? 2;
    const { y } = args.coordinates[0];
    // const profitLossText = `${overlay.extendData.profitLoss}`;
    // const profitLossTextWidth = utils.calcTextWidth(profitLossText) + PADDING * 2;
    // const volumeText = `${overlay.extendData.volume ?? 0}`;
    // const volumeTextWidth = utils.calcTextWidth(volumeText);
    // const volumeTextRectWidth = Math.max(volumeTextWidth + PADDING * 2, 22);

    // const reverseTooltip = overlay.extendData.reverseTooltip;
    // const closeTooltip = overlay.extendData.closeTooltip;

    const entrustExtendData: any = args.overlay.extendData.entrustOverlay;


    // 方向
    const directionText = args.overlay.extendData.direction
    const directionColor = args.overlay.styles?.directionColor;
    const directionBackgroundColor = args.overlay.styles?.directionBackgroundColor;
    // 价格
    const price = args.overlay.extendData.price
    // '110000'
    const priceColor = args.overlay.styles?.priceColor;
    const priceBackgroundColor = args.overlay.styles?.priceBackgroundColor;
    // 持仓量
    const volume = args.overlay.extendData.volume
    const volumeColor = args.overlay.styles?.volumeColor;
    const volumeBackgroundColor = args.overlay.styles?.volumeBackgroundColor;
    // 操作按钮
    const closeText = '\ue901';
    const operationColor = args.overlay.styles?.operationColor;
    const operationBackgroundColor = args.overlay.styles?.operationBackgroundColor;
    // 提示
    const tipColor = args.overlay.styles?.tipColor;
    const tipBorderColor = args.overlay.styles?.tipBorderColor;
    const tipBackgroundColor = args.overlay.styles?.tipBackgroundColor;

    //委托线
    const lineColor = args.overlay.styles?.lineColor;

    // 委托方向--------------------------------------------------
    const directionFigure = {
      type: 'text',
      // ignoreEvent: ['mouseDownEvent', 'mouseRightClickEvent'],
      attrs: {
        x: PADDING,
        y: y,
        baseline: 'middle',
        // text:LANG(marginType === 1 ? '全仓' : '逐仓') + ' ' +  profitLossText
        text: directionText
      },
      styles: {
        style: 'fill',
        color: directionColor,
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

    const directionWidth =
          directionFigure.styles.paddingLeft +
          utils.calcTextWidth(
            directionFigure.attrs.text,
            directionFigure.styles.size,
            directionFigure.styles.weight,
            directionFigure.styles.family
          ) +
          directionFigure.styles.paddingRight;
        entrustExtendData.directionFigure.option = directionFigure;
        entrustExtendData.directionFigure.styles.width = directionWidth;

    
    // 委托价格--------------------------------------------------
    const entrustPriceFigure = {
      type: 'text',
      attrs: {
        x: directionFigure.attrs.x + directionWidth,
        // height: HEIGHT,
        y: y,
        text: price,
        baseline: 'middle'
      },
      styles: {
        // 样式，可选项`fill`，`stroke`，`stroke_fill`
        style: 'fill',
        // 颜色
        color: priceColor,
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
        borderColor: priceBackgroundColor,
        // 边框尺寸
        borderSize: 0,
        // 边框虚线参数
        borderDashedValue: [2, 2],
        // 边框圆角值
        borderRadius: 0,
        // 背景色
        backgroundColor: priceBackgroundColor
      }
    };

    const entrustPriceWidth =
          entrustPriceFigure.styles.paddingLeft +
          utils.calcTextWidth(
            entrustPriceFigure.attrs.text,
            entrustPriceFigure.styles.size,
            entrustPriceFigure.styles.weight,
            entrustPriceFigure.styles.family
          ) +
          entrustPriceFigure.styles.paddingRight;
        entrustExtendData.entrustPriceFigure.option = entrustPriceFigure;
        entrustExtendData.entrustPriceFigure.styles.width = entrustPriceWidth;
    

    // 委托数量--------------------------------------------------
    const entrustVolumeFigure = {
      type: 'text',
      attrs: {
        x: directionFigure.attrs.x + directionWidth + entrustPriceWidth,
        // height: HEIGHT,
        y: y,
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

    const entrustVolumeWidth =
          entrustVolumeFigure.styles.paddingLeft +
          utils.calcTextWidth(
            entrustVolumeFigure.attrs.text,
            entrustVolumeFigure.styles.size,
            entrustVolumeFigure.styles.weight,
            entrustVolumeFigure.styles.family
          ) +
          entrustVolumeFigure.styles.paddingRight;
        entrustExtendData.entrustVolumeFigure.option = entrustVolumeFigure;
        entrustExtendData.entrustVolumeFigure.styles.width = entrustVolumeWidth;    
    
    const closeBtnFigure = {
          type: 'text',
          // ignoreEvent: ['mouseDownEvent', 'mouseRightClickEvent'],
          attrs: {
            x: directionFigure.attrs.x + directionWidth + entrustPriceWidth + entrustVolumeWidth,
            y: y,
            baseline: 'middle',
            text: closeText
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
    const closeBtnWidth =
      closeBtnFigure.styles.paddingLeft +
      utils.calcTextWidth(
        closeBtnFigure.attrs.text,
        closeBtnFigure.styles.size,
        closeBtnFigure.styles.weight,
        closeBtnFigure.styles.family
      ) +
      closeBtnFigure.styles.paddingRight;
    entrustExtendData.closeBtnFigure.option = closeBtnFigure;
    entrustExtendData.closeBtnFigure.styles.width = closeBtnWidth;


    // 线--------------------------------------------------
    const lineFigure = {
      type: 'line',
      attrs: { coordinates: [{x: directionFigure.attrs.x + directionWidth + entrustPriceWidth + entrustVolumeWidth + closeBtnWidth,y: y}, { x: args.bounding.width, y: y }] },
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


    // let figures: OverlayFigure[] = [
    //   {
    //     type: 'text',
    //     // ignoreEvent: true,
      
    //     attrs: {
    //       x: offsetLeft + PADDING,
    //       y: y,
    //       width: profitLossTextWidth,
    //       height: HEIGHT,
    //       align: 'left',
    //       baseline: 'middle',
    //       text: profitLossText
    //     },
    //     styles: {
        
    //       style: 'stroke_fill',
    //       borderStyle: 'solid',
    //       borderColor: profitLossColor,
    //       color: profitLossColor,
    //       backgroundColor,
    //       borderRadius: 0,
    //       paddingTop: 5,
    //       paddingLeft: PADDING,
    //       paddingRight: PADDING,
          
    //     }
    //   },
    //   // 数量
    //   {
    //     type: 'text',
    //     // ignoreEvent: true,
    //     // ignoreEvent: ['onPressedMoveStart', 'onPressedMoving','onPressedMoveEnd'],
    //     attrs: {
    //       x: offsetLeft + profitLossTextWidth + PADDING,
    //       y: y,
    //       width: volumeTextRectWidth,
    //       height: HEIGHT,
    //       align: 'left',
    //       baseline: 'middle',
    //       text: volumeText
    //     },
    //     styles: {
    //       cursor: 'pointer',
    //       style: 'stroke_fill',
    //       borderColor: directionColor,
    //       backgroundColor: directionColor,
    //       color: '#fff',
    //       borderRadius: 0,
    //       paddingTop: 5,
    //       paddingLeft: (volumeTextRectWidth - volumeTextWidth) / 2,
    //       paddingRight: (volumeTextRectWidth - volumeTextWidth) / 2
    //     }
    //   },
    //   // 关闭按钮
    //   {
    //     key: PositionEntrustineFigureKey.Close,
    //     type: 'text',
    //     // ignoreEvent: ['mouseDownEvent', 'mouseRightClickEvent'],
    //     attrs: {
    //       // x: offsetLeft + profitLossTextWidth + volumeTextRectWidth + 28 + PADDING,
    //       x: offsetLeft + profitLossTextWidth + volumeTextRectWidth + PADDING,
    //       y,
    //       height: HEIGHT,
    //       width: HEIGHT,
    //       align: 'left',
    //       baseline: 'middle',
    //       text: '✕'
    //     },
    //     styles: {
    //       style: 'stroke_fill',
    //       color: directionColor,
    //       size: 10,
    //       cursor: 'pointer',
    //       borderColor: directionColor,
    //       backgroundColor,
    //       paddingTop: 7,
    //       paddingLeft: 7,
    //       paddingRight: 7,
    //       borderRadius: 0
    //     }
    //   },
    //   {
    //     type: 'line',
    //     // ignoreEvent: true,
    //     attrs: {
          
    //       coordinates: [
    //         { x: offsetLeft + profitLossTextWidth + volumeTextRectWidth  + 30, y }, { x: bounding.width, y }
    //       ],
    //     },
    //     styles: {
    //       // style: 'dashed',
    //       cursor: 'pointer',
    //       color: directionColor
    //     }
    //   },
    // ];

    // if (reverseTooltip && reverseTooltip.length > 0) {
    //   figures = figures.concat(
    //     createOverlayTooltipFigures(
    //       { x: offsetLeft + profitLossTextWidth + volumeTextRectWidth + PADDING + 14, y: y - HEIGHT / 2 },
    //       reverseTooltip, '#fff', tooltipColor
    //     )
    //   );
    // }

    //  if (closeTooltip && closeTooltip.length > 0) {
    //   figures = figures.concat(
    //     createOverlayTooltipFigures(
    //       { x: offsetLeft + profitLossTextWidth + volumeTextRectWidth + PADDING + 28 + 12, y: y - HEIGHT / 2 },
    //       closeTooltip, '#fff', tooltipColor
    //     )
    //   );
    // }
    const figureElements = [directionFigure, entrustPriceFigure, entrustVolumeFigure, closeBtnFigure, lineFigure];
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
          color: yAxisMarkColor,
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
  onMouseEnter:(e:any) => {
    e.overlay.setZLevel(999)
    console.log('currentEntrustLine')
  }
};



export default currentEntrustLine;
