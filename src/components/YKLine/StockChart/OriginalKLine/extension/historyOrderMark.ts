// import { OverlayTemplate, OverlayFigure } from 'klinecharts';
import { OverlayTemplate, OverlayFigure } from '@/components/YKLine/StockChart/OriginalKLine/index.esm';



export const enum HistoryOrderMarkArrowDirection {
  Up,
  Down
}


const historyOrderMark: OverlayTemplate = {
  name: 'historyOrderMark',
  totalStep: 2,
  lock: true,
  createPointFigures: ({ coordinates, overlay }) => {
    let sign = -1;
    if (overlay.extendData.direction === HistoryOrderMarkArrowDirection.Up) {
      sign = 1;
    }
    const offset = overlay.extendData.offset * sign;
    const polygonCoordinates = [
      { x: coordinates[0].x, y: coordinates[0].y + offset },
      { x: coordinates[0].x - 3, y: coordinates[0].y + offset + 3 * sign },
      { x: coordinates[0].x - 1, y: coordinates[0].y + offset + 3 * sign },
      { x: coordinates[0].x - 1, y: coordinates[0].y + offset + (3 + 5) * sign },
      { x: coordinates[0].x + 1, y: coordinates[0].y + offset + (3 + 5) * sign },
      { x: coordinates[0].x + 1, y: coordinates[0].y + offset + 3 * sign },
      { x: coordinates[0].x + 3, y: coordinates[0].y + offset + 3 * sign },
    ];
    const figures: OverlayFigure[] = [
      {
        type: 'polygon',
        attrs: {
          coordinates: polygonCoordinates
        },
        styles: {
          style: 'fill',
          color: overlay.styles?.color
        }
      },
    ];
    const tooltipText = overlay.extendData.tooltip ?? '';
    if (tooltipText.length > 0) {
      const backgroundColor = overlay.styles?.tooltipColor;
      figures.push({
        type: 'polygon',
        ignoreEvent: true,
        attrs: {
          coordinates: [
            { x: coordinates[0].x, y: coordinates[0].y + offset + 4 * sign * -1 },
            { x: coordinates[0].x - 6, y: coordinates[0].y + offset + 10 * sign * -1 },
            { x: coordinates[0].x + 6, y: coordinates[0].y + offset + 10 * sign * -1 }
          ]
        },
        styles: {
          color: backgroundColor
        }
      });
      figures.push({
        type: 'text',
        ignoreEvent: true,
        attrs: {
          x: coordinates[0].x,
          y: coordinates[0].y + offset + 22 * sign * -1,
          height: 24,
          align: 'center',
          baseline: 'middle',
          text: tooltipText
        },
        styles: {
          color: '#ffffff',
          backgroundColor,
          paddingLeft: 8,
          paddingRight: 8,
          paddingTop: 6
        }
      });
    }
    return figures;
  }
};

export default historyOrderMark;
