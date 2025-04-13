import { FC, memo } from 'react';
import { Button } from 'antd';
import classnames from 'clsx';

import message from '@/components/Ymessage';

import CheckBox from '@/components/CheckBox';


import YIcon from '@/components/YIcons';

import YModal from '@/components/YModal';

import styles from './index.module.scss';
import { LANG } from '@/core/i18n';
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

const IndicatorModal: FC<IndicatorModalProps> = ({
  mainIndicators, subIndicators, onClose, onReset,
  onMainIndicatorChange, onSubIndicatorChange
}) => {
  return (
    <YModal
      open={true}
      width={372}
      header={
        <>
          <h3 className='kineindicatorName'>
            {
                LANG('kline_config_index')
            }
          </h3>
          <YIcon.CloseOutlined className="close-btn" onClick={onClose} />
        </>
      }
      contentStyle={{ height: 248, padding: '0 24px', boxSizing: 'border-box', overflow: 'hidden' }}
      content={
        <div className={classnames(styles.indicatorContent, 'bv-scroll')}>
          <span className={styles.indicatorContentTitleName}>
          {
                LANG('kline_config_Mainindicators')
            }

          </span>
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
                    }} />
                </li>
              ))
            }
          </ol>
          <span className={styles.indicatorContentTitleName}>
            
            {
                LANG('kline_config_SubIndicators')
            }
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
                        message.warning( LANG('kline_config_SubIndicatorsMax'));
                        return;
                      }
                      onSubIndicatorChange(name, checked ? IndicatorOperateType.Create : IndicatorOperateType.Remove);
                    }} />
                </li>
              ))
            }
          </ol>
        </div>
      }
      footer={
        <>
          <Button className={styles.indicatorCancel} onClick={onReset}>
            
            {
               LANG('重置')
            }
          </Button>
          <Button
            className={styles.indicatorPrimary}
            onClick={onClose}>
            
            {
               LANG('确认')
            }
          </Button>
        </>
      }
    />
  );
};

export default memo((IndicatorModal));
