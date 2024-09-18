import { linkClassName, linkStyles } from '@/components/link';
import { Loading } from '@/components/loading';
import { DrawerModal } from '@/components/mobile-modal';
import { SwapPositionModeModal } from '@/components/trade-ui/trade-view/swap/components/modal/swap-position-mode-modal';
import { getZendeskLink } from '@/components/zendesk';
import { useResponsive, useRouter } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { Swap } from '@/core/shared';
import { resso, useAppContext } from '@/core/store';
import { message } from '@/core/utils';
import { ReactNode, useMemo } from 'react';
import { InfoItem } from './components/info-item';
import { MySwitch } from './components/my-switch';
import { NotificationsSettings } from './components/notifications-settings';
import { clsx, styles } from './styled';

export const PreferenceMenu = ({
  onlyContent,
}: {
  children?: (o: { visible: boolean }) => ReactNode;
  onlyContent?: boolean;
}) => {
  const store = useMemo(
    () =>
      resso({
        visible: false,
        positionVisible: false,
      }),
    []
  );
  const { isMobile } = useResponsive();
  const { positionVisible } = store;
  const isUsdtType = Swap.Trade.base.isUsdtType;
  const twoWayMode = Swap.Trade.twoWayMode;
  const {
    limit: limitOrderConfirm,
    market: marketOrderConfirm,
    limitSpsl,
    marketSpsl,
    track,
    reverse,
  } = Swap.Info.getOrderConfirm(isUsdtType);
  const router = useRouter();
  const { isLogin } = useAppContext();
  const { lightningOrder, tradeNoticeSound } = Swap.Info.getTradePreference(isUsdtType);
  const isBounsWallet = Swap.Info.getIsBounsWallet(Swap.Info.getWalletId(Swap.Trade.base.isUsdtType));
  const _handlePositionVisible = () => {
    if (!isLogin) {
      router.push('/login');
      return;
    }
    if (!isBounsWallet) {
      if (!isMobile) {
        store.positionVisible = !store.positionVisible;
        if (store.positionVisible) {
          store.visible = false;
        }
      } else {
        store.positionVisible = true;
      }
    }
  };
  const _setPreference = (v: object) => {
    // _handleVisible();
    Swap.Info.setOrderConfirm(isUsdtType, v);
    // message.success(LANG('下单确认调整成功'), 1);
  };
  const content = (
    <div>
      <div className={clsx('content')}>
        <div>
          {isUsdtType && (
            <InfoItem
              label={LANG('仓位模式')}
              value={marketOrderConfirm}
              valueInfo={isBounsWallet ? LANG('体验金子钱包仅支持单向持仓') : null}
              onClick={_handlePositionVisible}
              valueLabel={twoWayMode ? LANG('双向持仓') : LANG('单向持仓')}
            />
          )}

          {/* <InfoItem
            label={LANG('价差保护')}
            info={
              <>
                <span
                  dangerouslySetInnerHTML={{
                    __html: LANG(
                      '开启价差保护功能后，止盈止损达到触发价，如果该合约的最新价格与标记价格价差超过该合约的设定阈值，止盈止损订单将不会被触发，防止价格波动影响您的止盈止损策略，可进入{rule}查看阈值。',
                      {
                        rule: `<a target={'_blank'}  class="${linkClassName} link"  href="${getZendeskLink(
                          '/articles/5692847301007'
                        )}">${LANG('交易规则')}</a>`,
                      }
                    ),
                  }}
                />
                {linkStyles}
              </>
            }
            value={Swap.Info.getPriceProtection(isUsdtType)}
            onChange={async (v: any) => {
              if (!isLogin) {
                router.push('/login');
                return;
              }
              Loading.start();
              try {
                const result = await Swap.Info.updatePriceProtection(isUsdtType, v);
                if (result.code !== 200) {
                  return message.error(result);
                }
              } catch (e) {
                message.error(e);
              } finally {
                Loading.end();
              }
            }}
          /> */}

          <InfoItem
            label={LANG('成交提示音')}
            value={tradeNoticeSound}
            onChange={(v: any) => Swap.Info.setTradePreference(isUsdtType, { tradeNoticeSound: v })}
          />
          <InfoItem
            label={LANG('闪电下单')}
            value={lightningOrder}
            onChange={(v: any) => Swap.Info.setTradePreference(isUsdtType, { lightningOrder: v })}
          />
          {/* <NotificationsSettings /> */}
          <div className={clsx('section-title')}>
            {LANG('下单确认')}
            <MySwitch
              value={limitOrderConfirm || marketOrderConfirm || limitSpsl || marketSpsl || track || reverse}
              onChange={(v: boolean) => {
                _setPreference({ market: v, limit: v, limitSpsl: v, marketSpsl: v, track: v, reverse: v });
              }}
            />
          </div>
          <InfoItem
            label={LANG('市价订单')}
            value={marketOrderConfirm}
            onChange={(v: any) => _setPreference({ market: v })}
          />
          <InfoItem
            label={LANG('限价订单')}
            value={limitOrderConfirm}
            onChange={(v: any) => _setPreference({ limit: v })}
          />
          <InfoItem
            label={LANG('市价止盈止损')}
            value={marketSpsl}
            onChange={(v: any) => _setPreference({ marketSpsl: v })}
          />
          <InfoItem
            label={LANG('限价止盈止损')}
            value={limitSpsl}
            onChange={(v: any) => _setPreference({ limitSpsl: v })}
          />
          {/* <InfoItem label={LANG('追踪出场')} value={track} onChange={(v: any) => _setPreference({ track: v })} /> */}
          {/* <InfoItem
            label={LANG('市价平仓')}
            value={marketCloseAll}
            onChange={(v: any) => _setPreference({ marketCloseAll: v })}
          /> */}
          {/* <InfoItem label={LANG('反向开仓')} value={reverse} onChange={(v: any) => _setPreference({ reverse: v })} /> */}
        </div>
      </div>
      {styles}
      <SwapPositionModeModal visible={positionVisible} onClose={_handlePositionVisible} zIndex={100000} />
    </div>
  );
  const preferenceMenuVisible = Swap.Trade.store.modal.preferenceMenuVisible;
  const title = isUsdtType ? LANG('U本位偏好设置') : LANG('币本位偏好设置');

  if (onlyContent) {
    return content;
  }
  return (
    <>
      <DrawerModal
        title={title}
        open={preferenceMenuVisible}
        onClose={() => Swap.Trade.setModal({ preferenceMenuVisible: false })}
        contentClassName={clsx('drawer-content')}
      >
        {content}
      </DrawerModal>
    </>
  );
};
