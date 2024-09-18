import { Button } from '@/components/button';
import CommonIcon from '@/components/common-icon';
import { Loading } from '@/components/loading';
import { useKycState } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { Account } from '@/core/shared';
import { message } from '@/core/utils';
import { useEffect, useState } from 'react';
import css from 'styled-jsx/css';
import { useApiContext } from '../context';
import { IDENTITY_TYPE } from '../types';
import { HorizontalStepBar } from './horizontal-stepbar';
import { UpButton } from './upload-button';

export const UploadSelfie = ({ onVerifiedDone }: { onVerifiedDone?: () => void }) => {
  const { updateKYCAsync } = useKycState();
  const { apiState, setApiState } = useApiContext();
  const { identityNumber, identityName, identityType, img_0, img_1, img_2, countryId } = apiState;
  const [shouldDisableStep3Btn, setDisableStep3Btn] = useState(false);
  const _upImg = (file: string) => {
    if (identityType === IDENTITY_TYPE.PASSPORT) {
      setApiState((draft) => {
        draft.img_1 = file;
      });
    } else {
      setApiState((draft) => {
        draft.img_2 = file;
      });
    }
  };
  useEffect(() => {
    if (img_1 || img_2) {
      setDisableStep3Btn(false);
      return;
    }
    if (!img_1 || !img_2) {
      setDisableStep3Btn(true);
    }
  }, [img_1, img_2]);
  // 上传图片
  const onSubmitUserInfo = async () => {
    Loading.start();
    const images = identityType === IDENTITY_TYPE.PASSPORT ? [img_0, img_1] : [img_0, img_1, img_2];
    try {
      const res = await Account.kycUpload({
        images, // 图片数组
        identityType: identityType, // 证件类型：1-身份证 2-护照
        identityNumber, // 身份号
        identityName, // 名字
        countryId, // 国家id
      });
      if (res.code === 200) {
        setApiState((draft) => {
          draft.showUploadPage = false;
          draft.pageStep = 'init';
        });
        updateKYCAsync();
        onVerifiedDone?.();
        message.success(LANG('提交成功,请耐心等待审核'));
      } else {
        message.error(res.message);
      }
      Loading.end();
    } catch (error) {
      Loading.end();
    }
  };
  return (
    <div className='upload-selfie-container'>
      <HorizontalStepBar step={3} />
      <div className='selfie-wrapper'>
        <p className='upload-label'>{LANG('请上传手持身份证照片以及手写今天日期和 YMEX 的纸质照片')}</p>
        <UpButton
          src='/static/images/account/dashboard/selfie-placeholder.svg'
          width={440}
          height={265}
          className='selfie-up-button'
          onChange={(file) => _upImg(file)}
        />
      </div>
      <p className='warn-tips'>
        <CommonIcon name='common-warning-0' width={14} height={14} enableSkin />
        {LANG('为了方便您快速通过审核，请确保您填写的信息与您证件上的信息一致')}
      </p>
      <div className='footer-button'>
        <Button type='primary' onClick={onSubmitUserInfo} className='ok-button' disabled={shouldDisableStep3Btn}>
          {LANG('提交')}
        </Button>
      </div>
      <style jsx>{styles}</style>
    </div>
  );
};
const styles = css`
  .upload-selfie-container {
    .selfie-wrapper {
      margin-top: 52px;
      .upload-label {
        font-size: 14px;
        font-weight: 500;
        color: var(--theme-font-color-3);
        margin-bottom: 12px;
      }
      :global(.selfie-up-button) {
        :global(img) {
          width: 100%;
          height: 265px;
        }
      }
    }
    .warn-tips {
      background-color: var(--theme-background-color-8);
      border-radius: 5px;
      margin-top: 21px;
      padding: 8px 15px;
      color: var(--theme-font-color-1);
      text-align: left;
      display: flex;
      align-items: flex-start;
      :global(img) {
        margin-right: 6px;
        margin-top: 4px;
      }
    }
  }
`;
