import { ReactNode } from 'react';

export const Unit = ({ children, ...props }: { children: ReactNode }) => {
  return (
    <>
      <div className={'unit'} {...props}>
        {children}
      </div>
      <style jsx>{`
        .unit {
          white-space: nowrap;
          line-height: 12px;
          font-size: 12px;
          font-weight: 400;
          color: var(--theme-trade-text-color-3);
        }
      `}</style>
    </>
  );
};
