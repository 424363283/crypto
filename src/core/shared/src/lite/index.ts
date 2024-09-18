import { Position } from './position';
import { Trade } from './trade';

export { LiteTabType, LoadingType } from './position/types';
export type { LiteListItem } from './position/types';
export { AccountType, OrderType, PositionSide, StopType } from './trade/types';

/**
 * 简单合约
 * @export Lite.Trade
 * @export Lite.Position
 */
export const Lite = {
  Trade: Trade,
  Position: Position,
};
