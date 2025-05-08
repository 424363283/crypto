import { Switch } from 'antd';
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useResponsive } from '@/core/hooks';
import CopyBtn from './copyBtn';
import styles from '../index.module.scss';
import BringContractModal from './bringContractModal';
import FreeMarginModal from './freeMarginModal';
import NickNameModal from './nickNameModal';
import IntrodutionModal from './introdutionModal';
import PersonalizedTagsModal from './personalizedTagsModal';
import { hidePartialOfPhoneOrEmail } from '@/core/utils/src/unknown';
import { LANG } from '@/core/i18n';
import { message } from '@/core/utils/src/message';
import { Loading } from '@/components/loading';
import { Copy } from '@/core/shared';
import { BRING_SETING_DATA } from '@/core/shared/src/copy/types';
import CommonIcon from '@/components/common-icon';
import { Button } from '@/components/button';
export default function BringSetting() {
  const { isMobile } = useResponsive();
  const [settingShow, setSettingShow] = useState({
    contractShow: false,
    freeMainginShow: false,
    introdutionShow: false,
    personalizedTagsShow: false,
    nickNameShow: false
  });
  const [settingInfo, setSettingInfo] = useState({} as BRING_SETING_DATA);
  const [nickNameInfo, nickNameInfoInfo] = useState({} as BRING_SETING_DATA);
  const [contentInfo, setContentInfo] = useState({} as BRING_SETING_DATA);

  const fetchSettingInfo = async () => {
    const res = await Copy.fetchShareTradeConfig({});
    console.log(res, 'resfetchShareTradeConfig');
    if (res?.code === 200) {
      setSettingInfo(prevUser => ({
        ...prevUser, // 保留之前的所有属性
        ...res.data, // 添加/覆盖新的属性
        nickname: res?.data?.nickname
          ? res?.data?.nickname
          : hidePartialOfPhoneOrEmail(userInfo?.user?.email || userInfo?.user?.phone)
      }));
    }
  };

  const fetchNikeName = async () => {
    const nikeName = await Copy.getAllNickNameAudits({});
    if (nikeName?.code === 200) {
      nickNameInfoInfo(prevUser => ({
        ...prevUser, // 保留之前的所有属性
        ...nikeName.data, // 添加/覆盖新的属性
      }));
    }
  };
  const fetchContent = async () => {
    const content = await Copy.fetchAllTraderContentAudits({});
    if (content?.code === 200) {
      setContentInfo(prevUser => ({
        ...prevUser, // 保留之前的所有属性
        contentStatus: content?.data?.status,
        ...content.data
      }));
    }
  };
  useEffect(() => {
    fetchSettingInfo();
    fetchNikeName();
    fetchContent();
  }, []);
  const toggleShareStatus = async () => {
    Loading.start();
    const user: any = await Copy.getUserInfo();
    const res = await Copy.fetchUpdateShareConfig({
      uid: user?.uid,
      shareStatus: settingInfo.shareStatus ? 0 : 1
    });
    Loading.end();
    if (res?.code === 200) {
      message.success(LANG('操作成功'));
      fetchSettingInfo();
      fetchNikeName();
    } else {
      message.error(res.message);
    }
  };
  const showContract = useMemo(() => {
    const symbol = settingInfo?.contractInfo && JSON.parse(settingInfo?.contractInfo);
    return (
      symbol &&
      Object.values(symbol)
        .map((key: any, idx) => key.toUpperCase().replace('-', ''))
        .join(',')
    );
  }, [settingInfo]);

  const handleCloseModal = (isUpdate: boolean, closeKey: string) => {
    setSettingShow({
      ...settingShow,
      [closeKey]: false
    });
    if (isUpdate && closeKey === 'nickNameShow') {
      fetchNikeName();
    } else if (isUpdate && closeKey === 'introdutionShow') {
      fetchContent();
    } else if (isUpdate) {
      fetchSettingInfo();
    }
  };
  const showNickname = useMemo(() => {
    const nikeName = nickNameInfo?.status === 0 ? nickNameInfo.nickname : nickNameInfo.currentNickname
    return nikeName || settingInfo.nickname
  },[nickNameInfo?.status,settingInfo.nickname,nickNameInfo.nickname])

  const showContent = useMemo(() => {
    const content = contentInfo?.status === 0 ? contentInfo?.content : contentInfo?.currentContent
    return content || settingInfo?.description
  },[contentInfo?.status,settingInfo?.description,contentInfo.content])
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
          <div>{LANG('个人昵称')}</div>
          <div className={styles.wOverflow}>{showNickname}</div>
        </div>
        <div className={styles.textRight}>
          {nickNameInfo.status === 0 && (
            <Button type={'yellow'} rounded width={104}>
              {LANG('审核中')}
            </Button>
          )}
          {nickNameInfo.status !== 0 && (
            <div
              className={`${styles.flexCenter} ${styles.gap16}`}
              onClick={() => setSettingShow({ ...settingShow, nickNameShow: true })}
            >
              {nickNameInfo.status === 2 && (
                <span className={`${styles.flexCenter} ${styles.gap8} ${styles.nickNameTips}`}>
                  <CommonIcon size={12} className="icon" name="common-question-outline-red-0" />
                  <span> {LANG('您提交的信息审核未通过，请重新修改！')}</span>
                </span>
              )}
              <div style={{width:104}}>
              <Button
                type={'primary'}
                rounded
                width={104}
                onClick={() => setSettingShow({ ...settingShow, nickNameShow: true })}
              >
                {LANG('修改')}
              </Button>
              </div>
              
            </div>
          )}
        </div>
      </div>
      <div className={`${styles.tradeRow} ${styles.mt24}`}>
        <div className={styles.tradeRow2}>
          <div>{LANG('带单合约')}</div>
          <div className={styles.wOverflow}>{showContract}</div>
        </div>
        <div className={styles.textRight}>
          <CopyBtn btnTxt={LANG('修改')}   width={104} onClick={() => setSettingShow({ ...settingShow, contractShow: true })} />
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
          <CopyBtn btnTxt={LANG('修改')}   width={104} onClick={() => setSettingShow({ ...settingShow, freeMainginShow: true })} />
        </div>
      </div>
      <div className={styles.tradeRow}>
        <div className={styles.tradeRow2}>
          <div>{LANG('个人简介')}</div>
          <div className={styles.wOverflow}>{showContent}</div>
        </div>
        <div className={styles.textRight}>
          {contentInfo.status === 0 && (
            <Button type={'yellow'} rounded width={104}>
              {LANG('审核中')}
            </Button>
          )}
          {contentInfo.status !== 0 && (
            <div
              className={`${styles.flexCenter} ${styles.gap16}`}
              onClick={() => setSettingShow({ ...settingShow, introdutionShow: true })}
            >
              {contentInfo.status === 2 && (
                <span className={`${styles.flexCenter} ${styles.gap8} ${styles.nickNameTips}`}>
                  <CommonIcon size={12} className="icon" name="common-question-outline-red-0" />
                  <span> {LANG('您提交的信息审核未通过，请重新修改！')}</span>
                </span>
              )}
             <div style={{width:104}}> <Button
                type={'primary'}
                rounded
                width={104}
                onClick={() => setSettingShow({ ...settingShow, introdutionShow: true })}
              >
                {LANG('修改')}
              </Button></div>
            </div>
          )}
        </div>
      </div>
      <BringContractModal
        title={LANG('带单合约')}
        type="bring"
        contractList={settingInfo.contractList}
        isOpen={settingShow.contractShow}
        contractSetting={settingInfo.contractInfo}
        close={(type: boolean) => handleCloseModal(type, 'contractShow')}
      />
      <FreeMarginModal
        isOpen={settingShow.freeMainginShow}
        copyMinAvailableMargin={settingInfo?.copyMinAvailableMargin}
        close={(type: boolean) => handleCloseModal(type, 'freeMainginShow')}
      />
      <NickNameModal
        isOpen={settingShow.nickNameShow}
        nickname={showNickname}
        close={(type: boolean) => handleCloseModal(type, 'nickNameShow')}
      />
      <IntrodutionModal
        isOpen={settingShow.introdutionShow}
        introduction={''}
        close={(type: boolean) => handleCloseModal(type, 'introdutionShow')}
      />
      <PersonalizedTagsModal
        isOpen={settingShow.personalizedTagsShow}
        close={(type: boolean) => handleCloseModal(type, 'introdutionShow')}
      />
    </div>
  );
}
