import CoinLogo from '@/components/coin-logo';
import Tags from '@/components/tags';
import { LANG, TradeLink } from '@/core/i18n';
import { DEFAULT_ORDER, Group, GroupItem } from '@/core/shared';
import { useEffect, useState } from 'react';
import css from 'styled-jsx/css';
import { resetZeroHeight } from '../..';
import SubMenu from '../../../sub-menu';
// etf
const SpotEtf = () => {
  const [list, setList] = useState<GroupItem[]>([]);
  useEffect(() => {
    const getEtfList = async () => {
      const group = await Group.getInstance();
      const list = group.getEtfList;
      let result: GroupItem[] = [];
      DEFAULT_ORDER.forEach((key) => {
        const findRes = list.find((item) => item?.coin === key);
        findRes && result.push(findRes);
      });
      result = [...new Set(result.concat(list))];
      setList(result);
    };
    getEtfList();
  }, []);

  return (
    <div className='leverage-token-wrapper'>
      {list.map((item: any, index) => {
        const code = item.coin;
        const { isBuy, lever } = item;
        let c = code === 'B' ? 'BTC' : code;
        return (
          <SubMenu key={index} className='leverage-token-item'>
            <TradeLink native id={item.id} className='leverage-token-link' onClick={resetZeroHeight}>
              <CoinLogo width='28' height='28' className='leverage-icon' coin={code} alt='' />
              <div className='leverage-content'>
                <p className='name'>
                  {item.name}
                  <Tags id={item.id} />
                </p>
                <p className='description'>
                  {code}
                  {lever}
                  {LANG('倍')}
                  {isBuy ? LANG('多') : LANG('空')}
                </p>
              </div>
            </TradeLink>
          </SubMenu>
        );
      })}
      <style jsx>{styles}</style>
    </div>
  );
};

export default SpotEtf;

const styles = css`
  .leverage-token-wrapper {
    width: 265px;
    height: 479px;
    background: var(--theme-background-color-2);
    padding: 10px;
    overflow: auto;
    :global(.leverage-token-item) {
      height: 64px;
      margin-bottom: 10px;
      &:last-child {
        margin-bottom: 40px;
      }
      &:hover {
        background-color: var(--theme-background-color-3);
      }
    }
    :global(.leverage-token-link) {
      display: flex;
      flex-direction: row;
      align-items: center;
      height: 100%;
      flex: 1;
      padding-left: 12px;
      :global(.leverage-icon) {
        height: 28px;
        width: 28px;
        margin-right: 16px;
        flex-shrink: 0;
      }
      :global(.leverage-content) {
        :global(.name) {
          display: flex;
          flex-direction: row;
          align-items: center;
          line-height: 12px;
          font-size: 14px;
          font-weight: 500;
          color: var(--theme-font-color-1);
          margin-bottom: 7px;
        }
        :global(.description) {
          line-height: 12px;
          font-size: 12px;
          font-weight: 400;
          color: var(--theme-font-color-3);
        }
      }
    }
  }
`;
