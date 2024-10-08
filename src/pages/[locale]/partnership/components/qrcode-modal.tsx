import { BasicModal, BasicProps } from '@/components/modal';
import { useTheme } from '@/core/hooks';
import { LANG, renderLangContent } from '@/core/i18n';
import { QRCodeCanvas } from 'qrcode.react';
import css from 'styled-jsx/css';

export enum QRCODE_MODAL_TYPE {
  LUCKY_WHEEL = 0,
  INVITE_FRIENDS_ASSIST = 1,
  MYSTERY_BOX = 2,
}

type ScanQrCodeProps = {
  modalType: QRCODE_MODAL_TYPE;
  shareUrl: string;
  bonus?: string;
} & BasicProps;

export default function ScanQrCodeModal(props: ScanQrCodeProps) {
  const { modalType, shareUrl, bonus, ...rest } = props;
  const { isBlue } = useTheme();
  // TODO: 奖励从接口获取
  const SUB_TITLE_MAP = {
    [QRCODE_MODAL_TYPE.LUCKY_WHEEL]: renderLangContent(LANG('领取{bonus}现金券'), {
      bonus: <span className='bonus'>{bonus}</span>,
    }),
    [QRCODE_MODAL_TYPE.INVITE_FRIENDS_ASSIST]: renderLangContent(LANG('您和好友 {highlight}'), {
      highlight: <span className='bonus'>{LANG('都有奖')}</span>,
    }),
    [QRCODE_MODAL_TYPE.MYSTERY_BOX]: renderLangContent(LANG('一起赢取 {bonus} 奖励'), {
      bonus: <span className='bonus'>{bonus || '1,550 USDT'}</span>,
    }),
  };

  return (
    <BasicModal
      {...rest}
      width={376}
      cancelButtonProps={{ style: { display: 'none' } }}
      okButtonProps={{ style: { display: 'none' } }}
    >
      <p className='title'>{LANG('邀请好友扫码注册')}</p>
      <p className='sub-title'>{SUB_TITLE_MAP[modalType]}</p>
      <QRCodeCanvas
        value={shareUrl} // 你想要转换的URL
        size={145} // 二维码的大小
        bgColor={'#ffffff'} // 二维码的背景颜色
        level={'H'} // 二维码的错误纠正等级
        includeMargin
        imageSettings={{
          src: isBlue ? '/static/icons/blue/common/logo-round.svg' : '/static/icons/primary/common/logo-round.svg',
          width: 34,
          height: 34,
          excavate: true,
        }}
      />
      <p className='tips'>{LANG('建议使用手机相机扫码')}</p>
      <style jsx>{styles}</style>
    </BasicModal>
  );
}
const styles = css`
  :global(.basic-modal .basic-content) {
    display: flex;
    flex-direction: column;
    align-items: center;
    :global(.title) {
      font-size: 20px;
      font-weight: 500;
      color: var(--spec-font-color-1);
      margin-top: 10px;
      text-align: center;
    }
    :global(.sub-title) {
      margin-bottom: 10px;
      font-size: 20px;
      font-weight: 500;
      text-align: center;
      color: var(--spec-font-color-1);
      :global(.bonus) {
        color: var(--skin-main-font-color);
      }
    }
    :global(.tips) {
      margin-top: 10px;
      font-size: 14px;
      color: var(--spec-font-color-2);
      text-align: center;
    }
  }
`;