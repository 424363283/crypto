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
            background-color: var(--fill_bg_1);
            @media ${MediaInfo.mobileOrTablet} {
              flex-direction: column;
              background: var(--fill_3);
            }
            .left-column {
              z-index: 1;
              height: 100%;
              width: 308px;
              position: sticky;
              top: 56px;
              border-left: 2px solid var(--theme-border-left);
            }
            .middle-column {
              width: 100%;
              height: 100%;
              padding: 8px;
              overflow-x: hidden;
              overflow-y: auto;
              &.no-margin {
                margin: 0;
              }
              @media ${MediaInfo.mobileOrTablet} {
                margin: 0;
              }
              @media ${MediaInfo.mobile} {
                padding: 0;
              }
            }
          }
        `}
      </style>
    </>
  );
}
