import { ScrollXWrap } from '@/components/scroll-x-wrap';
import { getZendeskLink } from '@/components/zendesk';
import { useRouter } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { SUBSCRIBE_TYPES, useWs } from '@/core/network';
import { DetailMap, TradeMap } from '@/core/shared';
import {} from '@/core/utils';
import { Tooltip } from 'antd';
import { useEffect, useState } from 'react';
import { CoinDes } from '../coin-des';
import { FundingRateCountdown, FundingRateType } from '../funding-rate-countdown';

export const Lite = () => {
  const [data, setData] = useState<DetailMap>();
  const id = useRouter().query.id as string;
  const [coin, setCoin] = useState('');
  const [name, setName] = useState('');

  useEffect(() => {
    TradeMap.getLiteById(id).then((res) => {
      if (res) {
        setCoin(res.coin);
        setName(res.name);
      }
    });
  }, [id]);

  useWs(SUBSCRIBE_TYPES.ws4001, (data) => setData(data));
  return (
    <>
      <div className='k-header'>
        <div className='k-header-left'>
          <CoinDes id={id} name={name} />
          <div className='price' style={{ color: `var(${data?.isUp ? '--color-green' : '--color-red'})` }}>
            {data?.price}
          </div>
        </div>
        <ScrollXWrap wrapClassName='k-header-center'>
          <div className='k-header-left-item'>
            <span>{LANG('涨跌额')}</span>
            <span style={{ color: `var(${data?.isUp ? '--color-green' : '--color-red'})` }}>{data?.ratePrice}</span>
          </div>
          <div className='k-header-left-item'>
            <span>{LANG('涨跌幅')}</span>
            <span style={{ color: `var(${data?.isUp ? '--color-green' : '--color-red'})` }}>{data?.rate}%</span>
          </div>
          <div className='k-header-left-item'>
            <span>{LANG('今日最高')}</span>
            <span>{data?.maxPrice?.toFormat()}</span>
          </div>
          <div className='k-header-left-item'>
            <span>{LANG('今日最低')}</span>
            <span>{data?.minPrice?.toFormat()}</span>
          </div>
          <div className='k-header-left-item'>
            <span>
              {LANG('24H 成交量')}({coin})
            </span>
            <span>{data?.volume?.toFormat()}</span>
          </div>
          <div className='k-header-left-item'>
            <Tooltip
              placement='bottom'
              overlayClassName='lite-header-tooltip-wrapper'
              align={{
                offset: [0, 20],
              }}
              title={
                <span
                  dangerouslySetInnerHTML={{
                    __html: LANG(
                      '买方及卖方在下个资金时段要交换的资金费率。费率为正，买方支付卖方。费率为负，卖方支付买方。{more}',
                      {
                        more: `<a target={'_blank'} href="${getZendeskLink('/articles/5692891995919')}">${LANG(
                          '了解更多'
                        )}</a>`,
                      }
                    ),
                  }}
                />
              }
            >
              <span className='shiftLabel'>{LANG('資金費率/倒計時')}</span>
            </Tooltip>
            {data?.isOpen ? <FundingRateCountdown type={FundingRateType.LITE} /> : <span>--</span>}
          </div>
        </ScrollXWrap>
      </div>
      <style jsx>
        {`
          .k-header {
            display: flex;
            flex: 1;
            justify-content: space-between;
            align-items: center;
            color: var(--theme-trade-text-color-1);
            overflow: hidden;
            .k-header-left {
              padding-left: 15px;
              display: flex;
              justify-content: space-between;
              align-items: center;

              .price {
                font-size: 20px;
                margin-left: 20px;
              }
            }

            :global(.k-header-center) {
              display: flex;
              flex: 1;
              margin-left: 30px;
              white-space: nowrap;

              .k-header-left-item {
                margin-right: 20px;
                display: flex;
                flex-direction: column;
                font-size: 12px;
                justify-content: space-between;
                > span:nth-child(1) {
                  color: var(--theme-font-color-2);
                }
              }
            }
          }
          :global(.lite-header-tooltip-wrapper) {
            :global(.ant-tooltip-inner) {
              background: var(--theme-background-color-2-3) !important;
              color: var(--theme-font-color-1);
              padding: 15px;
              width: 450px;
              white-space: normal;
            }
          }
        `}
      </style>
    </>
  );
};
