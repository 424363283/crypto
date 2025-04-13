// import { PieChart } from '@/components/chart/pie-chart';
import { BasicModal } from '@/components/modal';
import { RateText } from '@/components/rate-text';
import { LANG } from '@/core/i18n';
import { Account } from '@/core/shared';
import { memo } from 'react';
import { useCalcSwapAssets, useSwapBalance } from '../../../fund-management/assets-overview/hooks/use-swap-balance';
import dynamic from 'next/dynamic';
const PieChart = dynamic(() => import('@/components/chart/pie-chart'), { ssr: false });
import { Desktop, Mobile } from '@/components/responsive';
import { MobileBottomSheet } from '@/components/mobile-modal';

type ModalProps = {
  open: boolean;
  onCancel: () => void;
};

type AssetDetailType = {
  title: string,
  color: string,
  percentage: number,
  amount: number | string,
}


function AssetsDistributedModal(props: ModalProps) {
  const { open, onCancel } = props;
  const { swapBalance: swapCBalance, swapUBalance } = useSwapBalance();
  const swapUTotalMargin = useCalcSwapAssets({ isSwapU: true }).total.totalMargin2;
  const swapCTotalMargin = useCalcSwapAssets({ isSwapU: false }).total.totalMargin2;
  const swapUTotalBalance = swapUTotalMargin || swapUBalance;
  const swapCTotalBalance = swapCTotalMargin || swapCBalance;
  const { spotTotalBalance } = Account.assets.spotAssetsStore;
  const totalAssetsBalance = +spotTotalBalance.add(swapCTotalBalance).add(swapUTotalBalance);

  const renderAssetsList = () => {
    const ASSETS_LIST:[AssetDetailType] = [
      {
        title: LANG('现货账户'),
        amount: +spotTotalBalance,
        percentage: +spotTotalBalance.div(totalAssetsBalance).mul(100).toFixed(2),
        color: 'var(--brand)',
      },
      {
        title: LANG('U本位账户'),
        amount: swapUTotalBalance,
        percentage: swapUTotalBalance.div(totalAssetsBalance).mul(100).toFixed(2),
        color: 'var(--yellow)',
      },
    ];
    return ASSETS_LIST.map((item:AssetDetailType) => {
      return (
        <li className='list-item' key={item.title}>
          <div className='left-title'>
            <span className='dot' style={{ backgroundColor: item.color }}></span>
            <span className='title'>{item.title}</span>
          </div>
          <div className='right-amount'>
            <span className='percentage'>{item.percentage}%</span>
            <span className='amount'>
              ≈<RateText money={item.amount} useFormat prefix />
            </span>
          </div>
        </li>
      );
    });
  };

  const chartMain = () => {
    return  <div className='assets-distributed'>
    <PieChart
      contractuBalance={+swapUTotalBalance}
      contractBalance={+swapCTotalBalance}
      spotBalance={+spotTotalBalance}
    />
    <ul className='assets-lis'>{renderAssetsList()}</ul>
  </div>
  }

  return (
    <>
      <Desktop>
        <BasicModal
          width={480}
          title={LANG('资产分布')}
          className='assets-distributed-modal'
          open={open}
          onCancel={onCancel}
          hasFooter={false}
          okButtonProps={{ hidden: true }}
          cancelButtonProps={{ hidden: true }}
        >
          { chartMain() }
        </BasicModal>
      </Desktop>
      <Mobile>
        <MobileBottomSheet
            title={LANG('资产分布')}
            visible={open}
            close={onCancel}
            content={chartMain()}
            hasBtn={false}
        />
      </Mobile>
    </>
  );
}
export default memo(AssetsDistributedModal);
