// import CommonIcon from '@/components/common-icon';
import { LANG } from '@/core/i18n';

export const ItemSpsl = ({ sp, sl, onClick }: { sp: any; sl: any; onClick: any }) => {
  if (!sp && !sl) {
    return <></>;
  }
  return (
    <>
      <div className='item-spsl'>
        <div className='label'>{LANG('止盈/止损')}</div>
        <div className='value'>
          {sp || '--'}/{sl || '--'}
        </div>
        {/* <CommonIcon name='common-small-edit-0' width={12} height={13} enableSkin className='icon' /> */}
      </div>
      <style jsx>{`
        .item-spsl {
          // margin-top: 12px;
          display: flex;
          flex-direction: column;
          font-size: 12px;
          align-items: flex-start;
          gap: 4px;
          .label {
            color: var(--text-tertiary);
          }
          .value {
            // margin-left: 3px;
            color: var(--text-primary);
          }
          :global(.icon) {
            margin-left: 3px;
          }
        }
      `}</style>
    </>
  );
};
