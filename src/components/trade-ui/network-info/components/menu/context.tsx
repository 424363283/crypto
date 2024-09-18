import { clsx } from '@/core/utils';
export const Content = ({
  label,
  onClick,
  icon,
  hovered,
  newest,
  last,
}: {
  label: string;
  onClick?: any;
  icon: string[];
  newest?: boolean;
  hovered: boolean;
  last?: boolean;
}) => {
  return (
    <>
      <div className={clsx('menu', hovered && 'active', newest && 'newest', last && 'last')} onClick={onClick}>
        {/* <Svg src={hovered ? icon[1] : icon[0]} width={20} /> */}
        <div>{label}</div>
      </div>
      <style jsx>{`
        .menu {
          position: relative;
          display: flex;
          align-items: center;
          padding: 0 10px;
          &.last {
            &::after {
              display: none;
            }
          }
          &::after {
            height: 4px;
            width: 1px;
            background: var(--theme-border-color-3);
            display: block;
            content: '';
            position: absolute;
            z-index: 2;
            pointer-events: none;
            touch-action: none;
            right: 0;
          }
          &.newest {
            position: relative;
            &::before {
              content: '';
              display: block;
              border-radius: 50%;
              position: absolute;
              top: 1.5px;
              right: 7px;
              height: 3px;
              width: 3px;
              box-shadow: 0px 1px 3px 0px var(--const-color-error);
              background: var(--const-color-error);
            }
          }

          > div {
            cursor: pointer;
            margin-left: 5px;
            font-size: 12px;
            line-height: 20px;
            color: var(--theme-trade-text-color-3);
          }
          &.active {
            > div {
              color: var(--skin-primary-color);
            }
          }
        }
      `}</style>
    </>
  );
};
