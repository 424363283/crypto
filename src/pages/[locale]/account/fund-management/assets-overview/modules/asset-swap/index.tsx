import { ACCOUNT_TYPE, DefaultCoin, TransferModal } from '@/components/modal';
import { WalletFormModal } from '@/components/modal/wallet-form-modal';
import { Desktop, Mobile } from '@/components/responsive';
import TabBar, { TAB_TYPE } from '@/components/tab-bar';
import { useResponsive } from '@/core/hooks';
import { LANG, TrLink } from '@/core/i18n';
import { Swap } from '@/core/shared';
import { DEFAULT_QUOTE_ID } from '@/core/shared/src/swap/modules/trade/constants';
import { MediaInfo, getUrlQueryParams } from '@/core/utils';
import { useEffect, useState } from 'react';
import css from 'styled-jsx/css';
import HeaderAssetCard from '../../components/asset-card';
import { ProfitAnalysisCard } from '../../components/profit-analysis-card';
import { WalletType } from '../../components/types';
import { WalletBalanceCard } from '../../components/walet-balance-card';
import { useCalcSwapAssets } from '../../hooks/use-swap-balance';
import { AllAsset2 } from './components/all-asset2';
import { AssetContent } from './components/asset-content';
import { HistoricalCommission } from './components/historical-commission';
import { HoldPosition } from './components/hold-position';
import { OpenContractView } from './components/open-contract';
import { DaysProfitAndLossSmallCard, INTERVAL_DAY } from '../../components/profit-analysis-card/days-pnl-card';
import { Size } from '@/components/constants';
import { WalletKey } from '@/core/shared/src/swap/modules/assets/constants';

enum TAB_KEY {
  ALL_ASSETS = 'all-assets',
  HOLD_POSITION = 'hold-position',
  HISTORICAL_COMMISSION = 'historical-commission'
}
function AssetSwapPage() {
  const [walletFormModal, _setWalletFormModal] = useState<any>({ visible: false, update: '', isUsdtType: null });
  const [transferModal, setTransferModal] = useState<{ visible: boolean; wallet?: string; isUsdtType?: boolean }>({
    visible: false,
    wallet: '',
    isUsdtType: undefined
  });
  const { isMobile } = useResponsive(false);
  const [curTab, setCurTab] = useState(TAB_KEY.ALL_ASSETS);
  const onChange = (value: string) => {
    setCurTab(value as TAB_KEY);
  };
  const account: keyof typeof WalletKey = getUrlQueryParams('account')?.toUpperCase();
  const swapType = getUrlQueryParams('type');
  const isSwapU = swapType === 'swap-u';
  const walletId = WalletKey[account] || (isSwapU ? WalletKey.SWAP_U : '');
  const { wallets, total: calcTotal } = useCalcSwapAssets({ isSwapU });
  const accountAssets = wallets.find(item => item.wallet === walletId);
  const setWalletFormModal = (next: any) => {
    _setWalletFormModal((v: any) => ({ ...v, ...next }));
  };
  const onOpenWalletFormModal = (walletData: any) => {
    setWalletFormModal({ data: walletData, visible: true });
  };
  const renderTabContent = () => {
    const TAB_CONTENT_MAP = {
      [TAB_KEY.ALL_ASSETS]: (
        <AllAsset2
          isSwapU={isSwapU}
          wallets={wallets}
          walletId={walletId}
          onOpenWalletFormModal={onOpenWalletFormModal}
        />
      ),
      [TAB_KEY.HOLD_POSITION]: <HoldPosition onWalletClick={onOpenWalletFormModal} />,
      [TAB_KEY.HISTORICAL_COMMISSION]: <HistoricalCommission />
    };
    return TAB_CONTENT_MAP[curTab];
  };
  //TO-DO 添加钱包类型筛选数据(如跟单数据)
  useEffect(() => {
    Swap.Trade.setUsdtTypeByNotId(isSwapU);
    Swap.Order.fetchPosition(isSwapU);
    Swap.Assets.fetchBalance(isSwapU);
    return Swap.fetchInitData();
  }, [isSwapU, walletId]);

  Swap.useListener();
  const transferUsdt = transferModal.isUsdtType === undefined ? isSwapU : transferModal.isUsdtType;
  return (
    <div className="swap-assets-container">
      <div className="swap-header-card">
        <HeaderAssetCard>
          <WalletBalanceCard
            type={isSwapU ? WalletType.ASSET_SWAP_U : WalletType.ASSET_SWAP}
            wallet={walletId}
            onWalletCreateClick={onOpenWalletFormModal}
          />
          <DaysProfitAndLossSmallCard
            type={isSwapU ? WalletType.ASSET_SWAP_U : WalletType.ASSET_SWAP}
            wallet={walletId}
            dayType={INTERVAL_DAY.TODAY}
          />
          {/* <AssetContent
            margin={Number(calcTotal.totalMargin2)}
            unrealisedPNL={Number(calcTotal.unrealisedPNL)}
            bonusAmount={Number(calcTotal.bonusAmount)}
            deductionAmount={Number(calcTotal.voucherAmount)}
          /> */}
          <AssetContent
            margin={Number(accountAssets?.totalMargin2) || 0}
            unrealisedPNL={Number(accountAssets?.unrealisedPNL) || 0}
            bonusAmount={Number(accountAssets?.bonusAmount) || 0}
            deductionAmount={Number(accountAssets?.voucherAmount) || 0}
          />
        </HeaderAssetCard>
        <Desktop>
          <ProfitAnalysisCard type={isSwapU ? WalletType.ASSET_SWAP_U : WalletType.ASSET_SWAP} wallet={walletId} />
        </Desktop>
      </div>
      <Mobile>
        <ProfitAnalysisCard type={isSwapU ? WalletType.ASSET_SWAP_U : WalletType.ASSET_SWAP} wallet={walletId} />
      </Mobile>
      <div className="swap-table-card rounded-1 border-1">
        <div className="swap-tab-wrapper">
          <TabBar
            type={isMobile ? TAB_TYPE.CARD : TAB_TYPE.LINE}
            size={isMobile ? Size.LG : Size.LG}
            options={[
              { label: LANG('全部资产'), value: TAB_KEY.ALL_ASSETS },
              { label: LANG('持有仓位'), value: TAB_KEY.HOLD_POSITION },
              { label: LANG('历史委托'), value: TAB_KEY.HISTORICAL_COMMISSION }
            ]}
            value={curTab}
            onChange={onChange}
          >
            {/* <TrLink
            className='assets-link'
            href={`/account/fund-management/order-history/${isSwapU ? 'swap-u-order' : 'swap-order'}`}
            query={{ tab: 3 }}
          >
            {LANG('资金流水')}
          </TrLink> */}
          </TabBar>
          <Mobile>
            <TrLink href="/account/fund-management/assets-overview?type=fund-history" native className="link">
              {LANG('资金流水')}
            </TrLink>
          </Mobile>
        </div>
        <OpenContractView>{renderTabContent()}</OpenContractView>
      </div>
      <TransferModal
        defaultSourceAccount={ACCOUNT_TYPE.SPOT}
        defaultTargetAccount={transferUsdt ? ACCOUNT_TYPE.SWAP_U : ACCOUNT_TYPE.SWAP}
        open={transferModal.visible}
        defaultCoin={(transferUsdt ? DEFAULT_QUOTE_ID.SWAP_U : DEFAULT_QUOTE_ID.SWAP) as DefaultCoin}
        defaultTargetWallet={transferModal.wallet || Object.values(wallets)?.[0]?.wallet}
        onCancel={() => setTransferModal({ visible: false })}
        onTransferDone={({ accounts }) => {
          accounts.forEach(v => {
            if (v === ACCOUNT_TYPE.SWAP) {
              Swap.Assets.fetchBalance(false);
            } else if (v === ACCOUNT_TYPE.SWAP_U) {
              Swap.Assets.fetchBalance(true);
            }
          });
          Swap.Trade.clearInputVolume();
        }}
        inMobile={isMobile}
      />
      <WalletFormModal
        {...walletFormModal}
        onClose={() => setWalletFormModal({ visible: false, isUsdtType: null })}
        isUsdtType={walletFormModal.isUsdtType === null ? isSwapU : walletFormModal.isUsdtType}
        onWalletItemClick={({ walletData, isUsdtType }) => {
          setWalletFormModal({ data: walletData, isUsdtType: isUsdtType, update: new Date().toISOString() });
        }}
        onTransferNow={({ wallet, isUsdtType }) => setTransferModal({ wallet, isUsdtType, visible: true })}
      />
      <style jsx>{styles}</style>
    </div>
  );
}
const styles = css`
  .swap-assets-container {
    height: 100%;
    .swap-header-card {
      display: flex;
      align-items: center;
      height: 362px;
      @media ${MediaInfo.mobile} {
        height: 100%;
      }
    }
    .swap-table-card {
      background-color: var(--fill_bg_1);
      border-top-left-radius: 15px;
      border-top-right-radius: 15px;
      min-height: calc(100vh - 362px);
      margin-top: 8px;
      padding-top: 10px;
      .swap-tab-wrapper {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 24px;
        :global(.tab-bar) {
          padding: 0;
        }
        :global(.link) {
          min-width: 56px;
          font-size: 14px;
          font-weight: 400;
          color: var(--text_brand);
          text-decoration-line: underline;
          text-decoration-style: solid;
        }
        @media ${MediaInfo.mobile} {
          padding: 0 10px;
          :global(.tab-bar) {
            padding: 0;
          }
          :global(.link) {
            width: 100px;
            font-size: 16px;
            text-align: right;
            white-space: no-wrap;
            color: var(--yellow);
          }
        }
      }
      @media ${MediaInfo.mobile} {
        margin-top: 10px;
      }
      :global(.history-list) {
        :global(.filter-bar) {
          :global(.time-dropwown .dropdown-content) {
            background-color: var(--theme-background-color-14);
          }
          :global(.perpetual-button) {
            background-color: var(--theme-background-color-14);
          }
          :global(.date-range-picker) {
            background-color: var(--theme-background-color-14);
          }
        }
        :global(.record-list .ant-table-body) {
          max-height: calc(100vh - 580px) !important;
          height: 100%;
        }
      }
      :global(.ant-table-thead tr th) {
        background-color: var(--fill_1) !important;
      }
      :global(.ant-table-tbody .ant-table-row) {
        :global(td.ant-table-cell-row-hover) {
          background: var(--fill_2) !important;
        }
      }
    }
    :global(.assets-link) {
      font-size: 14px;
      font-weight: 400;
      color: var(--text_brand);
      line-height: 18px;
      border-bottom: 1px solid var(--text_brand);
    }
  }
`;
export default AssetSwapPage;
