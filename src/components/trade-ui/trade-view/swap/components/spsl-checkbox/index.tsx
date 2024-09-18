import { LANG } from '@/core/i18n';
import { Swap } from '@/core/shared';
import { clsxWithScope, message } from '@/core/utils';
import css from 'styled-jsx/css';
import { CheckboxItem } from '../checkbox-item';

export const SpslCheckbox = () => {
  const spslMode = Swap.Trade.store.spslMode;
  const currentPosition = Swap.Trade.getInputVolume({ isBuy: true });

  return (
    <>
      <CheckboxItem
        label={LANG('止盈/止损')}
        info={LANG('您可以在开仓前设置止盈止损，开仓后止盈止损才会生效。您也可以选择最新价或者标记价来触发止盈止损。')}
        value={spslMode.enable}
        onChange={(value) => {
          if (value) {
            Swap.Trade.onChangeSpslSetting({ enable: true });
          } else {
            Swap.Trade.resetSpslSetting();
          }
        }}
        renderRight={
          spslMode.enable
            ? () => (
                <div
                  className={clsx('spsl-advanced')}
                  onClick={() => {
                    if (!currentPosition) {
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
    </>
  );
};

export const SpslContent = ({ children }: { children: any }) => {
  if (!Swap.Trade.isOpenPositionMode) return <></>;
  return children;
};

const { className, styles } = css.resolve`
  .spsl-advanced {
    color: var(--skin-primary-color);
    font-size: 14px;
    font-weight: 400;
    cursor: pointer;
  }
`;
const clsx = clsxWithScope(className);
