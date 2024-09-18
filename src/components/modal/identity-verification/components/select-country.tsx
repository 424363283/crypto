import { BasicInput, INPUT_TYPE } from '@/components/basic-input';
import { Loading } from '@/components/loading';
import SelectCountry from '@/components/select-country';
import { SelectItem } from '@/components/select-country/types';
import { getKycSupportCountryApi, postAccountOnfidoCreationApi } from '@/core/api';
import { LANG } from '@/core/i18n';
import { useEffect, useState } from 'react';
import css from 'styled-jsx/css';
import { useImmer } from 'use-immer';
import { useApiContext } from '../context';
import { GoVerifyBtn } from './go-verify-btn';
import { HorizontalStepBar } from './horizontal-stepbar';
import { message } from '@/core/utils/src/message';

export const SelectCountryContent = () => {
  const [showInput, setShowInput] = useState(false);
  const { apiState, setApiState } = useApiContext();
  const { countryId } = apiState;
  const [disabledBtn, setDisabledBtn] = useState(false);
  const [state, setState] = useImmer({
    firstName: '',
    lastName: '',
  });
  const { firstName, lastName } = state;
  const getSupportCountry = async (countryCode: string) => {
    setApiState((draft) => {
      draft.countryId = countryCode;
    });
    const res = await getKycSupportCountryApi(countryCode);
    if (res.data.type !== 'native') {
      setShowInput(true);
    } else {
      setShowInput(false);
      setDisabledBtn(false);
    }
  };
  const handleNextOnfidoVerify = async () => {
    Loading.start();
    const result = await postAccountOnfidoCreationApi({
      countryId: countryId,
      device: 'web',
      firstName: firstName,
      lastName: lastName,
    });
    Loading.end();
    if (result.code === 200) {
      const { sdk_token,workflow_id, id } = result.data;
      if (sdk_token) {
        setApiState((draft) => {
          draft.sdk_token = sdk_token;
          draft.workflow_run_id = id;
        });
      }
      
    }else{
      message.error(result.message);
    }
  };
  const onCountrySelect = (item: SelectItem) => {
    setDisabledBtn(true);
    getSupportCountry(item.id);
  };
  // 改变名字
  const _changeFirstName = (value: string): void => {
    setState((draft) => {
      draft.firstName = value;
    });
  };
  const _changeLastName = (value: string): void => {
    setState((draft) => {
      draft.lastName = value;
    });
  };
  useEffect(() => {
    if (firstName.length && lastName.length) {
      setDisabledBtn(false);
    }
  }, [firstName, lastName]);
  const renderNameInput = () => {
    return (
      <>
        <BasicInput
          type={INPUT_TYPE.NORMAL_TEXT}
          label={LANG('First Name')}
          value={firstName}
          onInputChange={_changeFirstName}
          placeholder={LANG('请输入您的名')}
        />
        <BasicInput
          type={INPUT_TYPE.NORMAL_TEXT}
          label={LANG('Last Name')}
          value={lastName}
          onInputChange={_changeLastName}
          placeholder={LANG('请输入您的姓')}
        />
      </>
    );
  };
  return (
    <div className='select-country-container'>
      <div className='top-step-bar'>
        <HorizontalStepBar step={1} />
      </div>
      <div className='bottom-select-country'>
        <p className='label'>{LANG('请选择国家')}</p>
        <SelectCountry hideCode onChange={onCountrySelect} />
      </div>
      {showInput && renderNameInput()}
      <GoVerifyBtn
        onBtnClick={() => {
          showInput && handleNextOnfidoVerify();
          setApiState((draft) => {
            draft.pageStep = showInput ? 'onfido-verify' : 'upload-identify';
          });
        }}
        disabled={disabledBtn}
      />
      <style jsx>{styles}</style>
    </div>
  );
};
const styles = css`
  .select-country-container {
    .top-step-bar {
      width: 100%;
      margin-bottom: 30px;
    }
    :global(.basic-input-container .label) {
      color: var(--theme-font-color-3) !important;
      font-size: 14px !important;
      font-weight: 500 !important;
      margin-top: 12px;
    }
    .bottom-select-country {
      .label {
        color: var(--theme-font-color-3);
        font-size: 14px;
        font-weight: 400;
        margin-bottom: 10px;
      }

      :global(.emulate-select-selected) {
        background-color: var(--theme-background-color-8);
        border-radius: 6px;
      }
    }
  }
`;
