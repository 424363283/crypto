import { Loading } from '@/components/loading';
import { Svg } from '@/components/svg';
import {
  getSwapSetUserWarnOpenApi,
  postSwapSetUserWarnAddLpNotifyApi,
  postSwapSetUserWarnAddMarginNotifyApi,
} from '@/core/api';
import { useRouter } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { Account, Swap, UserInfo } from '@/core/shared';
import { useAppContext } from '@/core/store';
import { clsx, message } from '@/core/utils';
import { useEffect, useState } from 'react';
import { RateItem } from './components/rate-item';
import { SettingItem } from './components/setting-item';

export const NotificationsSettings = () => {
  const [visible, setVisible] = useState(false);
  const router = useRouter();
  const { isLogin } = useAppContext();
  const { addMarginWarn, fundRateVal, fundRateWarn, lpWarn, slTpWarn, warn1 } = Swap.Info.store.notificationSetting;
  const [user, setUser] = useState<UserInfo | null>(null);
  useEffect(() => {
    (async () => {
      const users = await Account.getUserInfo();
      setUser(users);
    })();
  }, []);

  const _onChange = async (_data: any) => {
    if (!isLogin) {
      router.push('/login');
      return;
    }
    Loading.start();
    const data = { slTpWarn, fundRateVal, fundRateWarn, ..._data };
    try {
      let result;

      if ([_data.slTpWarn, _data.fundRateVal, _data.fundRateWarn].some((v) => v !== undefined)) {
        result = await Swap.Info.setNotificationSetting({
          fundRate: data.fundRateWarn === 1,
          fundRateValue: data.fundRateVal,
          slTp: data.slTpWarn === 1,
          type: _data.slTpWarn !== undefined ? 1 : 2,
        });
      } else if (_data.warn1 !== undefined) {
        result = await getSwapSetUserWarnOpenApi({ open: data.warn1 === 1, type: 3 });
      } else if (_data.addMarginWarn !== undefined) {
        result = await postSwapSetUserWarnAddMarginNotifyApi({ type: data.addMarginWarn });
      } else if (_data.lpWarn !== undefined) {
        result = await postSwapSetUserWarnAddLpNotifyApi({ type: data.lpWarn });
      }
      if (result?.code !== 200) {
        return message.error(result);
      } else {
        Swap.Info.store.notificationSetting = { ...Swap.Info.store.notificationSetting, ...data };
      }
    } catch (e: any) {
      message.error(e);
    } finally {
      Loading.end();
    }
  };

  return (
    <>
      <div className={clsx('setting', visible && 'visible')}>
        <SettingItem
          onClick={() => setVisible((v) => !v)}
          border={visible}
          title={LANG('通知设置')}
          className={'my-title-item'}
          titleClassName={'my-title'}
          info={LANG('开启以下通知开关后，您将通过邮箱、站内信、APP推送收到通知。')}
          right={
            <Svg
              className={clsx('my-icon', visible && 'reverse')}
              src='/static/images/common/arrow-right.svg'
              width={12}
            />
          }
        />
        {visible && (
          <>
            <SettingItem
              title={LANG('止盈止损触发通知')}
              info={LANG('每位用户每日上限发送25条；委托类型包括限价止盈/止损、市价止盈/止损、追踪委托五种。')}
              value={slTpWarn === 1}
              onChange={(v: any) => _onChange({ slTpWarn: v ? 1 : 0 })}
            />
            <SettingItem
              title={LANG('限价委托成交通知')}
              info={LANG('{APP_NAME}会在限价委托单成交是发送通知', { APP_NAME: process.env.NEXT_PUBLIC_APP_NAME })}
              value={warn1 === 1}
              onChange={(v: any) => _onChange({ warn1: v ? 1 : 0 })}
            />
            <SettingItem
              title={LANG('资金费用触发通知')}
              info={
                LANG('{APP_NAME}会在支付的资金费率 触及时通知您。', { APP_NAME: process.env.NEXT_PUBLIC_APP_NAME }) +
                ` ${`${fundRateVal}`.mul(100)}%`
              }
              value={fundRateWarn === 1}
              onChange={(v: any) => _onChange({ fundRateWarn: v ? 1 : 0, fundRateVal })}
            >
              {fundRateWarn === 1 && (
                <RateItem
                  value={`${`${fundRateVal}`.mul(100)}`}
                  onDone={(v: any) => _onChange({ fundRateVal: `${v}`.div(100) })}
                />
              )}
            </SettingItem>
            <SettingItem
              title={LANG('追加保证金通知')}
              info={LANG('{APP_NAME}会在您持仓仓位的触发强平 前通知您，便于您及时追加仓位保证金，避免仓位被强平。', {
                APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
              })}
              value={addMarginWarn === 1}
              onChange={(v: any) => _onChange({ addMarginWarn: v ? 1 : 0 })}
            />
            <SettingItem
              title={LANG('仓位触发强平通知')}
              info={LANG('{APP_NAME}会您持仓仓位的触发强平前通知您。', { APP_NAME: process.env.NEXT_PUBLIC_APP_NAME })}
              value={lpWarn === 1}
              onChange={(v: any) => _onChange({ lpWarn: v ? 1 : 0 })}
            />
          </>
        )}
      </div>
      <style jsx>{`
        .setting {
          border-top: 1px solid var(--theme-trade-border-color-1);
          border-bottom: 1px solid var(--theme-trade-border-color-1);
          padding-top: 10px;
          margin-top: 10px;
          &.visible {
            padding-bottom: 10px;
            :global(.my-title-item) {
              margin-bottom: 20px;
            }
          }
          :global(.my-title-item) {
            margin-bottom: 10px;
          }
          :global(.my-title) {
            font-size: 12px !important;
            font-weight: 500;
          }
          :global(.my-icon) {
            transition: 0.1s all;
            transform: rotate(90deg);
          }
          :global(.reverse) {
            transform: rotate(270deg);
          }
        }
      `}</style>
    </>
  );
};
