/* account/security-setting,account/verify,/account/resetType等页面的样式抽象 */
import CommonIcon from '@/components/common-icon';
import Nav from '@/components/nav';
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
              <CommonIcon name='common-warning-tips-0' size={12} />
              {state?.prompt || prompt}
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
    background: var(--theme-background-color-2);
    padding: 20px;
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
      .content {
        border: 1px solid var(--theme-border-color-2);
        border-radius: 8px;
        padding: 20px;
        height: calc(100vh - 180px);
        overflow-y: auto;
        @media ${MediaInfo.tablet} {
          height: 92%;
        }
        @media ${MediaInfo.mobile} {
          padding: 0;
          border: 0;
          height: 100%;
        }
        .prompt-box {
          padding: 12px 20px;
          font-size: 12px;
          font-weight: 400;
          color: var(--theme-font-color-1);
          border-radius: 5px;
          margin-bottom: 30px;
          background: rgba(240, 78, 63, 0.08);
          :global(img) {
            margin-right: 10px;
          }
        }
      }
    }
  }
`;
