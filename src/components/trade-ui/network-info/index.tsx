import Image from '@/components/image';
import { Svg } from '@/components/svg';
import { useZendeskLink } from '@/components/zendesk';
import { useResponsive, useTheme } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { LOCAL_KEY, resso, useResso } from '@/core/store';
import { clsx } from '@/core/utils';
import dynamic from 'next/dynamic';
import { ActionsMenus } from './components/actions-menus';
import { InfoDetail, useNetwork } from './components/info-detail';
import { Menu } from './components/menu';
import { TgDetail } from './components/tg-detail';

const MyMarquee = dynamic(() => import('./components/marquee'), { ssr: false, loading: () => <div /> });
const ScrollStatus = dynamic(() => import('./components/scroll-status'), { ssr: false, loading: () => <div /> });

const _store = resso(
  {
    newest: true,
    actionIndex: 2,
  },
  {
    nameSpace: LOCAL_KEY.TRADE_UI_NETWORK_INFO,
  }
);
export const NetworkInfo = () => {
  const { onLine, wsOnline } = useNetwork();
  const { isDesktop } = useResponsive();
  const { isDark } = useTheme();
  const online = onLine && wsOnline;
  const store = useResso(_store);
  const setActionIndex = (v: number) => {
    store.actionIndex = v;
  };
  const { actionIndex } = store;
  return (
    <>
      <div className='network-info'>
        <div className='left'>
          <InfoDetail>
            <div className='info-detail'>
              <Svg
                width={12}
                src={
                  online
                    ? '/static/images/trade/network/network_full.svg'
                    : '/static/images/trade/network/network_empty.svg'
                }
              />
              <div className={clsx('info', online && 'online')}>{online ? LANG('网络稳定') : LANG('网络断开')}</div>
            </div>
          </InfoDetail>
          <ActionsMenus value={actionIndex} onChange={(v) => setActionIndex(v)}>
            <div className='setting'>
              <Image src='/static/images/network-info/setting.png' width={10.5} height={10.5} />
            </div>
          </ActionsMenus>
        </div>
        <div className='right'>
          <MyMarquee actionIndex={actionIndex} />
          {actionIndex == 1 && isDesktop && <ScrollStatus />}
          <div className='right-menus'>
            <Menu
              newest={store.newest}
              onClick={() => {
                if (store.newest) {
                  store.newest = false;
                }
              }}
              icon={[
                isDark
                  ? '/static/images/trade/network/menus/func.svg'
                  : '/static/images/trade/network/menus/func_light.svg',
                '/static/images/trade/network/menus/func_active.svg',
              ]}
              label={LANG('功能更新')}
              href={useZendeskLink('/categories/11310192831119')}
            />
            <TgDetail>
              <div>
                <Menu
                  icon={[
                    isDark
                      ? '/static/images/trade/network/menus/media.svg'
                      : '/static/images/trade/network/menus/media_light.svg',
                    '/static/images/trade/network/menus/media_active.svg',
                  ]}
                  label={LANG('媒体社群')}
                />
              </div>
            </TgDetail>
            <Menu
              icon={[
                isDark
                  ? '/static/images/trade/network/menus/feedback.svg'
                  : '/static/images/trade/network/menus/feedback_light.svg',
                '/static/images/trade/network/menus/feedback_active.svg',
              ]}
              label={LANG('公告中心')}
              href={useZendeskLink('/categories/11310192831119')}
            />
            <Menu
              last
              icon={[
                isDark
                  ? '/static/images/trade/network/menus/help.svg'
                  : '/static/images/trade/network/menus/help_light.svg',
                '/static/images/trade/network/menus/help_active.svg',
              ]}
              label={LANG('在线客服')}
              onClick={() => {
                if (window.zE) {
                  window.zE('messenger', 'show');
                  window.zE('messenger', 'open');
                  window.zE('messenger:on', 'close', () => {
                    window.zE('messenger', 'hide');
                  });
                }
              }}
            />
          </div>
        </div>
      </div>
      <style jsx>{`
        .network-info {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-items: center;
          height: 100%;
          background: var(--fill_bg_1);
          .left {
            display: flex;
            flex-direction: row;
            align-items: center;
            .setting {
              cursor: pointer;
              height: 100%;
              padding: 0 10px;
            }
          }
          .info-detail {
            height: 100%;
            padding-left: 14px;
            padding-right: 10px;
            border-right: 1px solid var(--theme-border-color-2);
            flex: none;
            cursor: pointer;
            display: flex;
            flex-direction: row;
            align-items: center;
            .info {
              margin-left: 4px;
              font-size: 12px;
              color: var(--const-color-error);
              &.online {
                color: #43bc9c;
              }
            }
          }
          .right {
            height: 100%;
            flex: 1;
            display: flex;
            flex-direction: row;
            justify-content: flex-end;
            align-items: center;
            overflow: hidden;

            .right-menus {
              display: flex;
              flex-direction: row;
              align-items: center;
              border-left: 1px solid var(--theme-border-color-2);
            }

            :global(> *) {
              flex: none;
              &:last-child {
                margin-right: 0;
              }
            }
          }
        }
      `}</style>
    </>
  );
};
export default NetworkInfo;
