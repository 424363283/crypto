import { Svg } from '@/components/svg';
import { DropdownSelect } from '@/components/trade-ui/common/dropdown';
import { useRouter, useTheme } from '@/core/hooks';
import { TradeMap } from '@/core/shared';
import { MenuProps } from 'antd';
import { useEffect, useState } from 'react';
import { ORDER_BOOK_TYPES } from '.';

export const DepthConfig = ({
  onChange,
  type,
}: {
  onChange: (value: number | null) => void;
  type: ORDER_BOOK_TYPES;
}) => {
  const [depthConfig, setDepthConfig] = useState<number[]>([]);
  const [text, setText] = useState<string>('');
  const { query } = useRouter();
  const { isDark } = useTheme();
  const id = query.id as string;

  useEffect(() => {
    if (id) {
      (async () => {
        const target = type === ORDER_BOOK_TYPES.SWAP ? await TradeMap.getSwapById(id) : await TradeMap.getSpotById(id);
        if (target) {
          setDepthConfig(target.depthConfig);
          setText(target.depthConfig[0].toString().toFixed());
          onChange(null);
        }
      })();
    }
  }, [id]);

  const items: MenuProps['items'] = depthConfig.map((t: number, i) => {
    return {
      key: i,
      label: <span>{t.toString().toFixed()}</span>,
      onClick: (e: any) => {
        setText(t.toString().toFixed());
        // 第一档不计算
        onChange(i == 0 ? null : t);
      },
    };
  });

  return (
    <>
      {/* <Dropdown menu={{ items }} trigger={['click']} placement='bottomRight' className='swap-deep-conf-dropdown'>
        <span className='text'>
          {text}
          <Svg src='/static/images/common/arrow_down.svg' width={12} height={12} className={'arrow'} />
        </span>
      </Dropdown> */}
      <DropdownSelect
        data={depthConfig}
        onChange={(t, i) => {
          setText(t.toString().toFixed());
          // 第一档不计算
          onChange(i == 0 ? null : t);
        }}
        isActive={(v, index) => v.toString().toFixed() === text}
        formatOptionLabel={(v) => v.toString().toFixed()}
        // overlayClassName={clsx('overlay')}
        trigger={['hover']}
        align={{ offset: [10, 0] }}
        className='swap-deep-conf-dropdown'
      >
        <span className='text'>
          {text}
          <Svg src='/static/images/common/arrow_down.svg' width={12} height={12} className={'arrow'} />
        </span>
      </DropdownSelect>
      <style jsx>{`
        :global(.swap-deep-conf-dropdown) {
          color: var(--theme-trade-text-color-1);
          font-size: 10px;
          cursor: pointer;
          background-color: var(--theme-trade-sub-button-bg);
          padding: 2px 5px;
          padding-right: 19px;
          min-width: 54px;
          height: 20px;
          border-radius: 5px;
          display: flex;
          align-items: center;
          position: relative;
          :global(.arrow) {
            position: absolute;
            top: 4px;
            right: 5px;
          }
        }
        :global(.ant-dropdown .ant-dropdown-menu .ant-dropdown-menu-item) {
          color: var(--theme-trade-text-color-1);
        }
        :global(.swap-deep-conf-dropdown-overlay) > :global(ul) {
          background-color: ${isDark ? ' var(--theme-trade-bg-color-4)' : '#fff'} !important;
        }
      `}</style>
    </>
  );
};
