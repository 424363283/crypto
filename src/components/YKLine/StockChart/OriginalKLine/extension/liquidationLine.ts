// import { OverlayFigure, OverlayTemplate, utils, Coordinate } from 'klinecharts';

import { OverlayFigure, OverlayTemplate, utils, Coordinate } from '@/components/YKLine/StockChart/OriginalKLine/index.esm';

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

const liquidationLine: OverlayTemplate = {
  name: 'liquidationLine',
  totalStep: 2,
  createPointFigures: ({ coordinates, bounding, overlay }) => {
    const PADDING = 8;
    const HEIGHT = 22;
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

    let figures: OverlayFigure[] = [
      {
        type: 'text',
        ignoreEvent: true,
        attrs: {
          x: offsetLeft + PADDING,
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
          borderColor: profitLossColor,
          color: profitLossColor,
          backgroundColor,
          borderRadius: 0,
          paddingTop: 5,
          paddingLeft: PADDING,
          paddingRight: PADDING
        }
      },
      // 数量
      {
        type: 'text',
        ignoreEvent: true,
        attrs: {
          x: offsetLeft + profitLossTextWidth + PADDING,
          y: y,
          width: volumeTextRectWidth,
          height: HEIGHT,
          align: 'left',
          baseline: 'middle',
          text: volumeText
        },
        styles: {
          style: 'stroke_fill',
          borderColor: directionColor,
          backgroundColor: directionColor,
          color: '#fff',
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
          coordinates: [{ x: offsetLeft + profitLossTextWidth + volumeTextRectWidth, y }, { x: bounding.width, y }],
        },
        styles: {
          style: 'dashed',
          color: directionColor
        }
      },
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
          text: `${utils.formatThousands(overlay.points[0].value!.toFixed(precision.price), thousandsSeparator)}`
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
      },
    ];
  },
};



export default liquidationLine;