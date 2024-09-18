import CoinLogo from '@/components/coin-logo';
import CommonIcon from '@/components/common-icon';
import { AlertFunction } from '@/components/modal';
import { Desktop } from '@/components/responsive';
import ProTooltip from '@/components/tooltip';
import { getCommonCurrentAirdropApi } from '@/core/api';
import { useResponsive, useRouter, useTheme } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { MediaInfo, clsx, message } from '@/core/utils';
import Image from 'next/image';
import { useEffect } from 'react';
import css from 'styled-jsx/css';
import { useImmer } from 'use-immer';

const AirDropCard = () => {
  const router = useRouter();
  const [state, setState] = useImmer({
    banner: '',
    coinName: '',
    status: 0, // 1即将进行 2进行中 3已结束
    amount: 0, // 奖励池
    participants: 0, // 参加人数
  });
  const statusText = [LANG('即将进行'), LANG('进行中'), LANG('已结束')];
  const statusClsName = ['coming-soon', 'in-progress', 'over'];
  const { isMobile } = useResponsive();
  const { isDark } = useTheme();
  useEffect(() => {
    const getAirDropTask = async () => {
      const res = await getCommonCurrentAirdropApi();
      if (res.code === 200) {
        const { banner, currency, status, amount, number } = res.data;
        setState((draft) => {
          draft.banner = banner;
          draft.coinName = currency;
          draft.status = status;
          draft.amount = amount;
          draft.participants = number;
        });
      } else {
        message.error(res.message);
      }
    };
    getAirDropTask();
  }, []);
  const { coinName, banner, status, amount, participants } = state;

  const onParticipantClick = () => {
    AlertFunction({
      title: LANG('立即参与'),
      content: <span className='content'>{LANG('请去app的算力中心参与此活动，如未下载app，点击 立即下载')}</span>,
      okText: LANG('立即下载'),
      cancelButtonProps: { hidden: true },
      onOk: () => {
        router.push('/download');
      },
    });
  };

  return (
    <div className='air-drop-card'>
      <div className='pool-item'>
        <div className='head-left'>
          <CoinLogo coin={coinName} alt={coinName} width={36} height={36} />
          <span className='name'>{coinName}</span>
        </div>
        <div className='head-right' onClick={onParticipantClick}>
          <span className='participant'>{LANG('立即参加')}</span>
          <CommonIcon name='common-arrow-right-active-0' size={12} enableSkin />
        </div>
      </div>
      <div className='content-card'>
        <div className='pool-item total-pool'>
          <div className='title-left-area'>
            <span className='title'>{LANG('本期总奖池')}</span>
            <ProTooltip
              placement={isMobile ? 'bottom' : 'bottomRight'}
              trigger={'click'}
              title={
                <div className='content'>
                  <p className='desc'>
                    {LANG(
                      '1. 空投活动基于算力系统决定的，该系统根据用户当期持有的算力值来分配空投奖励。具体公式为：空投奖励数量=用户当期总算力 / 全网当期总算力 x 空投总奖池。'
                    )}
                  </p>
                  <p className='desc'>{LANG('2. 空投总奖池每两个月一期，每期奖池中的奖励不同的热门代币。')}</p>
                  <p className='desc'>
                    {LANG(
                      '3.空投奖励将在当期结束后发放，请用户在当期活动结束后72小时内前往算力中心-空投页面领取，领取后奖励将会发放到用户的个人账户。未在72小时内领取的奖励将会被收回。'
                    )}
                  </p>
                  <p className='desc'>{LANG('4.本活动最终解释权归YMEX所有。')}</p>
                </div>
              }
            >
              <CommonIcon name='common-tooltip-0' size={12} className='tooltip' />
            </ProTooltip>
          </div>
          {!!status && (
            <div className='title-right-area'>
              <span className={clsx('status', statusClsName[status - 1 || 0])}>{statusText[status - 1 || 0]}</span>
            </div>
          )}
        </div>
        <Desktop>
          <div className='banner-area'>
            <Image src={banner} alt='banner' width={244} height={120} />
          </div>
        </Desktop>
        <div className='pool-item'>
          <span className='label'>{LANG('奖励池')}</span>
          <span className='amount'>
            {amount.toFormat()} {coinName}
          </span>
        </div>
        <div className='pool-item'>
          <span className='label'>{LANG('参加人数')}</span>
          <span className='join-number'>
            <Image
              src={
                isDark
                  ? '/static/images/account/dashboard/people-dark.svg'
                  : '/static/images/account/dashboard/people.svg'
              }
              width={14}
              height={14}
              alt='icon'
              className='people-icon'
            />
            {participants}
          </span>
        </div>
      </div>
      <style jsx>{styles}</style>
    </div>
  );
};
export default AirDropCard;
const styles = css`
  .air-drop-card {
    background-color: var(--theme-background-color-2);
    border-radius: 15px;
    width: 285px;
    padding: 7px 20px 22px;
    margin-bottom: 15px;
    @media ${MediaInfo.mobile} {
      width: 100%;
    }
    @media ${MediaInfo.tablet} {
      flex: 1;
      height: 212px;
      margin-right: 12px;
    }

    .pool-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 15px;
      @media ${MediaInfo.tablet} {
        margin-top: 20px;
      }
      .label {
        color: var(--theme-font-color-3);
        font-size: 14px;
      }
      .amount {
        color: var(--skin-color-active);
        font-size: 14px;
        font-weight: 500;
      }
      .join-number {
        color: var(--theme-font-color-1);
        font-size: 14px;
        font-weight: 500;
        :global(.people-icon) {
          margin-right: 6px;
        }
      }
      .head-left {
        display: flex;
        align-items: center;
        .name {
          color: var(--theme-font-color-1);
          font-weight: 700;
          font-size: 16px;
          margin-left: 10px;
        }
      }
      .head-right {
        color: var(--skin-color-active);
        font-size: 12px;
        font-weight: 500;
        cursor: pointer;
        display: flex;
        align-items: center;
        .participant {
          margin-right: 4px;
        }
      }
      .title-left-area {
        flex: 1;
        margin-right: 20px;
        .title {
          color: var(--theme-font-color-1);
          font-weight: 500;
          font-size: 16px;
          margin-right: 8px;
          word-break: break-all;
        }
        :global(.tooltip) {
          cursor: pointer;
        }
      }
      .title-right-area {
        .status {
          width: 100%;
          font-size: 14px;
          padding: 2px 6px;
          border: 1px solid;
          border-radius: 6px;
        }
        .coming-soon {
          color: var(--skin-color-active);
          border-color: var(--skin-color-active);
        }
        .in-progress {
          color: #43bc9c;
          border-color: #43bc9c;
        }
        .over {
          border-color: var(--skin-border-color-1);
          color: var(--theme-font-color-3);
        }
      }
    }
    .total-pool {
      @media ${MediaInfo.tablet} {
        margin-top: 32px;
      }
    }
    .content-card {
      .banner-area {
        margin-top: 15px;
        width: 100%;
        height: 120px;
        :global(img) {
          border-radius: 15px;
          object-fit: cover;
        }
      }
    }
  }
  :global(.airdrop-modal) {
    :global(.basic-content .content) {
      :global(.title) {
        color: var(--theme-font-color-3);
        font-size: 12px;
      }
      :global(.desc) {
        color: var(--theme-font-color-1);
        font-size: 12px;
        margin-top: 10px;
      }
    }
  }
  :global(.alert-modal .ant-modal-content .alert-description) {
    margin-bottom: 20px;
    :global(.content) {
      color: var(--theme-font-color-1);
      :global(.download) {
        color: var(--skin-color-active);
      }
    }
  }
  :global(.pro-tooltip .ant-tooltip-content) {
    :global(.ant-tooltip-inner) {
      padding: 16px;
      background-color: var(--theme-background-color-2-3);
      color: var(--theme-font-color-6);
      font-size: 12px;
    }
    :global(.ant-tooltip-arrow) {
      &:before {
        background-color: var(--theme-background-color-2-3);
      }
    }
  }
`;
