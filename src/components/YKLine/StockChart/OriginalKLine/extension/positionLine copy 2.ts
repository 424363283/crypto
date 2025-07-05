// import { OverlayFigure, OverlayTemplate, utils, Coordinate } from 'klinecharts';
import { OverlayFigure, OverlayTemplate, utils, Coordinate } from '@/components/YKLine/StockChart/OriginalKLine/index.esm';
import { getKineState, setPositionLineTpSl } from '@/store/kline';

export const PositionLineFigureKey = {
  Close: 'close',
  Reverse: 'reverse'
};


const color = 'rgb(39, 114, 123)'




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

const positionLine: OverlayTemplate = {
  name: 'positionLine',
  totalStep: 2,
  createPointFigures: ({ coordinates, bounding, overlay }) => {
    const PADDING = 8;
    const HEIGHT = 22;
    const offsetLeft = 2;
    const { y } = coordinates[0];
    
    const volumeText = '测试';
    const volumeTextWidth = utils.calcTextWidth(volumeText);
    const volumeTextRectWidth = Math.max(volumeTextWidth + PADDING * 2, 22);

    const showStopProfitLoss = overlay.extendData.showStopProfitLoss

    const { isHoverTPSL } = getKineState();

    console.log("showStopProfitLoss",isHoverTPSL)

    const figures: OverlayFigure[] = [
      {
        type: 'text',
        attrs: {
          x: offsetLeft,
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
          borderColor: color,
          backgroundColor: color,
          color: '#fff',
          borderRadius: 2,
          paddingTop: 5,
          paddingLeft: (volumeTextRectWidth - volumeTextWidth) / 2,
          paddingRight: (volumeTextRectWidth - volumeTextWidth) / 2
        }
      }
    ];
    let left = offsetLeft + volumeTextRectWidth
    if (isHoverTPSL) {
      // gap
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
      })

      left += 20
      const profitText = '止盈'
      const profitTextWidth = utils.calcTextWidth(profitText) + PADDING * 2
      figures.push({
        type: 'text',
        attrs: {
          x: left,
          y: y,
          width: profitTextWidth,
          height: HEIGHT,
          align: 'left',
          baseline: 'middle',
          text: profitText
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
      })

      left += profitTextWidth
      // gap
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
      })

      left += 10
      const lossText = '止损'
      const lossTextWidth = utils.calcTextWidth(lossText) + PADDING * 2
      figures.push({
        type: 'text',
        attrs: {
          x: left,
          y: y,
          width: lossTextWidth,
          height: HEIGHT,
          align: 'left',
          baseline: 'middle',
          text: lossText
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
      })
      left += lossTextWidth
    }
    figures.push({
      type: 'line',
      // ignoreEvent: true,
      attrs: {
        coordinates: [
          { x: left, y }, { x: bounding.width, y }
        ],
      },
      styles: {
        style: 'dashed',
        cursor: 'pointer',
        color
      }
    },)

    return figures;
  },
  createYAxisFigures: ({ coordinates, overlay, chart }) => {
    return [
      {
        type: 'text',
        // ignoreEvent: true,
        attrs: {
          x: 0,
          y: coordinates[0].y,
          baseline: 'middle',
          text: `${chart.getThousandsSeparator().format(overlay.points[0].value!.toFixed(chart.getPrecision().price))}`
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
      },
    ];
  },
  onMouseEnter: ({ chart, overlay }) => {
    setPositionLineTpSl(true)
    chart.overrideOverlay({
      id: overlay.id,
      extendData: {
        showStopProfitLoss: true
      }
    })


    return false
  },
  onMouseLeave: ({ chart, overlay }) => {
    setPositionLineTpSl(false)
    chart.overrideOverlay({
      id: overlay.id,
      extendData: {
        showStopProfitLoss: false
      }
    })
    return false
  }
};


export default positionLine;
