import { useState, useMemo } from 'react';
import Image from 'next/image';
import { Drawer, Input } from 'antd';
import { LANG } from '@/core/i18n';
import CommonIcon from '@/components/common-icon';
import { SUBSCRIBE_TYPES, useWs } from '@/core/network';
import { CURRENT_TAB } from '@/pages/[locale]/markets/store';
import { Markets, Group } from '@/core/shared';
import CoinLogo from '@/components/coin-logo';
import { clsx } from '@/core/utils/src/clsx';
import { useRouter } from '@/core/hooks/src/use-router';
import { useTradeHrefData } from '@/core/i18n/src/components/trade-link';
import { EmptyComponent } from '@/components/empty';
import { BasicInput, INPUT_TYPE } from '@/components/basic-input';
import { Size } from '@/components/constants';

interface MarketItem {
  id: string;
  name: string;
  fullName: string;
  icon: string;
  price: string;
  rate: string;
  coin: string;
  quoteCoin: string;
  type: string;
  isUp: boolean;
}

interface SearchDrawerProps {
  open: boolean;
  onClose: () => void;
  onSearch: (value: string) => void;
}

export const SearchDrawer = ({ open, onClose, onSearch }: SearchDrawerProps) => {
  const router = useRouter();
  const { getHrefAndQuery } = useTradeHrefData();
  const [list, setList] = useState<Record<string, MarketItem[]>>({});
  const [searchKey, setSearchKey] = useState('');

  useWs(SUBSCRIBE_TYPES.ws3001, async (detail: any) => {
    const group = await Group.getInstance();
    setList({
      //   [CURRENT_TAB.SPOT_GOODS]: Markets.getMarketList(detail, group.getHotSpotCoinIds()),
      [CURRENT_TAB.PERPETUAL]: Markets.getMarketList(detail, group.getHotSwapUsdtIds())
    });
  });

  const resultList = useMemo(() => {
    const allMarkets = Object.values(list).flat();
    if (!searchKey) return allMarkets;

    const lowerCaseSearchKey = searchKey.toLowerCase();
    return allMarkets.filter(
      item =>
        item.name.toLowerCase().includes(lowerCaseSearchKey) || item.fullName.toLowerCase().includes(lowerCaseSearchKey)
    );
  }, [searchKey, list]);

  const handleSearch = (value: string) => {
    setSearchKey(value);
    onSearch?.(value);
  };

  const handleItemClick = (id: string) => {
    const { href, query } = getHrefAndQuery(id.toUpperCase());
    router.push({ pathname: href, query });
    onClose();
  };

  return (
    <Drawer placement="bottom" onClose={onClose} open={open} height="100%" className="search-drawer">
      <div className="search-content">
        <div className="search-input-wrapper">
          <BasicInput
            label={''}
            type={INPUT_TYPE.NORMAL_TEXT}
            placeholder={LANG('搜索')}
            value={searchKey}
            size={Size.DEFAULT}
            rounded
            clearable={true}
            prefix={<CommonIcon size={16} className="prefix-icon" name="common-search-0" />}
            onInputChange={(val: string) => handleSearch(val)}
          />
        </div>
        {/* <Input
          autoFocus
          placeholder={LANG('搜索')}
          prefix={<CommonIcon name="common-search" size={20} className="search-icon" />}
          onChange={({ target: { value } }) => handleSearch(value)}
        /> */}
        {resultList.length > 0 && (
          <div className="search-hot-container">
            <Image src="/static/images/common/hot.svg" width="24" height="24" alt="hot" className="hot" />
            <span>{LANG('热门搜索')}</span>
          </div>
        )}
        <div className="search-results">
          {resultList.length > 0 ? (
            resultList.map((item, index) => (
              <div key={`${item.name}-${index}`} className="result-item" onClick={() => handleItemClick(item.id)}>
                <div className="left">
                  <CoinLogo width="32" height="32" className="icon" coin={item.coin} />
                  <div className="info">
                    <span className="symbol">
                      {item.coin}/{item.quoteCoin}
                    </span>
                  </div>
                </div>
                <div className="right">
                  <div className="price-wrap">
                    <span className="price">{item.price}</span>
                    <div className={clsx('rate', item.isUp ? 'positive-text' : 'negative-text')}>{item.rate}%</div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="empty">
              <EmptyComponent text={LANG('暂无数据')} />
            </div>
          )}
        </div>
      </div>
      <style jsx>{`
        :global(.search-drawer) {
          background: var(--fill_1) !important;
          overflow: hidden;
          :global(.ant-drawer-header) {
            padding: 0 !important;
            text-align: right;
            border-bottom: 1px solid var(--fill_line_1) !important;
          }
          :global(.ant-drawer-header-title) {
            height: 44px;
            position: relative;
          }
          :global(.ant-drawer-close) {
            position: absolute;
            right: 16px;
            top: 50%;
            transform: translateY(-50%);
            font-size: 20px;
            :global(svg) {
              color: var(--text_2);
              cursor: pointer;
            }
          }
          :global(.ant-drawer-body) {
            padding: 0 !important;
          }
          :global(.search-icon) {
            color: var(--text_2);
          }
        }
        .search-content {
          padding: 16px 24px;
          :global(.ant-input-affix-wrapper) {
            border-radius: 40px;
            height: 44px;
            background: var(--fill_2);
            border: none;
          }
          :global(.ant-input) {
            background: var(--fill_2);
            color: var(--text_1);
          }
          :global(.ant-input::placeholder) {
            color: var(--text_2);
          }
        }
        .search-input-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          :global(.basic-input-box) {
            background: var(--fill_3);
            &:hover {
              background: var(--fill_1);
            }
          }
        }
        .search-hot-container {
          display: flex;
          justify-content: flex-start;
          align-items: center;
          gap: 4px;
          margin-top: 1rem;
          height: 2.5rem;
          font-size: 14px;
          color: var(--text_2);
          line-height: normal;
        }
        .search-results {
          margin-top: 8px;
          .result-item {
            cursor: pointer;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 12px 0;
            border-bottom: 1px solid var(--line-color);
            &:hover {
              background: var(--fill_2);
            }
            .left {
              display: flex;
              align-items: center;
              gap: 8px;
              .info {
                display: flex;
                flex-direction: column;
                gap: 2px;
                .symbol {
                  font-size: 14px;
                  font-weight: 500;
                  color: var(--text_1);
                }
                .type {
                  font-size: 12px;
                  color: var(--text_2);
                }
              }
            }
            .right .price-wrap {
              display: flex;
              flex-direction: column;
              align-items: flex-end;
              gap: 4px;
              .price {
                font-size: 14px;
                color: var(--text_1);
                font-weight: 500;
              }
              .rate {
                font-size: 12px;
              }
            }
          }
        }
        .empty {
          height: 50vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      `}</style>
    </Drawer>
  );
};
