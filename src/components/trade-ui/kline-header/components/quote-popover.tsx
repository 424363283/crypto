import { Svg } from '@/components/svg';
import { useTheme } from '@/core/hooks';
import { MediaInfo } from '@/core/utils';
import { Popover } from 'antd';
import React, { ReactNode, useState } from 'react';

const QuotePopover = ({ content, trigger = 'hover' }: { content: ReactNode; trigger?: any }) => {
  const [open, setOpen] = useState(false);
  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
  };
  const { isDark } = useTheme();

  return (
    <Popover
      overlayInnerStyle={{
        backgroundColor: 'var(--theme-background-color-1)',
        padding: 0,
        marginTop: 26,
        marginLeft: 5,
        border: '1px solid var(--theme-trade-border-color-1)',
      }}
      onOpenChange={handleOpenChange}
      trigger={trigger}
      placement='bottom'
      arrow={false}
      open={open}
      content={
        <div
          style={{
            width: 350,
            height: 420,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {content}
        </div>
      }
      align={{
        offset: [0, 2],
      }}
    >
      <Svg
        src={
          isDark
            ? '/static/images/trade/header/collapse-mobile.svg'
            : '/static/images/trade/header/collapse-mobile-light.svg'
        }
        width={16}
        height={13}
        className='collapse_icon'
      />
      <style jsx>{`
        :global(.arrow_down_icon),
        :global(.collapse_icon) {
          cursor: pointer;
        }
        :global(.collapse_icon) {
          margin-left: 18px;
        }
        @media ${MediaInfo.tablet} {
          :global(.collapse_icon) {
            margin-left: 13px;
          }
        }
      `}</style>
    </Popover>
  );
};

export default React.memo(QuotePopover);
