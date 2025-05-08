import { Loading } from '@/components/loading';
import { AlertFunction } from '@/components/modal/alert-function';
import ShareModal from '@/components/order-list/lite/components/share-modal';
import { store as orderListStore, useListByStore } from '@/components/order-list/swap/store';
import { useModalProps, usePositionActions, useSortData } from '@/components/order-list/swap/stores/position-list';
import {
  LiquidationModal,
  ModifyMarginModal,
  ReverseConfirmModal,
  StopProfitStopLossModal,
  TrackModal
} from '@/components/trade-ui/order-list/swap/components/modal';
import { LANG } from '@/core/i18n';
import { Swap } from '@/core/shared';
import { useAppContext } from '@/core/store';
import { formatNumber2Ceil, message } from '@/core/utils';
import { useState } from 'react';
import { ListBar } from '../list-bar';
import { ListView } from '../list-view';
import { PositionItem } from './components/position-item';

import { Mobile } from '@/components/responsive';
import CheckboxItem from '@/components/trade-ui/trade-view/swap/components/checkbox-item';

import CommonIcon from '@/components/common-icon';
import YIcon from '@/components/YIcons';
import { WalletKey } from '@/core/shared/src/swap/modules/assets/constants';
// import CommonIcon from '@/components/common-icon';
// import CheckboxItem from '@/components/trade-ui/trade-view/swap/components/checkbox-item';
// import { useLocalStorage } from '@/core/hooks';

// const CloseAllContent = ({ item }: any) => {
//   const [isNoMoreHint, setIsNoMoreHint] = useLocalStorage(LOCAL_KEY.SWAP_CLOSE_ALL_ALERT, false);
//   const name = Swap.Info.getCryptoData(item.symbol).name;

//   return (
//     <>
//       <div className="close-all-content">
//         <span>
//           {LANG('确认对 {0} 永续 {1} {2}x 仓位进行市价全平？')
//             .replace('{0}', name)
//             .replace('{1}', item.positionSide === 'LONG' ? LANG('多') : LANG('空'))
//             .replace('{2}', item.leverage)}
//         </span>
//         <div className="hint">
//           <CommonIcon name="common-small-info" size={16} />
//           <span>{LANG('如果存在平仓挂单（限价或止盈止损委托），将会在全平前被撤单。')}</span>
//         </div>
//         <div className="line"></div>
//         <CheckboxItem
//           label={LANG('不再提示，您可在【偏好设置】中重新设置。')}
//           info=""
//           value={isNoMoreHint}
//           onChange={value => {
//             setIsNoMoreHint(value);
//           }}
//         />
//       </div>
//       <style jsx>{`
//         .close-all-content {
//           display: flex;
//           flex-direction: column;
//           gap: 1rem;
//           font-size: 14px;
//           font-weight: 400;
//           color: var(--text_2);
//           .hint {
//             display: flex;
//             align-items: center;
//             gap: 2px;
//             font-size: 12px;
//             color: var(--yellow);
//             line-height: 1.5;
//           }
//           .line {
//             width: 100%;
//             height: 1px;
//             background: var(--fill_line_1);
//           }
//         }
//       `}</style>
//     </>
//   );
// };

export const PositionList = ({
  onWalletClick,
  assetsPage,
  wallet
}: {
  onWalletClick?: (walletData?: any) => any;
  assetsPage?: boolean;
  wallet?: WalletKey;
}) => {
  const { isUsdtType, quoteId } = Swap.Trade.base;
  const [_modalItem, setModalItem] = useState<any>(undefined);
  const [dontShouldAgain, setDontShouldAgain] = useState<boolean>(false);
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
  Swap.Info.getIsVolUnit(isUsdtType);
  const positions = Swap.Calculate.positionData({
    usdt: isUsdtType,
    data: Swap.Order.getPosition(isUsdtType),
    twoWayMode: Swap.Trade.twoWayMode
  }).list?.filter(item => !wallet || item.subWallet === wallet);
  const storePositions = useListByStore(positions);
  let list = useSortData(assetsPage ? positions : storePositions);
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
    const coinName = Swap.Info.getCryptoData(item.symbol).name;
    AlertFunction({
      v4: true,
      title: LANG('市价全平'),
      className: 'reverse-modal',
      onOk: async () => {
        Loading.start();
        try {
          const result = await Swap.Order.closePosition(item, {
            price: '',
            orderQty: item.availPosition,
            side: Number(item.side) === 1 ? 1 : 2, // 1 买  2 卖
            type: 5
          });
          if (result.code != 200) {
            // 重复提示 Swap.Order.closePosition
            // message.error(result);
          }
        } catch (error: any) {
          message.error(error);
        } finally {
          Loading.end();
        }
      },
      content: (
        <div className="modal-content-desc">
          <p>
            {LANG('确认对 {0} 永续 {1} {2}x 仓位进行市价全平？')
              .replace('{0}', coinName)
              .replace('{1}', item.positionSide === 'LONG' ? LANG('多') : LANG('空'))
              .replace('{2}', item.leverage)}
          </p>
          <div className="hint">
            <YIcon.tipsIcon />
            <span>{LANG('如果存在平仓挂单（限价或止盈止损委托），将会在全平前被撤单。')}</span>
          </div>
          <div className="divider"></div>
          <Mobile>
            <CheckboxItem
              label={LANG('不再展示，您可在【偏好设置】中重新设置。')}
              value={dontShouldAgain}
              onChange={value => setDontShouldAgain(value)}
            />
          </Mobile>
        </div>
      )
      // content:  <CloseAllContent item={item} />
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
        {index => {
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
              onReverse={item => onReverse(item, onConfirm => onVisibleReverseModal(item, onConfirm))}
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
              income: modalItem.income
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

      <style jsx>{`
        :global(.reverse-modal) {
          :global(.divider) {
            border-top: 1px solid var(--fill_line_1);
            margin: 0 0 12px;
          }
        }
        :global(.hint) {
          padding: 16px 0;
          display: flex;
          align-items: center;
          gap: 2px;
          font-size: 12px;
          color: var(--yellow);
          font-size: 12px;
          font-style: normal;
          font-weight: 400;
          line-height: 150%; /* 18px */
        }
      `}</style>
    </div>
  );
};
export default PositionList;
