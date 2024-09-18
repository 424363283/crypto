// import { PieChart } from '@/components/chart/pie-chart';
import { BasicModal } from '@/components/modal';
import { RateText } from '@/components/rate-text';
import { LANG } from '@/core/i18n';
import { Account } from '@/core/shared';
import { memo } from 'react';
import { useSwapBalance } from '../../../fund-management/assets-overview/hooks/use-swap-balance';
import dynamic from 'next/dynamic';
const PieChart = dynamic(() => import('@/components/chart/pie-chart'), { ssr: false });

type ModalProps = {
  open: boolean;
  onCancel: () => void;
};
function AssetsDistributedModal(props: ModalProps) {
  const { open, onCancel } = props;
  const { swapBalance, swapUBalance } = useSwapBalance();
  const { spotAssetsStore } = Account.assets;
  const { spotTotalBalance } = spotAssetsStore;
  const totalAssetsBalance = spotTotalBalance.add(swapBalance).add(swapUBalance);

  const renderAssetsList = () => {
    const ASSETS_LIST = [
      {
        title: LANG('现货账户'),
        amount: spotTotalBalance,
        percentage: spotTotalBalance.div(totalAssetsBalance).mul(100).toFixed(2),
        color: '#FFD30F',
      },
      {
        title: LANG('合约账户(U本位)'),
        amount: swapUBalance,
        percentage: swapUBalance.div(totalAssetsBalance).mul(100).toFixed(2),
        color: '#43BC9C',
      },
      {
        title: LANG('合约账户(币本位)'),
        amount: swapBalance,
        percentage: swapBalance.div(totalAssetsBalance).mul(100).toFixed(2),
        color: '#4A96EE',
      },
    ];
    return ASSETS_LIST.map((item) => {
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
  return (
    <BasicModal
      width={460}
      title={LANG('资产分布')}
      className='assets-distributed-modal'
      open={open}
      onCancel={onCancel}
      okButtonProps={{ hidden: true }}
      cancelButtonProps={{ hidden: true }}
    >
      <div className='assets-distributed'>
        <PieChart contractuBalance={swapUBalance} contractBalance={+swapBalance} spotBalance={+spotTotalBalance} />
        <ul className='assets-lis'>{renderAssetsList()}</ul>
      </div>
    </BasicModal>
  );
}
export default memo(AssetsDistributedModal);
