import { message } from 'antd';
import { JointContent } from 'antd/es/message/interface';
// import './message.scss';
import pick from 'lodash/pick';

import styled from 'styled-components';

const Message = styled.div`
.g-message {
  .ant-message-notice-content {
    // 最外层容器
    padding: 5px 10px;
    box-shadow: 0px 2px 6px 0px rgba(27, 30, 46, 0.10);
    background: var(--fill-page-secondary, #1d1d21);
    color: var(--text-text-primary, #fff);
    border-radius: 2px;
    height: 40px;
    line-height: 40px;
    padding: 0 9px !important;
    text-align: left;
  }

  .ant-message-custom-content {
    display: inline-flex;
    align-items: center;
    width: 100%;
  }

  .bhex-icon {
    font-size: 24px !important;
    margin-right: 4px;
  }

  .bhex-icon-info {
    color: #3375e0;
  }

  .bhex-icon-suspended1 {
    color: #fcb71e;
  }

  .bhex-icon-delete {
    transform: scale(0.85);
    color: #f73a46;
  }

  .bhex-icon-check {
    color: #51d372;
  }

  .bhex-icon-info {
    color: #f08834;
  }
}
`;



interface MessageResult extends PromiseLike<boolean> {
  (): void;
}

type OpenType = (
  content: JointContent,
  duration?: number | VoidFunction, // Also can use onClose directly
  onClose?: VoidFunction
) => MessageResult;

const MessageTypes = ['info', 'warning', 'error', 'success', 'tip'] as const;
type MessageType = (typeof MessageTypes)[number];

const TypeIcon = {
  info: 'info',
  warning: 'suspended1',
  error: 'delete',
  success: 'check'
};

export default MessageTypes.reduce(
  (msgFuns, type: MessageType) => {
    msgFuns[type] = (content: JointContent, duration?: number | VoidFunction, onClose?: VoidFunction) => {
      let className = 'g-message';
      const extClsName: any = pick(content, 'className');
      if (extClsName) className += ' ' + extClsName.className;

      return type == 'tip'
        ? message.info(
            Object.assign({ content }, content, {
              className,
              icon: <i style={{ display: 'none' }}></i>
            }),
            duration,
            onClose
          )
        : (message as any)[type](
            Object.assign({ content }, content, {
              className,
              icon: <span></span>
            }),
            duration,
            onClose
          );
    };

    return msgFuns;
  },
  {} as {
    info: OpenType;
    warning: OpenType;
    error: OpenType;
    success: OpenType;
    tip: OpenType;
  }
);
// export default MessageTypes.reduce(
//   (msgFuns, type: MessageType) => {
//     msgFuns[type] = (content: JointContent, duration?: number | VoidFunction, onClose?: VoidFunction) => {
//       let className = 'g-message';
//       const extClsName: any = pick(content, 'className');
//       if (extClsName) className += ' ' + extClsName.className;

//       return type == 'tip'
//         ? message.info(
//             Object.assign({ content }, content, {
//               className,
//               icon: <i style={{ display: 'none' }}></i>
//             }),
//             duration,
//             onClose
//           )
//         : (message as any)[type](
//             Object.assign({ content }, content, {
//               className,
//               icon: <span></span>
//             }),
//             duration,
//             onClose
//           );
//     };

//     return msgFuns;
//   },
//   {} as {
//     info: OpenType;
//     warning: OpenType;
//     error: OpenType;
//     success: OpenType;
//     tip: OpenType;
//   }
// );