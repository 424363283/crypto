import { BasicInputProps, INPUT_TYPE } from '@/components/basic-input';
import SelectCountry from '@/components/select-country';
import { SelectItem } from '@/components/select-country/types';
import { LANG } from '@/core/i18n/src/page-lang';
import { useEffect, useState } from 'react';
import css from 'styled-jsx/css';
import { BasicInput } from '../../basic-input';
import { store } from '../store';
import { Intent, Size } from '@/components/constants';
import { useResponsive } from '@/core/hooks';

type BasicInputPropsOptional = Partial<Pick<BasicInputProps, 'type' | 'label'>> &
  Omit<BasicInputProps, 'type' | 'label'>;

export const InputPhone = (props: BasicInputPropsOptional) => {
  const { isMobile } = useResponsive();
  const [val, setVal] = useState('');
  const { label, type, placeholder, showLabel, ...rest } = props;
  const onChange = (value: string) => {
    setVal(value);
  };
  const onCountrySelect = (item: SelectItem) => {
    store.countryCode = item.countryCode;
    store.countryId = item.id;
  };
  useEffect(() => {
    store.phone = val;
  }, [val]);
  return (
    <div className='input-phone-container'>
      {showLabel ? <p className='label'>{LANG('手机号码')}</p> : null}
      <div className='input-row'>
        <div className='select-country-container'>
          <SelectCountry small className='select-country' onChange={onCountrySelect} />
        </div>
        <BasicInput
          label={''}
          type={type || INPUT_TYPE.PHONE}
          value={val}
          size={isMobile ? Size.LG : Size.XL}
          intent={Intent.PRIMARY}
          clearable={true}
          className='phone-input'
          placeholder={placeholder || LANG('请输入手机号码')}
          onInputChange={onChange}
          {...rest}
        />
      </div>
      <style jsx>{styles}</style>
    </div>
  );
};
const styles = css`
  .input-phone-container {
    .label {
      font-size: 14px;
      font-weight: 400;
      line-height: 16px;
      color: var(--text_3);
      margin-bottom: 12px;
    }
    .input-row {
      display: flex;

      :global(.select-country-container) {
        margin-right: 10px;
      }
      
      :global(.phone-input) {
        margin-bottom: 24px;
        :global(.error-input-tips) {
          position: absolute;
          font-size: 12px;
        }
      }
    }
  }
`;
