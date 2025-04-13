import { LANG } from '@/core/i18n/src/page-lang';
import { clsx } from '@/core/utils/src/clsx';
import css from 'styled-jsx/css';
import YIcon from '@/components/YIcons';
import { MediaInfo } from '@/core/utils';

export default function NewGuide() {
  return (
    <div className={clsx('new-guide')}>
      <div className={clsx('new-guide-wrap')}>
        <div className={clsx('new-guide-title')}>
          <h2>{LANG('新手指南')}</h2>
          <p>{LANG('最简单的使用方法, 快速进入全球加密市场')}</p>
        </div>
        <div className={clsx('new-guide-list')}>
          <div className={clsx('guide-item')}>
            <YIcon.guideIcon1 />
            <h5>{LANG('注册账号')}</h5>
            <p>{LANG('免费注册, 完成新手任务, 领取高达8,888美元新用户礼金')}</p>
          </div>

          <div className={clsx('guide-item')}>
            <YIcon.guideIcon2 />
            <h5>{LANG('买币充币')}</h5>
            <p>{LANG('用多种支付方式安全便捷地购买加密货币, 也可链上充币')}</p>
          </div>

          <div className={clsx('guide-item')}>
            <YIcon.guideIcon3 />
            <h5>{LANG('交易盈利')}</h5>
            <p>{LANG('低买高卖一键跟单, 无需了解复杂知识, 躺平实现专家级收益')}</p>
          </div>
        </div>
      </div>
      <style jsx>{styles}</style>
    </div>
  );
}

const styles = css`
  .new-guide {
    padding: 80px 0;
    background: var(--fill-2);
    @media ${MediaInfo.mobile} {
      padding: 40px 0;
    }
    &-wrap {
      width: 1200px;
      margin: 0 auto;
      @media ${MediaInfo.mobile} {
        width: 100%;
      }
    }
    &-title {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
      @media ${MediaInfo.mobile} {
        padding: 0 40px;
      }

      h2 {
        color: var(--text-primary);
        font-size: 32px;
        font-weight: 700;
        @media ${MediaInfo.mobile} {
          font-size: 24px;
        }
      }
      p {
        color: var(--text-tertiary);
        font-size: 16px;
        font-weight: 400;
      }
    }
    &-list {
      display: flex;
      align-items: center;
      align-self: stretch;
      padding: 80px 0 0;
      @media ${MediaInfo.mobile} {
        flex-direction: column;
        padding: 40px 0 0;
        gap: 40px;
      }
    }
    .guide-item {
      display: flex;
      flex: 1;
      padding: 0px 40px;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      gap: 16px;
      h5 {
        color: var(--text-primary);
        font-size: 24px;
        font-weight: 700;
        @media ${MediaInfo.mobile} {
          font-size: 18px;
        }
      }
      p {
        color: var(--text-secondary);
        font-size: 14px;
        font-weight: 400;
        line-height: 150%;
        text-align: center;
      }
    }
  }
`;
