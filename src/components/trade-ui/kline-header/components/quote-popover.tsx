import CommonIcon from '@/components/common-icon';
import { Svg } from '@/components/svg';
import { useTheme } from '@/core/hooks';
import { Group } from '@/core/shared';
import { MediaInfo, isLite } from '@/core/utils';
import { Popover } from 'antd';
import React, { ReactNode, useEffect, useMemo, useState } from 'react';

const QuotePopover = ({ id, content, open = false, trigger = 'hover', onOpenChange }: { id: string, content: ReactNode; open: boolean, trigger?: any, onOpenChange?: (value:boolean) => void }) => {
  const [quoteId, setQuoteId] = useState(id);
  const { isDark } = useTheme();
  useEffect(() => {
    (async () => {
      const group = await Group.getInstance();
      if (isLite(id)) {
        setQuoteId(id?.replace('USDT', ''));
        // setQuoteId(group.getLiteQuoteCode(id));
      } else {
        setQuoteId(id);
      }
    })();
  }, [id]);

  return (
    <Popover
      overlayInnerStyle={{
        padding: 0,
        marginTop: 8,
        marginLeft: 24,
        borderRadius: '24px',
        backgroundColor: 'var(--dropdown-select-bg-color)',
        boxShadow: '0px 4px 16px 0px var(--dropdown-select-shadow-color)'
      }}
      onOpenChange={onOpenChange}
      trigger={trigger}
      placement='bottom'
      arrow={false}
      open={open}
      content={
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            minWidth: 340,
            width: 'auto',
            height: 414,
          }}
        >
          {content}
        </div>
      }
      align={{
        offset: [0, 2],
      }}
    >
      <div className='coin-name-wrap'>
        <CommonIcon name='common-collapse-mobile' className='icon' size={24} />
        <div className='coin-name'>
          <h1 className='id'>{name ? name?.replace('_', '/') : quoteId?.replace('_', '/')}</h1>
        </div>
        <CommonIcon name='common-tiny-triangle-down' size={10} />
      </div>
      <style jsx>{`
        .coin-name-wrap {
          display: flex;
          position: relative;
          align-items: center;
          cursor: pointer;
          :global(>:not(:last-child)) {
            margin-right: 8px;
          }
          .coin-name {
            display: flex;
            flex-direction: column;
            position: relative;
            .id {
              font-size: 20px;
              font-weight: 700;
              color: var(--text-primary);
            }
            .text {
              font-size: 12px;
              color: var(--text-secondary);
            }
          }
        }
      `}</style>
    </Popover>
  );
};

export default React.memo(QuotePopover);
