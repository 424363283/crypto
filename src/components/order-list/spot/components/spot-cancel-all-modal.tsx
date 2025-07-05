import YIcon from '@/components/YIcons';
import YModal from '@/components/YModal';
import { LANG } from '@/core/i18n';
import Image from 'next/image';
import css from 'styled-jsx/css';

interface Props {
  open: boolean;
  onClose: () => void;
  submit: () => void;
}

export const SpotCancelAllModal = ({ open, onClose, submit }: Props) => {
  const onSubmit = () => {
    if (submit) {
      submit();
    }
  };

  return (
    <>
      <YModal
        open={open}
        width={480}
        header={
          <>
            <div className="spot_YModalHeader" >
              <div className="spot_YModalHeaderTitle">
                {
                  LANG('提示')
                }
              </div>
              <YIcon.CloseOutlined className="close-btn"
                onClick={onClose}
              />
            </div>
          </>
        }
        content={
          <>
            <div className="spot_YModalContent">
              <Image
                className="spot_YModalImg"
                src="/static/images/common/v2_alert_warning.png"
                alt=""
                width={60}
                height={60}
              />

              <p className="spot_YModalDes">{LANG('是否一键撤销所有挂单')}</p>
            </div>
          </>
        }
        footer={
          <>
            <div className="spot_YModalFooterBtn" onClick={onSubmit} >
              {LANG('确认')}
            </div>
          </>
        }
      />
      <style jsx>{styles}</style>
    </>
  );
};
const styles = css`
  .spot_YModalHeader {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 16px;
    width: 100%;
    .spot_YModalHeaderTitle {
      flex: 1;
      display: block;
    }
    .close-btn {
      font-size: 16px;
    }
  }
  .spot_YModalContent {
    display: flex;
    flex-direction: column;
    align-items: center; // Center horizontally
    justify-content: center; // Center vertically
    width: 100%;
    img {
      margin: auto;
      display: block;
    }
    .spot_YModalDes {
      text-align: center;
      font-size: 14px;
      font-style: normal;
      font-weight: 400;
      color: var(--text_2);
      margin-top: 16px;
    }
  }
  .spot_YModalFooterBtn {
    width: 100%;
    height: 48px;
    border-radius: 40px;
    background: var(--text_brand);
    color: #fff;
    text-align: center;
    line-height: 48px;
    cursor: pointer;
  }
  .spot_YModalImg {
    width: 60px;
    height: 60px;
    margin: auto;
    display: block;
  }
`;
