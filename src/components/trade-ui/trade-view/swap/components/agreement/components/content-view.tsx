import { Button } from '@/components/button';
import CommonIcon from '@/components/common-icon';
import { DesktopOrTablet } from '@/components/responsive';
import { useResponsive, useTheme } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { clsx } from '@/core/utils';

// <div className={'title'}>{LANG('开通合约账户')}</div>
export const ContentView = ({ title = LANG('开通合约账户'), onArgee }: { title?: string, onArgee: any }) => {
  const { isMobile } = useResponsive();
  const { isDark } = useTheme();
  return (
    <>
      <div className={clsx('agreement', !isDark && 'light')}>
        {title && <DesktopOrTablet>
          <div className={'title'}>{title}</div>
        </DesktopOrTablet>}
        <div className={'info-title'}>
          <CommonIcon size={24} className='icon' name='common-question-outline-0' />
          {LANG('重要提示')}：
        </div>
        <div className={'info-content'}>
          {LANG(
            '合约交易属于高风险交易行为，在带来更多潜在利润的同时，也蕴含巨大风险。请注意，当市场出现剧烈波动时，您合约钱包中的余额有可能全部亏损。来自部分地区的用户无法使用合约交易。'
          )}
        </div>
        <DesktopOrTablet>
          <Button className='submit' type='primary' rounded style={{width: '100%'}} onClick={onArgee}>{LANG('立即开户')}</Button>
        </DesktopOrTablet>
      </div>
      <style jsx>{`
        .agreement {
          display: flex;
          padding: 16px;
          flex-direction: column;
          align-items: flex-start;
          gap: 24px;
          .title {
            color: var(--text_1);
            font-size: 24px;
            font-style: normal;
            font-weight: 500;
            line-height: normal;
          }
          .info-title {
            display: flex;
            align-items: center;
            gap: 4px;
            align-self: stretch;
            color: var(--yellow);
            font-size: 16px;
            font-style: normal;
            font-weight: 500;
            line-height: normal;
          }
          .info-content {
            color: var(--text_2);
            font-size: 14px;
            font-style: normal;
            font-weight: 400;
            line-height: 24px;
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
