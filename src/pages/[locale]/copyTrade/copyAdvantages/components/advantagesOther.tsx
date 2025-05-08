import css from 'styled-jsx/css';
import Image from '@/components/image';
import { MediaInfo } from '@/core/utils';
import { LANG } from '@/core/i18n';
export default function advantagesOther() {
  const otherList = [
    {
      url: '/static/images/copy/advantages-low.svg',
      title: LANG('低门槛'),
      subTitle: LANG('无需了解复杂的交易知识，紧随专业交易员操作，交易自动执行')
    },
    {
      url: '/static/images/copy/advantages-hight.svg',
      title: LANG('高收益'),
      subTitle: LANG('专业策略极大提升交易收益，实现资产稳步增值')
    },
    {
      url: '/static/images/copy/advantages-more.svg',
      title: LANG('多策略'),
      subTitle: LANG('集结全球KOL，拥有各类交易策略和更多选择')
    }
  ];

  return (
    <div className="other-advantages">
      <div className="other-advantages-box">
        <div className="other-advantages-content">
          {otherList.map((other, idx) => {
            return (
              <div className="other-advantages-item" key={idx}>
                <Image src={other.url} width={64} height={64} alt=""></Image>
                <p className="other-advantages-title">{other.title}</p>
                <p className="other-advantages-subTitle">{other.subTitle}</p>
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
  .other-advantages {
    background: var(--fill_3);
  }
  .other-advantages-box {
    width: 1200px;
    margin: 0 auto;
    padding: 80px 0;
    @media ${MediaInfo.mobile} {
      width: 100%;
      padding: 0;
    }
    .other-advantages-title {
      font-family: HarmonyOS Sans SC;
      font-weight: 700;
      font-size: 40px;
      line-height: 46.88px;
      color: var(--text_1);
    }
    .other-advantages-content {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      grid-column-gap: 120px;
      @media ${MediaInfo.mobile} {
        grid-template-columns: repeat(1, 1fr);
        padding: 40px 24px;
        grid-row-gap: 40px;
      }
    }
    .other-advantages-item {
      padding: 40px 0;
      font-family: HarmonyOS Sans SC;
      font-weight: 700;
      font-size: 24px;
      line-height: 28.13px;
      @media ${MediaInfo.mobile} {
        padding: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
      }
      .other-advantages-title {
        margin: 16px 0;
      }
      .other-advantages-subTitle {
        font-family: HarmonyOS Sans SC;
        font-weight: 400;
        font-size: 16px;
        line-height: 24px;
        color: var(--text_3);
      }
    }
  }
`;
