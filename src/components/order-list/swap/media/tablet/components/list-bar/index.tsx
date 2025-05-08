import { Loading } from '@/components/loading';
import { AlertFunction } from '@/components/modal';
import { store } from '@/components/order-list/swap/store';
import { Switch } from '@/components/switch';
import { DropdownSelect } from '@/components/trade-ui/common/dropdown';
import { InfoHover } from '@/components/trade-ui/common/info-hover';
import Tooltip from '@/components/trade-ui/common/tooltip';
import { LANG } from '@/core/i18n';
import { Account, Swap } from '@/core/shared';
import { clsx, message } from '@/core/utils';
import CheckboxItem from '@/components/trade-ui/trade-view/swap/components/checkbox-item';

export const ListBar = ({
  positionMode,
  pendingMode,
  pending,
  positions
}: {
  positionMode?: boolean;
  pendingMode?: boolean;
  pending?: any;
  positions?: any;
}) => {
  const { hide, showAllOrders } = store;
  const { isUsdtType, quoteId } = Swap.Trade.base;
  const _closeAll = () => {
    AlertFunction({
      v4: true,
      title: LANG('一键全平'),
      onOk: async () => {
        Loading.start();
        try {
          const result = await Swap.Order.closePositionAll(isUsdtType, hide ? quoteId.toLowerCase() : undefined);
          if (result.code != 200) {
            message.error(result);
          }
        } catch (error: any) {
          message.error(error);
        } finally {
          Loading.end();
        }
      },
      content: isUsdtType
        ? LANG(
            '您当前的操作将对「所有子钱包」一键平仓，将会撤销U本位下所有子钱包下的挂单，并以市价委托方式平掉U本位下所有子钱包的仓位。'
          )
        : LANG(
            '您当前的操作将对「所有子钱包」一键平仓，将会撤销币本位下所有子钱包下的挂单，并以市价委托方式平掉币本位下所有子钱包的仓位。'
          )
    });
  };

  return (
    <>
      <div className="list-bar">
        <div>
          <div className={clsx('switch')}>
            <CheckboxItem
              label={LANG('隐藏其他交易对')}
              info=""
              value={hide}
              onChange={value => (store.hide = value)}
            />
            {/* <Switch checked={hide} bgType={2} onChange={(v) => (store.hide = v)} size='small' />
            <span className={clsx()}>{LANG('隐藏其他交易对')}</span> */}
          </div>
          {/* <div className={clsx('switch')}>
            <Switch checked={showAllOrders} bgType={2} onChange={(v) => (store.showAllOrders = v)} size='small' />
            <Tooltip
              title={LANG('当勾选了查看全部仓位时，所有子钱包下的持仓将全部展示；反之，只显示对应子钱包下的仓位')}
            >
              <InfoHover componnet={'span'} className={clsx()}>
                {LANG('查看全部仓位')}
              </InfoHover>
            </Tooltip>
          </div> */}
        </div>
        {pendingMode && !!pending.length && (
          <DropdownSelect
            data={[LANG('全部'), LANG('限价'), LANG('触发条件')]}
            // onChange={(v, i) => this._pendingListRef.current.onCancelAll?.(hide, [3, 1, 2][i])}
            onChange={async (v, i) => {
              if (!Account.isLogin) {
                return;
              }

              if (!pending.length) {
                // 没有委托
                return;
              }
              Loading.start();
              try {
                const result = await Swap.Order.cancelPendingAll(
                  isUsdtType,
                  hide ? quoteId.toLowerCase() : undefined,
                  [3, 1, 2][i]
                );
                if (result.code == 200) {
                  message.success(LANG('撤销全部成功'), 1);
                } else {
                  message.error(result);
                }
              } catch (error: any) {
                message.error(error);
              } finally {
                Loading.end();
              }
            }}
            isActive={() => false}
            trigger={['hover']}
          >
            <div className={clsx('cancel-all')}>{LANG('一键撤销')}</div>
          </DropdownSelect>
        )}
        {positionMode && !!positions.length && (
          <div className={clsx('cancel-all')} onClick={_closeAll}>
            {LANG('一键全平')}
          </div>
        )}
      </div>
      <style jsx>{`
        .list-bar {
          // margin: 19px 0;
          // padding: 0 var(--trade-spacing);
          // height: 25px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 1rem;
          border-bottom: 1px solid var(--fill_line_1);
          > div {
            display: flex;
          }
          .switch {
            display: flex;
            flex-direction: row;
            align-items: center;
            margin-right: 10px;
            height: 1.5rem;
            > :global(span) {
              margin-left: 5px;
              font-size: 12px;
              color: var(--theme-trade-text-color-1);
            }
          }
          .cancel-all {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 4px;
            flex-shrink: 0;
            cursor: pointer;
            width: 5rem;
            height: 1.5rem;
            line-height: 1.5rem;
            // padding: 0 8px;
            border: 1px solid var(--brand);
            border-radius: 1.5rem;
            font-size: 12px;
            color: var(--brand);
            white-space: nowrap;
          }
        }
      `}</style>
    </>
  );
};
