/* account/security-setting,account/verify,/account/resetType等页面的样式抽象 */
import CommonIcon from '@/components/common-icon';
import Nav from '@/components/nav';
import { Svg } from '@/components/svg';
import { useRouter } from '@/core/hooks/src/use-router';
// import { MediaInfo, clsx } from '@/core/utils';
import { clsx } from '@/core/utils/src/clsx';
import { MediaInfo } from '@/core/utils/src/media-info';
import css from 'styled-jsx/css';

export const AccountBox = (props: {
  title: string;
  children: JSX.Element[] | React.ReactNode;
  prompt?: string;
  back?: () => void;
  className?: string;
}) => {
  const { children, title, prompt, back, className } = props;
  const router = useRouter();
  const { state } = router;
  return (
    <div className={clsx('account-common-box', className)}>
      <div className='main-box'>
        <Nav title={state?.title || title} back={back} />
        <div className='content'>
          {prompt && (
            <div className='prompt-box'>
              <div className='prompt'><Svg src='/static/icons/primary/common/tips.svg' width={14} height={14} color='var(--yellow)' /> <span>{state?.prompt || prompt}</span></div>
            </div>
          )}
          {children}
        </div>
      </div>
      <style jsx>{styles}</style>
    </div>
  );
};
const styles = css`
  .account-common-box {
    height: 100%;
    display: flex;
    flex-direction: column;
    background: var(--fill_bg_1);
    // padding: 20px;
    border-top-left-radius: 15px;
    border-top-right-radius: 15px;
    @media ${MediaInfo.tablet} {
      border-radius: 15px;
      min-height: calc(100vh - 280px);
    }
    @media ${MediaInfo.mobile} {
      border-radius: 15px;
      padding: 20px 10px;
      min-height: calc(100vh - 260px);
    }
    .main-box {
      width: 100%;
      flex: 1 1;
      :global(.nav-title) {
        position: fixed;
        width: 100%;
        z-index: 100;
        @media ${MediaInfo.mobile} {
          position: relative;
          width: auto;
          padding:0;
          background: var(--fill_bg_1);
        }
      }
      :global(.nav-title+.content) {
        margin-top: 83px;
      }
      .prompt-box {
          padding: 8px 12px;
          font-weight: 400;
          color: var(--yellow);
          border-radius: 5px;
          margin-bottom: 30px;
          background: var(--tips);
          @media ${MediaInfo.mobile} {
           margin-bottom: 15px;
          }
          .prompt{ 
            display:flex;
            flex-direction: row;
            align-items: center;
            width: 1400px;
            margin: auto;
            font-size: 12px;
            span{
              padding-left: 6px;
            }
            @media ${MediaInfo.mobile} {
              width: auto;
            }
          }
          :global(img) {
            margin-right: 10px;
          }
      }
      .content {
        height: calc(100vh - 180px);
        overflow-y: auto;
        @media ${MediaInfo.mobile} {
          margin-top:15px;
        }
        @media ${MediaInfo.tablet} {
          height: 92%;
        }
        @media ${MediaInfo.mobile} {
          padding: 0;
          border: 0;
          height: 100%;
        }
        
      }
    }
  }
`;
