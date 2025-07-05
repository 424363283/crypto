import BasicModal from '@/components/modal/basic-modal';
import { LANG } from '@/core/i18n';
import css from 'styled-jsx/css';
import { Input } from 'antd';
import { useState, useImperativeHandle, forwardRef, useRef } from 'react';
const { TextArea } = Input;
import { useResponsive } from '@/core/hooks';
import { MobileDrawer } from '@/components/mobileDrawer';
import { Button } from '@/components/button';
import { message } from '@/core/utils/src/message';
import { Loading } from '@/components/loading';
import { Copy } from '@/core/shared';
interface CancelSettingProps {
  isOpen: boolean;
  close: Function;
  introduction: string;
}
const IntrodutionModal = (props: CancelSettingProps) => {
  const { isMobile } = useResponsive();
  const { isOpen, close, introduction } = props;
  const childRef = useRef<{ getBrief: () => string }>(null);
  const handleConfrim = async () => {
    const briefValue = childRef.current?.getBrief();
    Loading.start();
    const user: any = await Copy.getUserInfo();
    const res = await Copy.fetchUpdateTraderContentAudit({
      uid: user?.uid,
      content: briefValue
    });
    Loading.end();
    if (res?.code === 200) {
      message.success(LANG('个人简介修改已提交，审核中'));
      close(true);
    } else {
      message.error(res.message);
    }
  };

  const IntrodutionModule = forwardRef((props: { brief: string }, ref: any) => {
    const { brief } = props;
    const [value, setValue] = useState(brief || '');
    useImperativeHandle(ref, () => ({
      getBrief: () => value
    }));
    return (
      <>
        <div className="copy-modal-container">
          <TextArea
            value={value}
            onChange={e => setValue(e.target.value)}
            placeholder={LANG('这里是个人简介...')}
            autoSize={{ minRows: 7, maxRows: 5 }}
            maxLength={200}
          />
          <div className="show-len">
            <span className="current">{value.length}</span> <span className="split">/</span> <span>200</span>
          </div>
          <style jsx>{copyCancelStyle}</style>
        </div>
        <Button className={isMobile ? 'my24' : 'mt24'} type="primary" rounded height={48} width={'100%'} disabled={!value} onClick={handleConfrim}>
          {LANG('确定')}
        </Button>
      </>

    );
  });
  return (
    <>
      {!isMobile && (
        <BasicModal
          open={isOpen}
          title={LANG('个人简介')}
          width={480}
          onCancel={() => close()}
          // onOk={() => handleConfrim()}
          className="copy-cancel-modal"
          okText={LANG('确定')}
          hasCancel={false}
          hasFooter={false}
          destroyOnClose
        >
          <IntrodutionModule ref={childRef} brief={introduction} />

        </BasicModal>
      )}
      {isMobile && (
        <MobileDrawer
          open={isOpen}
          title={LANG('个人简介')}
          direction="bottom"
          height={350}
          width={'100%'}
          className="copy-cancel-modal"
          onClose={() => close()}
        >
          <IntrodutionModule ref={childRef} brief={introduction} />

        </MobileDrawer>
      )}
      <style jsx>{copyCancelStyle}</style>
    </>
  );
};

const copyCancelStyle = css`
  :global(.copy-cancel-modal) {
    .flexCenter {
      display: flex;
      align-items: center;
    }

    .copy-modal-container {
      :global(.ant-input-outlined) {
        background: var(--fill_3);
        border-radius: 12px;
        color: var(--text_1);
      }
      :global(textarea.ant-input) {
        padding-top:24px;
        color: var(--text_1)
      }
          
        :global(.ant-input) {
        &::placeholder {
          color: var(--text_1);
        }
      }
      .show-len {
        text-align: right;
        margin-top: 8px;
         font-family: "Lexend";;
        font-size: 12px;
        font-weight: 400;
        color: var(--text_3);
        .current {
          color: var(--text_brand);
        }
        .split {
          padding: 0 4px;
        }
      }
    }
    :global(.my24) {
      margin: 24px 0;
    }
     
     :global(.mt24) {
      margin: 24px 0 0;
    }
    
  }
`;

export default IntrodutionModal;
