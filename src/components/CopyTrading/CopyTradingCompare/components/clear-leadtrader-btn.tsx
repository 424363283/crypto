'use client';
import styles from './clear-leadtrader-btn.module.scss';
import { Button } from '@/components/button';
import CommonIcon from '@/components/common-icon';
import { useResponsive } from '@/core/hooks';
const ClearLeadTraderButton = ({ onClick }: { onClick: () => void }) => {
  const { isMobile } = useResponsive();
  return (
    <>
      <div className={styles.clearLeadTraderButton}>
        {!isMobile && (
          <Button rounded onClick={() => onClick()}>
            <div className={styles.commonButtonContent}>
              <CommonIcon name="common-clear-0" size={16} />
              <span>清空</span>
            </div>
          </Button>
        )}
        {isMobile && <CommonIcon name="common-clear-0" size={16} onClick={() => onClick()} />}
      </div>
    </>
  );
};

export default ClearLeadTraderButton;
