import { Svg } from '@/components/svg';
import { useFormatCryptoName, useRouter, useTheme } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { isSwapCoin, isSwapDemo, isSwapSLCoin, isSwapSLUsdt, isSwapUsdt } from '@/core/utils';
import { Popover } from 'antd';
import { createContext, useRef, useState } from 'react';
import { useLocation } from 'react-use';
import { QuoteList } from './quote-list';
import CommonIcon from '@/components/common-icon';
import { QuoteListContext } from '@/components/trade-ui/quote-list';

export const CoinName = () => {
  const isDemoSwap = isSwapDemo(useLocation().pathname);
  const { isDark } = useTheme();
  const [open, setOpen] = useState(false);
  const id = (useRouter().query.id as string) || '';
  const text = !isDemoSwap
    ? isSwapUsdt(id)
    : isSwapSLUsdt(id)
      ? LANG('永续U本位')
      : !isDemoSwap
        ? isSwapCoin(id)
        : isSwapSLCoin(id)
          ? LANG('永续币本位')
          : 'unknown';
  const { formatSwapCryptoName } = useFormatCryptoName();
  const quoteListApi = useRef({ clearSearchInput: () => {} });
  return (
    <>
      <QuoteListContext.Provider value={{ quoteListApi }}>
        <Popover
          overlayInnerStyle={{
            backgroundColor: 'var(--dropdown-select-bg-color)',
            boxShadow: '0px 4px 16px 0px var(--dropdown-select-shadow-color)',
            padding: 0,
            marginLeft: 6,
            borderRadius: 24,
            border: '1px solid transparent',
          }}
          open={open}
          placement='bottom'
          arrow={false}
          onOpenChange={(v) => {
            setOpen(v);
            setTimeout(() => quoteListApi.current.clearSearchInput(), 100);
          }}
          content={() => <QuoteList toast visible={open} onClickItem={() => setOpen(false)} />}
        >
          <div className='coin-name-wrap'>
            <CommonIcon name='common-collapse-mobile' className='icon' size={24} />
            <div className='coin-name'>
              <h1 className='id'>{formatSwapCryptoName(id)}</h1>
              <span className='text'>{text}</span>
            </div>
            <CommonIcon name='common-tiny-triangle-down' size={24} />
          </div>
          <style jsx>{`
          .coin-name-wrap {
            display: flex;
            position: relative;
            align-items: center;
            :global(>:not(:last-child)) {
              margin-right: 8px;
            }
          }
          .coin-name {
            display: flex;
            flex-direction: column;
            position: relative;
            cursor: pointer;
            .id {
              font-size: 20px;
              font-weight: 700;
              color: var(--text_1);
            }
            .text {
              font-size: 12px;
              color: var(--text_2);
            }
          }
        `}</style>
        </Popover>
      </QuoteListContext.Provider>
    </>
  );
};
