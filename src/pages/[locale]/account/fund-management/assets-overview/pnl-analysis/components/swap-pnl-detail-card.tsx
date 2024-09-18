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
    const swapElements = swapProfits.map((item: any) => {
      return (
        <SinglePnlCard
          key={item.indexDay}
          indexDay={item.indexDay}
          totalPnl={item.totalPnl}
          totalPnlRate={item.totalPnlRate}
        />
      );
    });
    return swapElements;
  };
  return (
    <div className='pnl-detail-card'>
      <Desktop>
        <Image
          src='/static/images/account/fund/pnl-indicator.png'
          width={130}
          height={112}
          enableSkin
          className='pnl-card-img'
        />
      </Desktop>
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
    display: flex;
    align-items: center;
    background-color: var(--theme-background-color-8);
    padding: 14px 30px 14px 23px;
    @media ${MediaInfo.mobile} {
      padding: 17px 11px 17px 14px;
    }
    @media ${MediaInfo.tablet} {
      padding: 21px 19px 30px 19px;
    }
    border-radius: 8px;
    .pnl-right-card {
      width: 100%;
      @media ${MediaInfo.desktop} {
        margin-left: 47px;
      }
      .top-title-area,
      .bottom-value-area {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .top-title-area {
        .title {
          font-size: 16px;
          font-weight: 500;
          color: var(--theme-font-color-1);
          display: flex;
          align-items: center;
          @media ${MediaInfo.mobile} {
            font-size: 14px;
          }
          :global(.eye-icon) {
            padding-left: 6px;
            cursor: pointer;
          }
        }
      }
      .bottom-value-area {
        margin-top: 16px;
        @media ${MediaInfo.mobile} {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }
        :global(.swap-last-two-elements) {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          margin-top: 15px;
        }
        .card {
          .name {
            color: var(--theme-font-color-3);
            margin-bottom: 7px;
            font-size: 14px;
            @media ${MediaInfo.mobile} {
              margin-bottom: 5px;
            }
          }
          .price {
            color: var(--theme-font-color-1);
            font-size: 20px;
            font-weight: 500;
            @media ${MediaInfo.mobile} {
              font-size: 14px;
            }
            .rate {
              margin-left: 4px;
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
