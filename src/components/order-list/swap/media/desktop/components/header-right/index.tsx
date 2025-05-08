import { Loading } from '@/components/loading';
import { AlertFunction } from '@/components/modal/alert-function';
import Radio from '@/components/Radio';
import { Switch } from '@/components/switch';
import { DropdownSelect } from '@/components/trade-ui/common/dropdown';
import { InfoHover } from '@/components/trade-ui/common/info-hover';
import Tooltip from '@/components/trade-ui/common/tooltip';
import { SubButton } from '@/components/trade-ui/trade-view/components/button';
import { useTheme } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { Account, Swap } from '@/core/shared';
import { clsxWithScope, message } from '@/core/utils';
import { isSwapDemo } from '@/core/utils/src/is';
import { useLocation } from 'react-use';
import css from 'styled-jsx/css';

export const HeaderRight = ({
  positions,
  pending,
  tabIndex,
  hide,
  onChangeHide,
  showAllOrders,
  onChangeShowAllOrders,
}: {
  positions: any;
  pending: any;
  tabIndex: number;
  hide: boolean;
  showAllOrders: boolean;
  onChangeHide: (hide: boolean) => any;
  onChangeShowAllOrders: (hide: boolean) => any;
}) => {
  const { isUsdtType, quoteId } = Swap.Trade.base;
  const walletId = Swap.Info.getWalletId(isUsdtType);
  const { theme } = useTheme();
  let cancelAll = null;
  let closeAll = null;

  const isDemo = isSwapDemo(useLocation().pathname);
  const _closeAll = () => {
    const usdtWalletInfo = showAllOrders
      ? LANG(
        '您当前的操作将对「所有子钱包」一键平仓，将会撤销U本位下所有子钱包下的挂单，并以市价委托方式平掉U本位下所有子钱包的仓位。'
      )
      : LANG(
        '您当前的操作将对「当前子钱包」一键平仓，将会撤销U本位下所有子钱包下的挂单，并以市价委托方式平掉U本位下所有子钱包的仓位。'
      );
    const coinWalletInfo = showAllOrders
      ? LANG(
        '您当前的操作将对「所有子钱包」一键平仓，将会撤销币本位下所有子钱包下的挂单，并以市价委托方式平掉币本位下所有子钱包的仓位。'
      )
      : LANG(
        '您当前的操作将对「当前子钱包」一键平仓，将会撤销币本位下所有子钱包下的挂单，并以市价委托方式平掉币本位下所有子钱包的仓位。'
      );

    AlertFunction({
      v4: true,
      title: LANG('一键全平'),
      width: 480,
      onOk: async () => {
        Loading.start();
        try {
          const result = await Swap.Order.closePositionAll(
            isUsdtType,
            hide ? quoteId.toLowerCase() : undefined,
            showAllOrders ? undefined : walletId
          );
          if (result.code != 200) {
            message.error(result);
          }
        } catch (error: any) {
          message.error(error);
        } finally {
          Loading.end();
        }
      },
      content: isUsdtType ? usdtWalletInfo : coinWalletInfo,
      theme,
    });
  };

  let hideSwitch = (
    <div className={clsx('header-action')}>

      <Radio
        label={LANG(hide ? '展示其他交易对' : '隐藏其他交易对')}
        checked={hide}
        onChange={checked => onChangeHide(checked)}
      />

      {/* <Switch
        aria-label={LANG('隐藏其他交易对')}
        checked={hide}
        bgType={2}
        onChange={(hide) => onChangeHide(hide)}
        size='small'
      />
      <span className={clsx()}>{LANG('隐藏其他交易对')}</span> */}
    </div>
  );
  let showAllOrdersSwitch = (
    <div className={clsx('header-action')}>
      <Switch
        aria-label={LANG('查看全部仓位')}
        checked={showAllOrders}
        bgType={2}
        onChange={(showAllOrders) => onChangeShowAllOrders(showAllOrders)}
        size='small'
      />
      <Tooltip title={LANG('当勾选了查看全部仓位时，所有子钱包下的持仓将全部展示；反之，只显示对应子钱包下的仓位')}>
        <InfoHover componnet={'span'} className={clsx()}>
          {LANG('查看全部仓位')}
        </InfoHover>
      </Tooltip>
    </div>
  );

  if (tabIndex === 1 && pending.length) {
    cancelAll = (
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
              [3, 1, 2][i],
              showAllOrders ? undefined : walletId
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
        <SubButton className={clsx('cancel-all')}>{LANG('一键撤销')}</SubButton>
      </DropdownSelect>
    );
  }
  if (tabIndex === 0 && positions.length) {
    closeAll = (
      <SubButton className={clsx('cancel-all')} onClick={_closeAll}>
        {LANG('一键全平')}
      </SubButton>
    );
  }
  return (
    <>
      <div className={clsx('right-part')}>
        {tabIndex <= 1 && (
          <>
            {/* {!isDemo && showAllOrdersSwitch} */}
            {hideSwitch}
          </>
        )}
        {cancelAll}
        {closeAll}
      </div>
      {styles}
    </>
  );
};
const { className, styles } = css.resolve`
  .right-part {
    display: flex;
    flex-direction: row;
    align-items: center;
    .header-action {
      display: flex;
      align-items: center;
      span {
        margin-left: 5px;
        font-weight: 400;
        font-size: 12px;
        color: var(--theme-trade-text-color-2);
      }
    }
    .cancel-all {
      cursor: pointer;
      display: flex;
      height: 24px;
      justify-content: center;
      align-items: center;
      border-radius: 24px;
      background: var(--text_brand);
      color: var(--text_white);
      font-size: 12px;
      font-weight: 400;
      margin:0 0 0 24px;
    }
  }
`;

const clsx = clsxWithScope(className);

export default HeaderRight;
