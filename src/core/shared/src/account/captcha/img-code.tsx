import { createRoot } from 'react-dom/client';

import { CaptchaResponse } from '.';
import { CaptchaView } from './view';
export class ImgCode {
  private static id: string = 'auth-img-code';

  private static get element() {
    return document.getElementById(ImgCode.id);
  }

  private static get isWindow() {
    return typeof window !== 'undefined';
  }

  private static view({ resolve }: { resolve: (res: CaptchaResponse) => void }): JSX.Element {
    return <CaptchaView resolve={resolve} ImgCode={ImgCode} />;
  }

  public static start(resolve: (res: CaptchaResponse) => void): void {
    if (!ImgCode.isWindow) return;
    if (ImgCode.element) return;
    const div = document.createElement('div');
    div.id = ImgCode.id;
    document.body.appendChild(div);
    createRoot(div).render(<ImgCode.view resolve={resolve} />);
  }

  public static end() {
    if (!ImgCode.isWindow) return;
    if (ImgCode.element) {
      ImgCode.element.parentElement?.removeChild(ImgCode.element);
    }
  }
}
