import styles from '../index.module.scss';
import { Svg } from '@/components/svg';
export default function LeverType(props: { leverType: number }) {
  const { leverType } = props;
  return (
    <>
      {leverType <= 3 && (
        <div className={styles.followLever}>
          <Svg src={`/static/icons/primary/common/follower-lever.svg`} width={24} height={24} />
          <span className={`${styles.leverType} ${styles.textWhite}`}>{leverType}</span>
        </div>
      )}
      {leverType > 3 && (
        <div className={styles.followLever}>
          <span className={`${styles.leverType} ${styles.textPrimary}`}>{leverType}</span>
        </div>
      )}
    </>
  );
}
