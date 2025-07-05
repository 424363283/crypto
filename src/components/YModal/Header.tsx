import YIcon from '@/components/YIcons';
import isFunction from 'lodash/isFunction';

export function Header({ title, onClose }: { title: React.ReactNode | string; onClose: () => void }) {
  return (
    <>
      <h3>{title}</h3>
      {isFunction(onClose) ? <YIcon.CloseOutlined className="close-btn" onClick={onClose} /> : null}
    </>
  );
}
