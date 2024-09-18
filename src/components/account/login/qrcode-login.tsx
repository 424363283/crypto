import CommonIcon from '@/components/common-icon';
import { LANG } from '@/core/i18n/src/page-lang';
import { QrCodeLogin } from '@/core/shared';
import QRCode from 'qrcode.react';
import { useCallback, useEffect, useState } from 'react';
import css from 'styled-jsx/css';

export const LoginQrCode = (props: { onLoginSuccess: () => void }) => {
  const { onLoginSuccess } = props;
  const [code, setCode] = useState(QrCodeLogin.qrcode);
  const _getCode = useCallback(async () => {
    return QrCodeLogin.getQrcode({ animate: true }).then((data) => {
      QrCodeLogin.killKeepAliveTimer();
      setCode(data.data);
    });
  }, []);
  useEffect(() => {
    const func = async () => {
      !code && (await _getCode());
      if (code) {
        QrCodeLogin.keepAliveVerifyQrcode().then(({ data }) => {
          // 二维码过期 -1:二维码过期 0:未验证 1:成功
          const status = Number(data?.status);
          if (status === -1) {
            _getCode();
          } else if (status === 1) {
            onLoginSuccess();
          }
        });
      }
    };
    func();
    return () => QrCodeLogin.killKeepAliveTimer();
  }, [code]);
  const renderQrCode = () => {
    if (code) {
      return (
        <QRCode
          size={160}
          value={code}
          level={'Q'}
          imageSettings={{
            src: '/favicon.ico',
            x: undefined,
            y: undefined,
            height: 24,
            width: 24,
            excavate: true,
          }}
        />
      );
    }
    return null;
  };
  return (
    <div className='qrcode'>
      <div className='content'>
        <div className='code'>{renderQrCode()}</div>
        <div className='info'>
          <CommonIcon name='common-scan' width='16' height='20' className='scan-icon' />
          <div
            className='text'
            dangerouslySetInnerHTML={{
              __html: LANG('打开{appName}移动端扫码登录', { appName: '<span>YMEX</span>' }),
            }}
          ></div>
        </div>
      </div>
      <style jsx>{styles}</style>
    </div>
  );
};
const styles = css`
  .qrcode {
    padding: 7px;
    .content {
      margin-top: 14px;
      .code {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        margin: 0 auto;
        background-color: #fff;
        border: 1px solid var(--skin-color-active);
        width: 198px;
        height: 198px;
        border-radius: 16px;
      }
      .info {
        margin-top: 40px;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        :global(.scan-icon) {
          width: 20px;
          height: 20px;
          margin-right: 9px;
        }
        .text {
          font-size: 14px;
          font-weight: 400;
          color: var(--theme-font-color-1);
          :global(span) {
            color: var(--skin-primary-color);
          }
        }
      }
    }
  }
`;
