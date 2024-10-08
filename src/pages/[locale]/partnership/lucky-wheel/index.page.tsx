import { UniversalLayout } from '@/components/layouts/universal';
import { getPromoOverviewApi, getPromoPrivateOverviewApi } from '@/core/api';
import { Lang, LANG, renderLangContent } from '@/core/i18n';
import dynamic from 'next/dynamic';
import { CountDown } from '../components/count-down';
import ProgressBox from './components/progress';
import Table from './components/table';
import Wheel from './components/wheel';
import { store } from './store';

// const RuleModal = dynamic(() => import('../components/rule-modal'));

import { modifyImagePath } from '@/components/image/helper';
import { getLuckydrawDetailApi } from '@/core/api';
import { useRequestData, useTheme } from '@/core/hooks';
import { Account } from '@/core/shared';
import { MediaInfo } from '@/core/utils';
import { useMemo } from 'react';
import ScanQrCodeModal, { QRCODE_MODAL_TYPE } from '../components/qrcode-modal';
// import { RULE_MODAL_TYPE } from '../components/rule-modal';

function LuckyWheel(): JSX.Element {
  const isLogin = Account.isLogin;
  const { isBlue, skin } = useTheme();
  const [overview] = useRequestData(isLogin ? getPromoPrivateOverviewApi : getPromoOverviewApi, {
    enableCache: false,
    initData: {
      sumLuckydrawUsers: '0',
      luckydraw: {},
    },
  });
  const [data, fetchData, , detailLoading] = useRequestData(getLuckydrawDetailApi, {
    enableCache: false,
    fetchOnMount: isLogin,
    enableIsLoading: true,
    initData: {
      luckydraw: {},
      reward: {},
      expireTime: 0,
    },
  });

  const prizeValue = useMemo(() => {
    if (data?.luckydraw?.prizeValue) {
      return data?.luckydraw.prizeValue;
    }
    if (overview?.luckydraw?.prizeValue) {
      return overview?.luckydraw.prizeValue;
    }
  }, [overview, data]);

  return (
    <UniversalLayout bgColor='var(--theme-background-color-9)'>
      <div>
        <div className='lucky-wheel-container'>
          <div className='banner'>
            <p className='title'>{LANG('幸运转盘')}</p>
            <p className='descript'>{LANG('活动时间还有')}</p>
            <div className='descript'>
              <CountDown timeStamp={data.state === 1 ? data?.expireTime : 0} />
            </div>
            <p className='descript color-font-grey' style={{ fontSize: '14px' }}>
              {LANG('每邀请1位好友注册且好友完成交易任务后，邀请人必得幸运币')}
            </p>
            <div style={{ fontSize: '12px' }} className='color-font-grey hot'>
              🔥
              {renderLangContent(LANG('已有{n}人参与'), {
                n: overview.sumLuckydrawUsers,
              })}
            </div>
          </div>
          <div className='main-content'>
            <ProgressBox amount={data?.amount} prizeValue={prizeValue} />
            <div className='content-main'>
              <Wheel loading={detailLoading} detail={data} fetchData={fetchData} totalValue={prizeValue || 100} />
              <Table />
            </div>
          </div>
        </div>
        {/* <RuleModal
          onOk={() => (store.ruleModal = false)}
          onCancel={() => (store.ruleModal = false)}
          open={store.ruleModal}
          modalType={RULE_MODAL_TYPE.LUCKY_WHEEL}
        /> */}
        {store.showShareModal && (
          <ScanQrCodeModal
            open={store.showShareModal}
            modalType={QRCODE_MODAL_TYPE.LUCKY_WHEEL}
            onCancel={() => (store.showShareModal = false)}
            bonus={prizeValue || 100}
            shareUrl={data.link}
          />
        )}
      </div>
      <style jsx>{`
        .lucky-wheel-container {
          height: 100%;
          font-family: 'PingFang SC';
          color: var(--spec-font-color-1);

          :global(.text-main) {
            color: var(--skin-main-font-color);
          }
          .banner {
            height: 374px;
            background-image: url(${modifyImagePath('/static/images/partnership/wheel-banner.png', isBlue, skin)});
            background-repeat: no-repeat;
            background-position: center;
            width: 100%;
            background-size: cover;
            color: var(--spec-font-color-1);
            display: flex;
            flex-direction: column;
            align-items: center;
            @media ${MediaInfo.mobile} {
              height: 259px;
            }

            .title {
              font-weight: bold;
              font-size: 50px;
              margin: 30px 0 12px 0;
              @media ${MediaInfo.mobileOrTablet} {
                font-size: 24px;
              }
            }
            .descript {
              font-size: 18px;
              margin-bottom: 12px;
              font-weight: 500;
              text-align: center;
            }
            .color-font-grey {
              color: var(--spec-font-color-2);
            }

            .hot {
              height: 28px;
              line-height: 14px;
              padding: 7px 6px;
              border-radius: 50px;
              border: 1px solid var(--spec-border-level-2);
            }
          }
          .main-content {
            border-top-left-radius: 15px;
            border-top-right-radius: 15px;
            max-width: 1200px;
            min-height: 985px;
            margin: 0 auto;
            margin-top: -105px;
            overflow-x: hidden;
            @media ${MediaInfo.mobile} {
              margin-top: -10px;
            }

            .content-main {
              display: flex;
              @media ${MediaInfo.mobileOrTablet} {
                flex-direction: column;
              }
            }
          }
        }
      `}</style>
    </UniversalLayout>
  );
}

export default Lang.SeoHead(LuckyWheel);
export const getStaticPaths = Lang.getStaticPaths;
export const getStaticProps = Lang.getStaticProps({ key: 'partnership/lucky-wheel' });
