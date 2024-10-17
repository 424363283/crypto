import BVIcon from '@/components/YIcons';
import isFunction from 'lodash/isFunction';

export function Header({ title, onClose }: { title: React.ReactNode | string; onClose: () => void }) {
  return (
    <>
      <h3>{title}</h3>
      {isFunction(onClose) ? <BVIcon.CloseOutlined className="close-btn" onClick={onClose} /> : null}
    </>
  );
}
