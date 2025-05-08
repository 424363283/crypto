import CommonIcon from '@/components/common-icon';
import Image from '@/components/image';
import { LANG } from '@/core/i18n';
import { Spot, SpotOrderType } from '@/core/shared';
import { getActive } from '@/core/utils';
import { Dropdown } from 'antd';
import clsx from 'clsx';
import { useMemo } from 'react';
import css from 'styled-jsx/css';
import Tooltip from '@/components/trade-ui/common/tooltip';

const { Trade } = Spot;

const TradeSelect = ({
  tab,
  onTabChanged,
  downMenuValue,
}: {
  tab: SpotOrderType | undefined;
  onTabChanged: (type: SpotOrderType) => void;
  downMenuValue: SpotOrderType;
}) => {
  const { currentSpotContract } = Trade.state;
  const index = Number(tab);
  const isLimit = index == SpotOrderType.LIMIT;
  const isPlan = index == SpotOrderType.LIMIT_PLAN || index == SpotOrderType.MARKET_PLAN || index == SpotOrderType.OCO;

  const TradeBtnMemo = useMemo(() => {
    if (!currentSpotContract?.id) return null;
    const { market, limitPlan, marketPlan, oco } = currentSpotContract;
    const renderMarketButton = market ? (
      <button className={getActive(index === SpotOrderType.MARKET)} onClick={() => onTabChanged(SpotOrderType.MARKET)}>
        {LANG('市价')}
      </button>
    ) : null;
    const renderPlanButton = (type: SpotOrderType, label: string) => (
      <button className={getActive(index === type)} onClick={() => onTabChanged(type)}>
        {label}
      </button>
    );

    if (!limitPlan && !marketPlan) {
      return renderMarketButton;
    }
    if ([limitPlan, marketPlan, oco].filter((i) => i).length > 1) {
      let items: any = [];
      if (limitPlan) {
        items.push({
          key: SpotOrderType.LIMIT_PLAN,
          label: renderPlanButton(SpotOrderType.LIMIT_PLAN, LANG('限价止盈止损')),
        });
      }
      if (marketPlan) {
        items.push({
          key: SpotOrderType.MARKET_PLAN,
          label: renderPlanButton(SpotOrderType.MARKET_PLAN, LANG('市价止盈止损')),
        });
      }
      if (oco) {
        items.push({
          key: SpotOrderType.OCO,
          label: renderPlanButton(SpotOrderType.OCO, 'OCO'),
        });
      }
      return (
        <>
          {renderMarketButton}
          <Dropdown
            menu={{
              items,
            }}
            trigger={['click']}
            placement='bottom'
            autoAdjustOverflow={false}
            overlayClassName='trade-btn-wrapper'
          >
            <div className={`type-select ${getActive(isPlan)}`}>
              <span>{[, , LANG('限价止盈止损'), LANG('市价止盈止损'), 'OCO'][downMenuValue]}</span>
              <CommonIcon name='common-tiny-triangle-down' size={14} />
            </div>
          </Dropdown>
        </>
      );
    }

    return (
      <>
        {renderMarketButton}
        {limitPlan && renderPlanButton(SpotOrderType.LIMIT_PLAN, LANG('限价止盈止损'))}
        {marketPlan && renderPlanButton(SpotOrderType.MARKET_PLAN, LANG('市价止盈止损'))}
        {marketPlan && renderPlanButton(SpotOrderType.MARKET_PLAN, 'OCO')}
      </>
    );
  }, [currentSpotContract, index]);

  const ToolTipMemo = useMemo(() => {
    return (
      <Tooltip
        placement='topRight'
        title={
          isLimit
            ? LANG('限价委托是指以特定或更优价格进行买卖，限价单不能保证执行。')
            : LANG('市价委托是指按照目前市场价格进行快速买卖。')
        }
      >
        <div className={clsx('info')}>
          <CommonIcon name='common-info-0' size={16} />
        </div>
      </Tooltip>
    );
  }, [isLimit]);

  return (
    <>
      <div className='order-type-btns'>
        <div>
          <button
            className={getActive(index === SpotOrderType.LIMIT)}
            onClick={() => onTabChanged(SpotOrderType.LIMIT)}
          >
            {LANG('限价')}
          </button>
          {TradeBtnMemo}
        </div>
        {ToolTipMemo}
      </div>
      <style jsx>{styles}</style>
    </>
  );
};

export default TradeSelect;
const styles = css`
  .order-type-btns {
    display: flex;
    width: 100%;
    height: 40px;
    padding: 16px 0;
    justify-content: space-between;
    align-items: center;
    flex-shrink: 0;
    > div {
      display: flex;
      align-items: center;
      gap: 24px;
      :global(button) {
        border: none;
        background: transparent;
        padding: 0;
        color: var(--text_2);
        font-size: 14px;
        font-style: normal;
        font-weight: 500;
        line-height: normal;
        cursor: pointer;
      }
      :global(button.active) {
        color: var(--text_brand);
      }
    }
    :global(.type-select) {
      font-size: 16px;
      color: var(--theme-font-color-placeholder);
      cursor: pointer;
      &.active {
        color: var(--skin-primary-color);
      }
    }
    :global(.type-select.active) {
      color: var(--skin-primary-color);
    }
  }
  :global(.trade-btn-wrapper) {
    :global(li) {
      padding: 0 !important;
    }
    :global(button) {
      border: none;
      background: transparent;
      padding: 0;
      color: currentColor;
      cursor: pointer;
      padding: 5px 12px;
      width: 100%;
      text-align: left;
    }
  }
  :global(.ant-tooltip-inner),
  :global(.ant-tooltip-arrow:before) {
    background: var(--fill_pop) !important;
    color: var(--text_1) !important;
  }
`;
