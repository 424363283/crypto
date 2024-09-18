import { useTheme } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { ReactNode } from 'react';
import { clsx, styles } from './styled';

export const Result = ({ results, tips }: { results: any[][]; tips?: any }) => {
  const { isDark } = useTheme();
  return (
    <div className={clsx('result', !isDark && 'light')}>
      <div className={clsx('result-content')}>
        <div className={clsx('title')}>{LANG('计算结果')}</div>
        {results.map(([label, value], index) => {
          return (
            <div className={clsx('row')} key={index}>
              <div className={clsx()}>{label}</div>
              <div className={clsx()}>{value}</div>
            </div>
          );
        })}
      </div>
      {tips && <div className={clsx('tips')}>{tips}</div>}
    </div>
  );
};

export const ResultLayout = ({
  children,
  className,
  onSubmit,
  disabled,
}: {
  children: ReactNode[];
  className?: string;
  onSubmit: () => any;
  disabled?: boolean;
}) => {
  const { isDark } = useTheme();

  return (
    <>
      <div className={clsx('result-layout', !isDark && 'light', className)}>
        <div className={clsx('content')}>
          {children?.[0]}
          <div className={clsx('submit', !disabled && 'active')} onClick={disabled ? undefined : onSubmit}>
            {LANG('计算')}
          </div>
        </div>
        {children?.[1]}
      </div>
      {styles}
    </>
  );
};
