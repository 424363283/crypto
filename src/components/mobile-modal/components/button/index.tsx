import { Loading } from '@/components/loading';
import { clsx } from '@/core/utils';
import { useState } from 'react';
import css from 'styled-jsx/css';

const Index = ({
  children,
  className,
  onClick,
  onSubmit,
  disabled,
  type
}: {
  children: any;
  type?: string;
  className?: string;
  disabled?: boolean;
  onClick?: Function;
  onSubmit?: () => Promise<any>;
}) => {
  const [loading, setLoading] = useState(false);

  const _onClick = async () => {
    if (disabled || loading) return;
    if (onClick) {
      onClick?.();
    } else {
      setLoading(true);
      Loading.start();
      try {
        if (onSubmit) {
          await onSubmit?.();
        }
      } finally {
        setLoading(false);
        Loading.end();
      }
    }
  };
  return (
    <>
      <div
        className={clsx('button', type && `type-${type}`, (disabled || loading) && 'disabled', className)}
        onClick={_onClick}
      >
        {children}
      </div>
      <style jsx>{styles}</style>
    </>
  );
};

const styles = css`
  .button {
    height: 2.5rem;
    width: 100%;
    border-radius: 2.5rem;
    display: flex;
    justify-content: center;
    align-items: center;
    background: var(--skin-primary-color);
    font-size: 14px;
    font-weight: 500;
    color: var(--text_white);
    &.type-1 {
      background: rgba(254, 214, 11, 0.2);
      color: var(--theme-font-color-3);
    }
    &.disabled {
      cursor: not-allowed;
      color: var(--text_3);
      background: var(--fill_3);
    }
  }
`;

export default Index;
