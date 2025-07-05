import CommonIcon from '@/components/common-icon';
import { useRouter, useTheme } from '@/core/hooks';
import { TrLink } from '@/core/i18n';
import { TradeMap } from '@/core/shared';
import React, { useEffect, useState } from 'react';

const SwapLink = () => {
  const { theme } = useTheme();
  const routerId = useRouter().query.id as string;

  const [level, setLevel] = useState(0);
  const [id, setId] = useState('');

  useEffect(() => {
    routerId && setSwapLink();
  }, [routerId]);

  // 判断是否存在当前币种的永续合约，存在的话添加跳转链接
  const setSwapLink = async () => {
    const res = await TradeMap.getSwapById(routerId.replace('_', '-'));

    if (res) {
      setLevel(res.leverageLevel);
      setId(res.id.toLocaleLowerCase());
    } else {
      setId('');
    }
  };

  if (!id) return null;

  return (
    <>
      <TrLink href={`/swap/${id}`} className={`swap-link ${theme}`}>
        <button>
          <span>{level}x</span>
          <CommonIcon name='common-trade-arrow-right-0' size={12} enableSkin />
        </button>
      </TrLink>
      <style jsx>{`
        :global(.swap-link) {
          font-size: 12px;
          font-weight: 500;
          button {
            display: flex;
            align-items: center;
            color: var(--skin-font-color);
            height: 20px;
            line-height: 19px;
            border-radius: 5px;
            font-size: 12px;
            font-weight: 600;
            background: var(--skin-primary-color);
            cursor: pointer;
            text-decoration: none;
            outline: none;
            border: none;
            > span {
              margin-right: 3px;
            }
          }
        }
      `}</style>
    </>
  );
};

export default React.memo(SwapLink);
