import CoinLogo from '@/components/coin-logo';
import { Mobile } from '@/components/responsive';
import { Svg } from '@/components/svg';
import { useRouter } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { TradeMap } from '@/core/shared';
import { MediaInfo, formatDefaultText, isSpot } from '@/core/utils';
import dayjs from 'dayjs';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import css from 'styled-jsx/css';
import { Dropdown, MenuProps } from 'antd';

const Overview = ({ data, isMobile = false }: { data: any; isMobile?: boolean }) => {
  const totalPrice = data?.low?.add(data?.high);
  const lowPercent = data?.low?.div(totalPrice).mul(100);
  const lowWidth = lowPercent < 5 ? 5 : lowPercent;
  const highWidth = lowPercent < 5 ? 95 : '100'.sub(lowPercent);
  const rack = data?.rack?.split(',');
  const router = useRouter();
  const routerId = router.query.id as string;
  const [currentSpotScale, setCurrentSpotScale] = useState(2);
  const [chatItems, setChatItems] = useState([]);

  useEffect(() => {
    (async () => {
      if (isSpot(routerId)) {
        const spotTradeItem = await TradeMap.getSpotById(routerId);
        setCurrentSpotScale(spotTradeItem?.digit || 2);
      }
    })();
  }, [routerId]);

  useEffect(() => {
    const items = data?.chat?.split(',').map((item: any, index: any) => ({
      key: index,
      label: <Link className='link' href={item} target='_blank' rel='noreferrer'>
        <span>{item}</span>
      </Link>
    }));
    setChatItems(items || []);

  }, [data?.chat]);

  const renderMediaWrapper = () => {
    if (data?.twitter || data?.telegram || data?.reddit || data?.chat) {
      return (
        <>
          <div className='media-wrapper'>
            <div className='title'>{LANG('社交媒体')}</div>
            <div className='container'>
              {data?.twitter && (
                <Link className='link' href={formatDefaultText(data?.twitter)} target='_blank' rel='noreferrer'>
                  <Svg src='/static/images/trade/header/twitter.svg' width={28} height={28} />
                  <span>Twitter</span>
                </Link>
              )}
              {data?.telegram && (
                <Link className='link' href={formatDefaultText(data?.telegram)} target='_blank' rel='noreferrer'>
                  <Svg src='/static/images/trade/header/telegram.svg' width={28} height={28} />
                  <span>Telegram</span>
                </Link>
              )}
              {data?.reddit && (
                <Link className='link' href={formatDefaultText(data?.reddit)} target='_blank' rel='noreferrer'>
                  <Svg src='/static/images/trade/header/reddit.svg' width={28} height={28} />
                  <span>Reddit</span>
                </Link>
              )}
              {/* data?.chat && (
                <Link className='link' href={formatDefaultText(data?.chat)} target='_blank' rel='noreferrer'>
                  <Svg src='/static/images/trade/header/chat.svg' width={28} height={28} />
                  <span>Chat</span>
                </Link>
              ) */}
              {data?.chat && <Dropdown
                menu={{ items: chatItems }}
                overlayClassName=''
                placement='topLeft'
                trigger={['hover']} >
                <div className='chat' >
                  <Svg src='/static/images/trade/header/chat.svg' width={28} height={28} />
                  <span>Chat</span>
                </div>
              </Dropdown>}
            </div>
          </div>
          <style jsx>{`
            .media-wrapper {
              display: flex;
              flex-direction: column;
              align-items: flex-start;
              gap: 16px;
              align-self: stretch;
              .title {
                color: var(--text_1);
                font-weight: 500;
              }
              .container {
                display: flex;
                align-items: center;
                gap: 16px;
                :global(a) {
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  line-height: normal;
                  color: var(--text_1);
                  gap: 8px;
                }
                .chat {
                  display: flex;
                  flex-direction: column;
                  align-items: flex-start;
                  cursor: pointer;
                  gap: 8px;
                  span {
                    line-height: normal;
                  }
                }
              }
            }
          `}</style>
        </>
      );
    }
    return <></>;
  };

  return (
    <>
      <div className={`content`}>
        <div className='left'>
          <div className='header'>
            <div className='left'>
              {data?.code && <CoinLogo coin={data?.code} width='24' height='24' alt={data?.code} />}
              <span className='name'>{formatDefaultText(data.isEtf ? data?.id : data?.coin)}</span>
              <span className='subtitle'>{formatDefaultText(data?.etfTitle ? data?.etfTitle : data?.fullname)}</span>
            </div>
            {!isMobile && !data.isEtf && (
              <div className='right'>
                <div className='from'>
                  {LANG('数据来自')}
                  <Svg
                    src={'/static/images/trade/header/coinMarketCap.svg'}
                    width={95}
                    height={16}
                    className='coinMarketCap_icon'
                  />
                </div>
              </div>
            )}
          </div>
          {!data.isEtf ? (
            <div
              className='introduction'
              dangerouslySetInnerHTML={{
                __html: formatDefaultText(data?.introduce?.replace(/\n+\s{1,2}/g, '\n')),
              }}
            />
          ) : (
            <div className='introduction'>
              {LANG(
                `风险提示：交易前请注意查看净值价格，该产品在极端行情下会存在价格趋近于归零的风险，请投资者注意控制风险。`
              )}
              <br />
              {LANG(
                `1.“3”为追踪标的资产涨跌幅的3倍，“L”为做多，“S”为做空。当标的资产上涨1%时，3L上涨3%，3S下跌3%。当标的资产下跌1%时，3L下跌3%，3S上涨3%。`
              )}
              <br />
              {LANG(`2.每天0点（UTC+8）会进行定时再平衡，更新净值基准值和标的资产基准值。`)}
              <br />
              {LANG(
                `3.一个再平衡周期内，标的资产涨跌幅触发15%，将进行阈值再平衡，更新净值基准值和标的资产基准值，防止爆仓。`
              )}
              <br />
              {LANG(`4.净值为该ETF产品的实际价值，所以请用户在参与交易时价格不要偏离净值过大，避免造成不必要的损失。`)}
              <br />
              {LANG(
                `5.当ETF产品的净值低于0.1时会触发合并机制，该ETF产品的净值变为合并前的10倍，同时该ETF产品的数量也会变为合并前的1/10，用户总资产价值不会受任何影响，以提高价格变化灵敏度，优化交易体验。`
              )}
            </div>
          )}

          {!data.isEtf && (
            <div className='link-wrapper'>
              <Link className='link' href={formatDefaultText(data?.website)} target='_blank' rel='noreferrer'>
                {LANG('官网')}
              </Link>
              <Link
                className='link'
                href={formatDefaultText(data?.explorer?.split(',')?.[0])}
                target='_blank'
                rel='noreferrer'
              >
                {LANG('浏览器')}
              </Link>
              {data?.github && (
                <Link className='link' href={formatDefaultText(data?.github)} target='_blank' rel='noreferrer'>
                  Github
                </Link>
              )}
            </div>
          )}
          {!isMobile && !data.isEtf && renderMediaWrapper()}
        </div>
        <div className='right'>
          <div className='base-info'>{LANG('基本信息')}</div>
          {data?.rack && (
            <>
              <div className='publish'>{LANG('大所上币')}</div>
              <div className='icon-wrapper'>
                {rack.includes('Binance') && (
                  <div className='item'>
                    <Svg src='/static/images/trade/header/binance.svg' width={18} height={18} />
                    <span>Binance</span>
                  </div>
                )}
                {rack.includes('Coinbase') && (
                  <div className='item'>
                    <Svg src='/static/images/trade/header/coinbase.svg' width={18} height={18} />
                    <span>Coinbase</span>
                  </div>
                )}
                {rack.includes('CoinList') && (
                  <div className='item'>
                    <Svg src='/static/images/trade/header/coinlist.svg' width={18} height={18} />
                    <span>Coinlist</span>
                  </div>
                )}
              </div>
            </>
          )}
          <ul className='info-wrapper'>
            <li>
              <div>{LANG('发行时间')}</div>
              <div>{formatDefaultText(data?.date)}</div>
            </li>
            {data.isEtf ? (
              <>
                <li>
                  <div>{LANG('发行价格')}</div>
                  <div>{data?.price}</div>
                </li>
                <li>
                  <div>{LANG('管理费率')}</div>
                  <div>{data?.managerRate?.mul(100)}%</div>
                </li>
              </>
            ) : (
              <>
                <li>
                  <div>{LANG('市场占有率')}</div>
                  <div>{formatDefaultText(data?.marketCapDominance?.toFixed(3))}%</div>
                </li>
                <li>
                  <div>
                    {LANG('流通')}/{LANG('最大')}
                  </div>
                  <div>
                    {data?.flow?.toFormatUnit()}
                    <span> / {data?.total?.toFormatUnit()}</span>
                  </div>
                </li>
                <li>
                  <div>ROI</div>
                  <div className={Number(data?.percentChange) > 0 ? 'raise' : 'fall'}>
                    {`${Number(data?.percentChange) > 0 ? '+' : ''} ${formatDefaultText(
                      data?.percentChange?.toFormat(2)
                    )}`}
                    %
                  </div>
                </li>
              </>
            )}
          </ul>
          {!data.isEtf && (
            <div className='price-wrapper'>
              <div className='price-container'>
                {/* 
                  <div>${formatDefaultText(data?.low?.toFormat(currentSpotScale))}</div>
                  <div>${formatDefaultText(data?.high?.toFormat(currentSpotScale))}</div> 
                */}
                <div>${formatDefaultText(data?.low || 0)}</div>
                <div>${formatDefaultText(data?.high || 0)}</div>
              </div>
              <div className='percent-wrapper'>
                {data?.low !== null ? (
                  <>
                    <div className='low' style={{ width: `${lowWidth}%` }} />
                    <div className='high' style={{ width: `${highWidth}%` }} />
                  </>
                ) : (
                  <div className='none' style={{ width: '100%' }} />
                )}
              </div>
              <div className='price-container'>
                <div>
                  {LANG('最低价')} · {data?.lowTime ? dayjs(data?.lowTime).format('YYYY/MM/DD') : '--'}
                </div>
                <div>
                  {data?.highTime ? dayjs(data?.highTime).format('YYYY/MM/DD') : '--'} · {LANG('最高价')}
                </div>
              </div>
            </div>
          )}
          <Mobile>{renderMediaWrapper()}</Mobile>
          <Mobile>
            {!data?.isEtf && (
              <div className='from'>
                {LANG('数据来自')}
                <Svg
                  src={'/static/images/trade/header/coinMarketCap.svg'}
                  width={95}
                  height={16}
                  className='coinMarketCap_icon'
                />
              </div>
            )}
          </Mobile>
        </div>
      </div>
      <style jsx>{styles}</style>
    </>
  );
};

const styles = css`
  .content {
    display: flex;
    align-self: stretch;
    align-items: flex-start;
    color: var(--text_1);
    gap: 24px;
    @media ${MediaInfo.tablet} {
      flex-direction: column;
      width: 469px;
      height: 690px;
      .left,
      .right {
        width: 100%;
      }
    }
    @media ${MediaInfo.mobile} {
      flex-direction: column;
      height: 450px;
      overflow: auto;
      width: 100%;
      padding: 16px;
      .left {
        width: 100%;
        margin-right: 0;
        .link-wrapper {
          margin-top: 12px;
          display: flex;
          :global(a) {
            font-size: 12px;
            flex: 1;
            text-align: center;
            padding: 8px;
            background: var(--fill_3);
            color: var(--text_1);
            margin-right: 4px;
            border-radius: 6px;
            &:last-child {
              margin-right: 0;
            }
          }
        }
      }
      .right {
        width: 100%;
        margin-top: 15px;
        .base-info {
          padding-bottom: 12px;
        }
        .publish {
          margin-top: 12px;
        }
      }
    }
    > .left {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 16px;
      flex: 1 0 0;
      .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        align-self: stretch;
        .left {
          display: flex;
          align-items: center;
        }
        .name {
          font-size: 16px;
          font-weight: 700;
          margin-left: 10px;
          margin-right: 4px;
        }
        .subtitle {
          font-size: 12px;
          color: var(--text_2);
        }
        .right {
          display: flex;
          flex-direction: row;
          justify-content: flex-end;
          align-items: center;
        }
      }
      .introduction {
        white-space: normal;
        word-break: normal;
        color: var(--text_1);
        height: 130px;
        overflow-y: auto;
      }
      .link-wrapper {
        display: flex;
        align-items: flex-start;
        gap: 8px;
        align-self: stretch;
        :global(a) {
          flex: 1;
          text-align: center;
          padding: 8px;
          background: var(--fill_3);
          color: var(--text_1);
          border-radius: 6px;
          &:last-child {
            margin-right: 0;
          }
        }
      }
    }
    .right {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 16px;
      flex: 1 0 0;
      .base-info {
        color: var(--text_1);
        font-weight: 500;
      }
      .publish {
        color: var(--text_2);
      }
      .icon-wrapper {
        display: flex;
        align-items: flex-start;
        gap: 8px;
        align-self: stretch;
        .item {
          display: flex;
          padding: 8px 0px;
          justify-content: center;
          align-items: center;
          gap: 8px;
          flex: 1 0 0;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 6px;
          background: var(--fill_3);
          color: var(--text_1);
          border-radius: 6px;
          cursor: default;
        }
      }
      .info-wrapper {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        align-self: stretch;
        flex-direction: column;
        gap: 16px;
        flex: 1 0 0;
        padding: 0;
        margin: 0;
        li {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          align-self: stretch;
          > div {
            &:first-child {
              color: var(--text_2);
            }
            span {
              color: var(--text_2);
            }
            &.raise {
              color: var(--color-green);
            }
            &.fall {
              color: var(--color-red);
            }
          }
        }
      }
      .from {
        display: flex;
        justify-content: center;
        align-items: center;
        color: var(--text_2);
        :global(.coinMarketCap_icon) {
          margin-left: 5px;
        }
      }
      .price-wrapper {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: stretch;
        align-self: stretch;
        gap: 10px;
        .price-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          &:first-child {
            color: var(--text_1);
          }
          &:last-child {
            color: var(--text_2);
          }
        }
        .percent-wrapper {
          display: flex;
          align-items: center;
          .low,
          .high,
          .none {
            height: 6px;
            border-radius: 3px;
          }
          .low {
            background: var(--yellow);
            position: relative;
            &:after {
              content: ' ';
              display: inline-block;
              height: 6px;
              width: 4px;
              background: var(--fill_bg_1);
              position: absolute;
              right: -4px;
              border-top-right-radius: 3px;
              border-bottom-right-radius: 3px;
            }
          }
          .high {
            background: var(--red);
          }
          .none {
            background: var(--fill_3);
          }
        }
      }
    }
  }
`;

export default Overview;
