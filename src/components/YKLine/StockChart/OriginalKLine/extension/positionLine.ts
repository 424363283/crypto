// import { OverlayFigure, OverlayTemplate, utils, Coordinate } from 'klinecharts';
import {
  OverlayFigure,
  OverlayTemplate,
  utils,
  Coordinate
} from '@/components/YKLine/StockChart/OriginalKLine/index.esm';
import { Swap } from '@/core/shared';
import { getKineState, setPositionLineTpSl, setPositionTpSLInfoFun, setPositionTpSlFun } from '@/store/kline';

import { clsx, formatDefaultText } from '@/core/utils';
export const PositionLineFigureKey = {
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

const positionLine: OverlayTemplate = {
  name: 'positionLine',
  totalStep: 2,
  createPointFigures: ({ coordinates, bounding, overlay }) => {
    const PADDING = 8;
    const HEIGHT = 22;
    const backgroundColor = overlay.styles?.backgroundColor;
    const directionColor = overlay.styles?.directionColor;
    const profitLossColor = overlay.styles?.profitLossColor;
    const tooltipColor = overlay.styles?.tooltipColor;
    const openDirectionBg = overlay.styles?.openDirectionBg;
    const offsetLeft = overlay.styles?.offsetLeft ?? 2;
    const { y } = coordinates[0];
    const profitLossText = `${overlay.extendData.profitLoss}`;
    const profitLossTextWidth = utils.calcTextWidth(profitLossText) + PADDING * 2;
    const volumeText = `${overlay.extendData.volume ?? 0}`;
    const volumeTextWidth = utils.calcTextWidth(volumeText);
    const volumeTextRectWidth = Math.max(volumeTextWidth + PADDING * 2, 22);

    const reverseTooltip = overlay.extendData.reverseTooltip;
    const closeTooltip = overlay.extendData.closeTooltip;

    let positionId = overlay.extendData.positionId;
    const { isHoverTPSL, positionTpSLInfo } = getKineState();

    let getfliterId =
      positionTpSLInfo.length > 0 && positionTpSLInfo?.find(item => item?.positionId === positionId)?.orders;

    let getPositionIdBuy = getfliterId && getfliterId?.some(item => item?.direction == 1);
    let getPositionIdSell = getfliterId && getfliterId?.some(item => item?.direction == 2);

    // console.log("getPositionIdBuy",isHoverTPSL)
    // console.log("getPositionIdSell",getPositionIdSell)

    // 切换按钮，单向持仓显示，双向持仓屏蔽
    const twoWayMode = !Swap.Trade.twoWayMode;
    let reverBtn = [];
    const reverBtnWidth = twoWayMode ? 28 : 0;
    if (twoWayMode) {
      reverBtn = [
        {
          key: PositionLineFigureKey.Reverse,
          type: 'rect',
          ignoreEvent: ['mouseDownEvent', 'mouseRightClickEvent'],
          attrs: {
            x: offsetLeft + profitLossTextWidth + volumeTextRectWidth + PADDING,
            y: y - HEIGHT / 2,
            width: 28,
            height: HEIGHT
          },
          styles: {
            style: 'stroke_fill',
            borderColor: profitLossColor,
            color: backgroundColor
          }
        },
        {
          type: 'line',
          ignoreEvent: true,
          attrs: {
            coordinates: [
              { x: offsetLeft + profitLossTextWidth + volumeTextRectWidth + PADDING + 10, y: y - 5 },
              { x: offsetLeft + profitLossTextWidth + volumeTextRectWidth + PADDING + 10, y: y + 5 }
            ]
          },
          styles: {
            color: profitLossColor
          }
        },
        {
          type: 'polygon',
          ignoreEvent: true,
          attrs: {
            coordinates: [
              { x: offsetLeft + profitLossTextWidth + volumeTextRectWidth + PADDING + 10, y: y + 5 },
              { x: offsetLeft + profitLossTextWidth + volumeTextRectWidth + PADDING + 7, y: y + 1 },
              { x: offsetLeft + profitLossTextWidth + volumeTextRectWidth + PADDING + 13, y: y + 1 }
            ]
          },
          styles: {
            style: 'fill',
            color: profitLossColor
          }
        },
        {
          type: 'line',
          ignoreEvent: true,
          attrs: {
            coordinates: [
              { x: offsetLeft + profitLossTextWidth + volumeTextRectWidth + PADDING + 19, y: y - 5 },
              { x: offsetLeft + profitLossTextWidth + volumeTextRectWidth + PADDING + 19, y: y + 5 }
            ]
          },
          styles: {
            color: profitLossColor
          }
        },
        {
          type: 'polygon',
          ignoreEvent: true,
          attrs: {
            coordinates: [
              { x: offsetLeft + profitLossTextWidth + volumeTextRectWidth + PADDING + 19, y: y - 5 },
              { x: offsetLeft + profitLossTextWidth + volumeTextRectWidth + PADDING + 16, y: y - 1 },
              { x: offsetLeft + profitLossTextWidth + volumeTextRectWidth + PADDING + 22, y: y - 1 }
            ]
          },
          styles: {
            style: 'fill',
            color: profitLossColor
          }
        }
      ];
    }
    let figures: OverlayFigure[] = [
      {
        type: 'text',
        // ignoreEvent: true,
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
          borderColor: backgroundColor,
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
          borderColor: 'none',
          backgroundColor: profitLossColor,
          // backgroundColor: openDirectionBg,
          color: '#fff',
          borderRadius: 0,
          paddingTop: 5,
          paddingLeft: (volumeTextRectWidth - volumeTextWidth) / 2,
          paddingRight: (volumeTextRectWidth - volumeTextWidth) / 2
        }
      },
      // 切换按钮
      ...reverBtn,
      // 关闭按钮
      {
        key: PositionLineFigureKey.Close,
        type: 'text',
        ignoreEvent: ['mouseDownEvent', 'mouseRightClickEvent'],
        attrs: {
          x: offsetLeft + profitLossTextWidth + volumeTextRectWidth + reverBtnWidth + PADDING,
          y,
          height: HEIGHT,
          width: HEIGHT,
          align: 'left',
          baseline: 'middle',
          text: '✕'
        },
        styles: {
          style: 'stroke_fill',
          color: profitLossColor,
          size: 10,
          borderColor: profitLossColor,
          backgroundColor,
          paddingTop: 7,
          paddingLeft: 7,
          paddingRight: 7,
          borderRadius: 0
        }
      },
      {
        type: 'line',
        ignoreEvent: true,
        attrs: {
          coordinates: [
            { x: offsetLeft + profitLossTextWidth + volumeTextRectWidth + reverBtnWidth + 30, y },
            { x: bounding.width, y }
          ]
        },
        styles: {
          // style: 'dashed',
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
          {
            x: offsetLeft + profitLossTextWidth + volumeTextRectWidth + PADDING + reverBtnWidth + 12,
            y: y - HEIGHT / 2
          },
          closeTooltip,
          '#fff',
          tooltipColor
        )
      );
    }
    let left = offsetLeft + profitLossTextWidth + volumeTextRectWidth + PADDING + 40;

    if (!getPositionIdBuy && isHoverTPSL?.id == positionId) {
      figures.push({
        type: 'rect',
        attrs: {
          x: left,
          y: y - HEIGHT / 2,
          width: 20,
          height: HEIGHT
        },
        styles: {
          style: 'stroke_fill',
          borderColor: 'transparent',
          color: 'transparent'
        }
      });

      left += 20;
      const profitText = 'TP';
      const profitTextWidth = utils.calcTextWidth(profitText) + PADDING * 2;
      figures.push({
        type: 'text',
        attrs: {
          x: left,
          y: y,
          width: profitTextWidth,
          height: HEIGHT,
          align: 'left',
          baseline: 'middle',
          text: profitText,
          id: 1
        },
        styles: {
          cursor: 'pointer',
          style: 'stroke_fill',
          borderColor: 'rgb(34, 195, 170)',
          backgroundColor: 'rgb(34, 195, 170)',
          color: '#fff',
          borderRadius: 2,
          paddingTop: 5,
          paddingLeft: PADDING
        }
      });

      left += profitTextWidth;
    }

    if (!getPositionIdSell && isHoverTPSL?.id == positionId) {
      if (getPositionIdBuy) {
        left + 20;
        const profitText = '  ';
        const profitTextWidth = utils.calcTextWidth(profitText) + PADDING * 2;
        left += profitTextWidth;
      }

      figures.push({
        type: 'rect',
        attrs: {
          x: left,
          y: y - HEIGHT / 2,
          width: 10,
          height: HEIGHT
        },
        styles: {
          style: 'stroke_fill',
          borderColor: 'transparent',
          color: 'transparent'
        }
      });

      left += 10;
      const lossText = 'SL';
      const lossTextWidth = utils.calcTextWidth(lossText) + PADDING * 2;
      figures.push({
        type: 'text',
        attrs: {
          x: left,
          y: y,
          width: lossTextWidth,
          height: HEIGHT,
          align: 'left',
          baseline: 'middle',
          text: lossText,
          id: 2
        },
        styles: {
          cursor: 'pointer',
          style: 'stroke_fill',
          borderColor: 'rgb(245, 141, 178)',
          backgroundColor: 'rgb(245, 141, 178)',
          color: '#fff',
          borderRadius: 2,
          paddingTop: 5,
          paddingLeft: PADDING
        }
      });
      left += lossTextWidth;
    }

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
          text: `${formatDefaultText(overlay.points[0].value.toFormat())}`
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
  },
  onpressedmove: ({ chart, overlay }) => {
    console.log('pros1', chart);
  },
  onPressedMoveStart: (event: object) => {
    if (event?.figure === PositionLineFigureKey.Close || event?.figure === PositionLineFigureKey.Reverse) {
      return;
    }
    //按住开始移动事件。
    console.log('pros', event);
  },
  onPressedMoveEnd: (event: object) => {
    if (
      event?.figure.key === PositionLineFigureKey.Close ||
      (event?.figure.key === PositionLineFigureKey.Reverse && event?.figure?.type === 'rect')
    ) {
      return;
    }
    //按住结束移动事件。
    // console.log("prosend",event?.figure?.attrs?.id)
    let tpslTypeId = event?.figure?.attrs?.id; //当前选择的类型
    let tpslPrice = event?.overlay?.points[0]?.value; //当前拖动的价格
    // console.log("prosend",tpslPrice)
    //1是止盈。2是止损
    setPositionTpSLInfoFun({
      id: tpslTypeId,
      price: tpslPrice,
      positionId: event?.overlay?.extendData?.positionId
    });
  },
  onMouseEnter: ({ chart, overlay }) => {
    // setPositionLineTpSl({
    //   id:overlay?.extendData?.positionId,
    //   visble:true
    // })
    // chart.overrideOverlay({
    //   id: overlay.id,
    //   extendData: {
    //     showStopProfitLoss: true
    //   }
    // })

    return false;
  },
  onMouseLeave: ({ event, chart, overlay }) => {
    if (event?.figure === PositionLineFigureKey.Close || event?.figure === PositionLineFigureKey.Reverse) {
      return;
    }
    // setPositionLineTpSl(false)
    setPositionLineTpSl({
      id: '',
      visble: false
    });
    // console.log("overlay",overlay?.extendData?.positionId)
    // console.log("onMouseLeave",overlay?.points[0]?.value)
    // chart.overrideOverlay({
    //   id: overlay.id,
    //   extendData: {
    //     showStopProfitLoss: false
    //   }
    // })
    return false;
  }
  // onClickL
};

export default positionLine;
