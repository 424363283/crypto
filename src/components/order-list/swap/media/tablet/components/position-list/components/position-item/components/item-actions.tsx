import CommonIcon from '@/components/common-icon';
import { SubButton } from '@/components/trade-ui/trade-view/components/button';
import { LANG } from '@/core/i18n';
import { Swap } from '@/core/shared';

export const ItemActions = ({
  onTrack,
  onSpsl,
  onClose,
  onCloseAll,
  onReverse,
  buy
}: {
  buy: boolean;
  onTrack: any;
  onSpsl: any;
  onClose: any;
  onCloseAll: any;
  onReverse: any;
}) => {
  // const { isDark } = useTheme();
  const twoWayMode = Swap.Trade.twoWayMode;

  return (
    <>
      <div className="item-actions">
        <SubButton onClick={onSpsl}>{LANG('止盈/止损')}</SubButton>
        <SubButton onClick={onClose}>{LANG('平仓')}</SubButton>
        <SubButton onClick={onCloseAll}>{LANG('市价全平')}</SubButton>
        {!twoWayMode && (
          <SubButton onClick={onReverse} className={'reverse'}>
            <CommonIcon name="common-reverse-fan" width={16} height={16} enableSkin className="icon" />
          </SubButton>
        )}
      </div>
      <style jsx>{`
        .item-actions {
          margin-top: 10px;
          display: flex;
          flex-direction: row;
          font-size: 12px;
          gap: 8px;
          :global(button) {
            flex: 1 auto;
            &:last-child {
              flex: 0;
            }
          }
          :global(> div) {
            cursor: pointer;
            background-color: var(--brand);
            color: var(--text_white);
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 400;
            height: 2rem;
            border-radius: 1.375rem;
            // margin-right: 6px;
            gap: 10px;
            flex: 1 0 0;
          }
          :global(.reverse) {
            width: 2rem;
            height: 2rem;
            border-radius: 2rem;
            flex: 0;
          }
        }
      `}</style>
    </>
  );
};
