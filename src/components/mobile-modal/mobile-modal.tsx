import { clsx } from '@/core/utils';
import React, { ReactNode, useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import css from 'styled-jsx/css';

const MobileModal = ({
  visible: _visible = true,
  children,
  onClose,
  type = 'default',
  zIndex,
}: {
  visible?: boolean;
  children?: ReactNode;
  onClose?: () => any;
  type?: 'default' | 'bottom';
  zIndex?: any;
}) => {
  const [visible, setVisible] = useState(false);
  const visibleClassName = type;

  useEffect(() => {
    setTimeout(
      () => {
        setVisible(_visible);
      },
      _visible ? 10 : 400
    );
    // 打开弹窗时，禁止 body 滚动
    const $body = document.querySelector('body');
    if ($body) {
      if (_visible) {
        $body.style.overflow = 'hidden';
      } else {
        $body.style.overflow = 'auto';
      }
    }
    return () => {
      if ($body) {
        $body.style.overflow = '';
      }
    };
  }, [_visible]);

  const { zIndexClassName, styles: zIndexStyles } = useMemo(() => {
    if (zIndex === undefined) {
      return {};
    }
    const { className, styles } = css.resolve`
      .modal-zindex {
        z-index: ${zIndex};
      }
    `;
    return { styles, zIndexClassName: clsx('modal-zindex', className) };
  }, [zIndex]);

  return createPortal(
    <>
      <div
        className={clsx(
          'modal',
          visibleClassName,
          (_visible == true ? visible : _visible) && 'visible',
          zIndexClassName
        )}
      >
        {(_visible == true ? _visible : visible) && (
          <>
            <div className='mask-content'>
              <div className='mask' onClick={onClose}></div>
              <ModalContext.Provider value={{ onClose }}>
                <div className='content'>{children}</div>
              </ModalContext.Provider>
            </div>
          </>
        )}
      </div>
      {zIndexStyles}
      <style jsx>{styles}</style>
    </>,
    document.body
  );
};

const styles = css`
  .modal {
    z-index: 1000;
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;

    .mask-content {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      width: 100vw;
      height: 100dvh;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }
    .mask {
      position: absolute;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100dvh;
      background-color: rgba(0, 0, 0, 0.55);
      transition: all 0.2s ease-in-out;
      opacity: 0;
    }
    .content {
      width: 100%;
      transition: all 0.3s ease-in-out;
      opacity: 0;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    &.default {
      .content {
        transform: scale(0.5);
      }
    }
    &.bottom {
      .mask-content {
        justify-content: flex-end;
      }
      .content {
        transform: translateY(100%);
      }
    }

    &.visible {
      .mask {
        opacity: 1;
      }
      &.default {
        .content {
          transform: scale(1);
          opacity: 1;
        }
      }
      &.bottom {
        .content {
          opacity: 1;
          transform: translateY(0);
        }
      }
    }
  }
`;

const ModalContext = React.createContext<{
  onClose?: React.MouseEventHandler<HTMLDivElement>;
}>({ onClose: () => {} });
export const useModalTools = () => {
  return React.useContext(ModalContext);
};
export default MobileModal;
