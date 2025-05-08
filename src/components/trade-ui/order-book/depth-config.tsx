import { Svg } from '@/components/svg';
import { DropdownSelect } from '@/components/trade-ui/common/dropdown';
import { useRouter, useTheme } from '@/core/hooks';
import { TradeMap } from '@/core/shared';
import { MenuProps } from 'antd';
import { useEffect, useState } from 'react';
import { ORDER_BOOK_TYPES } from '.';
import { MediaInfo } from '@/core/utils';

export const DepthConfig = ({
  onChange,
  type
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
      }
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
        visible={true}
        data={depthConfig}
        onChange={(t, i) => {
          setText(t.toString().toFixed());
          // 第一档不计算
          onChange(i == 0 ? null : t);
        }}
        isActive={(v, index) => v.toString().toFixed() === text}
        formatOptionLabel={v => v.toString().toFixed()}
        overlayClassName="overlay"
        trigger={['click']}
        align={{ offset: [10, 0] }}
        className="swap-deep-conf-dropdown"
      >
        <span className="text">
          {text}
          <Svg src="/static/images/new_common/arrow_down.svg" width={10} height={10} className={'arrow'} />
        </span>
      </DropdownSelect>
      <style jsx>{`
        :global(.swap-deep-conf-dropdown) {
          display: flex;
          min-width: 80px;
          height: 24px;
          padding: 0px 8px;
          justify-content: space-between;
          align-items: center;
          border-radius: 4px;
          background: var(--fill_3, #26262b);
          position: relative;
          color: var(--text_1);
          :global(.arrow) {
            /* position: absolute;
            top: 50%;
            right: 5px;
            transform: translateY(-50%); */
            svg {
              path {
                fill: var(--text_1);
              }
            }
          }
          @media ${MediaInfo.mobile} {
            font-size: 12px;
            height: 1.5rem;
          }
        }
        :global(.ant-dropdown .ant-dropdown-menu .ant-dropdown-menu-item) {
          color: var(--theme-trade-text-color-1);
        }
        :global(.ant-dropdown.overlay .menus) {
          right: 10px !important;
        }
      `}</style>
    </>
  );
};
