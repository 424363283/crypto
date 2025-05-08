import { useTheme, useResponsive } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { hiddenTxt, message } from '@/core/utils';
import Image from 'next/image';
import CopyToClipboard from 'react-copy-to-clipboard';
import css from 'styled-jsx/css';
import CommonIcon from '../common-icon';
import { ReactNode } from 'react';

const ClipboardItem = ({ text, children, style }: { text: string; children?: ReactNode; style?: React.CSSProperties }) => {
  const { isDark } = useTheme();
  const { isMobileOrTablet } = useResponsive();
  return (
    <>
      <CopyToClipboard text={text} onCopy={() => message.success(LANG('复制成功'))}>
        {children || (
          <p className="copy-content" style={style}>
            {hiddenTxt(text, 3, 4, 3)}
            <CommonIcon size={14} name={`common-copy${isMobileOrTablet ? '-2-grey' : ''}`} />
          </p>
        )}
      </CopyToClipboard>
      <style jsx>{styles}</style>
    </>
  );
};

export default ClipboardItem;
const styles = css`
  :global(.copy-content) {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
  }
`;
