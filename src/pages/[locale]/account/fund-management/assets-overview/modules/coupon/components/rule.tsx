import { BasicModal } from '@/components/modal';
import { LANG } from '@/core/i18n';
import React from 'react';
import css from 'styled-jsx/css';

export default function RuleModal({
  setRuleModalVisible,
  ruleModalVisible,
}: {
  setRuleModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  ruleModalVisible: boolean;
}): JSX.Element {
  const onCancel = () => {
    setRuleModalVisible(false);
  };

  const rules = [
    LANG('体验金仅可用于永续合约交易，盈利部分可提现，体验金本身不可提现。'),
    LANG('体验金不能用于币币兑换，抵扣提现手续费。'),
    LANG('体验金消耗完之前，任何资产转出合约账户的操作，都将导致您的体验金清零。'),
    LANG('体验金有使用时间，到达过期时间未使用完的体验金将被回收，期间带来的爆仓风险请留意。'),
    LANG(
      '抵扣金可用于抵扣简单合约和永续合约交易手续费，在抵扣相应费用时，优先于自有本金被抵扣，到达过期时间未使用完的抵扣金会被收回。'
    ),
  ];

  return (
    <BasicModal
      open={ruleModalVisible}
      onCancel={onCancel}
      title={LANG('规则说明')}
      onOk={onCancel}
      cancelButtonProps={{ hidden: true }}
    >
      <div className='rule-content'>
        {rules.map((v, i) => (
          <div key={i} className='text'>
            {i + 1}. {v}
          </div>
        ))}
      </div>
      <style jsx>{styles}</style>
    </BasicModal>
  );
}
const styles = css`
  .rule-content {
    margin: 20px 0 0;
    overflow: auto;
    .text {
      text-align: left;
      font-size: 14px;
      color: var(--theme-font-color-1);
      margin-bottom: 10px;
    }
  }
  .confirm {
    margin-top: 15px;
    cursor: pointer;
    width: 100%;
    height: 40px;
    background: linear-gradient(-90deg, #ffd41f, 'var(--skin-primary-color)');
    border-radius: 4px;
    text-align: center;
    line-height: 40px;
    font-weight: bold;
    font-size: 14px;
    color: var(--theme-text-color-1);
  }
`;
