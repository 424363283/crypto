import CommonIcon from '@/components/common-icon';
import { LANG } from '@/core/i18n';
import { Drawer } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import css from 'styled-jsx/css';
import Rates from './rates';
import RateHistory from './rate-history';
import ProtectionFund from './protection-fund';
import Exponent from './exponent';

interface Props {
  onClose: () => void;
  open: boolean;
  tabIndex: number;
  isUsdtType: boolean;
}

const SwapInfoDrawer = ({ onClose, open, tabIndex, isUsdtType }: Props) => {
  // 一级标题
  const [activeIndex, setActiveIndex] = useState(tabIndex);
  const [tabs] = useState<string[]>([LANG('实时资金费率'), LANG('资金费率历史'), LANG('风险保障基金'), LANG('指数')]);

  useEffect(() => {
    setActiveIndex(tabIndex);
  }, [tabIndex]);
  const infoContent = useMemo(
    () =>
      [
        <Rates key={0} isUSDT={isUsdtType} />,
        <RateHistory key={1} isUSDT={isUsdtType} />,
        <ProtectionFund key={2} isUSDT={isUsdtType} />,
        <Exponent key={3} isUSDT={isUsdtType} />
      ][activeIndex],
    [activeIndex, isUsdtType]
  );

  return (
    <Drawer
      placement="right"
      onClose={onClose}
      open={open}
      title={
        <div className="guide-title">
          <span>{LANG('合约信息')}</span>
          <div onClick={() => onClose()}>
            <CommonIcon name="common-modal-close" size={16} enableSkin />
          </div>
        </div>
      }
      closable={false}
      keyboard
      style={{ position: 'relative' }}
      rootClassName="guide-drawer-container"
    >
      <div className="content">
        <div className="tabs">
          {tabs.map((key, index) => (
            <div key={index} className={activeIndex === index ? 'active' : ''} onClick={() => setActiveIndex(index)}>
              {key}
            </div>
          ))}
        </div>
        <div className="line" />
        {infoContent}
      </div>
      <style jsx>{styles}</style>
    </Drawer>
  );
};

export default SwapInfoDrawer;

const styles = css`
  :global(.guide-drawer-container) {
    width: 100%;
    height: 100%;
    :global(.ant-drawer-content) {
    background: var(--bg-1);
    }
    :global(.ant-drawer-header) {
      border: 0;
      padding: 0 1.5rem;
      padding-top: 1.5rem;
    }
    :global(.ant-drawer-body) {
      padding: 1.5rem;
    }
    .guide-title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-weight: 500;
      line-height: normal;
    }
    .content {
      display: flex;
      flex-direction: column;
    }
    .tabs {
      display: flex;
      justify-content: space-between;
      align-items: center;
      fonts-size: 14px;
      font-weight: 500;
      color: var(--text-secondary);
      .active {
        color: var(--brand);
      }
    }
    .line {
      margin: 8px 0;
      width: 100%;
      height: 1px;
      background: var(--line-2);
    }
  }
`;
