import { Desktop, MobileOrTablet } from '@/components/responsive';
import { MediaInfo, getUrlQueryParams } from '@/core/utils';
import MiddleComponent from './components/middle-content';
import { NavCard } from './components/nav-card';
import { LANG } from '@/core/i18n';

import CommonIcon from '@/components/common-icon';
import { useState } from 'react';
import { MobileDrawer } from '@/components/drawer';

export default function DashboardContainer() {
  const option = getUrlQueryParams('option');
  const shouldRenderRightColumn = option === null;

  return (
    <>
      <div className="account-container">
        <Desktop>
          {shouldRenderRightColumn && (
            <div className="left-column">
              <NavCard />
            </div>
          )}
        </Desktop>
        <div className={`middle-column ${!shouldRenderRightColumn ? 'no-margin' : ''}`}>
          <MiddleComponent />
        </div>
      </div>
      <style jsx>
        {`
          .account-container {
            position: relative;
            display: flex;
            flex-direction: row;
            height: 100%;
            min-height: calc(100vh - 64px);
            @media ${MediaInfo.mobileOrTablet} {
              flex-direction: column;
            }
            .left-column {
              height: auto;
              width: 260px;
              background: var(--fill_bg_1);
              flex-shrink: 0;
            }
            .middle-column {
              width: 100%;
              height: 100%;
              padding: 8px 8px 0;
              overflow-x: hidden;
              overflow-y: auto;
              box-sizing: border-box;
              display: flex ;
              flex-direction: column;
              gap: 8px;
              &.no-margin {
                margin: 0;
              }
              @media ${MediaInfo.mobileOrTablet} {
                margin: 0;
                padding: 8px;
              }
            }
          }
        `}
      </style>
    </>
  );
}
