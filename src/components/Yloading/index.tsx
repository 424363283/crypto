import { ReactNode, FC, CSSProperties } from 'react';

import clsx from 'clsx';


// import { useIntlMsg } from '@/hooks/use-intl-msg';

import styles from './index.module.scss';

interface LoadingProps  {
  text?: boolean | ReactNode;
  className?: string;
  style?: CSSProperties
};

const Loading: FC<any> = ({ text,  style, className }) => {
  // const intlMsg = useIntlMsg(intl);

  return (
    <div
      style={style}
      className={clsx(styles.bvLoading, className)}>
      <span className={styles.spin}>
      </span>
      {
        <span>{text && '加载中'}</span>
      }
    </div>
  );
};

export default (Loading);
