import CoinLogo from '@/components/coin-logo';
import Tags from '@/components/tags';
import { LANG, TradeLink } from '@/core/i18n';
import { Group, GroupItem } from '@/core/shared';
import { useEffect, useState } from 'react';
import css from 'styled-jsx/css';
import { resetZeroHeight } from '../..';
import SubMenu from '../../../sub-menu';
import { sortSwapList } from '@/core/shared/src/copy/utils';

// 永续合约
const Perpetual = ({ isUsdtType }: { isUsdtType?: boolean }) => {
  const [list, setList] = useState<GroupItem[]>([]);
  const sortList = sortSwapList(list, ['BTCUSDT', 'ETHUSDT']);
  const tag = !isUsdtType ? LANG('永续币本位') : LANG('永续U本位');

  useEffect(() => {
    const getSwapCoinList = async () => {
      const group = await Group.getInstance();
      const list = (isUsdtType ? group?.getSwapUsdList : group?.getSwapCoinList) || [];
      setList(list);
      return list;
    };
    getSwapCoinList();
  }, []);
  return (
    <div className='perpetual-wrapper'>
      <div className='menu-content' >
        {sortList.map((item: any) => {
          const code = item?.coin || '';
          const name = item?.name || '';
          const fullName = item?.fullname || '';
          return (
            <SubMenu key={code} className='coin-menu-item'>
              <TradeLink native id={item.id} className='link-wrapper' onClick={resetZeroHeight}>
                <CoinLogo width='24' height='24' coin={code} alt='' className='icon-logo' />
                <div className='coin-content'>
                  <div className='title'>
                    {name}
                    <Tags id={item?.id} />
                  </div>
                  <div className='description'>
                    {fullName} {tag}
                  </div>
                </div>
              </TradeLink>
            </SubMenu>
          );
        })}
      </div>
      <style jsx>{styles}</style>
    </div>
  );
};

export default Perpetual;

const styles = css`
  .perpetual-wrapper {
    width: 227px;
    height: 100%;
    background: var(--dropdown-select-bg-color);
    overflow: auto;
    .menu-content {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    :global(.coin-menu-item) {
      &:hover {
        :global(.link-wrapper .coin-content .title) {
          color: var(--text_brand);
        }
      }
    }
    :global(.link-wrapper) {
      display: flex;
      flex-direction: row;
      align-items: center;
      height: 100%;
      flex: 1;
      :global(.icon-logo) {
        height: 24px;
        width: 24px;
        margin-right: 8px;
        flex-shrink: 0;
      }
      :global(.coin-content) {
        color: var(--text_2)!important;
        :global(>*:nth-last-child(2)) {
          color: var(--text_1);
        }
        :global(>*:nth-child(2)) {
          color: var(--text_3);
        }
        :global(.title) {
          display: flex;
          flex-direction: row;
          align-items: center;
          font-size: 14px;
          font-weight: 500;
          :global(.hot, .new) {
            margin-left: 5px;
            width: auto;
            height: 12px;
          }
        }
        :global(.description) {
          font-size: 12px;
          font-weight: 300;
        }
      }
    }
  }
`;
