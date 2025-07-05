import {
  OverlayFigure,
  OverlayTemplate,
  utils,
  Coordinate
} from '@/components/YKLine/StockChart/OriginalKLine/index.esm';

//爆仓线
const liquidationLine: OverlayTemplate = {
  name: 'liquidationLine',
  totalStep: 2,
  createPointFigures: ({ coordinates, bounding, overlay }) => {
    const PADDING = 4;
    const HEIGHT = 20;
    const backgroundColor = overlay.styles?.backgroundColor;
    const directionColor = overlay.styles?.directionColor;
    const profitLossColor = overlay.styles?.profitLossColor;
    const tooltipColor = overlay.styles?.tooltipColor;
    const offsetLeft = overlay.styles?.offsetLeft ?? 2;
    const { y } = coordinates[0];
    const profitLossText = `${overlay.extendData.profitLoss}`;
    const profitLossTextWidth = utils.calcTextWidth(profitLossText) + PADDING * 2;
    const volumeText = `${overlay.extendData.volume ?? 0}`;
    const volumeTextWidth = utils.calcTextWidth(volumeText);
    const volumeTextRectWidth = Math.max(volumeTextWidth + PADDING * 2, 22);

    const reverseTooltip = overlay.extendData.reverseTooltip;
    const closeTooltip = overlay.extendData.closeTooltip;
    let tipsWidth = bounding.width - volumeTextRectWidth - 68; // 爆仓文案的距离左边边的距离
    let tpSlWidth = bounding.width - (volumeTextRectWidth + 68 + profitLossTextWidth); // 爆仓文案方向距离左边的距离

    let figures: OverlayFigure[] = [
      {
        type: 'text',
        ignoreEvent: true,
        attrs: {
          x: tpSlWidth,
          y: y,
          width: profitLossTextWidth,
          height: HEIGHT,
          align: 'left',
          baseline: 'middle',
          text: profitLossText
        },
        styles: {
          style: 'stroke_fill',
          borderStyle: 'solid',
          borderColor: 'none',
          color: '#fff',
          backgroundColor,
          borderRadius: '0',
          paddingTop: 5,
          paddingLeft: PADDING,
          paddingRight: PADDING,
          borderRadius: [4, 0, 0, 4],
           fontFamily: "Lexend",
          fontSize: 10
        }
      },
      // 数量
      {
        type: 'text',
        ignoreEvent: true,
        attrs: {
          x: tipsWidth,
          y: y,
          width: volumeTextRectWidth,
          height: HEIGHT,
          align: 'left',
          baseline: 'middle',
          text: volumeText
        },
        styles: {
          style: 'stroke_fill',
          borderColor: '#47413A',
          backgroundColor: '#47413A',
          color: '#F0BA30',
          borderRadius: 0,
          paddingTop: 5,
          paddingLeft: (volumeTextRectWidth - volumeTextWidth) / 2,
          paddingRight: (volumeTextRectWidth - volumeTextWidth) / 2
        }
      },
      {
        type: 'line',
        ignoreEvent: true,
        attrs: {
          coordinates: [
            { x: tipsWidth + volumeTextRectWidth, y },
            { x: bounding.width, y }
          ]
        },
        styles: {
          color: directionColor
        }
      }
    ];

    return figures;
  },
  createYAxisFigures: ({ coordinates, overlay, precision, thousandsSeparator }) => {
    const color = overlay.styles?.directionColor;
    return [
      {
        type: 'text',
        ignoreEvent: true,
        attrs: {
          x: 0,
          y: coordinates[0].y,
          baseline: 'middle',
          // text: `${utils.formatThousands(overlay.points[0].value!.toFixed(precision.price), thousandsSeparator)}`
          text: overlay?.points[0]?.value
        },
        styles: {
          style: 'fill',
          color: '#ffffff',
          backgroundColor: color,
          borderRadius: 2,
          paddingLeft: 4,
          paddingTop: 4,
          paddingRight: 4,
          paddingBottom: 4
        }
      }
    ];
  }
};

export default liquidationLine;
