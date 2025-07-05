import { Button } from '@/components/button';
import CommonIcon from '@/components/common-icon';
import { Loading } from '@/components/loading';
import { useKycState } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { Account } from '@/core/shared';
import { MediaInfo, message } from '@/core/utils';
import { useEffect, useState } from 'react';
import css from 'styled-jsx/css';
import { useApiContext } from '../context';
import { IDENTITY_TYPE } from '../types';
import { HorizontalStepBar } from './horizontal-stepbar';
import { UpButton } from './upload-button';
import { useLoginUser } from '@/core/store';


export const UploadSelfie = ({ onVerifiedDone }: { onVerifiedDone?: () => void }) => {
  const { updateKYCAsync } = useKycState();
  const { apiState, setApiState } = useApiContext();
  const { fetchUserInfo } = useLoginUser();

  const { identityNumber, identityName, identityType, img_0, img_1, img_2, countryId } = apiState;
  const [shouldDisableStep3Btn, setDisableStep3Btn] = useState(false);
  const _upImg = (file: string) => {
    if (identityType === IDENTITY_TYPE.PASSPORT) {
      setApiState(draft => {
        draft.img_1 = file;
      });
    } else {
      setApiState(draft => {
        draft.img_2 = file;
      });
    }
  };
  useEffect(() => {
    if (
      (identityType == IDENTITY_TYPE.PASSPORT && img_1 != '') ||
      (identityType != IDENTITY_TYPE.PASSPORT && img_2 != '')
    ) {
      return setDisableStep3Btn(false);
    }
    if (!img_1 || !img_2) {
      return setDisableStep3Btn(true);
    }
  }, [img_1, img_2, identityType]);
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
        countryId // 国家id
      });
      if (res.code === 200) {
        setApiState(draft => {
          draft.showUploadPage = false;
          draft.pageStep = 'init';
        });
        await fetchUserInfo();
        await updateKYCAsync(true);
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
  const goPrevStep = () => {
    setApiState(draft => {
      draft.pageStep = 'upload-identify';
    });
  };
  return (
    <div className="upload-selfie-container">
      <p className="warn-tips">
        <CommonIcon name="common-warning-0" width={14} height={14} enableSkin />
        {LANG('为了方便您快速通过审核，请确保您填写的信息与您证件上的信息一致')}
      </p>
      <HorizontalStepBar step={3} />
      <div className="selfie-wrapper">
        <p className="upload-label">
          {identityType === IDENTITY_TYPE.PASSPORT
            ? LANG('请上传手持护照照片以及手写今天日期和 YMEX 的纸质照片')
            : LANG('请上传手持身份证照片以及手写今天日期和 YMEX 的纸质照片')}
        </p>
        <UpButton
          src={
            identityType === IDENTITY_TYPE.PASSPORT && img_1
              ? URL.createObjectURL(new Blob([img_1], { type: 'text/plain' }))
              : identityType !== IDENTITY_TYPE.PASSPORT && img_2
              ? URL.createObjectURL(new Blob([img_2], { type: 'text/plain' }))
              : '/static/images/account/dashboard/selfie-placeholder.svg'
          }
          width={432}
          height={275}
          className="selfie-up-button"
          onChange={file => _upImg(file)}
        />
      </div>

      <div className="footer-button">
        <Button type="light-sub-2" onClick={goPrevStep} className="cancel-button">
          {LANG('上一步')}
        </Button>
        <Button type="primary" onClick={onSubmitUserInfo} className="ok-button" disabled={shouldDisableStep3Btn}>
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
      margin-top: 24px;
      .upload-label {
        margin-bottom: 8px;

        color: var(--text_3);
         font-family: "Lexend";
        font-size: 12px;
        font-style: normal;
        font-weight: 400;
        line-height: normal;
      }
      :global(.selfie-up-button) {
        :global(img) {
          width: 100%;
          height: 274px;
          @media ${MediaInfo.mobile} {
            height: auto;
          }
        }
      }
    }
    .warn-tips {
      border-radius: 8px;
      background: var(--yellow_10);
      border-radius: 5px;
      margin-top: 20px;
      padding: 6px 15px;

      text-align: left;
      display: flex;
      align-items: flex-start;

      color: var(--yellow, #f0ba30);
       font-family: "Lexend";
      font-size: 14px;
      font-style: normal;
      font-weight: 400;
      line-height: 22px; /* 157.143% */
      align-items: center;

      :global(img) {
        margin-right: 6px;
        margin-top: 4px;
      }
    }
    .footer-button {
      :global(.common-button) {
        border-radius: 40px;
      }
    }
  }
`;
