import { Svg } from '@/components/svg';
import { SubButton } from '@/components/trade-ui/trade-view/components/button';
import { useTheme } from '@/core/hooks';
import { LANG } from '@/core/i18n';

export const ItemActions = ({
  onTrack,
  onSpsl,
  onClose,
  onCloseAll,
  onReverse,
  buy,
}: {
  buy: boolean;
  onTrack: any;
  onSpsl: any;
  onClose: any;
  onCloseAll: any;
  onReverse: any;
}) => {
  const { isDark } = useTheme();
  const reveseImg = !buy
    ? isDark
      ? '/static/images/swap/position/reverse_buy.svg'
      : '/static/images/swap/position/reverse_buy_light.svg'
    : isDark
    ? '/static/images/swap/position/reverse_sell.svg'
    : '/static/images/swap/position/reverse_sell_light.svg';

  return (
    <>
      <div className='item-actions'>
        <SubButton onClick={onSpsl}>{LANG('止盈/止损')}</SubButton>
        <SubButton onClick={onClose}>{LANG('平仓')}</SubButton>
        <SubButton onClick={onCloseAll}>{LANG('市价全平')}</SubButton>
        <SubButton onClick={onReverse} className={'reverse'}>
          <Svg src={reveseImg} width={14} height={14} />
        </SubButton>
      </div>
      <style jsx>{`
        .item-actions {
          margin-top: 12px;
          display: flex;
          flex-direction: row;
          font-size: 12px;
          :global(> div) {
            cursor: pointer;
            background-color: var(--theme-trade-sub-button-bg);
            color: var(--theme-trade-text-color-1);
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 400;
            height: 32px;
            border-radius: 6px;
            margin-right: 6px;
            flex: 1;
            padding: 0 5px;
            &:last-child {
              margin-right: 0;
            }
          }
          :global(.reverse) {
            flex: none;
            width: 32px;
          }
        }
      `}</style>
    </>
  );
};
