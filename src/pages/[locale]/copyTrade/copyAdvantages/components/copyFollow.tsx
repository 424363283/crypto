import { Button } from '@/components/button';
import css from 'styled-jsx/css';
import Image from '@/components/image';
import { MediaInfo } from '@/core/utils';
import { useResponsive } from '@/core/hooks';
import { LANG, TrLink } from '@/core/i18n';
export default function Header() {
  const { isMobile } = useResponsive();
  const FollowBtn = () => {
    return (
      <Button type="primary" rounded width={isMobile ? '100%' : 200}>
        <TrLink href={'/copyTrade'}>{LANG('一键跟单')}</TrLink>
      </Button>
    );
  };
  return (
    <div className="copy-follow-box">
      <div className="copy-follow-content">
        <div className="copy-follow-left">
          <p>{LANG('一键跟单，长久受益')}</p>
          <p className="copy-follow-tip">{LANG('汇聚全球顶级合约交易员，自动跟随专业交易员操作')}</p>
          {!isMobile && <FollowBtn />}
        </div>
        <div className="copy-follow-right">
          <Image src="/static/images/copy/follow-income.svg" width={320} height={320} alt=""></Image>
        </div>
        {isMobile && <FollowBtn />}
      </div>
      <style jsx>{styles}</style>
    </div>
  );
}

const styles = css`
  .copy-follow-box {
    width: 1200px;
    margin: 0 auto;
    padding: 80px 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    @media ${MediaInfo.mobile} {
      width: 100%;
      flex-direction: column;
      padding: 40px 0;
    }
    .copy-follow-content {
      display: flex;
      justify-content: space-between;
      flex: 1;
      @media ${MediaInfo.mobile} {
        padding: 0 24px;
        flex-direction: column;
        margin-bottom: 80px;
      }
    }
    .copy-follow-left {
      font-family: HarmonyOS Sans SC;
      font-weight: 700;
      font-size: 48px;
      line-height: 56.26px;
      color:var(--text_1);
      @media ${MediaInfo.mobile} {
        font-size: 32px;
      }
      .copy-follow-tip {
        font-weight: 500;
        font-size: 32px;
        line-height: 37.5px;
        margin: 24px 0 40px 0;
        @media ${MediaInfo.mobile} {
          font-size: 16px;
        }
      }
    }
    .copy-follow-right {
      @media ${MediaInfo.mobile} {
        margin-top: 24px;
        text-align: center;
      }
    }
  }
`;
