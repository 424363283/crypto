import dayjs from 'dayjs';
import CoinLogo from '../coin-logo';
import { Svg } from '../svg';
import { EmptyComponent } from '../empty';
import css from 'styled-jsx/css';
import { LANG } from '@/core/i18n';

const MobileFundHistoryList = ({ dataSource }: { dataSource: any }) => {
  const _getNameFromText = (text: string) => {
    if (text === 'SPOT') return LANG('现货账户');
    if (text === 'SWAP') return LANG('U本位账户');
  };

  if (dataSource.length === 0) {
    return <EmptyComponent />;
  } else {
    return (
      <>
        {dataSource.map(
          (
            item: {
              currency: string;
              amount: number;
              createTime: number;
              status: number;
              source?: string;
              target?: string;
            },
            index: number
          ) => {
            return (
              <div className="mobile-cloumns-list" key={index}>
                <div className="cloumns">
                  {!!item.source && !!item.target ? (
                    <div className="type">
                      {_getNameFromText(item.source)} <Svg src={'/static/icons/primary/common/arrow-right.svg'} />{' '}
                      {_getNameFromText(item.target)}
                    </div>
                  ) : (
                    <div className="logo">
                      <CoinLogo coin={item.currency} width={18} key={item.currency} height={18} />
                      <span>{item.currency ?? 'USDT'}</span>
                    </div>
                  )}
                  <div className="price">
                    {item.amount ?? '0.00'} {item.currency ?? 'USDT'}
                  </div>
                </div>
                <div className="cloumns">
                  <div>{dayjs(item.createTime).format('YYYY/MM/DD HH:mm:ss')}</div>
                  <div>
                    {{ '-1': LANG('等待'), 2: LANG('等待'), 0: LANG('失败'), 1: LANG('成功') }[item.status ?? 0]}
                  </div>
                </div>
              </div>
            );
          }
        )}
        <style jsx>{mobileListStyles}</style>
      </>
    );
  }
};

export default MobileFundHistoryList;

const mobileListStyles = css`
  .mobile-cloumns-list {
    margin: 10px 0 15px;
    padding: 0 12px 10px;
    border-bottom: 1px solid var(--fill_3);
    .cloumns {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      font-size: 15px;
      color: var(--text_1);
      .logo {
        display: flex;
        align-items: center;
        span {
          padding-left: 5px;
        }
      }
      .type {
        display: flex;
        align-items: center;
      }
      .price {
        color: var(--green);
      }
      &:first-child {
        margin-bottom: 10px;
      }
      &:last-child {
        font-size: 14px;
        color: var(--text_3)
      }
    }
  }
`;
