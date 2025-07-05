import { UniversalLayout } from "@/components/layouts/login/universal";
import { useRouter } from "@/core/hooks";
import { LANG, TrLink } from "@/core/i18n";
import { MediaInfo } from '@/core/utils';
import { clsx } from "@/core/utils";
import Image from "next/image";
import css from "styled-jsx/css";
import { SwapDemoHeader } from "../header/components/swap-demo-header";
import { useResponsive } from '@/core/hooks';
import CommonIcon from '@/components/common-icon';
const PageContent = ({
  className,
  setTab,
  tab,
  children,
  isSwapDemo,
  ...props
}: any) => {
  const router = useRouter();
  const { query } = router;
  const menus = [
    LANG("实时资金费率"),
    LANG("资金费率历史"),
    LANG("风险保障基金"),
    LANG("指数"),
  ];
  const CloseIcon = () => {
    const _onClose = () => {
      router.replace(`/swap/btc-usdt`)
    }
    return <CommonIcon name="common-modal-close" size={16} enableSkin onClick={_onClose}  />;
  };
 
  const swapInfo = !isSwapDemo ? `/swap-info` : `/swap-info/demo`;
  const { isMobile } = useResponsive();
  return (
    <UniversalLayout
      bgColor="var(--theme-background-color-9)"
      header={isSwapDemo ? <SwapDemoHeader /> : undefined}
    >
      <div className={clsx("swap-info-content", className)} {...props}>
        <div className={"banner"}>
        {
          !isMobile  &&  <Image
          src="/static/images/swap-info/rate_banner.png"
          className="image"
          alt=""
          width="1200"
          height="200"
        />
        }
        <h1 className={"title"}>{LANG("合约信息")}
          {isMobile &&   <CloseIcon  />}
          </h1> 
        </div>
        <div className={"menus-wrapper"}>
          <div className={"menus"}>
            {menus.map((item, index) => {
              return (
                <TrLink
                  key={index}
                  className={tab == index ? "active" : ""}
                  href={swapInfo}
                  query={`page=${index}&type=${query.type}`}
                >
                  {item}
                </TrLink>
              );
            })}
          </div>
        </div>
        <div className={"content"}>{children}</div>
        <style jsx>{styles}</style>
      </div>
    </UniversalLayout>
  );
};

const styles = css`
  .swap-info-content {
    display: flex;
    flex-direction: column;
    min-height: 100%;
    flex: 1;
    overflow: hidden;
    .banner {
      z-index: 0;
      position: relative;
      width: 100%;
      height: 200px;
      @media ${MediaInfo.mobile} {
        height:auto;
      }
      :global(.image) {
        width: 100%;
        height: 200px;
        object-fit: cover;
      }
      .title {
        /* top: 50px; */
        width: 1200px;
        margin: auto;
        text-align: left;
        margin-top: -120px;
        font-size: 40px;
        font-style: normal;
        font-weight: 700;
        color: var(--text_1);
        line-height: 48px;
        @media ${MediaInfo.mobile} {
          width: auto;
           font-family: "Lexend";;
          font-weight: 500;
          font-size: 16px;
          line-height: 100%;
          margin-top: 10px;
          padding: 0 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
      }
    }
    .menus-wrapper {
      position: relative;
      z-index: 1;
      width: 100%;
      padding-top: 42px;
      @media ${MediaInfo.mobile} {
        padding-top: 24px;
      }
      .menus {
        max-width: var(--const-max-page-width);
        width: 100%;
        margin: 0 auto;
        overflow-x: auto;
        white-space: nowrap;
        &::-webkit-scrollbar {
          display: none;
        }
        @media ${MediaInfo.mobile} {
          display: flex;
          align-items: center;
          gap: 24px;
          padding: 0 24px;
        }
        :global(a) {
          display: inline-block;
          height: 23px;
          padding: 0 20px;
          line-height: 23px;
          font-size: 20px;
          font-style: normal;
          font-weight: 500;
          color: var(--text_3);
          @media ${MediaInfo.mobile} {
             font-family: "Lexend";;
            font-weight: 500;
            font-size: 14px;
            line-height: 100%;
            height: auto;
            padding: 0;
          }
        }
        :global(a:first-of-type) {
          padding-left: 0;
        }
        :global(.active) {
          color: var(--brand);
          font-size: 20px;
          font-style: normal;
          font-weight: 500;
          @media ${MediaInfo.mobile} {
            font-size: 14px;
          }
          /* border-color: var(--skin-primary-color); */
          /* background: rgba(255, 255, 255, 0.05); */
        }
      }
    }
    .content {
      display: flex;
      flex-direction: column;
      position: relative;
      flex: 1;
      z-index: 1;
    }
  }
`;

export default PageContent;
