import CommonIcon from '@/components/common-icon';
import { DesktopOrTablet } from '@/components/responsive';
import { useResponsive, useTheme } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { clsx } from '@/core/utils';

export const ContentView = ({ onArgee }: { onArgee: any }) => {
  const { isMobile } = useResponsive();
  const { isDark } = useTheme();
  return (
    <>
      <div className={clsx('agreement', !isDark && 'light')}>
        <DesktopOrTablet>
          <div className={'title'}>{LANG('开通合约账户')}</div>
        </DesktopOrTablet>
        <div className={'info-title'}>
          <CommonIcon size={16} className='icon' name='common-question-outline-0' />
          {LANG('重要提示')}：
        </div>
        <div className={'info-content'}>
          {LANG(
            '合约交易属于高风险交易行为，在带来更多潜在利润的同时，也蕴含巨大风险。请注意，当市场出现剧烈波动时，您合约钱包中的余额有可能全部亏损。来自部分地区的用户无法使用合约交易。'
          )}
        </div>
        <DesktopOrTablet>
          <div className={clsx('button', 'pc-v2-btn')} onClick={onArgee}>
            {LANG('立即开户')}
          </div>
        </DesktopOrTablet>
      </div>
      <style jsx>{`
        .agreement {
          padding: 26px 15px ${!isMobile ? '100px' : '0'};
          .title {
            font-size: 20px;
            font-weight: 500;
            color: var(--theme-trade-text-color-1);
            margin-bottom: 30px;
          }
          .info-title {
            display: flex;
            flex-direction: row;
            align-items: center;
            margin-bottom: 15px;
            font-size: 16px;
            font-weight: 400;
            color: #798296;
            :global(.icon) {
              width: 16px;
              height: 16px;
              margin-right: 7px;
            }
          }
          .info-content {
            font-size: 16px;
            font-weight: 400;
            color: #798296;
            line-height: 24px;
            margin-bottom: 50px;
          }
          .button {
            cursor: pointer;
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
            margin: 0 3px;
            height: 42px;
            background: var(--skin-primary-color);
            border-radius: 3px;
            font-size: 14px;
            font-weight: 400;
            color: #1a202e;
          }
        }
        .loading-view {
          position: relative;

          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
        }
      `}</style>
    </>
  );
};
