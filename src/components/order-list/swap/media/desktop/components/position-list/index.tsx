import CommonIcon from '@/components/common-icon';
import { ImageHover } from '@/components/image';
import { linkClassName, linkStyles } from '@/components/link';
import EditButton from '@/components/order-list/components/edit-button';
import { OrderShare } from '@/components/order-list/components/order-share/export';
import RecordList, { ColSortTitle } from '@/components/order-list/components/record-list';
import { useListByStore } from '@/components/order-list/swap/store';
import {
  store,
  useModalProps,
  usePositionActions,
  useSortData,
} from '@/components/order-list/swap/stores/position-list';
import { InfoHover } from '@/components/trade-ui/common/info-hover';
import Tooltip from '@/components/trade-ui/common/tooltip';
import {
  LiquidationModal,
  ReverseConfirmModal,
  StopProfitStopLossModal,
  TrackModal,
} from '@/components/trade-ui/order-list/swap/components/modal';

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
import { clsx, styles } from './styled';

export const PositionList = ({
  assetsPage,
  onWalletClick,
}: {
  assetsPage?: boolean;
  onWalletClick?: (walletData?: any) => any;
}) => {
  let qty = Number(getUrlQueryParams('qty'));
  const { setting } = kHeaderStore(qty);
  const { isUsdtType, quoteId } = Swap.Trade.base;
  const walletId = Swap.Info.getWalletId(isUsdtType);

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
    onVisibleReverseModal,
  } = useModalProps();
  const positions = Swap.Calculate.positionData({
    usdt: isUsdtType,
    data: Swap.Order.getPosition(isUsdtType),
    twoWayMode: Swap.Trade.twoWayMode,
  }).list;
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
  useWs(SUBSCRIBE_TYPES.ws3001, (data) => {
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
        flagPrice: incomeType === 0 ? undefined : getMarketPrice(modalItem),
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
              volume: Number(item.currentPosition),
            });
            const rate = Swap.Calculate.positionROE({
              usdt: isUsdtType,
              data: item,
              income: income,
            });
            return `${rate.toFixed(2)}%`;
          };

          kChartEmitter.emit(
            kChartEmitter.K_CHART_POSITION_UPDATE,
            list
              .filter((e: { subWallet: string }) => e?.subWallet === walletId)
              .map((item: any) => {
                return {
                  id: item.positionId,
                  side: item.side,
                  sideText: item.side === '1' ? LANG('多') : LANG('空'),
                  openPrice: formatNumber2Ceil(
                    item.avgCostPrice,
                    Number(item.baseShowPrecision),
                    item.side === '1'
                  ).toFixed(Number(item.baseShowPrecision)),
                  volume: item.currentPositionFormat,
                  profitRate: handleRate(item),
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

  return (
    <>
      <div className={clsx('position-list')}>
        <RecordList
          renderRowKey={(v) => `${v.side} ${v.subWallet} ${v.symbol}}`}
          data={list}
          loading={Swap.Order.getPositionLoading(isUsdtType)}
          columns={useColumns({
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
            list: maeketList,
          })}
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
        {trackModalProps.visible && (
          <TrackModal
            {...trackModalProps}
            data={list.find((v: any) => Swap.Order.positionIsSame(v, trackModalProps.data as any)) || { symbol: '' }}
            onClose={onCloseTrackModal}
          />
        )}
        {reverseModalProps.visible && <ReverseConfirmModal {...reverseModalProps} onClose={onCloseReverseModal} />}
        {
        spslModalProps.visible && (
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
            title={LANG('当前仓位')}
            code={Swap.Info.getCryptoData(modalItem.symbol, { withHooks: false }).name}
            onClose={() => setModalItem(undefined)}
            rate={Swap.Calculate.positionROE({
              usdt: isUsdtType,
              data: modalItem,
              income: Number(modalItemIncome),
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
              Swap.Socket.getFlagPrice(modalItem.symbol, { withHooks: false }),
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
  list,
}: any) => {
  const { windowWidth } = useResponsive(false);
  const isSmallPc = windowWidth < 1500;
  const { onReverse } = usePositionActions();
  const indexPrice = Swap.Socket.getIndexPirce(quoteId);
  Swap.Socket.store.data1050;
  const getFlagPrice = (v: any) => Swap.Socket.getFlagPrice(v.symbol, { withHooks: false });
  const onVisibleSPSLModal = (item: any) => onVisiblesSpslModal(item);
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
    onWalletClick = () => {};
  }

  const volumeTitle = (
    <ColSortTitle
      value={store.getSortValue('currentPositionFormat', sort)}
      onChange={store.sortTypeChangeEvent('currentPositionFormat')}
    >
      <div>
        <Tooltip
          placement='top'
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
          <InfoHover componnet='span'>{LANG('数量')}</InfoHover>
        </Tooltip>
      </div>
    </ColSortTitle>
  );
  const openPriceTitle = (
    <Tooltip placement='top' title={LANG('持仓的平均买入/卖出成交价格')}>
      <InfoHover componnet='span'>{LANG('开仓价格')}</InfoHover>
    </Tooltip>
  );
  const flagPriceTitle = (
    <Tooltip
      placement='top'
      title={LANG(
        '合约的实时标记价格。此标记价格将用于计算盈亏及保证金，可能与合约最新成交价格有所偏差，以避免价格操纵。标记价格的计算是基于指数价格，指数价格是从主流现货交易所提取的总价格，由其相对交易量加权。当前指数价格是{price}。',
        { price: indexPrice }
      )}
    >
      <InfoHover componnet='span'>{LANG('标记价格')}</InfoHover>
    </Tooltip>
  );

  const lipPriceTitle = (
    <Tooltip
      placement='top'
      title={
        <>
          <span
            dangerouslySetInnerHTML={{
              __html: LANG(
                '若多仓的标记价格低于此强平价格，或是空仓的标记价格高于此强平价格，你的持仓将被强平。 {more}',
                {
                  more: `<a target={'_blank'}  class="${linkClassName} link"  href="${getZendeskLink(
                    '/articles/4404154603417'
                  )}">${LANG('了解更多')}</a>`,
                }
              ),
            }}
          />
          {linkStyles}
        </>
      }
    >
      <InfoHover componnet='span'>{LANG('强平价格')}</InfoHover>
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
          {LANG('合约')}
        </ColSortTitle>
      ),
      width: longCodeString ? 150 : undefined,
      dataIndex: 'code',
      className: clsx('code-col'),
      render: (v: any, item: any) => {
        const leverage = item?.leverage;
        const walletData = Swap.Assets.getWallet({ walletId: item.subWallet, usdt: isUsdtType, withHooks: false });
        return (
          <TradeLink id={item.symbol.toUpperCase()}>
            <div className={clsx('code', item.side === '1' ? 'buy' : 'sell')}>
              <div className={clsx('multi-line-item', 'content')}>
                <div className={clsx('code-text')}>
                  <div>{Swap.Info.getCryptoData(item.symbol, { withHooks: false }).name}</div>
                  <div className={clsx('margin-type')}>{item.marginType === 1 ? LANG('全仓') : LANG('逐仓')}</div>
                  {leverage ? (
                    <div
                      className={clsx('lever-row')}
                      onClick={(e: any) => {
                        if (assetsPage) {
                          return;
                        }
                        e.preventDefault();
                        e.stopPropagation();
                        Swap.Trade.setModal({
                          leverVisible: true,
                          leverData: { lever: leverage, symbol: item.symbol.toUpperCase(), wallet: item.subWallet },
                        });
                      }}
                    >
                      <LeverItem lever={leverage}></LeverItem>
                      {!assetsPage && (
                        <CommonIcon name='common-small-edit-0' size={12} className={clsx('icon')} enableSkin />
                      )}
                    </div>
                  ) : (
                    <div style={{ width: 26 }} />
                  )}
                </div>
                <div className={clsx('nowrap')}>
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
                        {!isDemo ? Swap.Assets.walletFormat(walletData)?.alias : LANG('模拟交易账户')}
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
                </div>
              </div>
            </div>
          </TradeLink>
        );
      },
    },
    {
      title: () => volumeTitle,
      visible: assetsPage,
      dataIndex: 'currentPositionFormat',
      render: (v: any, item: any) => {
        return `${v} ${Swap.Info.getUnitText({
          symbol: item.symbol,
          withHooks: false,
        })}`;
      },
    },
    {
      title: () => openPriceTitle,
      visible: assetsPage,
      dataIndex: 'openPrice',
      render: (v: any, item: any) => {
        return formatNumber2Ceil(item.avgCostPrice, Number(item.baseShowPrecision), item.side === '1').toFormat(
          Number(item.baseShowPrecision)
        );
      },
    },
    {
      title: (
        <div className={clsx('flex-inline')}>
          {volumeTitle}
          {' /'}
          <div>{openPriceTitle}</div>
        </div>
      ),
      visible: !assetsPage,
      dataIndex: 'currentPositionFormat',
      render: (v: any, item: any) => {
        return (
          <div className={clsx('current-position')}>
            {/* <div className={item.side === '1' ? 'main-green' : 'main-red'}> */}
            <div>
              {`${v} ${Swap.Info.getUnitText({
                symbol: item.symbol,
                withHooks: false,
              })}`}
            </div>
            <div>
              {formatNumber2Ceil(item.avgCostPrice, Number(item.baseShowPrecision), item.side === '1').toFormat(
                Number(item.baseShowPrecision)
              )}
            </div>
          </div>
        );
      },
    },
    // {
    //   title: LANG('仓位模式'),
    //   dataIndex: 'marginType',
    //   width: isZh || isEn ? 80 : null,
    //   render: (v: any, item: any) => (v === 1 ? LANG('全仓') : LANG('逐仓')),
    // },
    // {
    //   title: () => (
    //     <Tooltip placement='top' title={LANG('持仓的平均买入/卖出成交价格')}>
    //       <InfoHover componnet='span'>{LANG('开仓价格')}</InfoHover>
    //     </Tooltip>
    //   ),
    //   dataIndex: 'avgCostPrice',
    //   render: (v: any, item: any) => {
    //     const fixed = Number(item.baseShowPrecision);
    //     return formatNumber2Ceil(v, fixed, item.side === '1').toFormat(Number(item.baseShowPrecision));
    //   },
    // },
    {
      title: () => <div className={clsx()}>{flagPriceTitle}</div>,
      visible: assetsPage,
      dataIndex: 'flagPrice',
      render: (v: any, item: any) => {
        const fixed = Number(item.baseShowPrecision);
        const flagPrice = getFlagPrice(item)?.toFixed(fixed);
        const avgCostPrice = formatNumber2Ceil(item?.avgCostPrice, fixed, item.side === '1').toFixed(fixed);
        const buyColor = flagPrice >= avgCostPrice ? 'main-green' : 'main-red';
        const sellColor = flagPrice <= avgCostPrice ? 'main-green' : 'main-red';
        const textColor = item.side === '1' ? buyColor : sellColor;

        return <div className={textColor}>{flagPrice?.toFormat(fixed)}</div>;
      },
    },
    {
      title: () => <div className={clsx()}>{lipPriceTitle}</div>,
      visible: assetsPage,
      dataIndex: 'liquidation-price',
      render: (v: any, item: any) => {
        const fixed = Number(item.baseShowPrecision);

        return <div className={clsx('liquidation-price')}>{item.liquidationPrice.toFormat(fixed)}</div>;
      },
    },
    {
      title: () => (
        <div className={clsx()}>
          {flagPriceTitle}/{lipPriceTitle}
        </div>
      ),
      visible: !assetsPage,
      dataIndex: 'flagPrice2',
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
            <div className={clsx('liquidation-price')}>{item.liquidationPrice.toFormat(fixed)}</div>
          </div>
        );
      },
    },
    {
      title: () => (
        <ColSortTitle
          value={store.getSortValue('positionMarginRate', sort)}
          onChange={store.sortTypeChangeEvent('positionMarginRate')}
        >
          <div className={clsx()}>
            <Tooltip placement='top' title={LANG('仓位占用的保证金')}>
              <InfoHover componnet='span'>{LANG('保证金')}</InfoHover>
            </Tooltip>
            /
            <Tooltip
              placement='top'
              title={LANG('保证金比率越低，仓位的风险相对较小。当保证金比率到达100%时，仓位将被强平。')}
            >
              <InfoHover componnet='span'>{LANG('保证金率')}</InfoHover>
            </Tooltip>
          </div>
        </ColSortTitle>
      ),
      width: isSmallPc ? 135 : undefined,
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
          <div
            className={clsx('margin-wrapper', 'pointer')}
            onClick={() => (canAdd ? onVisibleMarginModal(item) : null)}
          >
            <div className={clsx()}>
              <div className={clsx()}>
                {myMargin}
                {` ${settleCoin}`}
              </div>
              <div className={clsx()}>{(item.positionMarginRate * 100).toFixed(2)}%</div>
            </div>
            {canAdd && (
              <>
                <div style={{ width: 10 }} />
                <EditButton />
              </>
            )}
          </div>
        );
      },
    },
    {
      title: () => <IncomeColTitle />,
      width: isSmallPc ? 135 : undefined,
      dataIndex: 'income',
      render: (v: any, item: any) => {
        const code = item.symbol.toUpperCase();
        const { settleCoin } = Swap.Info.getCryptoData(code, { withHooks: false });

        const income = Swap.Calculate.income({
          usdt: isUsdtType,
          code: code,
          isBuy: item.side === '1',
          avgCostPrice: item.avgCostPrice,
          volume: item.currentPosition,
          flagPrice: incomeType === 0 ? undefined : getMarketPrice(item),
        });
        const scale = isUsdtType ? 2 : Number(item.basePrecision);

        const myIncome = formatNumber2Ceil(income, scale, false).toFixed(scale);

        const style = Number(myIncome) >= 0 ? 'main-green' : 'main-red';

        // 未实现利率计算

        const incomeRate = Swap.Calculate.positionROE({
          usdt: isUsdtType,
          data: item,
          income: Number(myIncome),
          isAutoMargin: true,
        });
        return (
          <div className={clsx('multi-line-item')}>
            <div className={clsx()}>
              <div className={clsx(style)}>
                {myIncome} {settleCoin}
              </div>
              <div className={clsx(style)}>{`${incomeRate}`.toFixed(2) + '%'}</div>
            </div>
            {!assetsPage && (
              <ImageHover
                src='common-share-round-0'
                className={clsx('share')}
                width={20}
                height={20}
                hoverSrc='common-share-round-active-0'
                onClick={() => {
                  onShare(item);
                }}
                enableSkin
              />
            )}
          </div>
        );
      },
    },
  ];

  columns.push(
    {
      visible: !assetsPage,
      title: <span style={{ color: 'var(--spec-font-color-2)' }}>{LANG('平仓')}</span>,
      dataIndex: 'liquidation',
      // width: 150,
      render: (v: any, item: any) => {
        return (
          <div className={clsx('button-actions')}>
            <SubButton className='sub-button' onClick={() => onVisibleLiquidationModal(item, false)}>
              {LANG('市价')}
            </SubButton>
            <SubButton className='sub-button' onClick={() => onVisibleLiquidationModal(item, true)}>
              {LANG('限价')}
            </SubButton>
          </div>
        );
      },
    },
    // {
    //   visible: !assetsPage,
    //   title: <span style={{ color: 'var(--spec-font-color-2)' }}>{LANG('追踪出场')}</span>,
    //   dataIndex: 'callbackValue',
    //   // width: isZh || isEn ? 100 : null,
    //   render: (v: any, item: any) => {
    //     if (Number(item.callbackRate) > 0) {
    //       const swap = Swap.Info.getCryptoData(item.symbol, { withHooks: false });
    //       // 按比例（即根据当前最新价格*对应比例=回撤价格）
    //       v = Swap.Utils.minChangeFormat(swap.minChangePrice, item.cbVal);
    //       if (Number(item.cbVal) < swap.minChangePrice) {
    //         v = swap.minChangePrice;
    //       }
    //     }
    //     return (
    //       <div className={clsx('follow-action')}>
    //         <div className={clsx('text')}>
    //           <div>
    //             {!Number(item.activationPrice) ? (v ? Number(v).toFixed(Number(item.baseShowPrecision)) : '--') : '--'}
    //           </div>
    //         </div>
    //         <div style={{ width: 10 }} />
    //         <EditButton onClick={() => onVisibleTrackModal(item)} />
    //       </div>
    //     );
    //   },
    // },
    {
      visible: !assetsPage,
      title: () => (
        <Tooltip
          placement='top'
          title={LANG(
            '该止盈止损针对整个仓位(无论加仓或者减仓）。平仓后该止盈止损将被自动取消。当价格到达设定的触发价格时，将执行市价平仓委托。如果仓位数量超过市价委托单笔最大数量限制时，委托将被拒绝。'
          )}
        >
          <InfoHover componnet='span'>{LANG('仓位止盈止损')}</InfoHover>
        </Tooltip>
      ),
      // width: isZh || isEn ? 130 : null,
      dataIndex: 'zhiyin',
      render: (v: any, item: any) => {
        const baseShowPrecision = Number(item.baseShowPrecision);
        let stopProfit = '--';
        let stopLoss = '--';

        item.orders.forEach((o: any) => {
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
            <EditButton onClick={() => onVisibleSPSLModal(item)} />
          </div>
        );
      },
    },
    {
      title: <span style={{ color: 'var(--spec-font-color-2)' }}>{LANG('操作')}</span>,
      dataIndex: 'actions',
      align: 'right',
      render: (v: any, item: any) => (
        <div className={clsx('button-actions', 'flex-end')}>
          {!assetsPage ? (
            <SubButton
              className='sub-button'
              onClick={() => {
                onReverse(item, ({ onConfirm }) => onVisibleReverseModal(item, onConfirm));
              }}
            >
              {LANG('反向开仓')}
            </SubButton>
          ) : (
            <TrLink href={`/swap/${item.symbol.toLowerCase()}`}>
              <SubButton className='sub-button'>{LANG('交易')}</SubButton>
            </TrLink>
          )}
        </div>
      ),
    }
  );
  return columns.filter((v: any) => [undefined, true].includes(v.visible));
};

const IncomeColTitle = () => {
  return (
    <ColSortTitle value={store.getSortValue('income', store.sort)} onChange={store.sortTypeChangeEvent('income')}>
      <div>
        <Tooltip
          placement='top'
          title={
            <IncomeTips value={store.incomeType} onChange={(incomeType: any) => (store.incomeType = incomeType)} />
          }
        >
          <InfoHover componnet='span'>{`${LANG('未实现盈亏____1')}/${LANG('回报率')}`}</InfoHover>
        </Tooltip>
      </div>
    </ColSortTitle>
  );
};
export default PositionList;
