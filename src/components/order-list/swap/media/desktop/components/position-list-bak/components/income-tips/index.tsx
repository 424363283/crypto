import { useTheme } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { clsx } from '@/core/utils';

const IncomeTips = ({ value, onChange }: any) => {
  const { isDark } = useTheme();
  return (
    <>
      {LANG('采用标记价格计算得出的未实现盈亏以及回报率；')}
      <div className={clsx('title', !isDark && 'light')}>{LANG('选择价格基准')}</div>
      <div className={clsx('options', !isDark && 'light')}>
        {[LANG('标记价格'), LANG('最新价格')].map((v, index) => (
          <div onClick={() => onChange(index)} className={clsx('option', value === index && 'active')} key={index}>
            <div></div>
            {v}
          </div>
        ))}
      </div>
      <style jsx>{`
        .title {
          font-size: 12px;
          font-weight: 400;
          color: var(--theme-trade-text-color-3);
          padding: 8px 0;
          border-bottom: 1px solid var(--theme-trade-border-color-2);
        }

        .options {
          display: flex;
          flex-direction: row;
          align-items: center;
          height: 44px;
          .option {
            cursor: pointer;
            display: flex;
            flex-direction: row;
            align-items: center;
            font-size: 14px;
            font-weight: 500;
            div:first-child {
              margin-right: 4px;
              display: flex;
              justify-content: center;
              align-items: center;
              width: 15px;
              height: 15px;
              border: 1px solid var(--skin-primary-color);
              border-radius: 50%;
              &::after {
                content: '';
                display: none;
                width: 7px;
                height: 7px;
                background: var(--skin-primary-color);
                border-radius: 50%;
              }
            }
            &:first-child {
              margin-right: 40px;
            }
            &.active {
              font-weight: 600;
              div:first-child::after {
                display: block;
              }
            }
          }
        }
      `}</style>
    </>
  );
};

export default IncomeTips;
