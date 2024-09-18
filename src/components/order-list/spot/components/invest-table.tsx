import CoinLogo from '@/components/coin-logo';
import CommonIcon from '@/components/common-icon';
// import { INVEST_TIME_MAP } from '@/components/trade-ui/trade-view/spot-strategy/components/invest-view';
import { useResponsive, useRouter, useTheme } from '@/core/hooks';
import { LANG, TrLink } from '@/core/i18n';
import { Account, LIST_TYPE, LoadingType, Spot, SpotTabType } from '@/core/shared';
import { LOCAL_KEY, localStorageApi } from '@/core/store';
import { Tooltip } from 'antd';
import dayjs from 'dayjs';
import { useMemo } from 'react';
import { useImmer } from 'use-immer';
import RecordList from '../../components/record-list';
import { BaseTableStyle } from './base-table-style';
import { StopInvestModal } from './stop-invest-modal';
// import { StrategyShare } from './strategy-share';

const { Position } = Spot;

export const getColor = (n: number | string) => {
  if (Number(n) > 0) {
    return 'main-green';
  } else if (Number(n) < 0) {
    return 'main-red';
  }
  return 'normal';
};

export const formatZero = (n: string) => {
  if (!n || Number(n) === 0) {
    return '0.00';
  }
  return n;
};

const InvestTable = ({ type }: { type: SpotTabType }) => {
  const LIST_STATUS = ['', LANG('新建'), LANG('运行中'), LANG('停止中'), LANG('已结束')];
  const STOP_STATUS = ['', LANG('手动取消'), LANG('管理员停止'), LANG('余额不足停止')];
  const id = useRouter().query.id as string;
  const { theme } = useTheme();
  const { spotInvestList, loading } = Position.state;

  const { isTablet, isMobile } = useResponsive(false);

  const isLogin = Account.isLogin;
  const isRunning = type === SpotTabType.INVEST_RUNNING;

  const [state, setState] = useImmer({
    stopGridId: '',
    baseCoin: '',
    quoteCoin: '',
    stopSell: false,
    stopModalVisible: false,
    shareModalVisible: false,
    shareModalTitle: '',
    shareModalTotalPnl: '',
    shareModalRoi: '',
    stopInvestId: '',
    stopSymbols: [],
  });

  let columns: any[] = [
    {
      title: `${LANG('交易对')}/${LANG('状态')}`,
      dataIndex: 'symbol',
      width: 350,
      render: (_: any, { symbols, startTime, stopTime, stopType, state, title }: any) => {
        const now = new Date().getTime();
        return (
          <div className={`pair ${isRunning ? '' : 'stop'}`}>
            <div className='coin-wrapper'>
              <div className='coin-list-wrapper' style={{ width: `${symbols.slice(0, 3).length.mul(7).add(7)}px` }}>
                {symbols?.slice(0, 3).map((item: any) => (
                  <CoinLogo key={item.id} coin={item.baseCoin} width={14} height={14} alt='baseCoin' />
                ))}
              </div>
              <span className='title'>{title}</span>
            </div>
            <div>
              <span />
              <div className='sub-label'>
                {isRunning ? LIST_STATUS[state] : STOP_STATUS[stopType]}/
                {startTime ? (
                  <>
                    {dayjs(isRunning ? now : stopTime).diff(startTime, 'd')}D{' '}
                    {dayjs(isRunning ? now : stopTime).diff(startTime, 'h') % 24}h{' '}
                    {dayjs(isRunning ? now : stopTime).diff(startTime, 'minute') % 60}m
                  </>
                ) : (
                  '--'
                )}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      title: `${LANG('总收益')}/${LANG('收益率')}`,
      dataIndex: 'pnl',
      render: (_: any, { pnl, roi }: any) => {
        return (
          <div>
            <div className={getColor(formatZero(pnl))}>
              {Number(formatZero(pnl?.toRound(2))) > 0 ? '+' : ''}
              {formatZero(pnl?.toRound(2))}
            </div>
            <div className={`${getColor(formatZero(roi?.mul(100).toRound(2)))} sub-label`}>
              {formatZero(roi?.mul(100).toRound(2))}%
            </div>
          </div>
        );
      },
    },
    {
      title: `${LANG('币种')}`,
      dataIndex: 'symbols',
      render: (symbols: any) => {
        if (symbols.length > 3) {
          return (
            <Tooltip color='#fff' placement='top' title={symbols.map((item: any) => item.baseCoin).join('/')}>
              <div>
                {symbols
                  .slice(0, 3)
                  .map((item: any) => item.baseCoin)
                  .join('/')}
                {symbols.length > 3 && '...'}
              </div>
            </Tooltip>
          );
        }
        return <div>{symbols.map((item: any) => item.baseCoin).join('/')}</div>;
      },
    },
    {
      title: `${LANG('定投周期')}`,
      dataIndex: 'period',
      render: (period: number) => {
        return <div></div>;//{INVEST_TIME_MAP[period]}
      },
    },
    {
      title: `${LANG('已投次数')}`,
      dataIndex: 'investCount',
    },
    {
      title: LANG('操作'),
      align: 'right',
      dataIndex: 'id',
      width: 150,
      fixed: isTablet ? 'right' : 'none',
      render: (_: string, item: any) => (
        <div className='grid-operation-wrapper'>
          {!isMobile && (
            <div onClick={() => onItemShareClicked(item)}>
              <CommonIcon name='common-grid-share-0' size={13} className='icon' enableSkin />
            </div>
          )}

          {isRunning && (
            <div onClick={() => onItemStopClicked(item)}>
              <CommonIcon name='common-grid-stop-0' size={13} className='icon' enableSkin />
            </div>
          )}
          <TrLink
            href='/trading-bot/detail'
            query={{ id: item.id, type: 'invest' }}
            onClick={() => {
              localStorageApi.setItem(LOCAL_KEY.FROM_SPOT_TABLE, id);
            }}
            className='detail-btn'
            native
          >
            {LANG('详情')}
          </TrLink>
        </div>
      ),
    },
  ];

  if (isRunning) {
    columns.splice(4, 0, {
      title: `${LANG('下次定投')}`,
      dataIndex: 'nextTime',
      render: (nextTime: number, { state }: any) => {
        if (state >= 3) {
          return '--';
        }
        const now = new Date().getTime();
        return (
          <div>
            {nextTime ? (
              <>
                {dayjs(nextTime).diff(now, 'd')}D {dayjs(nextTime).diff(now, 'h') % 24}h{' '}
                {dayjs(nextTime).diff(now, 'minute') % 60}m
              </>
            ) : (
              '--'
            )}
          </div>
        );
      },
    });
  }

  const filterSpotGridList = useMemo(() => {
    let resultList = spotInvestList.filter((item: any) => (isRunning ? item.state < 3 : item.state >= 3));

    if (!isLogin) {
      return [];
    }
    return resultList;
  }, [id, isLogin, spotInvestList, isRunning]);

  const onItemStopClicked = (item: any) => {
    setState((draft) => {
      draft.stopInvestId = item?.id;
      draft.stopModalVisible = true;
      draft.stopSell = item.stopSell;
      draft.stopSymbols = item.symbols;
    });
  };

  const onItemShareClicked = (item: any) => {
    const length = item?.symbols.filter((item: any) => !item.cancel).length;
    setState((draft) => {
      draft.shareModalVisible = true;
      draft.shareModalTitle = `${item?.symbols
        .filter((item: any) => !item.cancel)
        .slice(0, 2)
        .map((item: any) => item.baseCoin)
        .join(' ')}${length > 2 ? '...' : ''} (${LANG('共{length}个币种', { length })})`;
      draft.shareModalTotalPnl = item?.pnl.toRound(2);
      draft.shareModalRoi = formatZero(item?.roi.mul(100).toFixed(2));
    });
  };

  return (
    <>
      <div className='container'>
        <RecordList
          loading={loading}
          columns={columns}
          data={filterSpotGridList}
          className={`${theme} spot-table grid-table`}
          renderRowKey={(v) => v.id}
        />
      </div>
      {state.stopModalVisible && (
        <StopInvestModal
          id={state.stopInvestId}
          stopSell={state.stopSell}
          open={state.stopModalVisible}
          onClose={() =>
            setState((draft) => {
              draft.stopModalVisible = false;
            })
          }
          stopSymbols={state.stopSymbols}
          onSuccess={() => Position.fetchSpotInvestPositionList(LoadingType.Hide)}
        />
      )}
      {/* <StrategyShare
        visible={state.shareModalVisible}
        title={LANG('盈亏分析')}
        code={state.shareModalTitle}
        onClose={() =>
          setState((draft) => {
            draft.shareModalVisible = false;
          })
        }
        rate={state.shareModalRoi}
        income={state.shareModalTotalPnl}
        incomeText={LANG('总收益')}
        type={LIST_TYPE.INVEST}
      /> */}
      <BaseTableStyle />
    </>
  );
};

export default InvestTable;
