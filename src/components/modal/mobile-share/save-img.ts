import { LANG } from '@/core/i18n';
import { message } from '@/core/utils';
import html2canvas from 'html2canvas';

export const saveImg = (id: string) => {
  if (!document) return;
  // 获取要截图的DOM元素
  const domElement = document.getElementById(id) as HTMLElement;
  // 定义缩放比例
  const scale = 3;
  // 生成截图
  html2canvas(domElement, {
    scale: scale,
    ignoreElements: (element) => {
      return element.classList.contains('common-btn');
    },
  })
    .then((canvas) => {
      // 导出图片
      const base64 = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = base64;
      a.download = 'screenshot.png';
      a.click();
    })
    .catch((err) => {
      message.error(err.message || LANG('导出失败'));
    });
};
