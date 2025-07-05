import { useTheme, useResponsive } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { ReactNode, useEffect, useState } from 'react';
import { clsx, styles } from './styled';
import { Button } from '@/components/button';
import { Size } from '@/components/constants';
import { DesktopOrTablet, Mobile } from '@/components/responsive';

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
  disabled
}: {
  children: ReactNode[];
  className?: string;
  onSubmit: () => any;
  disabled?: boolean;
}) => {
  const [isInitial, setIsInitial] = useState(false);
  const { isDark } = useTheme();
  const { isMobile } = useResponsive();
  useEffect(() => setIsInitial(true), []);
  if (!isInitial || !isMobile) {
    return (
      <>
        <div className={clsx('result-layout', !isDark && 'light', className)}>
          <div className={clsx('content')}>
            {children?.[0]}
            <Button
              className={clsx('confirm')}
              disabled={disabled}
              rounded
              type="primary"
              size={Size.LG}
              onClick={disabled ? undefined : onSubmit}
            >
              {LANG('计算')}
            </Button>
          </div>
          {children?.[1]}
        </div>
        {styles}
      </>
    );
  }
  return (
    <>
      <div className={clsx('result-layout', !isDark && 'light', className)}>
        <Mobile>
          {children?.[0]}
          {children?.[1]}
          <Button
            className={clsx('confirm')}
            disabled={disabled}
            rounded
            type="primary"
            size={Size.LG}
            onClick={disabled ? undefined : onSubmit}
          >
            {LANG('计算')}
          </Button>
        </Mobile>
      </div>
      {styles}
    </>
  );
};
