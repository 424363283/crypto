import Tooltip from '@/components/trade-ui/common/tooltip';

import { Svg } from '@/components/svg';
import { InfoHover } from '@/components/trade-ui/common/info-hover';
import { LANG } from '@/core/i18n';
import { Swap } from '@/core/shared';
import { clsxWithScope, MediaInfo } from '@/core/utils';
import css from 'styled-jsx/css';

export const EffectiveTime = () => {
  const value = Swap.Trade.store.effectiveTime;
  const { isMarket: isMarketType } = Swap.Trade.orderTradeType;
  let options = [
    ['GTC', 0],
    ['IOC', 8],
    ['FOK', 1]
  ];
  const label = options.find(v => v[1] === value)?.[0] || '';
  const content = (
    <Tooltip
      placement="top"
      title={
        <div className={clsx('tooltip')}>
          <div>{LANG('生效时间')}</div>
          <div>
            {'• '}
            {LANG('GTC (有效直到取消): 此种订单将持续有效，直到完全成交或被取消。')}
          </div>
          <div>
            {'• '}
            {LANG('IOC (立即成交或取消): 此种订单将会立即成交全部或部分订单，并且取消剩余未成交的部分。')}
          </div>
          <div>
            {'• '}
            {LANG('FOK (全部成交或取消): 此种订单必须立即全部成交，否则将被全部取消。')}
          </div>
        </div>
      }
    >
      <InfoHover className={clsx('label')} hoverColor={false}>
        {LANG('生效时间')}
      </InfoHover>
    </Tooltip>
  );

  if (isMarketType) {
    return <></>;
  }

  return (
    <>
      <div className={clsx('tools')}>
        {content}
        {/* <DropdownSelect
          data={options}
          onChange={(item) => (Swap.Trade.store.effectiveTime = item[1])}
          isActive={(v) => v[1] === value}
          formatOptionLabel={(v) => v[0]}
          overlayClassName={clsx('overlay')}
          align={{ offset: [10, 0] }}
        > */}
        <span className={clsx('value')} onClick={() => Swap.Trade.setModal({ effectiveTimeVisible: true })}>
          {label}
          <Svg src="/static/images/common/arrow_down.svg" width={12} height={12} className={clsx('arrow')} />
        </span>
        {/* </DropdownSelect> */}
      </div>
      {styles}
    </>
  );
};

const { className, styles } = css.resolve`
  .label {
    font-size: 12px;
    color: var(--text_2);
  }
  .value {
    position: relative;
    cursor: pointer;
    font-size: 12px;
    color: var(--text_1);

    display: flex;
    flex-direction: row;
    align-items: center;
    .arrow {
      margin: 0 3px;
    }
  }
  .overlay {
    width: 50px !important;
    min-width: 50px !important;
  }
  .line {
    height: 1px;
    background-color: var(--theme-trade-border-color-1);
    width: 100%;
  }
  .tools {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: 4px;
    @media ${MediaInfo.mobile} {
      :global(.info-hover) {
        border-bottom: 0;
      }
    }
  }
  .tooltip {
    padding: 5px 0;
    font-size: inherit;
    font-weight: inherit;
    color: inherit;
    > div {
      font-size: inherit;
      font-weight: inherit;
      color: inherit;
      margin-bottom: 8px;
      line-height: 15px;
      &:last-child {
        margin-bottom: 0;
      }
    }
  }
`;
const clsx = clsxWithScope(className);
