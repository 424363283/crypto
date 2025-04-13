import { EntryPoint } from '@/components/tv/account';
import Image from '@/components/image';
import { clsx } from '@/core/utils/src/clsx';
import { MediaInfo } from '@/core/utils/src/media-info';
import css from 'styled-jsx/css';
import { Desktop, Mobile, Tablet } from '../../responsive';
import { UniversalLayout } from './universal';

interface IProps {
  className?: string;
  children?: React.ReactNode;
  loginBoxClassName?: string;
  logoJumpId?: string;
}

export default function LoginCommonLayout(props: IProps) {
  return (
    <>
      <UniversalLayout hideFooter className='login-common' bgColor='var(--theme-secondary-bg-color)'>
        <div className={clsx('login-bg', props.className)}>
          {
            props.children ? (
              props.children
            ) : (
              <div className='bonus-logo-wrapper'>
              </div>
            )
          }
          <div className={clsx('login-box', props.loginBoxClassName)}>
            {<EntryPoint />}
          </div>
          <style jsx>{styles}</style>
        </div>
      </UniversalLayout>
    </>
  );
}
const styles = css`
  :global(.login-common) {
    background-color: var(--theme-background-color-2);
  }
  :global(header) {
    @media ${MediaInfo.mobile} {
      background-color: var(--theme-background-color-2) !important;
    }
  }
  .login-bg {
    display: flex;
    @media ${MediaInfo.desktop} {
      min-height: calc(100vh - 64px);
      align-items: center;
    }
    @media ${MediaInfo.tablet} {
      min-height: calc(100vh - 53px);
    }
    background: var(--theme-secondary-bg-color);
    @media ${MediaInfo.mobile} {
      background-color: var(--theme-background-color-2);
    }
    justify-content: center;
    .bonus-logo-wrapper {
      width: 600px;
      height: 586px;
      @media ${MediaInfo.mobileOrTablet} {
        display: none;
      }
    }
    .login-box {
      position: relative;
      @media ${MediaInfo.desktop} {
        margin-left: 7%;
        padding: 30px 24px;
      }
      @media ${MediaInfo.tablet} {
        margin-top: 75px;
        width: 464px;
        padding: 0px 16px;
      }
      @media ${MediaInfo.mobile} {
        width: 100%;
      }
      :global(.bonus-img) {
        border-radius: 8px;
        @media (${MediaInfo.mobile}) {
          display: none;
        }
      }
    }
    :global(.pc-bonus-img) {
      width: 600px;
      height: 586px;
    }
  }
`;
