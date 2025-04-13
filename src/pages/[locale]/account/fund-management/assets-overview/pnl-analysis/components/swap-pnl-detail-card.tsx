import { AssetValueToggleIcon } from '@/components/common-icon';
import Image from '@/components/image';
import { Desktop, DesktopOrTablet, Mobile } from '@/components/responsive';
import { LANG } from '@/core/i18n';
import { MediaInfo, clsx } from '@/core/utils';
import css from 'styled-jsx/css';
import { HidePrice } from './hide-price';
import { ShareBtn } from './share-btn';

export const SwapPnlDetailCard = (props: any) => {
  const { eyeOpen, setEyeOpen, symbolUnit, swapProfits } = props;
  const TITLE_MAP: { [key: string]: string } = {
    1: LANG('当日盈亏'),
    7: LANG('7日盈亏'),
    30: LANG('30日盈亏'),
  };
  const SinglePnlCard = ({
    indexDay,
    totalPnl,
    totalPnlRate,
  }: {
    indexDay: number;
    totalPnl: number;
    totalPnlRate: number;
  }) => {
    return (
      <div className={clsx('card')} key={indexDay}>
        <p className='name'>{TITLE_MAP[indexDay]}</p>
        <p className='price'>
          <HidePrice eyeOpen={eyeOpen}>
            <span>{totalPnl?.toFixed(2) + ' ' + symbolUnit || '0.00'}</span>
          </HidePrice>
          <span className={clsx('rate', +totalPnl < 0 ? 'negative' : 'positive')}>
            <HidePrice eyeOpen={eyeOpen}>{totalPnlRate?.mul(100).toFixed(2) || '0.00'} %</HidePrice>
          </span>
        </p>
        <style jsx>{styles}</style>
      </div>
    );
  };
  const renderMobileBottomValue = () => {
    const swapFirstElements = swapProfits.map((item: any) => {
      if (item.indexDay === 1) {
        return (
          <SinglePnlCard
            key={item.indexDay}
            indexDay={item.indexDay}
            totalPnl={item.totalPnl}
            totalPnlRate={item.totalPnlRate}
          />
        );
      }
    });
    const SwapLastTwoElements = swapProfits.map((item: any) => {
      if (item.indexDay !== 1) {
        return (
          <SinglePnlCard
            key={item.indexDay}
            indexDay={item.indexDay}
            totalPnl={item.totalPnl}
            totalPnlRate={item.totalPnlRate}
          />
        );
      }
    });
    return (
      <>
        {swapFirstElements}
        <div className='swap-last-two-elements'>{SwapLastTwoElements}</div>
      </>
    );
  };
  const renderBottomValue = () => {
    const swapElements = swapProfits.map((item: any, index: number) => {
      return (
        <>
          <SinglePnlCard
            key={item.indexDay}
            indexDay={item.indexDay}
            totalPnl={item.totalPnl}
            totalPnlRate={item.totalPnlRate}
          />
          {index < (swapProfits.length - 1) && <div className='line vertical'></div>}
        </>
      );
    });
    return swapElements;
  };
  return (
    <div className='pnl-detail-card'>
      <div className='pnl-right-card'>
        <div className='top-title-area'>
          <p className='title'>
            {LANG('盈亏详情')}
            <AssetValueToggleIcon size={18} className='eye-icon' show={eyeOpen} onClick={() => setEyeOpen(!eyeOpen)} />
          </p>
          <DesktopOrTablet>
            <ShareBtn symbolUnit={symbolUnit} profitsData={swapProfits} />
          </DesktopOrTablet>
        </div>
        <div className='bottom-value-area'>
          <DesktopOrTablet>{renderBottomValue()}</DesktopOrTablet>
          <Mobile>{renderMobileBottomValue()}</Mobile>
        </div>
      </div>
      <style jsx>{styles}</style>
    </div>
  );
};
const styles = css`
  .pnl-detail-card {
    @media ${MediaInfo.mobile}{
      width: 100%;
      background: var(--fill-1);
      border-radius: 8px;
    }
    .pnl-right-card {
      display: flex;
      width: 1200px;
      padding: 24px;
      flex-direction: column;
      justify-content: flex-end;
      align-items: flex-start;
      border-radius: 8px;
      border: 1px solid var(--line-1);
      gap: 24px;
      @media ${MediaInfo.mobile}{
        padding: 12px;
        border: none;
        width: calc(100% - 28px);
      }
      .top-title-area {
        display: flex;
        justify-content: space-between;
        align-items: center;
        align-self: stretch;
        .title {
          display: flex;
          align-items: center;
          gap: 8px;
          color: var(--text-primary);
          font-family: "HarmonyOS Sans SC";
          font-size: 16px;
          font-style: normal;
          font-weight: 500;
          line-height: 16px; /* 100% */
          :global(.eye-icon) {
            padding-left: 6px;
            cursor: pointer;
          }
        }
      }
      .bottom-value-area {
        display: flex;
        justify-content: space-between;
        align-items: center;
        align-self: stretch;
        :global(.line.vertical) {
          width: 1px;
          height: 48px;
          background: var(--line-1);
        }
        :global(.swap-last-two-elements) {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 15px;
          flex:1;
          @media ${MediaInfo.mobile}{
            margin:0;
            width: 66%;
          }
        }
        .card {
          display: flex;
          width: 134px;
          flex-direction: column;
          align-items: flex-start;
          gap: 12px;
          @media ${MediaInfo.mobile}{
            flex:1;
            width: 33%;
          }
          :last-child {
            align-items: flex-end;
            .price {
              align-items: flex-end;
            }
          }
          .name {
            color: var(--theme-font-color-3);
            margin-bottom: 7px;
            font-size: 14px;
            @media ${MediaInfo.mobile} {
              margin-bottom: 5px;
            }
          }
          .price {
            display: flex;
            width: 134px;
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
            color: var(--theme-font-color-1);
            font-size: 20px;
            font-weight: 500;
            @media ${MediaInfo.mobile} {
              font-size: 14px;
            }
            .rate {
              font-size: 14px;
              @media ${MediaInfo.mobile} {
                font-size: 12px;
              }
            }
            .rate.negative {
              color: var(--color-red);
            }
            .rate.positive {
              color: var(--color-green);
            }
          }
          &:last-child {
            text-align: right;
          }
        }
      }
    }
  }
`;
