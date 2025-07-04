import { LANG } from '@/core/i18n';
import { Swap } from '@/core/shared';
import { clsxWithScope, MediaInfo, message } from '@/core/utils';
import css from 'styled-jsx/css';
import { CheckboxItem } from '../checkbox-item';

export const SpslCheckbox = () => {
  // const { quoteId } = Swap.Trade.base;
  const { volume: inputVolume, spslMode } = Swap.Trade.store;
  // const currentPosition = Swap.Trade.getInputVolume({ isBuy: true });

  return (
    <div className={clsx('spsl-checkbox')}>
      <CheckboxItem
        label={LANG('设置止盈/止损')}
        info={LANG('您可以在开仓前设置止盈止损，开仓后止盈止损才会生效。您也可以选择最新价或者标记价来触发止盈止损。')}
        value={spslMode.enable}
        onChange={value => {
          if (value) {
            Swap.Trade.onChangeSpslSetting({ enable: true });
          } else {
            Swap.Trade.resetSpslSetting();
          }
        }}
        radioAttrs={{ width: 16, height: 16 }}
        renderRight={
          spslMode.enable
            ? () => (
              <div
                className={clsx('spsl-advanced')}
                onClick={() => {
                  if (inputVolume === '0' || !inputVolume) {
                    return message.error(LANG('请输入数量'));
                  }
                  Swap.Trade.setModal({ spslVisible: true });
                }}
              >
                {LANG('高级')}
              </div>
            )
            : null
        }
      />
      {styles}
    </div>
  );
};

export const SpslContent = ({ children }: { children: any }) => {
  if (!Swap.Trade.isOpenPositionMode) return <></>;
  return children;
};

const { className, styles } = css.resolve`
  .spsl-checkbox {
    :global(.item) {
      margin-top: 0px;
    }
  }
  .spsl-advanced {
    color: var(--text_brand);
    font-size: 12px;
    font-weight: 400;
    cursor: pointer;
  }
    @media ${MediaInfo.mobile} {
    :global(.tooltip) {
      padding-left: 1.5rem;
    }
  }
`;
const clsx = clsxWithScope(className);
