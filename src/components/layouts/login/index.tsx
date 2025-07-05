import { EntryPoint } from '@/components/account';
import { clsx } from '@/core/utils/src/clsx';
import { MediaInfo } from '@/core/utils/src/media-info';
import css from 'styled-jsx/css';
import { Desktop } from '../../responsive';
import { UniversalLayout } from './universal';
import { Banners } from '@/components/account/components/banners';

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
          <div className={clsx('login-box', props.loginBoxClassName)}>
            {props.children ? (
              props.children
            ) : (
              <Desktop forceInitRender={false}>
                <Banners className='login-banner' />
              </Desktop>
            )}
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
    margin-bottom: 0!important;
    background-color: var(--fill_bg_1);
  }
 
  .login-bg {
    display: flex;
    @media ${MediaInfo.desktop} {
      min-height: calc(100vh - 56px);
    }
    @media ${MediaInfo.tablet} {
      justify-content: center;
      min-height: calc(100vh - 53px);
    }
    background: var(--fill_bg_1);
    @media ${MediaInfo.mobile} {
      justify-content: center;
    }
    .login-box {
      position: relative;  
      border-radius: 12px;
      background-color: var(--fill_bg_1);
      @media ${MediaInfo.desktop} {
        display: flex;
        width: 100%;
        margin-left: 0%;
        justify-content: space-between;
      }
      @media ${MediaInfo.tablet} {
        margin-top: 75px;
        width: 464px;
        padding: 0px 16px;
      }
      @media ${MediaInfo.mobile} {
        width: 100%;
      }
      :global( .login-banner ) {
        width: 41.6%;
        :global(.swiper) {
          height: 100%;
        }
      }
      :global(.divided-line-vertical) {
        width: 1px;
        border-left: 1px solid var(--skin-border-color-1);
      }
    }
  }
`;

function Login() {
  return <LoginCommonLayout />;
}

export { Login }
