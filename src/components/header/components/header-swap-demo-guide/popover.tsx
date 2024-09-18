import { Button } from '@/components/button';
import CommonIcon from '@/components/common-icon';
import { LANG } from '@/core/i18n';
import { clsx } from '@/core/utils';
import { headerSwapDemoGuideStore } from '.';

export const Popover = ({
  content,
  onClose,
  goTo,
  arrow = 'top',
}: {
  content: string[];
  onClose?: () => any;
  goTo: (step: number) => void;
  arrow: string;
}) => {
  const { step, setCurrentStep } = headerSwapDemoGuideStore;

  const _onClose = () => {
    onClose?.();
    setTimeout(() => {
      headerSwapDemoGuideStore.step = 1;
    }, 0);
  };
  return (
    <>
      <div className={clsx('guide-popover', 'arrow', `arrow-${arrow}`)}>
        <div className='title'>
          {LANG('提示')}
          <CommonIcon name='common-black-close-0' size={10} enableSkin className='close' onClick={_onClose} />
        </div>
        <div className='content'>
          {content.map((v, i) => {
            if (v === 'space') {
              return <div key={i} className='space'></div>;
            }
            return <div key={i}>{v}</div>;
          })}
        </div>
        <div className='bottom'>
          <Button
            type='primary'
            className='button'
            onClick={() => {
              headerSwapDemoGuideStore.showDemoMenu = true;
              setCurrentStep(1);
              if (step == 1) {
                headerSwapDemoGuideStore.showDemoMenu = false;
                return _onClose?.();
              }

              goTo(1);
            }}
          >
            {LANG('好的')}
          </Button>
        </div>
      </div>
      <style jsx>{`
        .guide-popover {
          padding-top: 14px;
          padding-left: 15px;
          padding-right: 10px;
          padding-bottom: 10px;
          color: var(--theme-light-text-1);
          position: relative;
          &.arrow {
            &::before {
              content: '';
              display: block;
              position: absolute;
              border-top: 5px solid transparent;
              border-bottom: 5px solid transparent;
              border-right: 8px solid var(--skin-primary-color);
            }
            &.arrow-top::before {
              top: -8px;
              transform: rotate(90deg);
            }
            &.arrow-left::before {
              top: 38px;
              left: -8px;
            }
          }

          .title {
            font-size: 14px;
            font-weight: 500;
            margin-bottom: 10px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding-right: 5px;
            color: var(--skin-font-color);
            .close {
              cursor: pointer;
            }
          }
          .content {
            margin-bottom: 10px;
            color: var(--skin-font-color);
            > div {
              font-size: 12px;
            }
            .space {
              height: 20px;
            }
          }

          .bottom {
            display: flex;
            flex-direction: row;
            justify-content: flex-end;
            margin-top: 4px;

            :global(.button) {
              background-color: #fff;
              color: #141717;
              height: 24px;
              font-size: 12px;
              min-width: 53px;
            }
          }
        }
      `}</style>
    </>
  );
};
