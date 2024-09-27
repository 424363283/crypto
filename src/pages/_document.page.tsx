// _document is only rendered on the server side and not on the client side
// Event handlers like onClick can't be added to this file

import Document, {
    DocumentContext,
    DocumentInitialProps,
    Head,
    Html,
    Main,
    NextScript
  } from 'next/document';
   
import { defaultLang } from '@/core/i18n/src/constants';

 
class MyDocument extends Document {
    static async getInitialProps(ctx: DocumentContext): Promise<DocumentInitialProps> {
      const initialProps = await Document.getInitialProps(ctx);
      // console.log('initialProps',initialProps);
      const { pathname } = ctx;
       
      return { ...initialProps,pathname};
    }

    render() {
      const lang =
			typeof this.props.__NEXT_DATA__.query.locale === 'string'
				? this.props.__NEXT_DATA__.query.locale : defaultLang
       
 
      const buildTime = process.env.NEXT_PUBLIC_BUILD_TIME;

      const pathname = (this.props as any).pathname;
       
      const commonLangJsSrc = `/static/locales/${lang}/common-lang.js?t=${buildTime}`;
      const lang_js_index = (pathname == '/[locale]/index' || pathname == '/[locale]') ? `/static/locales/${lang}/index.js?t=${buildTime}` : '';
    
      const lang_js_spot = (pathname.indexOf('/[locale]/spot')  > -1) ? `/static/locales/${lang}/spot.js?t=${buildTime}` : '';
      const lang_js_trade_ui =
      (pathname.indexOf('/[locale]/swap') > -1 || pathname.indexOf('/[locale]/spot')  > -1) ? `/static/locales/${lang}/trade-ui-lang.js?t=${buildTime}` : '';

      const lang_js_convert = pathname == '/[locale]/convert' ? `/static/locales/${lang}/convert.js?t=${buildTime}` : '';
      // const lang_js_fiat_crypto = pathname == '/[locale]/fiat-crypto' ? `/static/locales/${lang}/fiat-crypto.js?t=${buildTime}` : '';
      const lang_js_account = 
      (
        pathname == '/[locale]/account/dashboard' ||
        pathname.indexOf('/[locale]/account/fund-management') > -1 
      ) ? `/static/locales/${lang}/account.js?t=${buildTime}` : '';
      const lang_js_novice_task = pathname == '/[locale]/novice-task' ? `/static/locales/${lang}/novice-task.js?t=${buildTime}` : '';
      const lang_js_markets = pathname == '/[locale]/markets' ? `/static/locales/${lang}/markets.js?t=${buildTime}` : '';
      const lang_js_swap_info = pathname == '/[locale]/swap-info' ? `/static/locales/${lang}/swap-info.js?t=${buildTime}` : '';
      const lang_js_tv = pathname.indexOf('/[locale]/tv') > -1 ? `/static/locales/${lang}/tv.js?t=${buildTime}` : '';
      const lang_js_vip = pathname.indexOf('/[locale]/vip') > -1 ? `/static/locales/${lang}/vip.js?t=${buildTime}` : '';

      const theme_js = `/static/js/theme.js?t=${buildTime}`;
      const cookie_js = `/static/js/cookie.js?t=${buildTime}`;
      const zendesk_js = `/static/js/zendesk.js?t=${buildTime}`;
      return (
        <Html 
        lang={lang}
        >
          <Head />
          <script src={theme_js}></script>
          <script src={cookie_js}></script>
 
          <body>
            <Main />

            
              <script src={commonLangJsSrc}></script>
              {lang_js_index && <script src={lang_js_index}></script>}
             
              {lang_js_spot && <script src={lang_js_spot}></script>}
              {lang_js_trade_ui && <script src={lang_js_trade_ui}></script>}
             
              {lang_js_convert && <script src={lang_js_convert}></script>}
              {/* {lang_js_fiat_crypto && <script src={lang_js_fiat_crypto}></script>} */}
              {lang_js_account && <script src={lang_js_account}></script>}
              {lang_js_novice_task && <script src={lang_js_novice_task}></script>}
              {lang_js_markets && <script src={lang_js_markets}></script>}
              {lang_js_swap_info && <script src={lang_js_swap_info}></script>}
              {lang_js_tv && <script src={lang_js_tv}></script>}
              {lang_js_vip && <script src={lang_js_vip}></script>}

              {/* <script type="module" src={zendesk_js} ></script> */}

            <NextScript />
          </body>
        </Html>
      );
    }
  }
  
  export default MyDocument;
  