import BasicModal from '@/components/modal/basic-modal';
import { LANG } from '@/core/i18n';
import css from 'styled-jsx/css';
import CopyInput from './copyInput';
import CopySettingInput from '@/components/CopyTrading/Components/copySettingInput';
import { useState, useImperativeHandle,forwardRef,useRef } from 'react';
import { useResponsive } from '@/core/hooks';
import { MobileDrawer } from '@/components/mobileDrawer';
import { Button } from '@/components/button';
import { message } from '@/core/utils/src/message';
import { Loading } from '@/components/loading';
import { Copy } from '@/core/shared';
interface CancelSettingProps {
  isOpen: boolean;
  close: Function;
  copyMinAvailableMargin: number
}
const FreeMarginModal = (props: CancelSettingProps) => {
  const { isMobile } = useResponsive();
  const { isOpen, close,copyMinAvailableMargin } = props;
  const childRef = useRef<{ getMargin: () => string }>(null);
    // 使用 useCallback 缓存回调函数
  const handleConfrim = async() => {
    const  copyMargin = childRef.current?.getMargin()
    Loading.start()
    const user: any = Copy.getUserInfo();
    const res = await Copy.fetchUpdateShareConfig({
      uid: user?.user.uid,
      copyMinAvailableMargin: Number(copyMargin)
    })
    Loading.end()
    if( res.code === 200) {
      close(true)
    } else {
      message.error(res.message)
    }
  }

  const FreeMarginModule = forwardRef((props: {  marginValue: number },ref:any) => {
    const { marginValue } = props;
    const [margin, setMargin] = useState(marginValue);
    useImperativeHandle(ref, () => ({
      getMargin: () => margin,
    }));
    return (
      <div className="copy-modal-container">
        <CopySettingInput unit="USDT" placeholder={LANG('保证金')} value={margin} onChange={e => setMargin(e)} />
        <div className="tips">{LANG('跟随者设置跟随时所需的最低可用保证金')}</div>
        <style jsx>{copyCancelStyle}</style>
      </div>
    );
  });
  return (
    <>
      {!isMobile && (
        <BasicModal
          open={isOpen}
          title={LANG('跟随者最低可用保证金')}
          width={400}
          onCancel={() => close()}
          onOk={() => handleConfrim()}
          className="copy-cancel-modal"
          okText={LANG('确定')}
          hasCancel={false}
          destroyOnClose
        >
          <FreeMarginModule ref={childRef}  marginValue={copyMinAvailableMargin} />
        </BasicModal>
      )}
      {isMobile && (
        <MobileDrawer
          open={isOpen}
          title={LANG('跟随者最低可用保证金')}
          direction="bottom"
          height={238}
          width={'100%'}
          className="copy-cancel-modal"
          onClose={() => close()}
        >
          <FreeMarginModule ref={childRef} marginValue={copyMinAvailableMargin} />
          <Button type="primary" rounded className="handle-btn" height={48} width={'100%'} onClick={handleConfrim}>
            {LANG('确定')}
          </Button>
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
      .tips {
        font-family: HarmonyOS Sans SC;
        font-size: 12px;
        font-weight: 400;
        color: var(--text-tertiary);
        margin-top: 8px;
      }
      :global(.handle-btn) {
        margin: 24px 0;
      }
      :global(.container) {
        :global(.input-wrapper) {
          width: 100%;
          border-radius: 12px;
          height: 48px;
          padding: 0 8px;
          background: var(--fill-3);
          :global(input) {
            background: var(--fill-3);
          }
        }
      }
    }
  }
`;

export default FreeMarginModal;
