import { useTheme } from '@/core/hooks';
import type { SwitchProps } from 'antd';
import { Switch } from 'antd';
import { clsx } from '@/core/utils/src/clsx';
import { Svg } from '@/components/svg';

export const ThemeModeSwitch = (props: SwitchProps) => {
  const { isDark } = useTheme();
  return (
    <>
      <Switch aria-label="change theme" {...props} className="theme-mode-switch" />
      <style jsx>{`
        :global(.theme-mode-switch) {
          background: rgba(121, 130, 150, 0.3) !important;
          :global(.ant-switch-handle) {
            &:before {
              height: 18px;
              content: ${isDark
                ? "url('/static/images/header/media/night-moon.svg')"
                : "url('/static/images/header/media/light-moon.svg')"};
              background-color: var(--brand);
              display: flex;
              align-items: center;
              justify-content: center;
            }
          }
          :global(.ant-switch-inner) {
            background-color: transparent;
          }
          :global(.theme-mode-switch:hover:not(.ant-switch-disabled)) {
            background-color: var(--theme-background-color-disabled-light);
          }
          :global(.theme-mode-switch.ant-switch-checked) {
            background-color: var(--theme-background-color-disabled-light);
          }
        }
      `}</style>
    </>
  );
};

export const ThemeSwitchBtn = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => {
  return (
    <>
      <div className={clsx('theme-switch-wrapper', checked && 'active')} onClick={() => onChange()}>
        <div className="switch-thumb" />
        <Svg src={'/static/images/header/media/sun.svg'} className={'sun'} width="29" height="20" />
        <Svg src={'/static/images/header/media/moon.svg'} className={'moon'} width="29" height="20" />
      </div>
      <style jsx>{`
        .theme-switch-wrapper {
          position: relative;
          width: 65px;
          height: 28px;
          background: var(--fill_3);
          border-radius: 28px;
          .switch-thumb {
            position: absolute;
            top: 4px;
            left: 4px;
            z-index: 99;
            width: 29px;
            height: 20px;
            background-color: var(--fill_bg_1);
            border-radius: 29px;
            display: flex;
            justify-content: center;
            align-items: center;
            transition: transform 0.3s;
          }
          :global(.sun) {
            position: absolute;
            top: 4px;
            left: 4px;
            z-index: 100;
            width: 29px;
            height: 20px;
            :global(svg) {
              fill: var(--text_1);
            }
          }
          :global(.moon) {
            position: absolute;
            top: 4px;
            right: 4px;
            z-index: 100;
            width: 29px;
            height: 20px;
            :global(svg) {
              fill: var(--text_3);
            }
          }
          &.active {
            // background-color: var(--brand);
            .switch-thumb {
              transform: translateX(28px);
            }
            :global(.sun) {
              :global(svg) {
                fill: var(--text_3);
              }
            }
            :global(.moon) {
              :global(svg) {
                fill: var(--text_1);
              }
            }
          }
        }
      `}</style>
    </>
  );
};
