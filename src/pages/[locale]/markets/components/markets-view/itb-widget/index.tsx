import { useEffect } from 'react';
import css from 'styled-jsx/css';
import { store } from '../../../store';
import { CURRENT_VIEW } from '../../../types';

const API_KEY = 'rBvW4awylLa7iaqMZEsEr4SHhSQBPNLk2KT1B1qF';
const WIDGET_URL = 'https://app.intotheblock.com/widget.js';

let _window: any = {};
if (typeof window !== 'undefined') {
  _window = window;
}
const ItbWidget = () => {
  const { currentView } = store;
  const showItb = currentView === CURRENT_VIEW.ITB;
  useEffect(() => {
    _window.itb_widget = _window.itb_widget || {
      init: (t: any) => {
        const e = document.createElement('script');
        (e.async = !0),
          (e.type = 'text/javascript'),
          (e.src = WIDGET_URL),
          (e.onload = function () {
            _window.itbWidgetInit(t);
          }),
          document.getElementsByTagName('head')[0].appendChild(e);
      },
    };
    _init();
  }, []);

  const _init = () => {
    _window.itb_widget.init({
      apiKey: API_KEY,
      options: {
        tokenId: 'BTC',
        loader: true,
        tokenSummary: {
          showTotalExchangesInflows: true,
          showTotalExchangesOutflows: true,
        },
      },
    });
  };
  return (
    <>
      <div
        style={{ padding: '0 30px 30px', color: 'var(--theme-font-color-1)', display: showItb ? 'block' : 'none' }}
        data-target='itb-widget'
        data-token-id='BTC'
        data-type='quick-view'
      />
      <style jsx>{styles}</style>
    </>
  );
};
const styles = css`
  :global(.itb-widget .section-title h2) {
    span {
      color: var(--theme-font-color-1) !important;
    }
  }
  :global(.itb-widget .section-subtitle) {
    color: var(--theme-font-color-1) !important;
  }
  :global(.itb-widget .summary .title .text) {
    color: var(--theme-font-color-2) !important;
  }
  :global(.itb-widget .powered-by .text) {
    color: var(--theme-font-color-1) !important;
  }
  :global(.itb-widget .signals .title) {
    color: var(--theme-font-color-2) !important;
  }
`;

export default ItbWidget;
