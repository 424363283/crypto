import { useTheme } from '@/core/hooks';

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
        <div>
          <div className={clsx('svg')}>
            <AddIcon width='13' height='13' alt='numeric-input-plus' />
          </div>
        </div>
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
      <div>
        <div className={clsx('svg')}>
          <MinuIcon width='13' height='13' alt='numeric-input-minus' />
        </div>
      </div>
    </div>
  );
};

export default { Add, Minus, style: 'controller' };
