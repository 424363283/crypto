import { Switch } from 'antd';
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useResponsive } from '@/core/hooks';
import CopyBtn from './copyBtn';
import styles from '../index.module.scss';
import BringContractModal from './bringContractModal';
import FreeMarginModal from './freeMarginModal';
import IntrodutionModal from './introdutionModal';
import PersonalizedTagsModal from './personalizedTagsModal';
import { LANG } from '@/core/i18n';
import { message } from '@/core/utils/src/message';
import { Loading } from '@/components/loading';
import { Copy } from '@/core/shared';
import { BRING_SETING_DATA } from '@/core/shared/src/copy/types';
export default function BringSetting() {
  const { isMobile } = useResponsive();
  const [settingShow, setSettingShow] = useState({
    contractShow: false,
    freeMainginShow: false,
    introdutionShow: false,
    personalizedTagsShow: false
  });
  const [settingInfo, setSettingInfo] = useState({} as BRING_SETING_DATA);
  const [shareStatus, setShareStatus] = useState(true);

  const fetchSettingInfo = async () => {
    const res = await Copy.fetchShareTradeConfig({});
    console.log(res, 'resfetchShareTradeConfig');
    if (res.code == 200) {
      setSettingInfo({
        ...res.data
      });
      console.log(settingInfo, 'settingInfo=======');
    }
  };

  useEffect(() => {
    fetchSettingInfo();
  }, []);
  const toggleShareStatus = async () => {
    Loading.start();
    const user: any = Copy.getUserInfo();
    const res = await Copy.fetchUpdateShareConfig({
      uid: user?.user.uid,
      shareStatus: shareStatus ? 0 : 1
    });
    Loading.end();
    if (res.code === 200) {
    } else {
      message.error(res.message);
    }
  };
  const showContract = useMemo(() => {
    const symbol = settingInfo?.contractInfo && JSON.parse(settingInfo?.contractInfo);
    return symbol && Object.values(symbol).map((key: any,idx) => key.replace('-', '')).join(',');
  }, [settingInfo]);

  const handleCloseModal = (isUpdate:boolean,closeKey:string) => {
    setSettingShow({
      ...settingShow,
      [closeKey]: false
    })
    if (isUpdate) {
      fetchSettingInfo()
    }
  }
  return (
    <div className={styles.bringSettingBox}>
      <div className={styles.flexSpace}>
        <div>
          <p>{LANG('开启带单')}</p>
          <p className={`${styles.remark} ${styles.mt8}`}>
            {LANG('开启带单后，您将出现在跟单社区的排行榜中，并可被用户跟单，享受更多利润分成。')}
          </p>
        </div>
        <div>
          <Switch aria-label="" onChange={toggleShareStatus} checked={!!settingInfo.shareStatus} />
        </div>
      </div>
      <div className={`${styles.tradeRow} ${styles.mt24}`}>
        <div className={styles.tradeRow2}>
          <div>{LANG('带单合约')}</div>
          <div className={styles.wOverflow}>{showContract}</div>
        </div>
        <div className={styles.textRight}>
          <CopyBtn btnTxt={LANG('修改')} onClick={() => setSettingShow({ ...settingShow, contractShow: true })} />
        </div>
      </div>
      {/* <div className={styles.tradeRow}>
        <div className={styles.tradeRow2}>
          <div>{LANG('个性化标签')}</div>
          <div className={styles.wOverflow}>高频, 短线, 轻仓</div>
        </div>
        <div className={styles.textRight}>
          <CopyBtn
            btnTxt={LANG('修改')}
            onClick={() => setSettingShow({ ...settingShow, personalizedTagsShow: true })}
          />
        </div>
      </div> */}
      <div className={styles.tradeRow}>
        <div className={styles.tradeRow2}>
          <div>{LANG('个人简介')}</div>
          <div className={styles.wOverflow}>{settingInfo.description}</div>
        </div>
        <div className={styles.textRight}>
          <CopyBtn btnTxt={LANG('修改')} onClick={() => setSettingShow({ ...settingShow, introdutionShow: true })} />
        </div>
      </div>
      <div className={styles.tradeRow}>
        <div className={styles.tradeRow2}>
          <div>
            {LANG('跟随者最低可用保证金')}
            {!isMobile && (
              <p className={`${styles.remark} ${styles.mt8}`}>{LANG('跟随者设置跟随时所需的最低可用保证金。')}</p>
            )}
          </div>
          <div className={styles.wOverflow}>{settingInfo.copyMinAvailableMargin}</div>
          {isMobile && (
            <p className={`${styles.remark} ${isMobile ? styles.mt16 : styles.mt8}`}>
              {LANG('跟随者设置跟随时所需的最低可用保证金。')}
            </p>
          )}
        </div>
        <div className={styles.textRight}>
          <CopyBtn btnTxt={LANG('修改')} onClick={() => setSettingShow({ ...settingShow, freeMainginShow: true })} />
        </div>
      </div>
      <BringContractModal
        type='bring'
        isOpen={settingShow.contractShow}
        contractSetting={settingInfo.contractInfo}
        close={(type:boolean) =>
          handleCloseModal(type,'contractShow')
        }
      />
      <FreeMarginModal
        isOpen={settingShow.freeMainginShow}
        copyMinAvailableMargin={settingInfo?.copyMinAvailableMargin}
        close={(type:boolean) =>
          handleCloseModal(type,'freeMainginShow')
        }
      />
      <IntrodutionModal
        isOpen={settingShow.introdutionShow}
        introduction={settingInfo.nickname}
        close={(type:boolean) =>
          handleCloseModal(type,'introdutionShow')
        }
      />
      <PersonalizedTagsModal
        isOpen={settingShow.personalizedTagsShow}
        close={(type:boolean) =>
          handleCloseModal(type,'introdutionShow')
        }
      />
    </div>
  );
}
