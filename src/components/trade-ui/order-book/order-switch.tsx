import CommonIcon from '@/components/common-icon';
import { clsx } from '@/core/utils';
import { Svg } from '@/components/svg';
import { useResponsive, useTheme } from '@/core/hooks';
import { RootColor } from '@/core/styles/src/theme/global/root';

export const OrderSwitch = ({ value, onChange }: { value: number; onChange: (value: 0 | 1 | 2) => any }) => {
  const { isDark } = useTheme();
  const index = RootColor.getColorIndex;

  let darkMap = {
    1: {
      all: '/static/images/orderbook/all',
      buy: '/static/images/orderbook/buy',
      sell: '/static/images/orderbook/sell'
    },
    2: {
      all: '/static/images/orderbook/red/all',
      buy: '/static/images/orderbook/red/buy',
      sell: '/static/images/orderbook/red/sell'
    },
    3: {
      all: '/static/images/orderbook/blue/all',
      buy: '/static/images/orderbook/blue/buy',
      sell: '/static/images/orderbook/blue/sell'
    },
    4: {
      all: '/static/images/orderbook/cad/all',
      buy: '/static/images/orderbook/cad/buy',
      sell: '/static/images/orderbook/cad/sell'
    }
  };

  let lightMap = {
    1: {
      all: '/static/images/orderbook/',
      buy: '/static/images/orderbook/',
      sell: '/static/images/orderbook/'
    },
    2: {
      all: '/static/images/orderbook/red/',
      buy: '/static/images/orderbook/red/',
      sell: '/static/images/orderbook/red/'
    },
    3: {
      all: '/static/images/orderbook/blue/',
      buy: '/static/images/orderbook/blue/',
      sell: '/static/images/orderbook/blue/'
    },
    4: {
      all: '/static/images/orderbook/cad/',
      buy: '/static/images/orderbook/cad/',
      sell: '/static/images/orderbook/cad/'
    }
  };

  return (
    <>
      <div className="order-book-active-list-wrap">
        <div className={clsx('order-book-active-item', value === 0 && 'active')} onClick={() => onChange(0)}>
          {isDark ? (
            <Svg
              width={24}
              height={24}
              src={`${darkMap[index as keyof typeof darkMap]['all']}${value === 0 ? '' : '-no'}.svg`}
            />
          ) : (
            <Svg
              width={24}
              height={24}
              src={`${lightMap[index as keyof typeof darkMap]['all']}${value === 0 ? 'lightAll' : 'lightAll-no'}.svg`}
            />
          )}
        </div>
        <div className={clsx('order-book-active-item', value === 1 && 'active')} onClick={() => onChange(1)}>
          {isDark ? (
            <Svg
              width={24}
              height={24}
              src={`${darkMap[index as keyof typeof darkMap]['buy']}${value === 1 ? '' : '-no'}.svg`}
            />
          ) : (
            <Svg
              width={24}
              height={24}
              src={`${lightMap[index as keyof typeof darkMap]['buy']}${value === 1 ? 'lightbuy' : 'lightbuy-no'}.svg`}
            />
          )}
        </div>
        <div className={clsx('order-book-active-item', value === 2 && 'active')} onClick={() => onChange(2)}>
          {isDark ? (
            <Svg
              width={24}
              height={24}
              src={`${darkMap[index as keyof typeof darkMap]['sell']}${value === 2 ? '' : '-no'}.svg`}
            />
          ) : (
            <Svg
              width={24}
              height={24}
              src={`${lightMap[index as keyof typeof darkMap]['sell']}${
                value === 2 ? 'lightsell' : 'lightsell-no'
              }.svg`}
            />
          )}
        </div>
      </div>
      <style jsx>{`
        .order-book-active-list-wrap {
          display: flex;
        }
        .order-book-active-item {
          flex: 1;
          height: 24px;
          width: 24px;
          display: flex;
          justify-content: center;
          align-items: center;
          margin-right: 8px;
          cursor: pointer;
          border: 1px solid var(--fill_line_1);
          border-radius: 4px;
        }
      `}</style>
    </>
  );
};
