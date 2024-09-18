import CoinLogo from '@/components/coin-logo';
import Tags from '@/components/tags';
import { LANG, TradeLink } from '@/core/i18n';
import { Group, GroupItem } from '@/core/shared';
import { useEffect, useState } from 'react';
import css from 'styled-jsx/css';
import { resetZeroHeight } from '../..';
import SubMenu from '../../../sub-menu';

// 永续合约
const Perpetual = ({ isUsdtType }: { isUsdtType?: boolean }) => {
  const [list, setList] = useState<GroupItem[]>([]);

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
      {list.map((item: any) => {
        const code = item?.coin || '';
        const name = item?.name || '';
        const fullName = item?.fullname || '';
        return (
          <SubMenu key={code} className='coin-menu-item'>
            <TradeLink native id={item.id} className='link-wrapper' onClick={resetZeroHeight}>
              <CoinLogo width='28' height='28' coin={code} alt='' className='icon-logo' />
              <div className='coin-content'>
                <div className='title'>
                  {name}
                  <Tags id={item?.id} />
                </div>
                <div>
                  {fullName} {tag}
                </div>
              </div>
            </TradeLink>
          </SubMenu>
        );
      })}
      <style jsx>{styles}</style>
    </div>
  );
};

export default Perpetual;

const styles = css`
  .perpetual-wrapper {
    width: 265px;
    height: 479px;
    background: var(--theme-background-color-2);
    padding: 10px;
    overflow: auto;
    :global(.coin-menu-item) {
      height: 64px;
      margin-bottom: 10px;
      &:last-child {
        margin-bottom: 40px;
      }
    }
    :global(.link-wrapper) {
      display: flex;
      flex-direction: row;
      align-items: center;
      height: 100%;
      flex: 1;
      padding-left: 12px;
      :global(.icon-logo) {
        height: 28px;
        width: 28px;
        margin-right: 16px;
        flex-shrink: 0;
      }
      :global(.coin-content) {
        :global(.title) {
          display: flex;
          flex-direction: row;
          align-items: center;
          font-size: 14px;
          font-weight: 500;
          color: var(--theme-font-color-1);
          margin-bottom: 7px;
          :global(.hot, .new) {
            margin-left: 5px;
            width: auto;
            height: 12px;
          }
        }
        > *:nth-child(2) {
          font-size: 12px;
          font-weight: 400;
          color: var(--theme-font-color-3);
        }
      }
    }
  }
`;
