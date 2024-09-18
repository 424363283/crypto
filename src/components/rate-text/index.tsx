import { RateTextProps, useRate } from '@/core/hooks';
import { memo } from 'react';

/**
 *
 * @param props RateTextProps
 * @description 根据local currency汇率转换钱的显示
 * @returns {JSX.Element}
 */
export const RateText = memo((props: RateTextProps) => {
  const { text } = useRate(props);
  return <>{text}</>;
});
