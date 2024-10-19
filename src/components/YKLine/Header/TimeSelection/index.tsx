import { useState, FC, useContext, useCallback } from 'react';
import { Popover, message } from 'antd';
import BVIcon from '@/components/YIcons';
import classnames from 'clsx';

import { ResolutionInfo, ALL_RESOLUTION_INFO } from '../../types';

import ExchangeChartContext from '../../context';

import styles from './index.module.scss';

interface TimeSelectionProps {
  resolutionList: ResolutionInfo[];
  setResolutionList: (resolutionList: ResolutionInfo[]) => void;
}

const TimeSelection: FC<TimeSelectionProps> = (props) => {

  const { setResolutionList, resolutionList } = props;

  const { setKLineResolution } = useContext(ExchangeChartContext);

  const [editBtn, setEditBtn] = useState(false);
  const [timeModel, setTimeModel] = useState(false);
  const [tempResolutionList, setTempResolutionList] = useState<ResolutionInfo[]>([...resolutionList]);

  const changeTime = (resolution: ResolutionInfo) => {
    if (editBtn) {
      const findResolution = tempResolutionList.find(item => item.slug === resolution.slug);
      let newTempResolutionList: ResolutionInfo[] = [];
      if (!findResolution) {
        newTempResolutionList = [...tempResolutionList, resolution];
        newTempResolutionList.sort((r1, r2) => r1.index - r2.index);
        setTempResolutionList(newTempResolutionList);
      } else {
        newTempResolutionList = tempResolutionList.filter(item => item.slug !== resolution.slug);
        if (newTempResolutionList.length < 1) {
          message.warning('最少选择一个');
        } else {
          setTempResolutionList(newTempResolutionList);
        }
      }
    } else {
      setKLineResolution(resolution.resolution);
    }
  };

  const match = useCallback((resolution: ResolutionInfo) => {
    const result = tempResolutionList.find(item => item.slug === resolution.slug);
    return !!result;
  }, [tempResolutionList]);

  const saveBtn = () => {
    setTimeModel(false);
    setEditBtn(false);
    setResolutionList(tempResolutionList);
  };

  const modelClose = () => {
    setTempResolutionList([...resolutionList]);
    setEditBtn(false);
  };

  const content = (
    <div className={styles.timeSelectMask}>
      <div className={styles.TimeSelectionContent}>
        <div className={styles.headerChange}>
          <div className={styles.leftTitle}>
          <span>选择周期</span>
          </div>
          <div className={styles.rightTitle}>
            {
              editBtn && (
                <span
                  className={styles.reset}
                  onClick={() => {
                    const resolutions = ALL_RESOLUTION_INFO.filter(item => item.isDefault) ?? [];
                    setResolutionList(resolutions);
                  }}>
                   重置
                </span>
              )
            }
            {
              editBtn ? (
              <span onClick={() => { saveBtn(); }}>
               保存
              </span>
            ) : (
              <span
                onClick={() => { setEditBtn(true); }}>
                编辑
              </span>
            )}
          </div>
        </div>
        <div className={styles.timeListContent}>
          {
            ALL_RESOLUTION_INFO.map(item => (
              <div
                key={item.slug}
                className={classnames(styles.timeBtn, match(item) && styles.activeBtn, styles.selectTimeBtn)}
                onClick={() => { changeTime(item); }}>
                {item.slug}
                {editBtn && <img className={styles.selectIcon} src="/images/KlineChart/timeUnselected.svg" />}
                {editBtn && match(item) && (<img className={styles.selectIcon} src="/images/KlineChart/timeSelected.svg" />)}
              </div>
            ))
          }
        </div>
      </div>
    </div>
  );

  return (
    <Popover
      placement="bottom"
      arrow={false}
      content={content}
      overlayClassName={styles.timeBtnContent}
      onOpenChange={e => {
        setTimeModel(e);
        modelClose();
      }}
      open={timeModel}
      mouseEnterDelay={0}>
      <div
        className={classnames(styles.KlineSelectIcon, timeModel && styles.arrowUp)}>
        <BVIcon.KlineSelectIcon />
      </div>
    </Popover>
  );
};

export default TimeSelection;
