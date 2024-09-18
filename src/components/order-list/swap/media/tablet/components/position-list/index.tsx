import { Loading } from '@/components/loading';
import { AlertFunction } from '@/components/modal/alert-function';
import ShareModal from '@/components/order-list/lite/components/share-modal';
import { store as orderListStore, useListByStore } from '@/components/order-list/swap/store';
import { useModalProps, usePositionActions } from '@/components/order-list/swap/stores/position-list';
import {
  LiquidationModal,
  ModifyMarginModal,
  ReverseConfirmModal,
  StopProfitStopLossModal,
  TrackModal,
} from '@/components/trade-ui/order-list/swap/components/modal';
import { LANG } from '@/core/i18n';
import { Swap } from '@/core/shared';
import { useAppContext } from '@/core/store';
import { formatNumber2Ceil, message } from '@/core/utils';
import { useState } from 'react';
import { ListBar } from '../list-bar';
import { ListView } from '../list-view';
import { PositionItem } from './components/position-item';

export const PositionList = ({
  onWalletClick,
  assetsPage,
}: {
  onWalletClick?: (walletData?: any) => any;
  assetsPage?: boolean;
}) => {
  const { isUsdtType, quoteId } = Swap.Trade.base;
  const [_modalItem, setModalItem] = useState<any>(undefined);
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
  Swap.Info.getIsVolUnit(isUsdtType);
  let list = useListByStore(
    Swap.Calculate.positionData({
      usdt: isUsdtType,
      data: Swap.Order.getPosition(isUsdtType),
      twoWayMode: Swap.Trade.twoWayMode,
    }).list
  );
  if (!useAppContext().isLogin) {
    list = [];
  }
  const { onReverse } = usePositionActions();
  const { hide } = orderListStore;
  const loading = Swap.Order.getPositionLoading(isUsdtType);
  const position = list.find((v: any) => v.positionId === (marginModalProps.data as any)?.positionId) || { symbol: '' };
  const modalItem = _modalItem && list.find((v: any) => v.positionId === _modalItem.positionId);
  const onShare = (item: any) => {
    setModalItem(item);
  };
  const onSpsl = (item: any) => {
    onVisiblesSpslModal(item);
  };
  const onClose = (item: any) => {
    onVisibleLiquidationModal(item, false);
  };
  const onCloseAll = (item: any) => {
    AlertFunction({
      v2: true,
      title: LANG('市价全平'),
      onOk: async () => {
        Loading.start();
        try {
          const result = await Swap.Order.closePosition(item, {
            price: '',
            orderQty: item.availPosition,
            side: Number(item.side) === 1 ? 1 : 2, // 1 买  2 卖
            type: 5,
          });
          if (result.code != 200) {
            message.error(result);
          }
        } catch (error: any) {
          message.error(error);
        } finally {
          Loading.end();
        }
      },
      content: LANG('全部仓位将以市价委托方式进行平仓，请确认是否市价全平？'),
    });
  };

  const onTrack = (item: any) => {
    onVisibleTrackModal(item);
  };
  const onChangeMargin = (item: any) => {
    onVisibleMarginModal(item);
  };

  return (
    <div>
      <ListBar positionMode positions={list} />
      <ListView data={list} loading={!list.length && loading}>
        {(index) => {
          const item = list[index];

          return (
            <PositionItem
              key={item.positionId}
              data={item}
              onShare={onShare}
              onSpsl={onSpsl}
              onClose={onClose}
              onCloseAll={onCloseAll}
              onTrack={onTrack}
              onReverse={(item) => onReverse(item, (onConfirm) => onVisibleReverseModal(item, onConfirm))}
              onChangeMargin={onChangeMargin}
              onWalletClick={onWalletClick}
              assetsPage={assetsPage}
            ></PositionItem>
          );
        }}
      </ListView>
      {modalItem && (
        <ShareModal
          isBuy={modalItem.side === '1'}
          lever={modalItem?.leverage}
          commodityName={Swap.Info.getCryptoData(modalItem.symbol, { withHooks: false }).name}
          type={Swap.Info.getContractName(isUsdtType)}
          incomeRate={Number(
            Swap.Calculate.positionROE({
              usdt: isUsdtType,
              data: modalItem,
              income: modalItem.income,
            }).toFixed(2)
          )}
          currentPrice={Swap.Socket.getFlagPrice(modalItem.symbol, { withHooks: false })}
          opPrice={formatNumber2Ceil(
            modalItem.avgCostPrice,
            Number(modalItem.baseShowPrecision),
            modalItem.side === '1'
          ).toFixed(Number(modalItem.baseShowPrecision))}
          onCancel={() => setModalItem(undefined)}
        />
      )}
      <ReverseConfirmModal {...reverseModalProps} onClose={onCloseReverseModal} />
      <LiquidationModal {...liquidationModalProps} onClose={onCloseLiquidationModal} />
      <ModifyMarginModal {...marginModalProps} data={position} onClose={onCloseMarginModal} />
      <TrackModal {...trackModalProps} onClose={onCloseTrackModal} />
      <StopProfitStopLossModal
        {...spslModalProps}
        data={list.find((v: any) => v.positionId === (spslModalProps.data as any)?.positionId) || spslModalProps.data}
        onClose={onCloseSpslModal}
      />
    </div>
  );
};
export default PositionList;
