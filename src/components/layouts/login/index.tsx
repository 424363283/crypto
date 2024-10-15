import { EntryPoint } from '@/components/account';
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
          <div className={clsx('login-box', props.loginBoxClassName)}>
            <Tablet forceInitRender={false}>
              <Image
                src='/static/images/account/bonus-pad.png'
                width={464}
                height={90}
                loading='eager'
                alt='y-mex bonus'
                className='bonus-img'
              />
            </Tablet>
            <Mobile forceInitRender={false}>
              <a href={`#${props.logoJumpId || ''}`} className='bonus-mobile'>
                <Image
                  src='/static/images/account/bonus-mobile.png'
                  width={142}
                  height={56}
                  loading='eager'
                  priority
                  alt='bonus'
                  enableSkin
                />
              </a>
            </Mobile>
            {<EntryPoint />}
            <Desktop>
              <div className='divided-line-vertical'></div>
            </Desktop>
            {props.children ? (
              props.children
            ) : (
              <div className='bonus-logo-wrapper'>
                <Desktop forceInitRender={false}>
                  <></>
                  {<Image
                    src='/static/images/account/login.png'
                    enableSkin
                    className='pc-bonus-img'
                    width='298'
                    height='286'
                    loading='eager'
                    priority
                  />}
                  <div className='bonus-slogan'>
                    <div className='title'>
                      <p>全球领先的</p>
                    </div>
                    <h1 className='text'>一站式金融娱乐平台</h1>
                  </div>
                </Desktop>
              </div>
            )}
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
    .login-box {
      position: relative;  
      border-radius: 12px;
      box-shadow: var(--theme-box-shadow-1);
      @media ${MediaInfo.desktop} {
        display: flex;
        margin-left: 0%;
        background-color: var(--theme-background-color-2);
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
      :global(.bonus-mobile) {
        position: absolute;
        right: 0;
        top: 70px;
        z-index: 10;
        font-size: 0;
        width: 142px;
        height: auto;
      }
      :global(.divided-line-vertical) {
        width: 1px;
        border-left: 1px solid var(--skin-border-color-1);
      }
      .bonus-logo-wrapper {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        width: 298px;
        height: auto;
        margin: 30px;
        @media ${MediaInfo.mobileOrTablet} {
          display: none;
        }
        :global(.pc-bonus-img) {
          width: 298px;
          height: 286px;
        }
        .bonus-slogan {
          .title {
            margin: 0;
            padding: 0;
            font-size: 52px;
            font-weight: 700;
            line-height: 1.2;
            white-space: nowrap;
            color: var(--skin-hover-font-color);
            span {
              color: var(--skin-color-active);
            }
            > * {
              font-family: DINPro !important;
            }
          }
          .text {
            margin: 0;
            padding: 0;
            font-size: 28px;
            font-weight: 400;
            line-height: 1.5;
            padding: 15px 0 0 0;
            color: var(--theme-font-color-1);
          }
        }
      }
    }
  }
`;

function Login() {
  return <>
    <LoginCommonLayout />
  </>;
}

export { Login }
