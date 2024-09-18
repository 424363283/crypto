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
          :global(.ant-switch-handle) {
            &:before {
              content: ${isDark
                ? "url('/static/images/header/media/night-moon.svg')"
                : "url('/static/images/header/media/light-moon.svg')"};
              background-color: var(--skin-primary-color);
              display: flex;
              align-items: center;
              justify-content: center;
            }
          }
          :global(.ant-switch-inner) {
            background-color: var(--theme-background-color-disabled-light);
          }
          :global(.ant-switch:hover:not(.ant-switch-disabled)) {
            background-color: var(--theme-background-color-disabled-light);
          }
          :global(.ant-switch-checked) {
            background-color: var(--theme-background-color-disabled-light);
          }
        }
      `}</style>
    </>
  );
};
