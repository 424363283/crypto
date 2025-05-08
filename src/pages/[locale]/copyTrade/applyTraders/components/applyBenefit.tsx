import css from 'styled-jsx/css';
import Image from '@/components/image';
import { MediaInfo } from '@/core/utils';
import { useResponsive } from '@/core/hooks';
import { LANG } from '@/core/i18n';
export default function ApplyBenefit() {
  const { isMobile } = useResponsive()
  const benefitList = [
    [
      {
        title: LANG('海量合约粉丝'),
        url: '/static/images/copy/apply-fans.svg',
        tips: [
          {
            label: LANG('全球前 10 跟单平台'),
            value: 'top'
          },
          {
            label: LANG('百万合约用户'),
            value: 'milla'
          }
        ]
      }
    ],
    [
      {
        title: LANG('全球海量曝光'),
        url: '/static/images/copy/apply-global.svg',
        tips: [
          {
            label: LANG('每日平台精准宣发'),
            value: 'day'
          },
          {
            label: LANG('平台官方认证和流量曝光'),
            value: 'platform'
          }
        ]
      },
      {
        title: LANG('专属客服'),
        url: '/static/images/copy/apply-service.svg',
        tips: [
          {
            label: LANG('享有专属客服通道'),
            value: 'channel'
          },
          {
            label: LANG('7*24小时服务'),
            value: 'service'
          }
        ]
      }
    ],
    [
      {
        title: LANG('高额奖励'),
        url: '/static/images/copy/apply-rewards.svg',
        tips: [
          {
            label: LANG('最高享有20%分润'),
            value: 'reward'
          }
        ]
      },
      {
        title: LANG('全球影响力'),
        url: '/static/images/copy/apply-impact.svg',
        tips: [
          {
            label: LANG('链接百万跟单用户，构建个人影响力'),
            value: 'global'
          }
        ]
      },
      {
        title: LANG('资源扶持'),
        url: '/static/images/copy/apply-support.svg',
        tips: [
          {
            label: LANG('跟单用户丰富活动，持续运营粉丝用户'),
            value: 'support'
          }
        ]
      }
    ]
  ];

  return (
    <div className="benefit-box">
      <div className="benefit-title">{LANG('带单员权益')}</div>
      <div className="benefit-content">
        {benefitList.map((item, idx) => {
          return (
            <div key={idx} className="benefit-item">
              {item.map((benefit,idx) => {
                return (
                  <div key={`benefit-${idx}`} className={`benefit-apply ${item.length > 2 || isMobile ? 'flexSpace' : 'flexEnd'}`}>
                    <div>
                      <div className="benefit-apply-title">{benefit.title}</div>
                      <div className="benefit-tips">
                        {benefit.tips.map(tip => {
                          return (
                            <div className="benefit-tips-item" key={tip.value}>
                              <span className="dots"></span>
                              <span>{tip.label}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    <div className="benefit-right">
                      <Image
                        src={benefit.url}
                        width={!isMobile && item.length === 1 ? 160 : 80}
                        height={!isMobile && item.length === 1 ? 116 : 80}
                        alt=""
                      ></Image>
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
      <style jsx>{styles}</style>
    </div>
  );
}
const styles = css`
  .benefit-box {
    width: 1200px;
    margin: 80px auto;
    @media ${MediaInfo.mobile} {
      margin: 40px auto;
      width: 100%;
    }
    .benefit-title {
      font-family: HarmonyOS Sans SC;
      font-weight: 700;
      font-size: 40px;
      line-height: 46.88px;
      text-align: center;
      color: var(--text_1);
      @media ${MediaInfo.mobile} {
        font-size: 32px;
      }
    }
    .benefit-content {
      margin-top: 48px;
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      grid-gap: 24px;
      @media ${MediaInfo.mobile} {
        grid-template-columns: repeat(1, 1fr);
        margin: 24px 24px;

      }
    }
    .benefit-item {
      gap: 24px;
      display: flex;
      flex: 1;
      flex-direction: column;
    }
    .benefit-apply {
      border: 1px solid var(--fill_line_2);
      padding: 40px 24px;
      border-radius: 24px;
      flex: 1;
      &.flexSpace {
        display: flex;
        justify-content: space-between;
      }
      &.flexEnd {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
      }
      .benefit-apply-title {
        font-family: HarmonyOS Sans SC;
        font-weight: 500;
        font-size: 24px;
        line-height: 36px;
        color: var(--text_1);
      }
    }
    .benefit-tips {
      font-family: HarmonyOS Sans SC;
      font-weight: 500;
      font-size: 16px;
      line-height: 24px;
      color: var(--text_2);
      margin-top: 24px;
      border: 1px solide var(--fill_line_2);
    }
    .benefit-tips-item {
      gap: 8px;
      .dots {
        border-radius: 0.75px;
        width: 6px;
        height: 6px;
        transform: rotate(45deg);
        background: var(--text_2);
        display: inline-block;
        margin-right: 6px;
      }
    }
    .benefit-right {
      text-align: right;
    }
  }
`;
