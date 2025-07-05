import BasicModal from '@/components/modal/basic-modal';
import { LANG } from '@/core/i18n';
import css from 'styled-jsx/css';
import { Copy } from '@/core/shared';
import { useRouter } from '@/core/hooks';
import { message } from '@/core/utils/src/message';

interface CancelSettingProps {
  isOpen: boolean;
  close: Function;
  title: string;
  okText: string;
  content: string;
  isOpenU:boolean
}
const CancelModalSetting = (props: CancelSettingProps) => {
  const { isOpen, close, isOpenU, title, okText, content } = props;
   const router = useRouter();
  const confrimActivate = async() => {
    if (!isOpenU) {
      router.push({
        pathname: '/swap/btc-usdt'
      });
    } else {
       const res = await Copy.fetchOpenCopyWallet({
          contractType: 2 // 2=u本位 1=币本位
        });
        if (res?.code === 200) {
          message.error(LANG('开通成功'))
        } else {
          message.error(LANG('开通失败'))
        }
    }
  };
  return (
    <>
      <BasicModal
        open={isOpen}
        title={LANG(title)}
        width={400}
        onCancel={() => close()}
        onOk={() => confrimActivate()}
        className="copy-cancel-modal"
        okText={LANG(okText)}
        hasCancel={false}
        destroyOnClose
      >
        <div className="copy-modal-container">{LANG(content)}</div>
      </BasicModal>
      <style jsx>{copyCancelStyle}</style>
    </>
  );
};

const copyCancelStyle = css`
  :global(.basic-modal.copy-cancel-modal .ant-modal-content .basic-content) {
    padding-top: 20px;
  }

  :global(.basic-modal.copy-cancel-modal .ant-btn) {
    font-size: 16px;
    font-weight: 500;
  }

  :global(.basic-modal.copy-cancel-modal) {
    .flexCenter {
      display: flex;
      align-items: flex-start;
    }
    :global(.ant-modal-content) {
      border-radius: 12px;
      padding: 16px 0;
    }
    .copy-modal-container {
      font-family: Lexend;
      font-weight: 400;
      font-size: 14px;
      leading-trim: Cap height;
      line-height: 150%;
      vertical-align: middle;
      padding-bottom: 28px;
      color: var(--text_2)
    }
    :global(.ant-modal-close) {
      width: 24px;
      height: 24px;
    }
    .fixWh {
      height: 22px;
      width: 22px;
    }
    .tips {
      color: var(--yellow);
      font-family: 'Lexend';
      font-size: 14px;
      font-style: normal;
      font-weight: 400;
      line-height: 21px;
    }
  }
`;

export default CancelModalSetting;
