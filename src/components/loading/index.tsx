/**
 * @file loading - 全局loading组件
 */
import Image from '@/components/image';
import { clsx } from '@/core/utils';
import { createRoot } from 'react-dom/client';

interface LoadingViewProps {
  style?: React.CSSProperties;
  className?: string;
  small?: boolean;
}
interface LoadingViewChildrenProps {
  style?: React.CSSProperties;
  className?: string;
  small?: boolean;
  children?: React.ReactNode;
  isLoading?: boolean;
  background?: string;
  top?: number;
}

export class Loading {
  static id: string = 'loading';

  static get element() {
    return document.getElementById(Loading.id);
  }

  static get isWindow() {
    return typeof window !== 'undefined';
  }

  // 默认1分钟
  static start(duration: number = 1000 * 60): void {
    if (!Loading.isWindow) return;
    if (Loading.element) return;
    const div = document.createElement('div');
    div.id = Loading.id;
    document.body.appendChild(div);
    createRoot(div).render(
      <Loading.view
        style={{
          position: 'fixed',
          width: '100vw',
          height: '100vh',
          zIndex: 99999,
          top: 0,
          left: 0,
          userSelect: 'none',
        }}
      />
    );
    duration && setTimeout(Loading.end, duration);
  }
  static end() {
    if (!Loading.isWindow) return;
    if (Loading.element) {
      Loading.element.parentElement?.removeChild(Loading.element);
    }
  }

  static view({ style, className, small }: LoadingViewProps) {
    return (
      <>
        <div key='light' className={clsx('y-mex-loading', small && 'small', className)} style={style}>
          <Image src={'/static/images/loading/light-1.png'} width='60' height='60' enableSkin />
          <Image src={'/static/images/loading/light-2.png'} width='70' height='70' enableSkin />
          <Image src={'/static/images/loading/light-3.png'} width='80' height='80' enableSkin />
        </div>

        <style jsx global>
          {`
            .y-mex-loading {
              position: relative;
              width: 80px;
              height: 80px;

              img {
                position: absolute;
                top: 0;
                bottom: 0;
                right: 0;
                left: 0;
                margin: auto;
              }
              > img:nth-child(1) {
                border-radius: 50%;
                overflow: hidden;
              }
              > img:nth-child(2) {
                animation: img2 2s linear infinite;
                @keyframes img2 {
                  0% {
                    transform: rotateZ(0);
                  }
                  100% {
                    transform: rotateZ(-360deg);
                  }
                }
              }
              > img:nth-child(3) {
                animation: img3 1.5s linear infinite;
                @keyframes img3 {
                  0% {
                    transform: rotateZ(0);
                  }
                  100% {
                    transform: rotateZ(360deg);
                  }
                }
              }
              &.small {
                img:nth-child(1) {
                  width: 40px;
                  height: 40px;
                }
                img:nth-child(2) {
                  width: 50px;
                  height: 50px;
                }
                img:nth-child(3) {
                  width: 60px;
                  height: 60px;
                }
              }
            }
          `}
        </style>
      </>
    );
  }

  static wrap({ style, className, small, children, isLoading, background, top }: LoadingViewChildrenProps) {
    return (
      <>
        <div className={clsx('loading-wrap', className)} style={style}>
          {!isLoading && <>{children}</>}
          {isLoading && (
            <div className='loading' style={{ background }}>
              <Loading.view small={small} />
            </div>
          )}
        </div>

        <style jsx>
          {`
            .loading-wrap {
              position: relative;
              pointer-events: ${isLoading ? 'none' : 'auto'};
              .loading {
                pointer-events: ${isLoading ? 'none' : 'auto'};
                position: absolute;
                z-index: 99999;
                top: ${top || 0}px;
                height: 100%;
                width: 100%;
                display: flex;
                justify-content: center;
                align-items: center;
              }
            }
          `}
        </style>
      </>
    );
  }

  static tradeView() {
    return (
      <div
        style={{
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'var(--theme-background-color-1)',
          borderTop: 'var(--theme-trade-layout-gap) solid var(--theme-trade-bg-color-1)',
        }}
      >
        <Loading.view />
      </div>
    );
  }
}
