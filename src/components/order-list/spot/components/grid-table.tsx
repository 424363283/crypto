import CommonIcon from '@/components/common-icon';
import { useResponsive, useRouter, useTheme } from '@/core/hooks';
import { LANG, TrLink } from '@/core/i18n';
import { Account, LIST_TYPE, LoadingType, Spot, SpotTabType } from '@/core/shared';
import { LOCAL_KEY, localStorageApi } from '@/core/store';
import dayjs from 'dayjs';
import { useMemo } from 'react';
import { useImmer } from 'use-immer';
import RecordList from '../../components/record-list';
import { BaseTableStyle } from './base-table-style';
import { StopGridModal } from './stop-grid-modal';
// import { StrategyShare } from './strategy-share';

const { Position, Grid, Strategy } = Spot;

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

const GridTable = ({ type }: { type: SpotTabType }) => {
  const STOP_STATUS = [
    '',
    LANG('手动停止'),
    LANG('管理员停止'),
    LANG('止盈停止'),
    LANG('止损停止'),
    LANG('到期停止'),
    LANG('异常停止'),
  ];
  const GRID_STATUS = [LANG('待触发'), LANG('新建'), LANG('运行中'), LANG('停止中'), LANG('已结束')];
  const id = useRouter().query.id as string;
  const { theme } = useTheme();
  const { spotGridList, loading, hideOther } = Position.state;
  const { symbolList } = Grid.state;

  const { isTablet, isMobile } = useResponsive(false);

  const isLogin = Account.isLogin;
  const isRunning = type === SpotTabType.GRID_RUNNING;

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
    shareModalLowPrice: '',
    shareModalHighPrice: '',
    shareModalGridCount: '',
  });

  const columns = [
    {
      title: `${LANG('交易对')}/${LANG('状态')}`,
      dataIndex: 'symbol',
      width: 200,
      render: (_: any, { symbol, startTime, stopTime, stopType, state }: any) => {
        const now = new Date().getTime();
        return (
          <div className={`pair ${isRunning ? '' : 'stop'}`}>
            <div>{symbol.replace('_', '/')}</div>
            <div>
              <span />
              <div className='sub-label'>
                {isRunning ? GRID_STATUS[state] : STOP_STATUS[stopType]}/
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
      width: 130,
      render: (_: any, { totalPnl, roi, symbol }: any) => {
        const findItem = symbolList.find((item) => item.symbol === symbol);
        return (
          <div>
            <div className={getColor(formatZero(totalPnl?.toRound(findItem?.priceScale)))}>
              {Number(formatZero(totalPnl?.toRound(findItem?.priceScale))) > 0 ? '+' : ''}
              {formatZero(totalPnl?.toRound(findItem?.priceScale))}
            </div>
            <div className={`${getColor(formatZero(roi?.mul(100).toFixed(2)))} sub-label`}>
              {formatZero(roi?.mul(100).toFixed(2))}%
            </div>
          </div>
        );
      },
    },
    {
      title: `${LANG('价格区间')}`,
      dataIndex: 'priceMin',
      width: 220,
      render: (_: any, { priceMin, priceMax, quoteCoin }: any) => {
        return (
          <div>
            {priceMin}-{priceMax} {quoteCoin}
          </div>
        );
      },
    },
    {
      title: `${LANG('网格数量')}`,
      width: 100,
      dataIndex: 'gridCount',
    },
    {
      title: `${LANG('投入金额')}`,
      dataIndex: 'initQuote',
      width: 100,
      render: (_: any, { initQuote, quoteCoin }: any) => {
        return (
          <div>
            {initQuote} {quoteCoin}
          </div>
        );
      },
    },
    {
      title: `${isRunning ? LANG('创建时间') : LANG('停止时间')}`,
      dataIndex: 'createTime',
      width: 150,
      render: (_: number, { createTime, stopTime }: any) => {
        return <div>{dayjs(isRunning ? createTime : stopTime).format('YYYY/MM/DD HH:mm:ss')}</div>;
      },
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
            <div
              onClick={() =>
                setState((draft) => {
                  const findItem = symbolList.find((i) => i.symbol === item.symbol);
                  draft.shareModalVisible = true;
                  draft.shareModalTotalPnl = item?.totalPnl?.toRound(findItem?.priceScale);
                  draft.shareModalRoi = item?.roi.mul(100).toFixed(2);
                  draft.shareModalLowPrice = item?.priceMin;
                  draft.shareModalHighPrice = item?.priceMax;
                  draft.shareModalGridCount = item?.gridCount;
                  draft.shareModalTitle = item.symbol.replace('_', '/');
                })
              }
            >
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
            query={{ id: item.id, type: 'grid' }}
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

  const filterSpotGridList = useMemo(() => {
    let resultList = spotGridList.filter((item: any) => (isRunning ? item.state < 3 : item.state >= 3));
    if (hideOther) {
      resultList = resultList.filter(({ symbol }) => (hideOther ? symbol === id : true));
    }
    if (!isLogin) {
      return [];
    }
    return resultList;
  }, [id, isLogin, spotGridList, isRunning, hideOther]);

  const onItemStopClicked = (item: any) => {
    setState((draft) => {
      draft.stopGridId = item?.id;
      draft.baseCoin = item?.baseCoin;
      draft.quoteCoin = item?.quoteCoin;
      draft.stopSell = item?.stopSell;
      draft.stopModalVisible = true;
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
        <StopGridModal
          id={state.stopGridId}
          baseCoin={state.baseCoin}
          quoteCoin={state.quoteCoin}
          stopSell={state.stopSell}
          open={state.stopModalVisible}
          onClose={() =>
            setState((draft) => {
              draft.stopModalVisible = false;
            })
          }
          onSuccess={() => {
            Position.fetchSpotGridPositionList(LoadingType.Show);
            Strategy.getBalance();
          }}
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
        priceMin={state.shareModalLowPrice}
        priceMax={state.shareModalHighPrice}
        gridCount={state.shareModalGridCount}
        incomeText={LANG('总收益')}
        type={LIST_TYPE.GRID}
      /> */}
      <BaseTableStyle />
    </>
  );
};

export default GridTable;
