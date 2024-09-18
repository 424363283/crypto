import { useTheme } from '@/core/hooks';
import { ConfigProvider } from 'antd';

export const AntdThemeConfigProvider = ({ children }: any) => {
  const { skin } = useTheme();
  
  const COLOR_PRIMARY_MAP = {
    blue: '#1772F8',
    primary: '#f8bb37',
  };
  return (
    <ConfigProvider
      theme={{
        token: { colorPrimary: COLOR_PRIMARY_MAP[skin] },
        components: {
          Checkbox: {
            colorPrimary: 'var(--skin-primary-color)',
            colorBgContainer: 'var(--theme-background-color-2)',
            colorPrimaryBorder: 'var(--skin-primary-color)',
            colorWhite: 'var(--theme-font-color-1-reverse)',
            borderRadiusSM: 20,
            colorBorder: 'var(--theme-font-color-3)',
            colorPrimaryHover: 'var(--skin-primary-bg-color-opacity-2)',
          },
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
};
