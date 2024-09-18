import { QRCodeCanvas } from 'qrcode.react';

export default function DownloadQrCode({ size = 148 }: { size?: number }) {
  if (typeof window === 'undefined') return <></>;
  const url = window.location.origin + '/onelink';
  return (
    <QRCodeCanvas
      value={url} // 你想要转换的URL
      size={size} // 二维码的大小
      bgColor={'#ffffff'} // 二维码的背景颜色
      level={'H'} // 二维码的错误纠正等级
      includeMargin
      imageSettings={{
        src: '/static/images/header/media/app-logo.svg',
        width: size / 3.9,
        height: size / 3.9,
        excavate: true,
      }}
    />
  );
}
