import { FC, memo } from 'react';
import { Button } from 'antd';
import classnames from 'clsx';

import message from '@/components/Ymessage';
import CheckBox from '@/components/YCheckBox';


import BVIcon from '@/components/YIcons';

import BvModal from '@/components/YModal';

import styles from './index.module.scss';

export enum IndicatorOperateType {
  Create = 'create',
  Remove = 'remove'
}

interface IndicatorModalProps {
  mainIndicators: string[];
  subIndicators: string[];
  onMainIndicatorChange: (name: string, type: IndicatorOperateType) => void;
  onSubIndicatorChange: (name: string, type: IndicatorOperateType) => void;
  onReset: () => void;
  onClose: () => void;
}

const IndicatorModal: FC<any> = ({
  mainIndicators, subIndicators, onClose, onReset, 
  onMainIndicatorChange, onSubIndicatorChange
}) => {

  return (
    <BvModal
      open={true}
      width={480}
      header={
        <>
          <h3>指标</h3>
          <BVIcon.CloseOutlined className="close-btn" onClick={onClose} />
        </>
      }
      contentStyle={{ height: 248, padding: '0 24px', boxSizing: 'border-box', overflow: 'hidden' }}
      content={
        <div className={classnames(styles.indicatorContent, 'bv-scroll')}>
          <span>主指标</span>
          <ol
            className={styles.indicatorChild}>
              {
                ['MA', 'EMA', 'BOLL', 'SAR'].map(name => (
                  <li
                    key={name}
                    className={styles.item}>
                    {/* @ts-ignore */}
                    <CheckBox
                      label={name}
                      checked={mainIndicators.includes(name)}
                      onChange={(checked) => {
                        onMainIndicatorChange(name, checked ? IndicatorOperateType.Create : IndicatorOperateType.Remove);
                      }}/>
                  </li>
                ))
              }
            </ol>
            <span style={{ display: 'block', marginTop: 16 }}>
            副指标
            </span>
            <ol
              style={{ paddingBottom: 16 }}
              className={styles.indicatorChild}>
              {
                [
                  'VOL', 'MACD', 'KDJ', 'RSI',
                  'BIAS', 'BRAR', 'CCI', 'DMI',
                  'CR', 'PSY', 'DMA', 'TRIX',
                  'OBV', 'VR', 'WR', 'MTM',
                  'EMV', 'AO', 'ROC'
                ].map(name => (
                  <li
                    key={name}
                    className={styles.item}>
                    {/* @ts-ignore */}
                    <CheckBox
                      label={name}
                      checked={subIndicators.includes(name)}
                      onChange={(checked) => {
                        if (checked && subIndicators.length > 2) {
                          message.warning('副指标最多设置3个');
                          return;
                        }
                        onSubIndicatorChange(name, checked ? IndicatorOperateType.Create : IndicatorOperateType.Remove);
                      }}/>
                  </li>
                ))
              }
          </ol>
        </div>
      }
      footer={
        <>
          <Button className="cancel" onClick={onReset}>
          重置
          </Button>
          <Button
            className="primary"
            onClick={onClose}>
           确认
          </Button>
        </>
      }
    />
  );
};

export default memo(IndicatorModal);
