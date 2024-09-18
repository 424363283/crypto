import CommonIcon from '@/components/common-icon';
import { getZendeskLink } from '@/components/zendesk';
import { LANG } from '@/core/i18n';

export const WhatIsTrack = () => {
  return (
    <>
      <div className='what-is-track' onClick={() => window.open(getZendeskLink('/articles/6951123628943'))}>
        {LANG('什么是追踪出场？')}
        <CommonIcon name='common-arrow-down-0' size={12} />
      </div>
      <style jsx>{`
        .what-is-track {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          cursor: pointer;
          color: var(--theme-trade-text-color-3);
          font-size: 14px;
          margin-bottom: 15px;
        }
      `}</style>
    </>
  );
};
