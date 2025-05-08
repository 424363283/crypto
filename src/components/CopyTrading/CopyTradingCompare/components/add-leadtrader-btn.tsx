'use client';
import styles from './add-leadtrader-btn.module.scss';
import { Button } from '@/components/button';
import CommonIcon from '@/components/common-icon';
import { LANG } from '@/core/i18n';
import { useResponsive } from '@/core/hooks';
const AddLeadTraderButton = ({ onClick,type = 'outside' }: { onClick: () => void,type:string }) => {
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
        {isMobile && type === 'outside' && <CommonIcon name="common-add-round-brand-0" size={16} onClick={() => onClick()} />}
        {isMobile && type === 'inner' && <div className={styles.addInnerBox}  onClick={() => onClick()}>
          <CommonIcon name="common-add-all-round-0" size={12} />
        </div>}
      </div>
    </>
  );
};

export default AddLeadTraderButton;
