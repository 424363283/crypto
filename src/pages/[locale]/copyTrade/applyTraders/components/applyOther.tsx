import css from 'styled-jsx/css';
import Image from '@/components/image';
import { MediaInfo } from '@/core/utils';
import { LANG } from '@/core/i18n';
export default function ApplyBenefit() {
  const otherList = [
    {
      url: '/static/images/copy/other-benefit-exposure.svg',
      title: LANG('额外曝光')
    },
    {
      url: '/static/images/copy/other-benefit-community.svg',
      title: LANG('官方社群')
    },
    {
      url: '/static/images/copy/other-benefit-fee.svg',
      title: LANG('手续费减免')
    },
    {
      url: '/static/images/copy/other-benefit-activity.svg',
      title: LANG('线下活动')
    },
    {
      url: '/static/images/copy/other-benefit-present.svg',
      title: LANG('周边礼物')
    },
    {
      url: '/static/images/copy/other-benefit-invite.svg',
      title: LANG('直播邀约')
    }
  ];

  return (
    <div className="other-benefit">
      <div className="other-benefit-box">
        <div className="other-benefit-title">{LANG('其他权益')}</div>
        <div className="other-benefit-content">
          {otherList.map((other, idx) => {
            return (
              <div className="other-benefit-item" key={idx}>
                <Image src={other.url} width={64} height={64} alt=""></Image>
                <span>{other.title}</span>
              </div>
            );
          })}
        </div>
      </div>
      <style jsx>{styles}</style>
    </div>
  );
}
const styles = css`
  .other-benefit {
    background: var(--fill_3);
  }
  .other-benefit-box {
    width: 1200px;
    margin: 0 auto;
    padding: 80px 0;
    @media ${MediaInfo.mobile} {
      width: 100%;
      padding: 20px 0;
    }
    .other-benefit-title {
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
    .other-benefit-content {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      grid-template-rows: repeat(2, 1fr);
      grid-column-gap: 24px;
      grid-row-gap: 24px;
      font-family: HarmonyOS Sans SC;
      font-weight: 700;
      font-size: 24px;
      color: var(--text_1);
      @media ${MediaInfo.mobile} {
        grid-template-columns: repeat(2, 1fr);
        grid-template-rows: repeat(3, 1fr);
        font-size: 16px;
      }
    }
    .other-benefit-item {
      padding: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 16px;
      @media ${MediaInfo.mobile} {
        padding: 0;
      }
    }
  }
`;
