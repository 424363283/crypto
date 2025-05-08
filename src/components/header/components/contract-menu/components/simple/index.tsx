import CoinLogo from '@/components/coin-logo';
import Tags from '@/components/tags';
import { LANG, TradeLink } from '@/core/i18n';
import { Group, GroupItem } from '@/core/shared';
import React, { useEffect, useState } from 'react';
import { useHover } from 'react-use';
import css from 'styled-jsx/css';
import { resetZeroHeight } from '../..';
import SubMenu from '../../../sub-menu';
// 简易合约
const Simple = ({ active }: { active: boolean }) => {
  const [menuIndex, setMenuIndex] = useState(0);
  

  const [{ allList, cryptoList, derivList, ustockList,hkstockList, orderList }, setContractList] = useState({
    allList: [],
    cryptoList: [],
    derivList: [],
    ustockList: [],
    hkstockList: [],
    orderList: []
  });

  const data = [allList, cryptoList, derivList, ustockList,hkstockList, orderList];
  useEffect(() => {
    active && setMenuIndex(0);
  }, [active]);

  const sortByHotIds = (ids: string[], list: GroupItem[]) => {
    let hotList: GroupItem[] = [];
    ids.forEach((key) => {
      const findRes = list.find((item) => item?.id === key);
      findRes && hotList.push(findRes);
    });

    return [...new Set(hotList.concat(list))];
  };

  useEffect(() => {
    // 获取全部
    const getLiteContractList = async () => {
      const group = await Group.getInstance();
      const hotIds = group.getHotIds();
      const list = group.getLiteList;
      return sortByHotIds(hotIds, list);
    };
    // //加密货币
    const getLiteCryptoContractList = async () => {
      const group = await Group.getInstance();
      const hotIds = group.getHotIds();
      const list = group.getLiteCryptoList;
      return sortByHotIds(hotIds, list);
    };
    
    const getLiteDerivContractList = async () => {
      const group = await Group.getInstance();
      const hotIds = group.getHotIds();
      const list = group.getLiteDerivList;
      return sortByHotIds(hotIds, list);
    };

    const getLiteUStockContractList = async () => {
      const group = await Group.getInstance();
      const hotIds = group.getHotIds();
      const list = group.getLiteUStockList;
      return sortByHotIds(hotIds, list);
    };

    const getLiteHKStockContractList = async () => {
      const group = await Group.getInstance();
      const hotIds = group.getHotIds();
      const list = group.getLiteHKStockList;
      return sortByHotIds(hotIds, list);
    };
    //带单区
    const getLiteOrderContractList = async () => {
      const group = await Group.getInstance();
      const hotIds = group.getHotIds();
      const list = group.getLiteOrderList;
      return sortByHotIds(hotIds, list);
    };
    Promise.all([
      getLiteContractList(),
      getLiteCryptoContractList(),
      getLiteDerivContractList(),
      getLiteUStockContractList(),
      getLiteHKStockContractList(),
      getLiteOrderContractList(),
    ]).then((res: any) => {
      setContractList({
        allList: res[0],
        cryptoList:  res[1],
        derivList:  res[2],
        ustockList:  res[3],
        hkstockList:  res[4],
        orderList: res[5],
      });
    });
  }, []);

  // const headerMenus = [LANG('全部'), LANG('加密货币')];
  return (
    <div className='simple-contract-wrapper'>
      {/* <div className='simple-header'>
        {headerMenus.map((v, index) => {
          const active = index === menuIndex;
          return (
            <HeaderItem key={index} onChange={() => setMenuIndex(index)} active={active}>
              {v}
            </HeaderItem>
          );
        })}
      </div> */}
      <div className='menu-content' >
        {data.map((item: any, key) => {
          return (
            <div
              key={key}
              style={{
                display: key === menuIndex ? 'block' : 'none',
              }}
            >
              {item && item.map((item: any, index: any) => {
                return (
                  <SubMenu key={key + index} className='simple-item'>
                    <TradeLink native id={item.id} className='simple-link-wrapper' onClick={resetZeroHeight}>
                      <CoinLogo width='28' height='28' coin={item.coin} alt='' className='icon-logo' />
                      <div className='content-wrapper'>
                        <p className='name'>
                          {item.name}
                          <Tags id={item.id} />
                        </p>
                        <p className='description'>
                          {item.fullname} {LANG('简易合约')}
                        </p>
                      </div>
                    </TradeLink>
                  </SubMenu>
                );
              })}
            </div>
          );
        })}
      </div>

      <style jsx>{styles}</style>
    </div>
  );
};

const HeaderItem = ({
  children,
  active,
  onChange,
}: {
  children: React.ReactNode;
  active: boolean;
  onChange: () => void;
}) => {
  const [hoverable, isHovering] = useHover(
    <div className={[active ? 'active' : '', 'header-item'].join(' ')}>{children}</div>
  );
  useEffect(() => {
    if (isHovering) onChange();
  }, [isHovering]);
  return hoverable;
};


export default Simple;

const styles = css`
  .simple-contract-wrapper {
    width: 285px;
    height: 479px;
    background: var(--dropdown-select-bg-color);
    display: flex;
    flex-direction: column;
    box-sizing: content-box;

    .simple-header {
      flex: none;
      height: 44px;
      padding: 0 22px;
      display: flex;
      flex-direction: row;
      :global(.header-item) {
        white-space: nowrap;
        font-size: 14px;
        font-weight: 500;
        color: var(--theme-font-color-1);
        line-height: 40px;
        border-bottom: 1px solid transparent;
        margin-right: 20px;
        :global(&:last-child) {
          margin-right: 0;
        }
      }
      :global(.active) {
        border-bottom: 2px solid var(--skin-primary-color);
      }
    }
    .menu-content {
      flex: 1;
      overflow-y: auto;
      padding-bottom: 36px;
      padding: 10px;
      position: relative;
      :global(.simple-item) {
        height: 64px;
        margin-bottom: 10px;
        
        :global(.simple-link-wrapper) {
          display: flex;
          flex-direction: row;
          align-items: center;
          height: 100%;
          flex: 1;
          padding-left: 12px;
          color: var(--text_2)!important;
          .content-wrapper {
            :global(>*:nth-last-child(2)) {
              color: var(--text_1);
            }
            :global(>*:nth-child(2)) {
              color: var(--text_3);
            }
          }
          :global(.icon-logo) {
            height: 28px;
            width: 28px;
            margin-right: 16px;
            flex-shrink: 0;
          }
          :global(.name) {
            display: flex;
            flex-direction: row;
            align-items: center;
            line-height: 12px;
            font-size: 14px;
            font-weight: 500;
            margin-bottom: 7px;
            :global(.hot) {
              margin-left: 5px;
              width: auto;
              height: 12px;
            }
          }
          :global(.description) {
            line-height: 12px;
            font-size: 12px;
            font-weight: 400;
          }
        }
        &:hover {
          :global(.simple-link-wrapper .content-wrapper .name) {
            color: var(--text_brand);
          }
        }
      }
    }
  }
`;
