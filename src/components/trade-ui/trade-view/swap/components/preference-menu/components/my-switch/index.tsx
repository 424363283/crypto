import { clsx } from '@/core/utils';

export const MySwitch = ({ value, onChange }: { value: any; onChange: any }) => {
  return (
    <>
      <div className={clsx(value && 'visible', 'my-switch')} onClick={() => onChange(!value)}>
        <div>{value ? 'On' : 'Off'}</div>
      </div>
      <style jsx>{`
        .my-switch {
          cursor: pointer;
          height: 22px;
          min-width: 41px;
          border-radius: 10px;
          padding: 1px;
          background: var(--theme-trade-input-bg);
          position: relative;
          transition: 0.3s all;
          padding-right: 12px;
          div {
            font-size: 12px;
            background: rgb(240, 78, 63);
            height: 100%;
            min-width: 60%;
            padding: 0 6px;
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--skin-font-color);
          }
          &.visible {
            padding-left: 12px;
            padding-right: 0;

            div {
              background: var(--skin-primary-color);
            }
          }
        }
      `}</style>
    </>
  );
};
