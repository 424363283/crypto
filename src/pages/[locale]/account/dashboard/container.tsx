import { Desktop, MobileOrTablet } from '@/components/responsive';
import { MediaInfo, getUrlQueryParams } from '@/core/utils';
import AirDropCard from './components/air-drop-card';
import AvatarCard from './components/avatar-card';
import MiddleComponent from './components/middle-content';
import { NavCard } from './components/nav-card';
import { RightColumnRewards } from './components/rewards';
import { MobileNav } from './media/mobile-nav';

export default function DashboardContainer() {
  const type = getUrlQueryParams('type');
  const shouldRenderRightColumn = type === 'overview' || !type;
  return (
    <>
      <div className='account-container'>
        <MobileOrTablet>
          <AvatarCard />
        </MobileOrTablet>
        <Desktop>
          <div className='left-column'>
            <div className='top-banner'>
              <AvatarCard />
            </div>
            <div className='bottom'>
              <NavCard />
            </div>
          </div>
        </Desktop>
        <div className='middle-column'>
          <MobileOrTablet>
            <MobileNav />
          </MobileOrTablet>
          <Desktop>
            <MiddleComponent />
          </Desktop>
          <MobileOrTablet>
            <div className='main-content'>
              <MiddleComponent />
            </div>
          </MobileOrTablet>
        </div>
        {shouldRenderRightColumn && (
          <div className='right-column'>
            <AirDropCard />
            <RightColumnRewards />
          </div>
        )}
      </div>
      <style jsx>
        {`
          .account-container {
            overflow-y: scroll;
            position: relative;
            display: flex;
            flex-direction: row;
            height: 100%;
            min-height: calc(100vh - 64px);
            background-color: var(--theme-background-color-5);
            @media ${MediaInfo.mobileOrTablet} {
              flex-direction: column;
            }
            .left-column {
              height: 100%;
              width: 258px;
              .top-banner {
                padding: 20px;
                height: 246px;
                width: 100vw;
                background-color: var(--theme-secondary-bg-color);
              }
              .bottom {
                height: 100%;
                width: 100vw;
              }
            }
            .middle-column {
              width: 100%;
              height: 100%;
              padding-top: 18px;
              @media ${MediaInfo.desktop} {
                margin-right: 20px;
              }
              .main-content {
                @media ${MediaInfo.tablet} {
                  padding: 20px 20px 0 20px;
                }
                @media ${MediaInfo.mobile} {
                  padding: 10px;
                }
              }
            }

            .right-column {
              flex: 1;
              margin-top: 20px;
              @media ${MediaInfo.desktop} {
                margin-top: 18px;
              }
              @media ${MediaInfo.mobile} {
                margin: 0 10px 10px;
              }
              @media ${MediaInfo.tablet} {
                display: flex;
                margin-left: 20px;
              }
              margin-right: 22px;
              margin-bottom: 23px;
            }
          }
        `}
      </style>
    </>
  );
}
