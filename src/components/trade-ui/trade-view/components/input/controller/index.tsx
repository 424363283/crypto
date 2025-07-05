import { useTheme } from '@/core/hooks';
import YIcon from '@/components/YIcons';
import { AddIcon } from './icon/add';
import { MinuIcon } from './icon/minus';

import { clsx, styles } from './styled';

const Add = (props: any) => {
  const { isDark } = useTheme();

  return (
    <>
      <div
        onClick={props.onClick}
        onMouseDown={props.onMouseDown}
        onMouseUp={props.onMouseUp}
        className={clsx('btn-control', 'btn-plus', !isDark && 'light')}
      >
        <YIcon.plusIcon />
      </div>
      {styles}
    </>
  );
};

const Minus = (props: any) => {
  const { isDark } = useTheme();
  return (
    <div
      onClick={props.onClick}
      onMouseDown={props.onMouseDown}
      onMouseUp={props.onMouseUp}
      className={clsx('btn-control', 'btn-minus', !isDark && 'light')}
    >
      <YIcon.minusIcon />
    </div>
  );
};

export default { Add, Minus, style: 'controller' };
