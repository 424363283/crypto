import { Svg } from '@/components/svg';
import { Zendesk } from '@/components/zendesk';
import { LANG } from '@/core/i18n';
import { clsx } from '@/core/utils';
import { useState } from 'react';

export const WhatIsWallet = () => {
  const [expand, setExpand] = useState(false);

  return (
    <>
      <div className='what-is-wallet'>
        <div className='header' onClick={() => setExpand((v) => !v)}>
          <div>{LANG('什么是合约子钱包？')}</div>
          <Svg
            className={clsx(expand && 'arrow')}
            src={'/static/images/swap/wallet/double_arrow.svg'}
            width={12}
            height={12}
          />
        </div>
        {expand && (
          <div className='texts'>
            <div>
              {LANG(
                '{APP_NAME}子錢包功能並非子帳號，用於永續合約交易分倉使用，使用戶更好的管理資產風險，詳情您可以點擊下方查看更多文章。',
                { APP_NAME: process.env.NEXT_PUBLIC_APP_NAME }
              )}
            </div>
            <div>{LANG('注：子錢包創建後不可刪除，建議您依照交易策略決定是否創建。')}</div>
          </div>
        )}
        <Zendesk className='more' href='/articles/7290503394063'>
          {LANG('查看更多文章')}
        </Zendesk>
      </div>
      <style jsx>{`
        .what-is-wallet {
          padding-bottom: 20px;
          .header {
            cursor: pointer;
            color: var(--text_1);
            padding: 20px 0 6px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            :global(.arrow) {
              transform: rotate(180deg);
            }
          }
          .texts {
            padding-bottom: 16px;
            > div:first-child {
              margin-bottom: 5px;
            }
          }
          :global(.more) {
            margin-top: 10px;
            color: var(--skin-main-font-color);
          }
        }
      `}</style>
    </>
  );
};
