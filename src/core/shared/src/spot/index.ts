import { Position } from './position';
import { Strategy } from './strategy';
import { Trade } from './trade';

export { HistoryRange, LIST_TYPE, LoadingType, SpotGridPositionType, SpotTabType } from './position/types';
export type { SpotListItem, SpotPositionListItem } from './position/types';
export { CREATE_TYPE } from './strategy/types';
export type { GridAiItem, GridSymbolItem } from './strategy/types';
export { SideType, SpotOrderType, TRADE_TAB } from './trade/types';
/**
 * 现货
 * @export Spot.Trade
 * @export Spot.Position
 * @export Spot.Strategy
 */
export const Spot = {
  Trade: Trade,
  Grid : {},
  Position: Position,
  Strategy: Strategy,
};
