import { BasicInput, INPUT_TYPE } from '@/components/basic-input';
import { Button } from '@/components/button';
import CommonIcon from '@/components/common-icon';
import Image from '@/components/image';
import { LANG } from '@/core/i18n';
import { clsx } from '@/core/utils';
import { useEffect, useState } from 'react';
import css from 'styled-jsx/css';
import { useApiContext } from '../context';
import { IDENTITY_TYPE } from '../types';
import { HorizontalStepBar } from './horizontal-stepbar';
import { UpButton } from './upload-button';

type State = {
  identityType: number;
  identityNumber: string;
  identityName: string;
  img_0: string;
  img_1: string;
  img_2: string;
};
// 图片的上传顺序
export const UploadIDInfo = () => {
  const [shouldDisableStep2Btn, setDisableStep2Btn] = useState(false);
  const { apiState, setApiState } = useApiContext();
  const { identityNumber, identityName, identityType, img_0, img_1, img_2 } = apiState;
  // 证件类型
  const changeIdentityType = (num: number) => {
    setApiState((draft: State) => {
      draft.identityType = num;
      draft.identityNumber = '';
      draft.identityName = '';
      draft.img_0 = '';
      draft.img_1 = '';
      draft.img_2 = '';
    });
  };
  // 验证
  const _verifyInfo = () => {
    const images = identityType === IDENTITY_TYPE.PASSPORT ? [img_0, img_1] : [img_0, img_1, img_2];
    const imgArr = images.filter(Boolean);
    const verifyImg = identityType === IDENTITY_TYPE.PASSPORT ? imgArr.length === 1 : imgArr.length === 2;
    if (/^[A-Za-z0-9]{5,}$/.test(identityNumber) && identityName && verifyImg) {
      setDisableStep2Btn(false);
    } else {
      setDisableStep2Btn(true);
    }
  };
  useEffect(() => {
    _verifyInfo();
  }, [img_0, img_1, img_2, identityNumber, identityName, identityType]);
  // 选择图片
  const _upImg = (file: string, id: number) => {
    setApiState((draft: any) => {
      draft[`img_${id}`] = file;
    });
  };

  // 改变名字
  const _changeName = (value: string): void => {
    setApiState((draft) => {
      draft.identityName = value;
    });
  };

  // 改变证件号码
  const _changeIdNumber = (value: string) => {
    if (/^[A-Za-z0-9]+$/.test(value) || value === '') {
      setApiState((draft) => {
        draft.identityNumber = value?.toUpperCase();
      });
    }
  };
  const goPrevStep = () => {
    setApiState((draft) => {
      draft.pageStep = 'select-country';
    });
  };
  const goNextStep = () => {
    setApiState((draft) => {
      draft.pageStep = 'upload-selfie';
    });
  };
  const renderUploadImgPlaceholder = () => {
    if (identityType === IDENTITY_TYPE.PASSPORT) {
      return (
        <UpButton
          key='passport'
          src='/static/images/account/dashboard/passport.svg'
          onChange={(file) => {
            _upImg(file, 0);
          }}
        />
      );
    }
    return (
      <>
        <UpButton
          key='id-card'
          src='/static/images/account/dashboard/id-card.svg'
          className='id-card-placeholder'
          onChange={(file) => {
            _upImg(file, 0);
          }}
        />
        <UpButton
          key='id-card-reverse'
          src='/static/images/account/dashboard/id-reverse.svg'
          onChange={(file) => {
            _upImg(file, 1);
          }}
        />
      </>
    );
  };
  return (
    <div className='upload-id-info'>
      <HorizontalStepBar step={2} />
      <p className='id-label'>{LANG('ID Type')}</p>
      <div className='id-type'>
        <section
          className={clsx('passport-card', 'common-card', identityType === IDENTITY_TYPE.PASSPORT && 'active-card')}
          onClick={() => changeIdentityType(IDENTITY_TYPE.PASSPORT)}
        >
          <div className='icon-wrapper'>
            <Image
              src={
                identityType === IDENTITY_TYPE.PASSPORT
                  ? '/static/images/account/dashboard/passport-active.svg'
                  : '/static/images/account/dashboard/passport-icon.svg'
              }
              width={24}
              height={24}
              enableSkin={identityType === IDENTITY_TYPE.PASSPORT}
            />
          </div>
          <span className='name'>{LANG('护照')}</span>
          <CommonIcon
            name={
              identityType === IDENTITY_TYPE.PASSPORT ? 'common-checkbox-circle-active-0' : 'common-unchecked-box-0'
            }
            size={12}
            enableSkin
            className='check-icon'
          />
        </section>
        <section
          className={clsx('id-card', 'common-card', identityType === IDENTITY_TYPE.ID_CERTIFICATE && 'active-card')}
          onClick={() => changeIdentityType(IDENTITY_TYPE.ID_CERTIFICATE)}
        >
          <div className='icon-wrapper'>
            <Image
              src={
                identityType === IDENTITY_TYPE.ID_CERTIFICATE
                  ? '/static/images/account/dashboard/certificate-active-icon.svg'
                  : '/static/images/account/dashboard/certificate-icon.svg'
              }
              width={24}
              height={24}
              enableSkin={identityType === IDENTITY_TYPE.ID_CERTIFICATE}
            />
          </div>
          <span className='name'>{LANG('身份证')}</span>
          <CommonIcon
            name={
              identityType === IDENTITY_TYPE.ID_CERTIFICATE
                ? 'common-checkbox-circle-active-0'
                : 'common-unchecked-box-0'
            }
            width={12}
            className='check-icon'
            height={12}
            enableSkin
          />
        </section>
      </div>
      <BasicInput
        type={INPUT_TYPE.NORMAL_TEXT}
        label={LANG('Full Name')}
        value={identityName}
        onInputChange={_changeName}
        placeholder={LANG('Enter the same full name as on you...')}
      />
      <BasicInput
        type={INPUT_TYPE.NORMAL_TEXT}
        label={LANG('ID Number')}
        onInputChange={_changeIdNumber}
        value={identityNumber}
        placeholder={LANG('Enter ID Number')}
        className='id-number-input'
      />
      <p className='upload-label'>{LANG('Please take photo and upload')}</p>
      <div className='upload-img'>{renderUploadImgPlaceholder()}</div>
      <p className='warn-tips'>
        <CommonIcon name='common-warning-0' width={14} height={14} enableSkin />
        {LANG('为了方便您快速通过审核，请确保您填写的信息与您证件上的信息一致')}
      </p>

      <div className='footer-button'>
        <Button type='light-sub-2' onClick={goPrevStep} className='cancel-button'>
          {LANG('返回上一步')}
        </Button>
        <Button type='primary' onClick={goNextStep} className='ok-button' disabled={shouldDisableStep2Btn}>
          {LANG('下一步')}
        </Button>
      </div>
      <style jsx>{styles}</style>
    </div>
  );
};

const styles = css`
  .upload-id-info {
    .id-label {
      color: var(--const-color-grey);
      font-weight: 500;
      font-size: 14px;
      margin-top: 30px;
      margin-bottom: 12px;
    }
    .id-type {
      display: flex;
      margin-bottom: 16px;
      .common-card {
        position: relative;
        flex: 1;
        border: 1px solid #f2f2f0;
        padding: 12px;
        border-radius: 6px;
        display: flex;
        cursor: pointer;
        align-items: center;
        .icon-wrapper {
          display: flex;
          align-items: center;
          padding: 4px;
          border-radius: 5px;
          margin-right: 8px;
        }
        .name {
          color: var(--theme-font-color-1);
        }
        :global(.check-icon) {
          position: absolute;
          right: 10px;
          top: 19px;
        }
      }
      .active-card {
        border: 1px solid var(--skin-primary-color);
      }
      .passport-card {
        margin-right: 10px;
      }
    }
    :global(.basic-input-container .label) {
      color: var(--theme-font-color-3);
      font-size: 14px;
      font-weight: 500;
    }
    :global(.id-number-input) {
      margin-top: 16px;
    }
    .upload-label {
      color: var(--theme-font-color-3);
      margin-top: 33px;
      font-size: 14px;
      font-weight: 500;
    }
    .upload-img {
      display: flex;
      margin-top: 12px;
      :global(.id-card-placeholder) {
        margin-right: 12px;
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
      }
    }
  }
`;
