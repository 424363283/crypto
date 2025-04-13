import { useTheme } from '@/core/hooks';
import type { SwitchProps } from 'antd';
import { Switch } from 'antd';

export const ThemeModeSwitch = (props: SwitchProps) => {
  const { isDark } = useTheme();
  return (
    <>
      <Switch aria-label='change theme' {...props} className='theme-mode-switch' />
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
