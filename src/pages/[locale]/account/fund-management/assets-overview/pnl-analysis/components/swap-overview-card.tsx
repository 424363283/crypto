import { LANG } from '@/core/i18n';
import { RootColor } from '@/core/styles/src/theme/global/root';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import css from 'styled-jsx/css';
import { SwapReportPnls } from '../../components/hooks/use-swap-pnl-data';

const BarChart = dynamic(() => import('./bar-chart'));
const LineChart = dynamic(() => import('./line-chart'));

interface SwapOverviewCardProps {
  reportPnls: SwapReportPnls[];
  symbolUnit: 'USD' | 'USDT';
}
export default function SwapOverviewCard(props: SwapOverviewCardProps) {
  const { symbolUnit, reportPnls } = props;
  const colorHex = RootColor.getColorHex;
  const CardTitle = ({ title, unit }: { title: string; unit?: 'USD' | 'USDT' }) => {
    return (
      <div className='title'>
        <Image src='/static/images/account/fund/chart-label.png' width={20} height={20} alt='icon' />
        {title + (unit ? `(${unit})` : '')}
        <style jsx>{styles}</style>
      </div>
    );
  };
  return (
    <div className='overview-card'>
      <CardTitle title={LANG('单日盈亏')} unit={symbolUnit} />
      <BarChart reportPnls={reportPnls} symbolUnit={symbolUnit} />
      <CardTitle title={LANG('累计盈亏')} unit={symbolUnit} />
      <LineChart
        reportPnls={reportPnls}
        chartId='totalPnl'
        lineColor={colorHex['active-color-hex']}
        symbolUnit={symbolUnit}
      />
      <CardTitle title={LANG('累计盈亏率')} />
      <LineChart reportPnls={reportPnls} chartId='totalPnlRate' lineColor='#F04e3f' symbolUnit={symbolUnit} />
      <style jsx>{styles}</style>
    </div>
  );
}
const styles = css`
  .overview-card {
    width: 100%;
    .title {
      color: var(--theme-font-color-3);
      font-size: 14px;
      display: flex;
      align-items: center;
      &:not(:first-child) {
        margin-top: 36px;
      }
    }
  }
`;
