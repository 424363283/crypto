// import { OverlayFigure, OverlayTemplate, utils, Coordinate } from 'klinecharts';

import {
  OverlayFigure,
  OverlayTemplate,
  utils,
  Coordinate
} from '@/components/YKLine/StockChart/OriginalKLine/index.esm';
export const PositionTPSLLineFigureKey = {
  Close: 'close',
  Reverse: 'reverse'
};

function createOverlayTooltipFigures(coordinate: Coordinate, text: string, color: string, backgroundColor: string) {
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

const positionTPTLLine: OverlayTemplate = {
  name: 'positionTPTLLine',
  totalStep: 2,
  createPointFigures: ({ coordinates, bounding, overlay }) => {
    const PADDING = 4;
    const HEIGHT = 20;
    const backgroundColor = overlay.styles?.backgroundColor;
    const directionColor = overlay.styles?.directionColor;
    const profitLossColor = overlay.styles?.profitLossColor;
    const tooltipColor = overlay.styles?.tooltipColor;
    const openDirectionColor = overlay.styles?.openDirectionColor;
    const openDirectionBg = overlay.styles?.openDirectionBg;
    const closeBg = overlay.styles?.closeBg;
    const closeColor = overlay.styles?.closeColor;

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

    let figures: OverlayFigure[] = [
      {
        type: 'text',
        // ignoreEvent: true,
        attrs: {
          x: tipsWidth,

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
          borderColor: openDirectionColor,
          color: '#fff',
          backgroundColor: openDirectionColor,
          borderRadius: [4, 0, 0, 4],
          paddingTop: 4,
          paddingLeft: PADDING,
          paddingRight: PADDING
        }
      },
      // 数量
      {
        type: 'text',
        // ignoreEvent: true,
        // ignoreEvent: ['onPressedMoveStart', 'onPressedMoving','onPressedMoveEnd'],
        attrs: {
          // x: offsetLeft + profitLossTextWidth + PADDING,
          x: tpSlWidth,

          y: y,
          width: volumeTextRectWidth,
          height: HEIGHT,
          align: 'left',
          baseline: 'middle',
          text: volumeText
        },
        styles: {
          cursor: 'pointer',
          style: 'stroke_fill',
          borderColor: openDirectionBg,
          backgroundColor: openDirectionBg,
          color: openDirectionColor,
          borderRadius: 0,
          paddingTop: 5,
          paddingLeft: (volumeTextRectWidth - volumeTextWidth) / 2,
          paddingRight: (volumeTextRectWidth - volumeTextWidth) / 2
        }
      },
      // 关闭按钮
      {
        key: PositionTPSLLineFigureKey.Close,
        type: 'rect',
        attrs: {
          x: closeWidth - HEIGHT + 2, // 调整水平位置
          y: y - 8, // 调整垂直位置，使其居中
          width: 16,
          height: 16
        },
        styles: {
          style: 'fill',
          color: 'transparent',
          cursor: 'pointer'
        }
      },
      {
        key: PositionTPSLLineFigureKey.Close,
        type: 'line',
        attrs: {
          coordinates: [
            { x: closeWidth - HEIGHT + 6, y: y - 4 }, // 调整交叉线的起点
            { x: closeWidth - HEIGHT + 14, y: y + 4 } // 调整交叉线的终点
          ]
        },
        styles: {
          color: '#A5A8AC',
          size: 2
        }
      },
      {
        key: PositionTPSLLineFigureKey.Close,
        type: 'line',
        attrs: {
          coordinates: [
            { x: closeWidth - HEIGHT + 14, y: y - 4 }, // 调整交叉线的起点
            { x: closeWidth - HEIGHT + 6, y: y + 4 } // 调整交叉线的终点
          ]
        },
        styles: {
          color: '#A5A8AC',
          size: 2
        }
      },
      {
        key: PositionTPSLLineFigureKey.Close,
        type: 'line',
        // ignoreEvent: true,
        attrs: {
          coordinates: [
            { x: closeWidth, y },
            { x: bounding.width, y }
          ]
          // coordinates: [

          //   { x: offsetLeft + profitLossTextWidth + volumeTextRectWidth  + 30, y }, { x: bounding.width, y }
          // ],
        },
        styles: {
          // style: 'dashed',
          cursor: 'pointer',
          color: directionColor
        }
      }
    ];

    if (reverseTooltip && reverseTooltip.length > 0) {
      figures = figures.concat(
        createOverlayTooltipFigures(
          { x: offsetLeft + profitLossTextWidth + volumeTextRectWidth + PADDING + 14, y: y - HEIGHT / 2 },
          reverseTooltip,
          '#fff',
          tooltipColor
        )
      );
    }

    if (closeTooltip && closeTooltip.length > 0) {
      figures = figures.concat(
        createOverlayTooltipFigures(
          { x: offsetLeft + profitLossTextWidth + volumeTextRectWidth + PADDING + 28 + 12, y: y - HEIGHT / 2 },
          closeTooltip,
          '#fff',
          tooltipColor
        )
      );
    }

    return figures;
  },
  createYAxisFigures: ({ coordinates, overlay, precision, thousandsSeparator }) => {
    const color = overlay.styles?.directionColor;
    return [
      {
        type: 'text',
        // ignoreEvent: true,
        attrs: {
          x: 0,
          y: coordinates[0].y,
          baseline: 'middle',
          // text: `${utils.formatThousands(overlay.points[0].value!.toFixed(precision.price), thousandsSeparator)}`
          text: overlay?.points[0]?.value
        },
        styles: {
          cursor: 'pointer',
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

export default positionTPTLLine;
