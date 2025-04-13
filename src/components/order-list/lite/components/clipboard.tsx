import YIcon from '@/components/YIcons';
import { LANG } from '@/core/i18n';
import { message } from '@/core/utils';
import CopyToClipboard from 'react-copy-to-clipboard';
import css from 'styled-jsx/css';

const Clipboard = ({ text }: { text: string }) => {
  return (
    <>
      <CopyToClipboard text={text} onCopy={() => message.success(LANG('复制成功'))}>
        <YIcon.copyIcon />
      </CopyToClipboard>
      <style jsx>{styles}</style>
    </>
  );
};

export default Clipboard;
const styles = css`
  :global(.copyIcon) {
    cursor: pointer;
  }
`;
