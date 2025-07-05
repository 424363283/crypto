import { LANG } from '@/core/i18n/src/page-lang';
import { clsx } from '@/core/utils/src/clsx';
import css from 'styled-jsx/css';
import YIcon from '@/components/YIcons';
import { MediaInfo } from '@/core/utils';
import { Carousel } from 'antd';
import { useResponsive } from '@/core/hooks';
export default function Advantages() {
  const { isMobile } = useResponsive();
  return (
    <div className={clsx('advantages')}>
      <div className={clsx('advantages-wrap')}>
        <div className={clsx('advantages-title')}>
          <h2>{LANG('为何选择YMEX?')}</h2>
          <p>{LANG('最简单的使用方式，快速进入全球加密市场')}</p>
        </div>
        {isMobile ? (
          <div className={clsx('advantages-list-mb')}>
            <Carousel adaptiveHeight>
              <div className={clsx('advantages-item')}>
                <h5>{LANG('热币最多')}</h5>
                <p>{LANG('热门加密货币最多最全, 200+ 种现货, 150+ 种合约, 高达200倍杠杆, 低投入高回报')}</p>
              </div>

              <div className={clsx('advantages-item')}>
                <h5>{LANG('轻松盈利')}</h5>
                <p>{LANG('一键买币, 一键跟单, 不用费心学习, 自动紧跟专家技巧, 带您提升交易收益')}</p>
              </div>

              <div className={clsx('advantages-item')}>
                <h5>{LANG('优质体验')}</h5>
                <p>{LANG('便捷使用引导, 交易极致丝滑, 手续费业内最低, 优秀客服全天实时在线帮助')}</p>
              </div>

              <div className={clsx('advantages-item')}>
                <h5>{LANG('安全稳健')}</h5>
                <p>{LANG('采用最高安全标准和措施, 领先的加密, 存储, 风控系统确保您资产安全保密')}</p>
              </div>
            </Carousel>
          </div>
        ) : (
          <>
            <div className={clsx('advantages-item long')}>
              <h5>{LANG('热币最多')}</h5>
              <p>{LANG('热门加密货币最多最全, 200+ 种现货, 150+ 种合约, 高达200倍杠杆, 低投入高回报')}</p>
              <div className={clsx('more-symbol')}>
                <YIcon.hotCoin />
              </div>
            </div>
            <div className={clsx('advantages-list')}>
              <div className={clsx('advantages-item')}>
                <h5>{LANG('轻松盈利')}</h5>
                <p>{LANG('一键买币, 一键跟单, 不用费心学习, 自动紧跟专家技巧, 带您提升交易收益')}</p>
              </div>

              <div className={clsx('advantages-item')}>
                <h5>{LANG('优质体验')}</h5>
                <p>{LANG('便捷使用引导, 交易极致丝滑, 手续费业内最低, 优秀客服全天实时在线帮助')}</p>
              </div>

              <div className={clsx('advantages-item')}>
                <h5>{LANG('安全稳健')}</h5>
                <p>{LANG('采用最高安全标准和措施, 领先的加密, 存储, 风控系统确保您资产安全保密')}</p>
              </div>
            </div>
          </>
        )}
      </div>
      <style jsx>{styles}</style>
    </div>
  );
}

const styles = css`
  .advantages {
    padding: 120px 0 20px;
    position: relative;
    @media ${MediaInfo.mobile} {
      padding: 40px 0 20px;
    }
    &-wrap {
      width: 1200px;
      margin: 0 auto;
      @media ${MediaInfo.mobile} {
        width: 100%;
      }
    }
    .advantages-title {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
      @media ${MediaInfo.mobile} {
        padding: 0 24px;
      }
      h2 {
        color: var(--text_1);
        font-size: 32px;
        font-weight: 600;
        @media ${MediaInfo.mobile} {
          font-size: 24px;
        }
      }
      p {
        color: var(--text_3);
        font-size: 14px;
        font-weight: 300;
        text-align: center;
      }
    }
    &-list {
      display: flex;
      align-items: stretch;
      gap: 24px;
      padding: 0 0 80px;
    }
    &-bottom {
      display: flex;
      align-items: center;
      gap: 240px;
      justify-content: center;
      flex-direction: row;
      &-line {
        width: 160px;
        height: 1px;
        border-bottom: 1px dashed var(--fill_line_3);
      }
    }
    .advantages-item {
      display: flex;
      padding: 40px;
      flex-direction: column;
      justify-content: center;
      align-items: flex-start;
      gap: 16px;
      flex: 1 0 0;
      border-radius: 24px;
      margin: 24px 0 0;
      background: var(--fill_bg_3);
      position: relative;
      @media ${MediaInfo.mobile} {
        padding: 40px 24px;
        box-sizing: border-box;
        margin: 0;
      }
      &.long {
        padding: 56px 40px;
        margin: 48px 0 0;
      }
      h5 {
        color: var(--text_1);
        font-size: 24px;
        font-weight: 500;
        @media ${MediaInfo.mobile} {
          font-size: 18px;
          padding: 0 0 16px;
        }
      }
      p {
        color: var(--text_3);
        font-size: 14px;
        font-weight: 400;
      }
      .more-symbol {
        position: absolute;
        right: 40px;
        width: 96px;
        transform: translateY(-50%);
        top: 50%;
      }
    }
    .advantages-list-mb {
      margin: 24px;
      :global(.ant-carousel) {
        :global(.slick-track) {
          display: flex;
        }
        :global(.slick-slide) {
          height: auto;
          background: var(--fill_bg_3);
          border-radius: 24px;
        }
        :global(.slick-dots-bottom) {
          bottom: -18px;
        }
        :global(.slick-dots) {
          :global(li) {
            border-radius: 4px;
            background: var(--fill_3);
            width: 16px;
            height: 4px;
            transition: none;
            &::after {
              background: var(--brand);
            }
            :global(button) {
              background: var(--fill_3);
            }
          }
          :global(.slick-active) {
            background: var(--brand);
            :global(button) {
              background: transparent;
            }
          }
        }
      }
    }
  }
`;
