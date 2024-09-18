import CommonIcon from '@/components/common-icon';
import { linkClassName, linkStyles } from '@/components/link';
import { getZendeskLink } from '@/components/zendesk';
import { useRouter } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { useWs1050 } from '@/core/network';
import { Group, Swap, TradeMap } from '@/core/shared';
import { formatDefaultText } from '@/core/utils';
import { useEffect, useRef, useState } from 'react';
import Tooltip from '../common/tooltip';

export const MarkPrice = () => {
  let [indexPrice, setIndexPrice] = useState(0);
  const id = useRouter().query.id as string;
  const ref = useRef<{ id: string; digit: number }>({ id: '', digit: 2 });

  const { baseShowPrecision } = Swap.Info.getCryptoData(id);

  useEffect(() => {
    (async () => {
      const swapTradeItem = await TradeMap.getSwapById(id);
      setIndexPrice(swapTradeItem?.flagPrice || 0);
    })();
  }, [id]);

  useEffect(() => {
    Group.getInstance().then((group) => {
      ref.current = {
        id,
        digit: group.getPriceDigit(id),
      };
    });
  }, [id]);

  useWs1050((data) => {
    try {
      const { id, digit } = ref.current;
      if (id) {
        setIndexPrice(data[id].currentPrice.toFixed(digit));
      }
    } catch {}
  });

  return (
    <>
      <Tooltip
        placement='top'
        title={
          <>
            <div
              dangerouslySetInnerHTML={{
                __html: LANG(
                  '标记价格由实时指数价格和即将到来的资金费率决定，反映该合约当前的合理价格。标记价格用于强平触发。{more}',
                  {
                    more: `<a target={'_blank'} class="${linkClassName} link" href="${getZendeskLink(
                      '/articles/5693586874383'
                    )}">${LANG('了解更多')}</a>`,
                  }
                ),
              }}
            />
            {linkStyles}
          </>
        }
      >
        <div className='mark-price'>
          <CommonIcon name='common-flag-0' size={16} enableSkin />
          <span className='price'>{formatDefaultText(indexPrice?.toFixed(baseShowPrecision))}</span>
        </div>
      </Tooltip>
      <style jsx>{`
        .mark-price {
          cursor: pointer;
          display: flex;
          margin-left: 8px;
          align-items: center;

          .price {
            margin-left: 4px;
            font-weight: 500;
            color: var(--theme-trade-text-color-1);
            border-bottom: 1px dashed var(--theme-trade-text-color-2);
          }
        }
      `}</style>
    </>
  );
};
