import { Svg } from '@/components/svg';
import { useFormatCryptoName, useRouter, useTheme } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { isSwapCoin, isSwapDemo, isSwapSLCoin, isSwapSLUsdt, isSwapUsdt } from '@/core/utils';
import { Popover } from 'antd';
import { useState } from 'react';
import { useLocation } from 'react-use';
import { QuoteList } from './quote-list';

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
  return (
    <>
      <Popover
        overlayInnerStyle={{
          backgroundColor: 'var(--theme-trade-bg-color-6)',
          padding: 0,
          marginLeft: 6,
          border: '1px solid var(--theme-trade-border-color-1)',
        }}
        open={open}
        placement='bottom'
        arrow={false}
        onOpenChange={(v) => setOpen(v)}
        content={() => <QuoteList toast visible={open} onClickItem={() => setOpen(false)} />}
      >
        <div className='coin-name-wrap'>
          <Svg
            src={
              isDark
                ? '/static/images/trade/header/collapse-mobile.svg'
                : '/static/images/trade/header/collapse-mobile-light.svg'
            }
            width='18'
            height='14.74425'
            className='icon'
          />
          <div className='coin-name'>
            <h1 className='id'>{formatSwapCryptoName(id)}</h1>
            <span className='text'>{text}</span>
          </div>
        </div>
        <style jsx>{`
          .coin-name-wrap {
            display: flex;
            align-items: center;
            :global(.icon) {
              margin-right: 11px;
            }
          }
          .coin-name {
            display: flex;
            flex-direction: column;
            position: relative;
            min-width: 100px;
            padding-right: 25px;

            cursor: pointer;
            .id {
              font-size: 16px;
              font-weight: 500;
            }
            .text {
              font-size: 12px;
              color: var(--theme-trade-text-color-3);
            }
            &::after {
              content: '';
              display: block;
              position: absolute;
              right: 0;
              top: 2px;
              width: 1px;
              height: 30px;
              background-color: var(--theme-trade-border-color-2);
            }
          }
        `}</style>
      </Popover>
    </>
  );
};
