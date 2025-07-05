import css from 'styled-jsx/css';
import { MediaInfo } from '@/core/utils';
import { LANG } from '@/core/i18n';
export default function Interests() {
  const interestsList = [
    {
      title: LANG('专业交易员'),
      count: '168,000+'
    },
    {
      title: LANG('跟单用户'),
      count: '900,000+'
    },
    {
      title: LANG('跟单总收益'),
      count: '$240,000,000+'
    }
  ];

  return (
    <div className="interests-box">
      <div className="interests-content">
        {interestsList.map((item, idx) => {
          return (
            <div key={idx} className="interests-item">
              <div className="interests-count">{item.count}</div>
              <div className="interests-title">{item.title}</div>
            </div>
          );
        })}
      </div>
      <style jsx>{styles}</style>
    </div>
  );
}
const styles = css`
  .interests-box {
    width: 1200px;
    margin: 40px auto;
    @media ${MediaInfo.mobile} {
      margin: 40px auto;
      width: 100%;
    }
    .interests-content {
      padding: 40px 0;
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      @media ${MediaInfo.mobile} {
        grid-template-columns: repeat(1, 1fr);
        padding: 0 40px;
      }
      .interests-item {
         font-family: "Lexend";;
        font-weight: 700;
        font-size: 32px;
        line-height: 37.5px;
        color: var(--text_1);
        @media ${MediaInfo.mobile} {
          display: flex;
          align-items: center;
          flex-direction: row-reverse;
          justify-content: flex-end;
          margin-bottom: 40px;
          padding: 0;
          font-size: 24px;
        }
      }
      .interests-title {
        font-weight: 400;
        font-size: 24px;
        line-height: 28.13px;
        color: var(--text_2);
        margin-top: 16px;
        @media ${MediaInfo.mobile} {
          margin-top: 0;
          font-size: 16px;
          margin-right: 16px;
        }
      }
    }
  }
`;
