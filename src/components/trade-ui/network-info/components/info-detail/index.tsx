import Tooltip from '@/components/trade-ui/common/tooltip';
import { LANG } from '@/core/i18n';
import { clsxWithScope } from '@/core/utils';
import { isSwapDemo } from '@/core/utils/src/is';
import { useNetWorkInfo } from '@/core/utils/src/network-info';
import { useRouter } from 'next/router';
import css from 'styled-jsx/css';

export const useNetwork = () => {
  const router = useRouter();
  const info = useNetWorkInfo();
  const isSwap = (!isSwapDemo() ? /\/swap(\/|\?)/ : /\/swap\/demo(\/|\?)/).test(router.asPath);
  const wsOnline = (isSwap ? info?.wsSwapOnLine && info?.wsSwapMessagerOnLine : info?.wsSpotOnLine) === true;
  const onLine = info?.onLine === true;
  return { wsOnline, onLine };
};
export const InfoDetail = ({ children }: { children: any }) => {
  const { wsOnline, onLine } = useNetwork();

  return (
    <>
      <Tooltip
        className={clsx('info-detail-tooltip')}
        placement='topLeft'
        title={
          <div className={clsx('info-detail')}>
            <div>
              <span>{LANG('网络状态')}</span>
              <span>{onLine ? LANG('在线') : LANG('断线')}</span>
            </div>
            <div>
              <span>{LANG('网络服务器连接')}</span>
              <span>{wsOnline ? LANG('在线') : LANG('断线')}</span>
            </div>
            {!wsOnline && (
              <div>
                <span>{LANG('网络服务器连接断开,请及时刷新页面。')}</span>
              </div>
            )}
          </div>
        }
      >
        {children}
      </Tooltip>
      {styles}
    </>
  );
};

const { className, styles } = css.resolve`
  .info-detail {
    :global(> div) {
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;
      &:last-child {
        margin-bottom: 0;
      }
      :global(> span) {
        font-size: 12px;
      }
    }
  }
  .info-detail-tooltip {
    :global(.ant-tooltip-inner) {
      min-width: 289px;
    }
  }
`;

const clsx = clsxWithScope(className);
