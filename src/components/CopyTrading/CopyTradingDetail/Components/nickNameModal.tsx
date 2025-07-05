import BasicModal from '@/components/modal/basic-modal';
import { LANG } from '@/core/i18n';
import css from 'styled-jsx/css';
import { useState, useImperativeHandle, forwardRef, useRef, useMemo } from 'react';
import { useResponsive } from '@/core/hooks';
import { MobileDrawer } from '@/components/mobileDrawer';
import { Button } from '@/components/button';
import { message } from '@/core/utils/src/message';
import { Loading } from '@/components/loading';
import { Copy } from '@/core/shared';
import { Input } from 'antd';
interface CancelSettingProps {
  isOpen: boolean;
  close: Function;
  nickname: string;
}
const nickNameModal = (props: CancelSettingProps) => {
  const regex = /[\u4E00-\u9FD5]|[\u3040-\u31FF]|[\uAC00-\uD7AF]/;
  const regexGlobal = new RegExp(regex, 'g');
  const { isMobile } = useResponsive();
  const { isOpen, close, nickname } = props;
  const childRef = useRef<{ getMargin: () => string }>(null);
  // 使用 useCallback 缓存回调函数
  const handleConfrim = async () => {
    const name = childRef.current?.getNewNickName();
    if (name.length<3) return
    Loading.start();
    const user: any = await Copy.getUserInfo();
    const res = await Copy.fetchUpdateNickNameAudit({
      uid: user?.uid,
      nickname: name
    });
    Loading.end();
    if (res?.code === 200) {
      close(true);
      message.success(LANG('昵称修改已提交，审核中'))
    } else {
      message.error(res.message);
    }
  };

  const NickNameModule = forwardRef((props: { nicknameValue: string }, ref: any) => {
    const { nicknameValue } = props;
    const [newNickName, setNewNickName] = useState('');
    useImperativeHandle(ref, () => ({
      getNewNickName: () => newNickName
    }));
    const canSubmit = useMemo(() => {
      return newNickName.length <3
    },[newNickName])
    return (
      <div className="copy-modal-container">
        <div className="copy-nickname-box">
          <p className="nickname">{LANG('旧昵称')}</p>
          <Input disabled placeholder={LANG('旧昵称')} className="inputSearch" value={nicknameValue} />
        </div>
        <div className="copy-nickname-box">
          <p className="nickname">{LANG('新昵称')}</p>
          <Input
            placeholder={LANG('3到20个字符')}
            className="inputSearch"
            min={2}
            max={20}
            value={newNickName}
            onChange={e =>{
              let value = e.target.value;
              let newValue = value;
              let currentLength = value?.replace(regexGlobal, "**").length;
              if (currentLength > 20) {
                let truncatedValue = '';
                let truncatedLength = 0;
                for (let char of value) {
                  const charLength = regex.test(char) ? 2 : 1;
                  if (truncatedLength + charLength > 20) {
                    break;
                  }
                  truncatedValue += char;
                  truncatedLength += charLength;
                }
                newValue = truncatedValue;
              }
              setNewNickName(newValue)
            }}
          />
        </div>
        <div className="tips">{LANG('修改个人昵称后，通过审核后才能生效。')}</div>
         <Button type="primary" rounded className="handle-btn" height={48} width={'100%'} disabled={canSubmit}  onClick={handleConfrim}>
            {LANG('确定')}
          </Button>
        <style jsx>{copyCancelStyle}</style>
      </div>
    );
  });
  return (
    <>
      {!isMobile && (
        <BasicModal
          open={isOpen}
          title={LANG('修改昵称')}
          width={400}
          onCancel={() => close()}
          className="copy-cancel-modal"
          okText={LANG('确定')}
          hasFooter={false}
          hasCancel={false}
          destroyOnClose
        >
          <NickNameModule ref={childRef} nicknameValue={nickname } />
        </BasicModal>
      )}
      {isMobile && (
        <MobileDrawer
          open={isOpen}
          title={LANG('修改昵称')}
          direction="bottom"
          height={380}
          width={'100%'}
          className="copy-cancel-modal"
          onClose={() => close()}
        >
          <NickNameModule ref={childRef} nicknameValue={nickname} />
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
         font-family: "Lexend";;
        font-weight: 400;
        font-size: 12px;
        color: var(--yellow, #f0ba30);
      }
      :global(.handle-btn) {
        margin-bottom: 0;
      }
      :global(.container) {
        :global(.input-wrapper) {
          width: 100%;
          border-radius: 12px;
          height: 48px;
          padding: 0 8px;
          background: var(--fill_3);
          :global(input) {
            background: var(--fill_3);
          }
        }
      }
      .copy-nickname-box {
        margin-bottom: 24px;
        .nickname {
           font-family: "Lexend";;
          font-weight: 400;
          font-size: 14px;
          margin-bottom: 8px;
          color: var(--text_2);
          margin-bottom: 8px;
        }
      }
      :global(.inputSearch) {
        height: 48px;
        background: var(--fill_2);
        border-radius: 8px;
        border: 1px solid var(--fill_2);
        color:var(--text_1);
        &.ant-input-outlined:focus {
          border: 1px solid var(--brand);
        }
        &:hover {
          border: 1px solid var(--brand);
          box-shadow: none;
        }
        &::placeholder {
          color: var(--text_2) !important;
        }
        &::-webkit-input-placeholder {
          color: var(--text_2) !important;
        }
        input {
         color:var(--text_1);
          &::placeholder {
            color: var(--text_2) !important;
          }
          &::-webkit-input-placeholder {
            color: var(--text_2) !important;
          }
        }
        &.ant-input-affix-wrapper > input.ant-input {
          color: var(--text_1);
        }
      }
    }
  }
`;

export default nickNameModal;
