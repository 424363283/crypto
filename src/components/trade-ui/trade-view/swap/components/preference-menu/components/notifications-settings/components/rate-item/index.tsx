import AppInput, { DecimalInput } from '@/components/numeric-input';
import { Svg } from '@/components/svg';
import { LANG } from '@/core/i18n';
import { useEffect, useState } from 'react';

export const RateItem = ({ value: _value, onDone }: { value: any; onDone: any }) => {
  const [visible, setVisible] = useState(false);
  const [value, onChange] = useState(_value);

  useEffect(() => {
    onChange(value);
  }, [_value]);

  return (
    <>
      <div className='rate-item'>
        {!visible ? (
          <div className='edit' onClick={() => setVisible(true)}>
            {LANG('编辑')}
          </div>
        ) : (
          <div className='content'>
            <div>
              {LANG('资金费率')}
              {'>='}
            </div>
            <div className='input'>
              <AppInput
                focusActive
                component={DecimalInput}
                onChange={onChange}
                digit={4}
                type='number'
                value={value}
                max={5}
                min={0.0001}
                className='my-input'
                suffix={<div className='suffix'>%</div>}
              />
              <div className='button'>
                <Svg
                  src='/static/images/swap/setting/done.svg'
                  width={16}
                  height={16}
                  onClick={async () => {
                    await onDone(value);
                    setVisible(false);
                  }}
                />
                <Svg
                  src='/static/images/swap/setting/close.svg'
                  width={16}
                  height={16}
                  onClick={() => setVisible(false)}
                />
              </div>
            </div>
          </div>
        )}
      </div>
      <style jsx>{`
        .rate-item {
          .edit {
            margin-top: 5px;
            font-size: 12px;
            color: var(--theme-font-color-small-yellow);
          }
          .content {
            color: var(--theme-trade-text-color-1);
            padding: 0 10px;
            height: 48px;
            border-radius: 5px;
            margin-top: 15px;
            background-color: var(--theme-trade-modal-input-bg);
            display: flex;
            align-items: center;
            justify-content: space-between;
            .input {
              display: flex;
              align-items: center;
              justify-content: flex-end;
              :global(.my-input) {
                width: 50%;
                height: 34px;
                border: 1px solid var(--theme-trade-text-color-2);
                flex: none;
                padding-right: 8px;
                margin-right: 10px;
              }
              :global(input) {
                color: var(--theme-trade-text-color-1);
                font-size: 12px;
              }
              .button {
                display: flex;
                align-items: center;
                :global(> *:first-child) {
                  margin-right: 10px;
                }
              }
            }
          }
        }
      `}</style>
    </>
  );
};
