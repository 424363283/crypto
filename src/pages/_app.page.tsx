import { Activity } from '@/components/activity/activity';
import { KycBonusModal } from '@/components/activity/kyc-bonus';
import { AntdThemeConfigProvider } from '@/components/antd-config-provider/theme-config-provider';
import { Cookie } from '@/components/cookie';
import { DesktopOrTablet } from '@/components/responsive';
import '@/core/prototype';
import { AppProvider } from '@/core/store';
import '@/core/styles/src/design.scss';
import { GlobalStyle } from '@/core/styles/src/global-style';
import { AppProps } from 'next/app';
// const ErrorBoundary = dynamic(() => import('@/components/error/error-boundary'));
import  ErrorBoundary  from '@/components/error/error-boundary';
import '@/core/styles/global.scss';
import {useRouter} from 'next/router';
import { useEffect } from 'react';

import { KeepAliveContextProvider } from '@/components/keepalive';

const RootApp = ({ Component, pageProps }: AppProps) => {
  useEffect(() => {
    console.info('%c%s', 'font-weight: bold;color: #5f55a5', `Release info: ${process.env.NEXT_PUBLIC_BUILD_TIME}`);
  }, []);

  return (
    <AppProvider auth={pageProps.auth}>
      <GlobalStyle>
       <ErrorBoundary> 
          <AntdThemeConfigProvider>
                   <KeepAliveContextProvider>
                     <Component {...pageProps} /> 
                  </KeepAliveContextProvider>
             <DesktopOrTablet>
              <Activity />
            </DesktopOrTablet>
            <Cookie />
            <KycBonusModal />
          </AntdThemeConfigProvider>
         </ErrorBoundary>  
      </GlobalStyle>
    </AppProvider>
  );
};

export default RootApp;
