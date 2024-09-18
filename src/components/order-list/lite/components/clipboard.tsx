import { useTheme } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { message } from '@/core/utils';
import Image from 'next/image';
import CopyToClipboard from 'react-copy-to-clipboard';
import css from 'styled-jsx/css';

const Clipboard = ({ text }: { text: string }) => {
  const { isDark } = useTheme();
  return (
    <>
      <CopyToClipboard text={text} onCopy={() => message.success(LANG('复制成功'))}>
        <Image
          src={isDark ? '/static/images/lite/icon_copy_dark.png' : '/static/images/lite/icon_copy.png'}
          className='copyIcon'
          width={12}
          height={12}
          alt=''
        />
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
