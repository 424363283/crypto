import { LeadTrader } from '@/store/copytrading-swap';
import styles from './date-range-group.module.scss';
import Radio from '@/components/Radio';
import { LANG } from '@/core/i18n';
import { useState } from 'react';
import { Direction } from '@/components/constants';
import clsx from 'clsx';
export default function DateRangeGroup({
  value = 1,
  direction = Direction.HORIZONTAL,
  onSelect
}: {
  value: number,
  direction?: Direction
  onSelect: (value: number) => void,
}) {
  const dateOptions = [
    { value: 7, label: LANG('{number}天', { number: 7 }) },
    { value: 30, label: LANG('{number}天', { number: 30 }) },
    { value: 90, label: LANG('{number}天', { number: 90 }) },
    { value: 180, label: LANG('{number}天', { number: 180 }) },
  ];

  return (
    <>
      <div className={clsx(styles.dateRangeGroup, direction === Direction.HORIZONTAL ? 'horizontal' : 'vertical')}>
        {dateOptions.map((option) => (
          <div className='date' key={option.value}>
            <Radio
              size={14}
              label={option.label}
              checked={value === option.value}
              onChange={() => onSelect(option.value)}
            />
          </div>
        ))}
      </div>
    </>
  );
}

