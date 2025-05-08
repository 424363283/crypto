import { LANG } from '@/core/i18n';
import { SUBSCRIBE_TYPES, useWs } from '@/core/network';
import { DetailMap } from '@/core/shared';
import { formatDefaultText } from '@/core/utils';
import { Tooltip } from 'antd';
import { useState } from 'react';

export const EtfNetVal = () => {
  const [data, setData] = useState<DetailMap>();

  useWs(SUBSCRIBE_TYPES.ws4001, (data) => setData(data));

  return (
    <>
      <div className='etfnetval'>
        <Tooltip
          align={{
            offset: [-110, 10],
          }}
          overlayClassName='tooltip-wrapper'
          placement='bottom'
          title={LANG('成交价格与净值偏离过大时，请谨慎交易')}
          arrow={false}
        >
          <span className='dash'>{`${LANG('净值')} `}</span>
        </Tooltip>
        {formatDefaultText(data?.netValue)}
      </div>
      <style jsx>{`
        .etfnetval {
          padding-right: 12px;
          color: var(--theme-trade-text-color-1);
          .dash {
            border-bottom: 1px dashed;
          }
        }
        :global(.tooltip-wrapper) {
          :global(.ant-tooltip-inner) {
            background: var(--fill_bg_1);
            color: var(--theme-trade-text-color-1);
            padding: 15px;
            width: 290px;
            white-space: normal;
            text-align: center;
          }
        }
      `}</style>
    </>
  );
};
