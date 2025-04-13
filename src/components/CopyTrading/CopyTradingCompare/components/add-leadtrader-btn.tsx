'use client';
import styles from './add-leadtrader-btn.module.scss';
import { Button } from '@/components/button';
import CommonIcon from '@/components/common-icon';
import { LANG } from '@/core/i18n';
import { useResponsive } from '@/core/hooks';
const AddLeadTraderButton = ({ onClick }: { onClick: () => void }) => {
  const { isMobile } = useResponsive();
  return (
    <>
      <div className={styles.addLeadTraderButton}>
        {!isMobile && (
          <Button type="primary" rounded onClick={() => onClick()}>
            <div className={styles.commonButtonContent}>
              <CommonIcon name="common-add-all-round-0" size={16} />
              <span>{LANG('添加交易员')}</span>
            </div>
          </Button>
        )}
        {isMobile && <CommonIcon name="common-add-round-brand-0" size={16} onClick={() => onClick()} />}
      </div>
    </>
  );
};

export default AddLeadTraderButton;
