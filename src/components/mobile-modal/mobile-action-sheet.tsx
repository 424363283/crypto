import { ActionSheet } from "antd-mobile";
import { ReactNode } from "react";
import { Svg } from "../svg";
import { LANG } from "@/core/i18n";
import css from "styled-jsx/css";
import { clsx } from "@/core/utils";
import { Button } from '@/components/button';
import { Size } from "../constants";

interface BottomSheetType {
    title?: string;
    visible: boolean;
    content: ReactNode;
    contentClassName?: string;
    bottomClassName?: string;
    hasBtn?: boolean;
    hasCancel?: boolean;
    cancelText?: string;
    confirmText?: string;
    disabled?: boolean;
    close: () => void;
    onCancel?: () => void;
    onConfirm?: () => void;
}

const MobileBottomSheet = (props: BottomSheetType) => {
    const {
        visible,
        content,
        close,
        title,
        contentClassName,
        bottomClassName,
        hasBtn = true,
        hasCancel = false,
        cancelText = '取消',
        confirmText = '确定',
        onConfirm,
        onCancel,
        disabled = false
    } = props;
    return <>
         <ActionSheet
            visible={visible}
            actions={[]}
            onClose={close}
            popupClassName='antd-action-sheet'
            extra={
                <div className={'bottom-sheet-box'}>
                    <div className="title">
                        {!!title && <div className="edit-title">{title}</div>}
                        <Svg src={'/static/icons/primary/common/close.svg'} width={14} fill='var(--text_1)' onClick={close} />
                    </div>
                    <div className={clsx('content', contentClassName)}>{content}</div>
                    {
                        hasBtn && 
                        <div className= {clsx('bottom', bottomClassName)}>
                            {
                                hasCancel && <>
                                    <Button onClick={ onCancel || close}
                                        className='cancel-btn'
                                        type=''
                                        disabled={disabled}
                                        rounded
                                        size={Size.LG}
                                    >
                                        {LANG(cancelText)}
                                    </Button>
                                    <div style={{width: 20}} />
                                </>
                            }
                            <Button onClick={onConfirm || close}
                                    className='confirm-btn'
                                    type='primary'
                                    disabled={disabled}
                                    rounded
                                    size={Size.LG}
                                >
                                {LANG(confirmText)}
                            </Button>
                        </div>
                    }
                </div>
            }
            destroyOnClose={true}
        />
         <style jsx>{styles}</style>
    </>
}

const styles = css`
  :global(.adm-action-sheet-popup.antd-action-sheet > .adm-popup-body) {
    border-top-left-radius: 24px; 
    border-top-right-radius: 24px;
  }
  :global(.adm-action-sheet-extra){
     background-color:var(--fill_pop);
     padding: 24px!important;
  }
  .bottom-sheet-box{
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 24px;
      .title{
          display:flex;
          justify-content: space-between;
          .edit-title{
              font-size: 16px;
              font-weight: 500;
              color:var(--text_1);
          }
      }
      .bottom{
          flex: 1;
          display: flex;
          justify-content: space-between;
          // width: calc(100% - 30px);
          :global(.common-button){
             flex: 1;
          }
          :global(.cancel-btn) {
            background: var(--fill_3);
          }
      }
  }
`

export default MobileBottomSheet;
