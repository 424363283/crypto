import CommonIcon from '@/components/common-icon';
import { useTheme } from '@/core/hooks';
import { clsx } from '@/core/utils';

const ModalClose = ({ className, onClose }: { className?: string; onClose?: any }) => {
  const { isDark } = useTheme();
  return (
    <>
      <div className={clsx('close-wrapper', className)}>
        <div className={clsx('close', className)} onClick={onClose}>
          <CommonIcon name='common-close-filled' size={24} enableSkin />
        </div>
      </div>
      <style jsx>{`
        .close-wrapper {
          cursor: pointer;
          height: 47px;
          width: 47px;
          display: flex;
          justify-content: center;
          align-items: center;
          .close {
            flex: none;
            display: flex;
            justify-content: center;
            align-items: center;
            border-radius: 50%;
            height: 24px;
            width: 24px;
            line-height: 24px;
          }
        }
      `}</style>
    </>
  );
};
export default ModalClose;
