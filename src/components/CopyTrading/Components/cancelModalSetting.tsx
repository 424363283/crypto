import BasicModal from '@/components/modal/basic-modal';
import { LANG } from '@/core/i18n';
import css from 'styled-jsx/css'; 
interface CancelSettingProps { 
    isOpen: boolean;
    close: Function;
    confrimPlan:Function
}
const CancelModalSetting = (props:CancelSettingProps) => {
    const { isOpen, close,confrimPlan} = props;
    const CopyIcon = () => {
        return (
            <>
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22" fill="none">
                    <path
                        d="M11 2.75C6.45176 2.75 2.75 6.45176 2.75 11C2.75 15.5482 6.45176 19.25 11 19.25C15.5482 19.25 19.25 15.5482 19.25 11C19.25 6.45176 15.5482 2.75 11 2.75ZM11 18.1629C7.05117 18.1629 3.83711 14.9488 3.83711 11C3.83711 7.05117 7.05117 3.83711 11 3.83711C14.9488 3.83711 18.1629 7.05117 18.1629 11C18.1629 14.9488 14.9488 18.1629 11 18.1629Z"
                        fill="#F0BA30"
                    />
                    <path
                        d="M11.0006 8.82576C10.6998 8.82576 10.457 9.06853 10.457 9.36931V14.3C10.457 14.6008 10.6998 14.8435 11.0006 14.8435C11.3014 14.8435 11.5441 14.6008 11.5441 14.3V9.36931C11.5441 9.06853 11.3014 8.82576 11.0006 8.82576ZM11.0006 7.15857C10.6998 7.15857 10.457 7.40134 10.457 7.70212C10.457 8.0029 10.702 8.24568 11.0006 8.24568C11.3014 8.24568 11.5441 8.0029 11.5441 7.70212C11.5441 7.40134 11.3014 7.15857 11.0006 7.15857Z"
                        fill="#F0BA30"
                    />
                </svg>
            </>
        );
    };
    return (
        <>
            <BasicModal
                open={isOpen}
                title={LANG('取消跟单')}
                width={400}
                onCancel={() => close()}
                onOk={() => confrimPlan()}
                className="copy-cancel-modal"
                okText={LANG('确定')}
                hasCancel={false}
                destroyOnClose
            >
                <div className='copy-modal-container'>{LANG('是否确认取消跟单？')}</div>
                <div className="flexCenter tips">
                    <CopyIcon />
                   {LANG(' 取消后，所有跟随此交易员的仓位会被立即平仓。')}
                </div>
            </BasicModal>
            <style jsx>{copyCancelStyle}</style>
        </>
    );
};

const copyCancelStyle = css`
  :global(.copy-cancel-modal) {
   .flexCenter{
        display: flex;
        align-items: center;
      
    }
    .copy-modal-container{
         color: var(--text-primary);
        font-family: "HarmonyOS Sans SC";
        font-size: 16px;
        font-style: normal;
        font-weight: 400;
        line-height: 24px;
          display: flex;
        align-items: center;
            justify-content: center;
            margin-bottom: 40px;
    }
    .tips {
      color: var(--yellow);
      font-family: 'HarmonyOS Sans SC';
      font-size: 14px;
      font-style: normal;
      font-weight: 400;
      line-height: 21px;
    }
  }
`;

export default CancelModalSetting;
