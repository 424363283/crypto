import { useEffect } from 'react';
import classnames from 'clsx';

import '@/styles/UseMessage.module.scss';

interface MessageHookProps {
  msg: string;
  type?: 'info' | 'warn' | 'error' | 'success' | 'tip';
  duration?: number;
}

const useMessage = ({ msg, type = 'info', duration = 1000 }: MessageHookProps) => {
  useEffect(() => {
    const create = (message: string, classname: string | null, time: number = duration) => {
      const div = document.createElement('em');
      div.className = classnames('g-message', classname);
      div.innerHTML = message;

      const msgbox = window.document.querySelector('#msgbox');
      if (!msgbox) {
        createBox();
      }

      if (msgbox) {
        msgbox.appendChild(div);
        setTimeout(() => {
          div.className = classnames('g-message', classname, 'close');
          // Animation completed, remove from DOM
          setTimeout(() => {
            msgbox.removeChild(div);
          }, 550);
        }, time);
      }
    };

    const createBox = () => {
      const msgbox = window.document.createElement('div');
      msgbox.id = 'msgbox';
      msgbox.className = 'g-msgbox';
      window.document.body.appendChild(msgbox);
    };

    createBox(); // Ensure the box is created when the component mounts

    switch (type) {
      case 'info':
        create(`<i class="bhex-icon bhex-icon-info"></i><span>${msg}</span>`, null, duration);
        break;
      case 'warn':
        create(`<i class="bhex-icon bhex-icon-suspended1"></i><span>${msg}</span>`, 'warn', duration);
        break;
      case 'error':
        create(`<i class="bhex-icon bhex-icon-delete"></i><span>${msg}</span>`, 'error', duration);
        break;
      case 'success':
        create(`<i class="bhex-icon bhex-icon-check"></i><span>${msg}</span>`, 'success', duration);
        break;
      case 'tip':
        create(`<span>${msg}</span>`, 'success', duration);
        break;
      default:
        break;
    }
  }, [msg, type, duration]);
};

export default useMessage;