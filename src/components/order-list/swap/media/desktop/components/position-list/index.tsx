import YIcon from '@/components/YIcons';
import CommonIcon from '@/components/common-icon';

import InputPrice from '@/components/trade-ui/order-list/swap/components/modal/stop-profit-stop-loss-modal/components/input-price';
import { linkClassName, linkStyles } from '@/components/link';
import { OrderShare } from '@/components/order-list/components/order-share/export';
import RecordList, { ColSortTitle } from '@/components/order-list/components/record-list';
import { useListByStore } from '@/components/order-list/swap/store';
import {
  store,
  useModalProps,
  usePositionActions,
  useSortData
} from '@/components/order-list/swap/stores/position-list';
// import { useModalProps, usePositionActions } from '@/components/order-list/swap/stores/position-list';
import { InfoHover } from '@/components/trade-ui/common/info-hover';
import Tooltip from '@/components/trade-ui/common/tooltip';
import {
  LiquidationModal,
  ReverseConfirmModal,
  StopProfitStopLossModal,
  TrackModal
} from '@/components/trade-ui/order-list/swap/components/modal';

import { ModifyMarginModal } from '@/components/trade-ui/order-list/swap/components/modal';

// import { ModifyMarginModal } from '@/components/modal';

import { kHeaderStore } from '@/components/chart/k-chart/components/k-header/store';
import { SubButton } from '@/components/trade-ui/trade-view/components/button';
import { WalletAvatar } from '@/components/wallet-avatar';
import { getZendeskLink } from '@/components/zendesk';
import { kChartEmitter } from '@/core/events';
import { FORMULAS } from '@/core/formulas';
import { useResponsive } from '@/core/hooks';
import { LANG, TrLink, TradeLink } from '@/core/i18n';
import { SUBSCRIBE_TYPES, useWs } from '@/core/network';
import { Swap } from '@/core/shared';
import { getCryptoData } from '@/core/shared/src/swap/modules/calculate/utils';
import { useAppContext } from '@/core/store';
import { formatNumber2Ceil, getUrlQueryParams } from '@/core/utils';
import { frameRun } from '@/core/utils/src/frame-run';
import { isSwapDemo } from '@/core/utils/src/is';
import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-use';
import { LeverItem } from '../lever-item';
import IncomeTips from './components/income-tips';
import { clsx, styles } from '@/components/order-list/swap/media/desktop/components/position-list/styled.ts';
import LiquidationInputPrice from './components/liquidation-input-price';
import { setPositionTpSlFun } from '@/store/kline';
import { MARGIN_TYPE } from '@/core/shared/src/swap/modules/trade/constants';
import { SWAP_DEFAULT_WALLET_KEY, WalletKey } from '@/core/shared/src/swap/modules/assets/constants';
import { WalletName } from '../wallet-name';
import { useCopyTradingSwapStore } from '@/store/copytrading-swap';

export const PositionList = ({
  wallet,
  assetsPage,
  onWalletClick
}: {
  wallet?: WalletKey;
  assetsPage?: boolean;
  onWalletClick?: (walletData?: any) => any;
}) => {
  const qty = Number(getUrlQueryParams('qty'));
  const { setting } = kHeaderStore(qty);
  const { isUsdtType, quoteId } = Swap.Trade.base;
  const walletId = Swap.Info.getWalletId(isUsdtType);
  const isCopyTrader = useCopyTradingSwapStore.use.isCopyTrader();
  const { onReverse } = usePositionActions();
  const {
    liquidationModalProps,
    onVisibleLiquidationModal,
    onCloseLiquidationModal,
    marginModalProps,
    onVisibleMarginModal,
    onCloseMarginModal,
    trackModalProps,
    onVisibleTrackModal,
    onCloseTrackModal,
    spslModalProps,
    onCloseSpslModal,
    onVisiblesSpslModal,
    reverseModalProps,
    onCloseReverseModal,
    onVisibleReverseModal
  } = useModalProps();
  const positions = Swap.Calculate.positionData({
    usdt: isUsdtType,
    data: Swap.Order.getPosition(isUsdtType),
    twoWayMode: Swap.Trade.twoWayMode
    // }).list?.filter(item => !wallet || item.subWallet === wallet);
  }).list?.filter(item => {
    if (wallet) {
      return item.subWallet === wallet;

    } else {
      return isCopyTrader || item.subWallet !== WalletKey.COPY;
    }

  });
  const storePositions = useListByStore(positions);
  let list = useSortData(assetsPage ? positions : storePositions);
  if (!useAppContext().isLogin) {
    list = [];
  }

  const [_modalItem, setModalItem] = useState<any>(undefined);
  const modalItem = _modalItem && list.find((v: any) => Swap.Order.positionIsSame(v, _modalItem));
  const onShare = (item: any) => {
    setModalItem(item);
  };

  const incomeType = store.incomeType;

  const [maeketList, setMarketList] = useState<any>([]);
  useWs(SUBSCRIBE_TYPES.ws3001, data => {
    setMarketList(isUsdtType ? data.getSwapUsdtList() : data.getSwapCoinList());
  });
  const getMarketPrice = (item: any) => {
    return maeketList.find((v: any) => v.id === item.symbol.toUpperCase())?.price;
  };
  let modalItemIncome = '0';
  if (modalItem) {
    modalItemIncome = formatNumber2Ceil(
      Swap.Calculate.income({
        usdt: isUsdtType,
        code: modalItem.symbol,
        isBuy: modalItem.side === '1',
        avgCostPrice: modalItem.avgCostPrice,
        volume: modalItem.currentPosition,
        flagPrice: incomeType === 0 ? undefined : getMarketPrice(modalItem)
      }),
      isUsdtType ? 2 : Number(modalItem.basePrecision),
      false
    ).toFixed(isUsdtType ? 2 : Number(modalItem.basePrecision));
  }

  useEffect(() => {
    const onK_CHART_POSITION_REVERSE_CLICK = (id: string) => {
      const item = list?.find((e: any) => e.positionId === id);
      // console.log('持仓反向开仓点击了id:', id);
      if (item) {
        onReverse(item, ({ onConfirm }) => onVisibleReverseModal(item, onConfirm));
      }
    };

    const onK_CHART_POSITION_STOP_CLICK = (id: string) => {
      const item = list?.find((e: any) => e.positionId === id);
      // console.log('持仓止盈止损点击了id:', id);

      if (item) {
        onVisiblesSpslModal(item);
      }
    };

    frameRun(() => {
      kChartEmitter.removeAllListeners(kChartEmitter.K_CHART_POSITION_REVERSE_CLICK);
      kChartEmitter.removeAllListeners(kChartEmitter.K_CHART_POSITION_STOP_CLICK);

      kChartEmitter.on(kChartEmitter.K_CHART_POSITION_REVERSE_CLICK, (id: string) => {
        onK_CHART_POSITION_REVERSE_CLICK(id);
      });
      kChartEmitter.on(kChartEmitter.K_CHART_POSITION_STOP_CLICK, (id: string) => {
        onK_CHART_POSITION_STOP_CLICK(id);
      });
    });

    return () => {
      kChartEmitter.off(kChartEmitter.K_CHART_POSITION_REVERSE_CLICK, onK_CHART_POSITION_REVERSE_CLICK);
      kChartEmitter.off(kChartEmitter.K_CHART_POSITION_STOP_CLICK, onK_CHART_POSITION_STOP_CLICK);
    };
  }, [list]);

  useEffect(() => {
    const action = () => {
      frameRun(() => {
        if (setting.positionOrder) {
          const handleRate = (item: any) => {
            const income = Swap.Calculate.income({
              usdt: isUsdtType,
              code: item.symbol?.toUpperCase(),
              isBuy: item.side === '1',
              avgCostPrice: Number(item.avgCostPrice),
              volume: Number(item.currentPosition)
            });
            const rate = Swap.Calculate.positionROE({
              usdt: isUsdtType,
              data: item,
              income: income
            });
            return `${rate.toFixed(2)}%`;
          };

          // console.log("获取当前的时间戳",list)
          // debugger

          kChartEmitter.emit(
            kChartEmitter.K_CHART_POSITION_UPDATE,
            list
              .filter((e: { subWallet: string }) => e?.subWallet === walletId)

              .map((item: any) => {
                item.orders.map((item) => {
                  if (item.ctime && !item.orginalTriggerPrice) {
                    item.orginalTriggerPrice = item.triggerPrice
                  }
                  return item;
                })
                return {
                  symbolId: item.symbol,
                  avgPrice: item.avgCostPrice,
                  unrealizedPnl: item.income,
                  leverage: item.leverage, //杠杠倍数
                  id: item.positionId,
                  side: item.side,
                  tpSlList: item.orders,
                  liquidationPrice: item.liquidationPrice,
                  ctime: item,
                  sideText: item.side === '1' ? LANG('多') : LANG('空'),
                  openPrice: formatNumber2Ceil(
                    item.avgCostPrice,
                    Number(item.baseShowPrecision),
                    item.side === '1'
                  ).toFixed(Number(item.baseShowPrecision)),
                  volume: item.currentPositionFormat,
                  profitRate: handleRate(item),
                  orginalItem: item
                };
              })
          );
          kChartEmitter.emit(kChartEmitter.K_CHART_POSITION_VISIBLE, true);
        } else {
          kChartEmitter.emit(kChartEmitter.K_CHART_POSITION_VISIBLE, false);
        }
      });
    };
    action();
  }, [setting, list, walletId]);

  // 匹配当前选择的币对
  useEffect(() => {
    if (quoteId) {
      const getActiveId = list.filter(item => {
        return item.symbol.toUpperCase() === quoteId.toUpperCase();
      });
      setPositionTpSlFun(getActiveId)
    }
  }, [list, quoteId]);

  // setPositionTpSlFun
  // {
  //   id:'',
  //   order
  // }

  return (
    <>
      <div className={clsx('position-list')}>
        <RecordList
          // renderRowKey={v => `${v.side} ${v.subWallet} ${v.symbol}}`}
          renderRowKey={v => `${v.positionId}}`}
          data={list}
          loading={Swap.Order.getPositionLoading(isUsdtType)}
          columns={useColumns({
            wallet,
            assetsPage,
            isUsdtType,
            quoteId,
            data: list,
            onVisibleLiquidationModal,
            onVisibleMarginModal,
            onVisibleTrackModal,
            onVisiblesSpslModal,
            onVisibleReverseModal,
            onShare,
            onWalletClick,
            list: maeketList
          })}
          scroll={{ x: 'max-content', y: 500 }}
        />
        {liquidationModalProps.visible && (
          <LiquidationModal {...liquidationModalProps} onClose={onCloseLiquidationModal} />
        )}
        {/* {marginModalProps.visible && (
          <ModifyMarginModal
            {...marginModalProps}
            data={list.find((v: any) => Swap.Order.positionIsSame(v, marginModalProps.data as any)) || { symbol: '' }}
            onClose={onCloseMarginModal}
          />
        )} */}
        <ModifyMarginModal
          {...marginModalProps}
          data={list.find((v: any) => Swap.Order.positionIsSame(v, marginModalProps.data as any)) || { symbol: '' }}
          onClose={onCloseMarginModal}
        />
        {trackModalProps.visible && (
          <TrackModal
            {...trackModalProps}
            data={list.find((v: any) => Swap.Order.positionIsSame(v, trackModalProps.data as any)) || { symbol: '' }}
            onClose={onCloseTrackModal}
          />
        )}
        {reverseModalProps.visible && <ReverseConfirmModal {...reverseModalProps} onClose={onCloseReverseModal} />}
        {spslModalProps.visible && (
          <StopProfitStopLossModal
            {...spslModalProps}
            data={
              list.find((v: any) => Swap.Order.positionIsSame(v, spslModalProps.data as any)) || spslModalProps.data
            }
            onClose={onCloseSpslModal}
          />
        )}
        {modalItem && (
          <OrderShare
            visible={!!modalItem}
            title={LANG('分享')}
            symbol={modalItem.symbol}
            settleCoin={Swap.Info.getCryptoData(modalItem.symbol, { withHooks: false })?.settleCoin}
            code={Swap.Info.getCryptoData(modalItem.symbol, { withHooks: false }).name}
            onClose={() => setModalItem(undefined)}
            rate={Swap.Calculate.positionROE({
              usdt: isUsdtType,
              data: modalItem,
              income: Number(modalItemIncome)
              // isAutoMargin: true,
            }).toFixed(2)}
            income={modalItemIncome}
            isBuy={modalItem.side === '1'}
            items={[
              // 开仓价格
              formatNumber2Ceil(
                modalItem.avgCostPrice,
                Number(modalItem.baseShowPrecision),
                modalItem.side === '1'
              ).toFixed(Number(modalItem.baseShowPrecision)),
              // 标记价格
              Swap.Socket.getFlagPrice(modalItem.symbol, { withHooks: false })
            ]}
            data={modalItem}
            leverage={modalItem.leverage}
          />
          // <ShareModal
          //   isBuy={modalItem.side === '1'}
          //   lever={modalItem?.leverage}
          //   commodityName={Swap.Info.getCryptoData(modalItem.symbol, { withHooks: false }).name}
          //   type={Swap.Info.getContractName(isUsdtType)}
          //   incomeRate={Number(
          //     Swap.Calculate.positionROE({
          //       usdt: isUsdtType,
          //       data: modalItem,
          //       income: modalItem.income,
          //     }).toFixed(2)
          //   )}
          //   currentPrice={Swap.Socket.getFlagPrice(modalItem.symbol, { withHooks: false })}
          //   opPrice={formatNumber2Ceil(
          //     modalItem.avgCostPrice,
          //     Number(modalItem.baseShowPrecision),
          //     modalItem.side === '1'
          //   ).toFixed(Number(modalItem.baseShowPrecision))}
          //   onCancel={() => setModalItem(undefined)}
          // />
        )}
      </div>
      {styles}
    </>
  );
};

const useColumns = ({
  wallet,
  isUsdtType,
  quoteId,
  assetsPage = false,
  data,
  onVisibleLiquidationModal,
  onVisibleMarginModal,
  onVisibleTrackModal,
  onVisiblesSpslModal,
  onVisibleReverseModal,
  onShare,
  onWalletClick,
  list
}: any) => {
  const { windowWidth } = useResponsive(false);
  const isSmallPc = windowWidth < 1500;
  const { onReverse } = usePositionActions();
  const indexPrice = Swap.Socket.getIndexPirce(quoteId);
  Swap.Socket.store.data1050;
  const getFlagPrice = (v: any) => Swap.Socket.getFlagPrice(v.symbol, { withHooks: false });
  const onVisibleSPSLModal = (item: any, tab?: any, isEdit?: boolean) => onVisiblesSpslModal(item, tab || 0, isEdit);
  const { sort } = store;
  const incomeType = store.incomeType;
  const isDemo = isSwapDemo(useLocation().pathname);

  const getMarketPrice = (item: any) => {
    const markitem = list.find((v: any) => v.id === item.symbol.toUpperCase());
    return markitem?.price;
  };

  onWalletClick =
    onWalletClick ||
    ((walletData: any) => Swap.Trade.setModal({ walletFormVisible: true, walletFormData: { data: walletData } }));
  if (isDemo) {
    onWalletClick = () => { };
  }

  const volumeTitle = (
    <ColSortTitle
      value={store.getSortValue('currentPositionFormat', sort)}
      onChange={store.sortTypeChangeEvent('currentPositionFormat')}
    >
      <div>
        <Tooltip
          placement="top"
          className={clsx('custom-tooltip')}
          arrow={false}
          title={
            isUsdtType
              ? LANG(
                'U本位合约交易单位为BTC等币单位时，显示的持仓数量为根据实际张数换算而来的，数值随着最新价格变动而变动。'
              )
              : LANG(
                '币本位合约交易单位为BTC等币单位时，显示的持仓数量为根据实际张数换算而来的，数值随着最新价格变动而变动。'
              )
          }
        >
          <InfoHover componnet="span">{LANG('持仓量')}</InfoHover>
        </Tooltip>
      </div>
    </ColSortTitle>
  );
  const openPriceTitle = (
    <Tooltip
      arrow={false}
      className={clsx('custom-tooltip')}
      placement="top"
      title={LANG('持仓的平均买入/卖出成交价格')}
    >
      <InfoHover componnet="span">{LANG('开仓价格')}</InfoHover>
    </Tooltip>
  );
  const flagPriceTitle = (
    <Tooltip
      placement="top"
      title={LANG(
        '合约的实时标记价格。此标记价格将用于计算盈亏及保证金，可能与合约最新成交价格有所偏差，以避免价格操纵。标记价格的计算是基于指数价格，指数价格是从主流现货交易所提取的总价格，由其相对交易量加权。'
      )}
      className={clsx('custom-tooltip')}
      arrow={false}
    >
      <InfoHover componnet="span">{LANG('标记价格')}</InfoHover>
    </Tooltip>
  );

  const lipPriceTitle = (
    <Tooltip
      placement="top"
      title={
        <>
          <span
            dangerouslySetInnerHTML={{
              __html: LANG(
                '若多仓的标记价格低于此强平价格，或是空仓的标记价格高于此强平价格，你的持仓将被强平。 {more}',
                {
                  more: `<a target={'_blank'}  class="${linkClassName} link"  href="${getZendeskLink(
                    '/articles/4404154603417'
                  )}">${LANG('了解更多')}</a>`
                }
              )
            }}
          />
          {linkStyles}
        </>
      }
    >
      <InfoHover componnet="span">{LANG('强平价格')}</InfoHover>
    </Tooltip>
  );
  const longCodeString = useMemo(
    () =>
      data?.some((v: any) => {
        return Swap.Info.getCryptoData(v.symbol, { withHooks: false }).name.length >= 13;
      }),
    [data]
  );
  const columns: any = [
    {
      title: (
        <ColSortTitle value={store.getSortValue('symbol', sort)} onChange={store.sortTypeChangeEvent('symbol')}>
          {LANG('合约名称')}
        </ColSortTitle>
      ),
      // minWidth: longCodeString ? 150 : undefined,
      minWidth: 150,
      fixed: 'left',
      dataIndex: 'code',
      className: clsx('code-col'),
      render: (v: any, item: any) => {
        const leverage = item?.leverage;
        const walletData = Swap.Assets.getWallet({ walletId: item.subWallet, usdt: isUsdtType, withHooks: false });
        const canAdjustLeverage = !assetsPage && item.subWallet === SWAP_DEFAULT_WALLET_KEY;

        return (
          <TradeLink id={item.symbol.toUpperCase()}>
            <div className={clsx('code', item.side === '1' ? 'buy' : 'sell')}>
              <div className={clsx('multi-line-item', 'content')}>
                <div className={clsx('code-text')}>
                  <div>
                    {Swap.Info.getCryptoData(item.symbol, { withHooks: false }).name} {LANG('永续')}
                  </div>
                  <div className={clsx('lever-row')}>
                    <div className={clsx('margin-name')}>{item.marginType === 1 ? LANG('全仓') : LANG('逐仓')}</div>
                    {leverage ? (
                      <div
                        className={clsx('lever-action')}
                        onClick={(e: any) => {
                          if (assetsPage) {
                            return;
                          }
                          e.preventDefault();
                          e.stopPropagation();
                          Swap.Trade.setModal({
                            leverVisible: true,
                            leverData: { lever: leverage, symbol: item.symbol.toUpperCase(), wallet: item.subWallet, side: item.side, pid: item.positionId }
                          });
                        }}
                      >
                        <LeverItem lever={leverage}></LeverItem>
                        {canAdjustLeverage && <YIcon.positionEdit className={clsx('editIcon', 'stroke-icon')} />}
                      </div>
                    ) : (
                        ''
                      )}
                  </div>
                </div>
                {/* <div className={clsx('nowrap')}>
                  <div className={clsx()}>
                    <div
                      className={clsx('wallet')}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (walletData?.edit) {
                          onWalletClick(walletData);
                        }
                      }}
                    >
                      <WalletAvatar type={!isDemo ? walletData?.pic : null} size={16} walletData={walletData} />
                      <div className={clsx('text', isDemo && 'active')}>
                        {!isDemo ? walletData?.alias : LANG('模拟交易账户')}
                      </div>
                      {!isDemo && walletData?.edit && (
                        <CommonIcon
                          name='common-small-edit-0'
                          width={12}
                          height={13}
                          className={clsx('icon')}
                          enableSkin
                        />
                      )}
                    </div>
                  </div>
                </div> */}

              </div>
            </div>
          </TradeLink>
        );
      }
    },
    {
      title: LANG('账户'),
      dataIndex: 'subWallet',
      minWidth: 100,
      visible: !assetsPage,
      render: (v: any, item: any) => {
        const walletData = Swap.Assets.getWallet({ walletId: item.subWallet, usdt: isUsdtType, withHooks: false });
        return (
          <WalletName> {LANG(walletData?.alias)} </WalletName>
        );
      }
    },
    {
      title: () => volumeTitle,
      visible: assetsPage,
      dataIndex: 'currentPositionFormat',
      minWidth: 100,
      render: (v: any, item: any) => {
        return `${v} ${Swap.Info.getUnitText({
          symbol: item.symbol,
          withHooks: false
        })}`;
      }
    },
    {
      title: () => openPriceTitle,
      visible: assetsPage,
      dataIndex: 'openPrice',
      minWidth: 100,
      render: (v: any, item: any) => {
        return formatNumber2Ceil(item.avgCostPrice, Number(item.baseShowPrecision), item.side === '1').toFormat(
          Number(item.baseShowPrecision)
        );
      }
    },
    {
      title: <div className={clsx('flex-inline')}>{volumeTitle}</div>,
      visible: !assetsPage,
      dataIndex: 'currentPositionFormat',
      minWidth: 100,
      render: (v: any, item: any) => {
        return (
          <div className={clsx('current-position')}>
            <div>
              {`${v} ${Swap.Info.getUnitText({
                symbol: item.symbol,
                withHooks: false
              })}`}
            </div>
          </div>
        );
      }
    },
    {
      title: LANG('仓位保证金'),
      visible: !assetsPage,
      dataIndex: 'currentPositionFormat',
      minWidth: 100,
      render: (v: any, item: any) => {
        const { settleCoin } = Swap.Info.getCryptoData(item.symbol, { withHooks: false });
        const canAdd = item.marginType === MARGIN_TYPE.ISOLATED && item.subWallet === SWAP_DEFAULT_WALLET_KEY;

        const handleMargin = isUsdtType
          ? FORMULAS.SWAP.usdt.calculateFreezeClosingFee
          : FORMULAS.SWAP.coin.calculateFreezeClosingFee;
        const firstMargin = handleMargin(
          item['avgCostPrice'],
          item['currentPosition'],
          getCryptoData(item.symbol.toUpperCase()).contractFactor,
          item['r']
        );
        const marginData = Number(item.margin).sub(Number(firstMargin));
        // const myMargin = isUsdtType
        //   ? formatNumber2Ceil(marginData, 2).toFixed(2)
        //   : Number(marginData).toFixed(Number(item.basePrecision));

        const myMargin = parseFloat(Number(item.margin).toFixed(2));

        return (
          <>
            <div
              className={clsx('margin-wrapper', 'current-position', 'pointer')}
              onClick={() => canAdd && onVisibleMarginModal(item)}
            >
              <div className={clsx()}>
                {myMargin}
                {` ${settleCoin}`}
              </div>
              {canAdd && (
                <>
                  <YIcon.addMarin className={clsx('editIcon')} />
                </>
              )}
            </div>
          </>
        );
      }
    },
    {
      title: (
        <div className={clsx('flex-inline')}>
          <div>{openPriceTitle}</div>
        </div>
      ),
      visible: !assetsPage,
      dataIndex: 'currentPositionFormat',
      minWidth: 100,
      render: (v: any, item: any) => {
        return (
          <div className={clsx('current-position')}>
            <div>
              {formatNumber2Ceil(item.avgCostPrice, Number(item.baseShowPrecision), item.side === '1').toFormat(
                Number(item.baseShowPrecision)
              )}
            </div>
          </div>
        );
      }
    },
    {
      title: () => <div className={clsx('flag-price-tips')}>{flagPriceTitle}</div>,
      visible: assetsPage,
      dataIndex: 'flagPrice',
      minWidth: 100,
      render: (v: any, item: any) => {
        const fixed = Number(item.baseShowPrecision);
        const flagPrice = getFlagPrice(item)?.toFixed(fixed);
        const avgCostPrice = formatNumber2Ceil(item?.avgCostPrice, fixed, item.side === '1').toFixed(fixed);
        const buyColor = flagPrice >= avgCostPrice ? 'main-green' : 'main-red';
        const sellColor = flagPrice <= avgCostPrice ? 'main-green' : 'main-red';
        const textColor = item.side === '1' ? buyColor : sellColor;

        return <div className={textColor}>{flagPrice?.toFormat(fixed)}</div>;
      }
    },
    {
      title: () => <div className={clsx()}>{flagPriceTitle}</div>,
      visible: !assetsPage,
      dataIndex: 'flagPrice2',
      minWidth: 100,
      render: (v: any, item: any) => {
        const fixed = Number(item.baseShowPrecision);
        const flagPrice = getFlagPrice(item)?.toFixed(fixed);
        const avgCostPrice = formatNumber2Ceil(item?.avgCostPrice, fixed, item.side === '1').toFixed(fixed);
        const buyColor = flagPrice >= avgCostPrice ? 'main-green' : 'main-red';
        const sellColor = flagPrice <= avgCostPrice ? 'main-green' : 'main-red';
        const textColor = item.side === '1' ? buyColor : sellColor;

        return (
          <div className={clsx()}>
            <div className={textColor}>{flagPrice?.toFormat(fixed)}</div>
          </div>
        );
      }
    },
    {
      title: LANG('未实现盈亏'),
      width: isSmallPc ? 135 : undefined,
      dataIndex: 'income',
      minWidth: 100,
      render: (v: any, item: any) => {
        const code = item.symbol.toUpperCase();
        const { settleCoin } = Swap.Info.getCryptoData(code, { withHooks: false });
        const income = Swap.Calculate.income({
          usdt: isUsdtType,
          code: code,
          isBuy: item.side === '1',
          avgCostPrice: item.avgCostPrice,
          volume: item.currentPosition,
          flagPrice: incomeType === 0 ? undefined : getMarketPrice(item)
        });
        const scale = isUsdtType ? 2 : Number(item.basePrecision);

        const myIncome = formatNumber2Ceil(income, scale, false).toFixed(scale);

        const style = Number(myIncome) >= 0 ? 'main-green' : 'main-red';

        // 未实现利率计算

        const incomeRate = Swap.Calculate.positionROE({
          usdt: isUsdtType,
          data: item,
          income: Number(myIncome),
          isAutoMargin: true
        });
        return (
          <div className={clsx('multi-line-item')}>
            <div className={clsx()}>
              <div className={clsx(style)}>
                {myIncome} {settleCoin}
              </div>
            </div>
          </div>
        );
      }
    },
    {
      title: LANG('收益率'),
      width: isSmallPc ? 135 : undefined,
      dataIndex: 'income',
      minWidth: 100,
      render: (v: any, item: any) => {
        const code = item.symbol.toUpperCase();
        const { settleCoin } = Swap.Info.getCryptoData(code, { withHooks: false });

        const income = Swap.Calculate.income({
          usdt: isUsdtType,
          code: code,
          isBuy: item.side === '1',
          avgCostPrice: item.avgCostPrice,
          volume: item.currentPosition,
          flagPrice: incomeType === 0 ? undefined : getMarketPrice(item)
        });
        const scale = isUsdtType ? 2 : Number(item.basePrecision);

        const myIncome = formatNumber2Ceil(income, scale, false).toFixed(scale);

        const style = Number(myIncome) >= 0 ? 'main-green' : 'main-red';

        // 未实现利率计算

        const incomeRate = Swap.Calculate.positionROE({
          usdt: isUsdtType,
          data: item,
          income: Number(myIncome),
          isAutoMargin: true
        });
        return (
          <div className={clsx('multi-line-item')}>
            <div className={clsx()}>
              <div className={clsx(style)}>{`${incomeRate}`.toFixed(2) + '%'}</div>
            </div>
            {!assetsPage && (
              <YIcon.share
                className={clsx('editIcon', 'stroke-icon')}
                onClick={() => {
                  onShare(item);
                }}
              />
            )}
          </div>
        );
      }
    },
    {
      title: LANG('预估强平价'),
      visible: !assetsPage,
      dataIndex: 'flagPrice2',
      minWidth: 135,
      render: (v: any, item: any) => {
        const fixed = Number(item.baseShowPrecision);
        return (
          <div className={clsx()}>
            <div className={clsx('liquidation-price')}>{item.liquidationPrice.toFormat(fixed)}</div>
          </div>
        );
      }
    },
    {
      title: () => (
        <ColSortTitle
          value={store.getSortValue('positionMarginRate', sort)}
          onChange={store.sortTypeChangeEvent('positionMarginRate')}
        >
          <div className={clsx()}>
            <Tooltip
              placement="top"
              title={LANG('保证金比率越低，仓位的风险相对较小。当保证金比率到达100%时，仓位将被强平。')}
              className={clsx('custom-tooltip')}
              arrow={false}
            >
              <InfoHover componnet="span">{LANG('保证金率')}</InfoHover>
            </Tooltip>
          </div>
        </ColSortTitle>
      ),
      // minWidth: isSmallPc ? 135 : undefined,
      minWidth: 100,
      dataIndex: 'margin',
      render: (margin: any, item: any) => {
        const { settleCoin } = Swap.Info.getCryptoData(item.symbol, { withHooks: false });
        const canAdd = item.marginType === 2;

        const handleMargin = isUsdtType
          ? FORMULAS.SWAP.usdt.calculateFreezeClosingFee
          : FORMULAS.SWAP.coin.calculateFreezeClosingFee;
        const firstMargin = handleMargin(
          item['avgCostPrice'],
          item['currentPosition'],
          getCryptoData(item.symbol.toUpperCase()).contractFactor,
          item['r']
        );
        const marginData = Number(item.margin).sub(Number(firstMargin));
        const myMargin = isUsdtType
          ? formatNumber2Ceil(marginData, 2).toFixed(2)
          : Number(marginData).toFixed(Number(item.basePrecision));

        return (
          <div className={clsx('margin-wrapper', 'pointer')} onClick={() => canAdd && onVisibleMarginModal(item)}>
            <div className={clsx()}>
              <div className={clsx()}>{(item.positionMarginRate * 100).toFixed(2)}%</div>
            </div>
            {/* {canAdd && (
              <>
                <YIcon.addMarin className={clsx('editIcon')} />
              </>
            )} */}
          </div>
        );
      }
    },
    {
      visible: !assetsPage,
      title: () => (
        <Tooltip
          placement="top"
          title={LANG(
            '该止盈止损针对整个仓位(无论加仓或者减仓）。平仓后该止盈止损将被自动取消。当价格到达设定的触发价格时，将执行市价平仓委托。如果仓位数量超过市价委托单笔最大数量限制时，委托将被拒绝。'
          )}
          className={clsx('custom-tooltip')}
          arrow={false}
        >
          <InfoHover componnet="span">{LANG('仓位止盈止损')}</InfoHover>
        </Tooltip>
      ),
      // width: isZh || isEn ? 130 : null,
      dataIndex: 'zhiyin',
      minWidth: 100,
      render: (v: any, item: any) => {
        const baseShowPrecision = Number(item.baseShowPrecision);
        let stopProfit = '--';
        let stopLoss = '--';
        item.orders.filter((item) => item.ctime).forEach((o: any) => {
          if (o.strategyType === '1') stopProfit = Number(o.triggerPrice).toFixed(baseShowPrecision);
          if (o.strategyType === '2') stopLoss = Number(o.triggerPrice).toFixed(baseShowPrecision);
        });

        return (
          <div className={clsx('set-spsl')}>
            <div className={clsx('text')}>
              <div className={clsx()}> {stopProfit}</div>
              <div className={clsx()}> {stopLoss}</div>
            </div>
            <div style={{ width: 10 }} />
            <YIcon.positionEdit className={clsx('editIcon')} onClick={() => onVisibleSPSLModal(item, 0, true)} />
          </div>
        );
      }
    }

    // {
    //   visible: !assetsPage,
    //   title: () => (
    //     <Tooltip
    //       placement='top'
    //       title={LANG(
    //         '该止盈止损针对整个仓位(无论加仓或者减仓）。平仓后该止盈止损将被自动取消。当价格到达设定的触发价格时，将执行市价平仓委托。如果仓位数量超过市价委托单笔最大数量限制时，委托将被拒绝。'
    //       )}
    //       arrow={false}
    //       className={clsx('custom-tooltip')}
    //     >
    //       <InfoHover componnet='span'>{LANG('部分止盈止损')}</InfoHover>
    //     </Tooltip>
    //   ),
    //   // width: isZh || isEn ? 130 : null,
    //   dataIndex: 'zhiyin',
    //   minWidth: 100,
    //   render: (v: any, item: any) => {
    //     const baseShowPrecision = Number(item.baseShowPrecision);
    //     let stopProfit = '--';
    //     let stopLoss = '--';

    //     item.orders.forEach((o: any) => {
    //       if (o.strategyType === '1') stopProfit = Number(o.triggerPrice).toFixed(baseShowPrecision);
    //       if (o.strategyType === '2') stopLoss = Number(o.triggerPrice).toFixed(baseShowPrecision);
    //     });

    //     return (
    //       <div className={clsx('set-spsl')}>
    //         <div className={clsx('text')}>
    //           <div className={clsx()}> {stopProfit}</div>
    //           <div className={clsx()}> {stopLoss}</div>
    //         </div>
    //         <div style={{ width: 10 }} />
    //         <YIcon.positionEdit className={clsx('editIcon')} onClick={() => onVisibleSPSLModal(item, 0)} />
    //       </div>
    //     );
    //   },
    // },
  ];

  columns.push(
    // {
    //   visible: !assetsPage,
    //   title: <span style={{ color: 'var(--spec-font-color-2)' }}>{LANG('平仓')}</span>,
    //   dataIndex: 'liquidation',
    //   // width: 150,
    //   render: (v: any, item: any) => {
    //     return (
    //       <div className={clsx('button-actions')}>
    //         <SubButton className='sub-button' onClick={() => onVisibleLiquidationModal(item, false)}>
    //           {LANG('市价')}
    //         </SubButton>
    //         <SubButton className='sub-button' onClick={() => onVisibleLiquidationModal(item, true)}>
    //           {LANG('限价')}
    //         </SubButton>
    //       </div>
    //     );
    //   },
    // },

    {
      title: <span style={{ color: 'var(--spec-font-color-2)', padding: '0 12px 0 0' }}>{LANG('操作')}</span>,
      dataIndex: 'actions',
      align: 'right',
      width: 300,
      fixed: 'right',
      hidden: wallet === WalletKey.COPY,
      render: (v: any, item: any) => {
        return (
          <LiquidationInputPrice
            onReverse={() => onReverse(item, ({ onConfirm }) => onVisibleReverseModal(item, onConfirm))}
            item={item}
            isUsdtType={isUsdtType}
          />
        );
      }
    }
  );
  return columns.filter((v: any) => [undefined, true].includes(v.visible));
};

const IncomeColTitle = () => {
  return (
    <ColSortTitle value={store.getSortValue('income', store.sort)} onChange={store.sortTypeChangeEvent('income')}>
      <div>
        <Tooltip
          placement="top"
          title={
            <IncomeTips value={store.incomeType} onChange={(incomeType: any) => (store.incomeType = incomeType)} />
          }
          arrow={false}
          className={clsx('custom-tooltip')}
        >
          <InfoHover componnet="span">{`${LANG('未实现盈亏____1')}/${LANG('回报率')}`}</InfoHover>
        </Tooltip>
      </div>
    </ColSortTitle>
  );
};
export default PositionList;
