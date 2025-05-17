import {
  OverlayFigure,
  OverlayTemplate,
  utils,
  Coordinate
} from '@/components/YKLine/StockChart/OriginalKLine/index.esm';
import { buildYAxisFigures } from '../common/figureBuilder';
import { color } from 'echarts';

//爆仓线
const liquidationLine: OverlayTemplate = {
  name: 'liquidationLine',
  totalStep: 2,
  createPointFigures: ({ coordinates, bounding, overlay }) => {
    const PADDING = 4;
    const HEIGHT = 20;
    // const backgroundColor = overlay.styles?.backgroundColor;
    // const directionColor = overlay.styles?.directionColor;
    // const profitLossColor = overlay.styles?.profitLossColor;
    // const tooltipColor = overlay.styles?.tooltipColor;
    // const offsetLeft = overlay.styles?.offsetLeft ?? 2;
    const { y } = coordinates[0];
    // const profitLossText = `${overlay.extendData.profitLoss}`;
    // const profitLossTextWidth = utils.calcTextWidth(profitLossText) + PADDING * 2;
    // const volumeText = `${overlay.extendData.volume ?? 0}`;
    // const volumeTextWidth = utils.calcTextWidth(volumeText);
    // const volumeTextRectWidth = Math.max(volumeTextWidth + PADDING * 2, 22);

    // const reverseTooltip = overlay.extendData.reverseTooltip;
    // const closeTooltip = overlay.extendData.closeTooltip;
    // let tipsWidth = bounding.width - volumeTextRectWidth - 68; // 爆仓文案的距离左边边的距离
    // let tpSlWidth = bounding.width - (volumeTextRectWidth + 68 + profitLossTextWidth); // 爆仓文案方向距离左边的距离

    // 公共部分
    const borderSize = 1;
    const fontSize = 10;
    const paddingTopBottom = (HEIGHT - borderSize - fontSize)/2

    // 边距线
    const marginLineColor = overlay.styles?.marginLineColor
    const marginLineWidth = 68

    // 方向
    const directionColor = overlay.styles?.directionColor;
    const directionBorderColor = overlay.styles?.directionBorderColor;
    const directionBackgroundColor = overlay.styles?.directionBackgroundColor;
    const directionText = overlay.extendData.direction;

    // 强平
    const descriptionColor = overlay.styles?.descriptionColor;
    const descriptionBorderColor = overlay.styles?.descriptionBorderColor;
    const descriptionBackgroundColor = overlay.styles?.descriptionBackgroundColor;
    const descriptionText = overlay.extendData.description;
    

    const figures:OverlayFigure[] = []
    // 边距线-----------------------------------------
    const marginLineFigure = {
        type: 'line',
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
    
    // 描述信息-----------------------------------------
    const descriptionFigure = {
      type: 'text',
      attrs: {
        x: 0,
        y: y,
        baseline: 'middle',
        text: descriptionText
      },
      styles: {
        style: 'stroke_fill',
        color: descriptionColor,
        // 尺寸
        size: 10,
         // 字体
        family: 'HarmonyOS Sans SC',
        // 粗细
        weight: 'normal',
        // 左内边距
        paddingLeft: PADDING,
        // 右内边距
        paddingRight: PADDING,
        // 上内边距
        paddingTop: paddingTopBottom,
        // 下内边距
        paddingBottom: paddingTopBottom,
        // 边框样式
        borderStyle: 'solid',
        // 边框颜色
        borderColor: descriptionBorderColor,
        // 边框尺寸
        borderSize: 0,
        // 边框虚线参数
        borderDashedValue: [2, 2],
        // 边框圆角值
        borderRadius: [4, 0, 0, 4],
        // 边框颜色
        backgroundColor: descriptionBackgroundColor
      }
    };

    const descriptionWidth =
      descriptionFigure.styles.paddingLeft +
      utils.calcTextWidth(
        descriptionFigure.attrs.text,
        descriptionFigure.styles.size,
        descriptionFigure.styles.weight,
        descriptionFigure.styles.family
      ) +
      descriptionFigure.styles.paddingRight;
    descriptionFigure.attrs.x = bounding.width - (marginLineWidth + descriptionWidth)

    // 方向-----------------------------------------

    const directionFigure = {
      type: 'text',
      // ignoreEvent: ['mouseDownEvent', 'mouseRightClickEvent'],
      attrs: {
        x: 0,
        y: y,
        baseline: 'middle',
        text: directionText
      },
      styles: {
        style: 'fill',
        color: directionColor,
        // 尺寸
        size: fontSize,
         // 字体
        family: 'HarmonyOS Sans SC',
        // 粗细
        weight: 'normal',
        // 左内边距
        paddingLeft: PADDING,
        // 右内边距
        paddingRight: PADDING,
        // 上内边距
        paddingTop: paddingTopBottom,
        // 下内边距
        paddingBottom: paddingTopBottom,
        // 边框样式
        borderStyle: 'solid',
        // 边框颜色
        borderColor: directionBorderColor,
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
    directionFigure.attrs.x = bounding.width - (marginLineWidth + descriptionWidth + directionWidth)
    
    figures.push(marginLineFigure, descriptionFigure, directionFigure)

    return figures;
  },
  createYAxisFigures: ({ coordinates, overlay, precision, thousandsSeparator, yAxis }) => {
    const styles = {
      color: overlay.styles?.yAxisMarkColor,
      borderColor: overlay.styles?.yAxisMarkBorderColor,
      backgroundColor: overlay.styles?.yAxisMarkBackgroundColor
    }
    return buildYAxisFigures(coordinates[0], overlay, precision, yAxis, thousandsSeparator, styles)
  }
};

export default liquidationLine;
