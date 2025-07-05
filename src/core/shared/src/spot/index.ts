import { Position } from './position';
import { Strategy } from './strategy';
import { Grid } from './strategy/grid';
import { Invest } from './strategy/invest';
import { Martin } from './strategy/martin';
import { Trade } from './trade';

export { HistoryRange, LIST_TYPE, LoadingType, SpotGridPositionType, SpotTabType } from './position/types';
export type { SpotListItem, SpotPositionListItem } from './position/types';
export { CREATE_TYPE } from './strategy/grid/types';
export type { GridAiItem, GridSymbolItem } from './strategy/grid/types';
export type { MartinSymbolItem } from './strategy/martin/types';
export { SideType, SpotOrderType, TRADE_TAB } from './trade/types';
/**
 * 现货
 * @export Spot.Trade
 * @export Spot.Position
 * @export Spot.Strategy
 */
export const Spot = {
  Trade,
  Position,
  Strategy,
  Grid,
  Invest,
  Martin,
};
