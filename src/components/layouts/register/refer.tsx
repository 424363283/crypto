import Image from '@/components/image';
import { Desktop, Mobile, MobileOrTablet } from '@/components/responsive';
import { LANG } from '@/core/i18n';
import { MediaInfo } from '@/core/utils/src/media-info';
import dayjs from 'dayjs';
import { useEffect, useRef } from 'react';
import { useImmer } from 'use-immer';

export const Refer = ({ info }: any) => {
  const ref = useRef<any>(null);
  const { activeTime = 0, expireTime = 0, title = '', notes = [], rules = [] } = info?.note || {};
  const [state, setState] = useImmer({
    DD: '00',
    HH: '00',
    MM: '00',
    SS: '00',
    showDate: false,
  });

  useEffect(() => {
    return () => {
      ref.current && clearTimeout(ref.current);
    };
  }, []);
  useEffect(() => {
    countdown(expireTime);
  }, [expireTime]);

  const countdown = (targetDate: number) => {
    const now = new Date().getTime();
    const difference = targetDate - now;
    if (difference <= 0) {
      setState((draft) => {
        draft.DD = '00';
        draft.HH = '00';
        draft.MM = '00';
        draft.SS = '00';
        draft.showDate = false;
      });
      ref.current && clearTimeout(ref.current);
      return;
    }
    setState((draft) => {
      draft.showDate = true;
    });
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);
    setState((draft) => {
      draft.DD = formatDate(days);
      draft.HH = formatDate(hours);
      draft.MM = formatDate(minutes);
      draft.SS = formatDate(seconds);
    });
    ref.current = setTimeout(() => {
      countdown(targetDate);
    }, 1000);
  };

  const formatDate = (data: number) => {
    return String(data).length < 2 ? '0' + data : String(data);
  };
  return (
    <>
      <div className='refer'>
        <Mobile>
          {state.showDate && (
            <div className='refer-date'>
              {LANG('Event Ends in')}&nbsp;{state.DD}D&nbsp;:&nbsp;{state.HH}H&nbsp;:&nbsp;{state.MM}M&nbsp;:&nbsp;
              {state.SS}S
            </div>
          )}
        </Mobile>
        <div id='refer-box' className='box-base box-1'>
          <Image
            src={info?.avatar ? info?.avatar : '/static/images/account/user.png'}
            alt='avatar'
            width={66}
            height={66}
            style={{
              borderRadius: '50%',
              overflow: 'hidden',
              border: '2px solid var(--skin-color-active)',
              flexShrink: 0,
            }}
          />
          <div className='name-info'>
            <p>
              <span>{info?.username}</span>
              <span>
                {LANG('Referral Code')}: {info?.ru}
              </span>
            </p>
            <p>
              {LANG('活动期间，只有使用【{name}】推荐链接或推荐码注册的用户才有资格获得奖金', { name: info?.username })}
            </p>
          </div>
        </div>
        {state.showDate && (
          <>
            <div style={{ height: 24 }}></div>
            <div className='box-base box-5'>
              <div className='box-title'>{title}</div>
              <div className='content'>
                <div className='box'>
                  <div className='b-title'>{LANG('Event Ends in')}</div>
                  <div className='date'>
                    <div className='item'>
                      <div>{state.DD}</div>
                      <div>D</div>
                    </div>
                    <div className='symbol'>
                      <div>:</div>
                      <div></div>
                    </div>
                    <div className='item'>
                      <div>{state.HH}</div>
                      <div>H</div>
                    </div>
                    <div className='symbol'>
                      <div>:</div>
                      <div></div>
                    </div>
                    <div className='item'>
                      <div>{state.MM}</div>
                      <div>M</div>
                    </div>
                    <div className='symbol'>
                      <div>:</div>
                      <div></div>
                    </div>
                    <div className='item'>
                      <div>{state.SS}</div>
                      <div>S</div>
                    </div>
                  </div>
                  <div className='time'>
                    {LANG('Event period')}: {dayjs(activeTime).format('YYYY-MM-DD HH:mm:ss')}&nbsp;-&nbsp;
                    {dayjs(expireTime).format('YYYY-MM-DD HH:mm:ss')}
                  </div>
                </div>
                <Image src={'/static/images/register/box.png'} width='150' height='150' enableSkin />
              </div>
            </div>
          </>
        )}
        {!!rules?.length && state.showDate && (
          <>
            <div style={{ height: 24 }}></div>
            <div className='box-base'>
              <div className='title'>
                <span>{LANG('活动规则')}</span>
              </div>
              <div className='box-list'>
                {rules.map((item: any, key: number) => {
                  return (
                    <div key={key}>
                      {key + 1}.{item}
                    </div>
                  );
                })}
              </div>
              <div className='title'>
                <span>{LANG('活动须知')}</span>
              </div>
              <div className='box-list'>
                {notes.map((item: any, key: number) => {
                  return (
                    <div key={key}>
                      {key + 1}.{item}
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}

        <div style={{ height: 24 }}></div>
        <div className='box-base box-3'>
          <div className='title'>
            <span>{LANG('Up to $8000+ Deposit Rewards')}</span>
            <span>{LANG('Earn more when you deposit and trade!')}</span>
          </div>
          <div className='list'>
            <div>
              <Desktop forceInitRender={false}>
                <Image
                  className='b-img'
                  src='/static/images/register/1.png'
                  width={40}
                  height={23}
                  alt='Deposit ＄3,000 & rade ≥＄10k'
                  enableSkin
                />
              </Desktop>
              <MobileOrTablet forceInitRender={false}>
                <Image
                  className='b-img'
                  src='/static/images/register/11.png'
                  height={40}
                  width={23}
                  alt='Deposit ＄3,000 & rade ≥＄10k'
                  enableSkin
                />
              </MobileOrTablet>
              <div>
                <span className='price'>$40</span>
                <span className='text'>{LANG('Deposit ＄3,000 & rade ≥＄10k')}</span>
              </div>
            </div>
            <div>
              <Desktop forceInitRender={false}>
                <Image
                  className='b-img'
                  src='/static/images/register/2.png'
                  width={40}
                  height={32}
                  alt='Deposit ＄10k & Trade ＄50k'
                  enableSkin
                />
              </Desktop>
              <MobileOrTablet forceInitRender={false}>
                <Image
                  className='b-img'
                  src='/static/images/register/22.png'
                  height={40}
                  width={32}
                  alt='Deposit ＄3,000 & rade ≥＄10k'
                  enableSkin
                />
              </MobileOrTablet>
              <div>
                <span className='price'>$90</span>
                <span className='text'>{LANG('Deposit ＄10k & Trade ＄50k')}</span>
              </div>
            </div>
            <div>
              <Desktop forceInitRender={false}>
                <Image
                  className='b-img'
                  src='/static/images/register/3.png'
                  width={40}
                  height={80}
                  alt='Deposit ＄50k & Trade ≥＄3m'
                  enableSkin
                />
              </Desktop>
              <MobileOrTablet forceInitRender={false}>
                <Image
                  className='b-img'
                  src='/static/images/register/33.png'
                  height={40}
                  width={80}
                  alt='Deposit ＄50k & Trade ≥＄3m'
                  enableSkin
                />
              </MobileOrTablet>
              <div>
                <span className='price'>$1290</span>
                <span className='text'>{LANG('Deposit ＄50k & Trade ≥＄3m')}</span>
              </div>
            </div>
            <div>
              <Desktop forceInitRender={false}>
                <Image
                  className='b-img'
                  src='/static/images/register/4.png'
                  width={40}
                  height={160}
                  alt='Deposit ＄100k & Trade ≥＄10m'
                  enableSkin
                />
              </Desktop>
              <MobileOrTablet forceInitRender={false}>
                <Image
                  className='b-img'
                  src='/static/images/register/44.png'
                  height={40}
                  width={150}
                  alt='Deposit ＄100k & Trade ≥＄10m'
                  enableSkin
                />
              </MobileOrTablet>
              <div>
                <span className='price'>$2790</span>
                <span className='text'>{LANG('Deposit ＄100k & Trade ≥＄10m')}</span>
              </div>
            </div>
          </div>
        </div>
        <div style={{ height: 24 }}></div>
        <div className='box-base box-4'>
          <div className='title'>
            <span>{LANG('Top cryptocurrency exchanges')}</span>
          </div>
          <div className='b5'>
            <div>
              <span>500K+</span>
              <span>{LANG('Global Users')}</span>
            </div>
            <div>
              <span>500+</span>
              <span>{LANG('Spot Assets')}</span>
            </div>
            <div>
              <span>200+</span>
              <span>{LANG('Derivatives Contracts')}</span>
            </div>
          </div>
          <div className='b2'>{LANG('无KYC交易')}</div>
          <div className='border'></div>
          <div className='b2'>{LANG('永续合约：高达200倍杠杆')}</div>
          <div className='border'></div>
          <div className='b2'>{LANG('合约子钱包: 避免交易风险')}</div>
          <div className='border'></div>
          <div className='b2'>{LANG('YMEX Point Center: Get super airdrops, by holding YMEX Points')}</div>
          <Image className='b3' src='/static/images/register/2888.png' width={580} height={180} alt='2888' />
          <div className='b4'>
            <span>{LANG('XK拥有最后的解释权利，任何不正常的套利或是行为都将取消优惠')}</span>
            <span>{LANG('基于每个不同国家用户，会有不同的优惠活动，敬请注意')}</span>
          </div>
        </div>
        <div style={{ height: 24 }}></div>
      </div>
      <style jsx>{`
        .refer {
          .refer-date {
            background: rgba(var(--skin-primary-color-rgb), 0.15);
            color: var(--skin-primary-color);
            font-size: 14px;
            font-weight: 400;
            line-height: 32px;
            text-align: center;
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            z-index: 1;
          }
          .box-base {
            border-radius: 12px;
            background-color: var(--theme-background-color-2);
            padding: 32px 40px;
            .title {
              display: flex;
              flex-direction: column;
              span {
                display: flex;
                align-items: flex-start;
                gap: 10px;
                color: var(--theme-font-color-1);
                font-size: 24px;
                font-weight: 600;
                &:nth-child(1) {
                  &::before {
                    content: '';
                    display: inline-block;
                    width: 6px;
                    height: 24px;
                    background: var(--skin-primary-color);
                    margin-top: 4px;
                  }
                }
              }
            }
            .box-list {
              padding: 24px 0;
              font-size: 14px;
              line-height: 1.5;
              display: flex;
              flex-direction: column;
              gap: 12px;
              color: var(--theme-font-color-1);
            }
          }
          .box-5 {
            color: var(--theme-font-color-3);
            .box-title {
              font-size: 24px;
              font-weight: 600;
              color: var(--skin-color-active);
            }
            .content {
              display: flex;
              align-items: center;
              justify-content: space-between;
              gap: 30px;
              :global(img) {
                display: none;
              }
              .b-title {
                font-size: 16px;
                font-weight: 600;
                padding: 12px 0 10px;
              }
              .date {
                display: flex;
                align-items: center;
                .item {
                  div:nth-child(1) {
                    background: rgba(var(--skin-primary-color-rgb), 0.15);
                    border-radius: 4px;
                  }
                }
                & > div {
                  div {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 44px;
                    height: 44px;

                    &:nth-child(1) {
                      font-size: 24px;
                      font-weight: 800;
                      color: var(--skin-primary-color);
                    }
                    &:nth-child(2) {
                      height: 30px;
                      font-size: 14px;
                      font-weight: 600;
                    }
                  }
                }
              }
              .time {
                font-size: 14px;
                font-weight: 400;
              }
            }
          }
          .box-1 {
            height: 114px;
            display: flex;
            align-items: center;
            .name-info {
              margin-left: 16px;
              p:nth-child(1) {
                display: flex;
                align-items: baseline;
                span:nth-child(1) {
                  font-family: Inter;
                  font-size: 24px;
                  font-weight: 600;
                  color: var(--theme-font-color-1);
                }
                span:nth-child(2) {
                  font-size: 16px;
                  font-weight: 600;
                  color: var(--skin-color-active);
                  margin-left: 8px;
                }
              }
              p:nth-child(2) {
                color: var(--theme-font-color-2);
                font-size: 14px;
                font-weight: 400;
                padding-top: 10px;
              }
            }
          }
          .box-2 {
            display: flex;
            flex-direction: column;

            .content {
              flex: 1;
              display: flex;
              justify-content: space-between;
              align-items: center;

              .list {
                flex: 1;

                .list-title {
                  color: var(--skin-color-active);
                  display: flex;
                  align-items: center;
                  font-size: 14px;
                  font-weight: 600;
                  margin-bottom: 12px;
                  > div {
                    background: rgba(var(--color-active-rgb), 0.2);
                    padding: 8px;
                    border-radius: 6px;
                  }
                }
                .item-wrap {
                  flex: 1;
                  .item {
                    display: flex;
                    align-items: center;
                    margin-bottom: 6px;
                    span {
                      padding-left: 8px;
                      color: var(--theme-font-color-1);
                      font-size: 14px;
                      font-weight: 400;
                    }
                  }
                }
              }
            }
          }
          .box-3 {
            height: 382px;
            display: flex;
            flex-direction: column;
            .title {
              display: flex;
              flex-direction: column;
              span:nth-child(1) {
                color: var(--theme-font-color-1);
                font-size: 24px;
                font-weight: 600;
              }
              span:nth-child(2) {
                color: var(--theme-font-color-2);
                font-size: 14px;
                font-weight: 400;
                padding-left: 16px;
              }
            }
            .list {
              display: flex;
              justify-content: space-between;
              flex: 1;
              align-items: flex-end;
              > div {
                display: flex;
                justify-content: center;
                flex-direction: column;
                align-items: center;
                width: 116px;
                > div {
                  display: flex;
                  justify-content: center;
                  flex-direction: column;
                  align-items: center;
                  .price {
                    color: var(--theme-font-color-1);
                    font-size: 24px;
                    font-weight: 600;
                  }
                  .text {
                    text-align: center;
                    color: var(--theme-font-color-2);
                    font-size: 14px;
                    font-weight: 400;
                  }
                }
              }
            }
          }
          .box-4 {
            display: flex;
            flex-direction: column;
            .b1 {
              color: var(--theme-font-color-1);
              font-size: 24px;
              font-weight: 600;
            }
            .b5 {
              margin-top: 45px;
              display: flex;
              justify-content: space-between;
              padding-bottom: 70px;
              > div {
                display: flex;
                flex-direction: column;
                flex: 1;
                span:nth-child(1) {
                  font-weight: 700;
                  color: var(--skin-color-active);
                  font-size: 36px;
                }
                span:nth-child(2) {
                  color: var(--theme-font-color-1);
                  font-weight: 400;
                  font-size: 16px;
                }
              }
            }
            .border {
              height: 1px;
              background: var(--skin-border-color-1);
              margin: 30px 0;
            }
            .b2 {
              font-size: 24px;
              font-weight: 500;
              color: var(--theme-font-color-1);
            }
            :global(.b3) {
              margin-top: 70px;
              width: 100%;
            }
            .b4 {
              margin-top: 24px;
              font-size: 14px;
              font-weight: 400;
              color: var(--theme-font-color-2);
              display: flex;
              flex-direction: column;
            }
          }
        }

        @media ${MediaInfo.desktop} {
          .refer {
            width: 660px;
            .box-5 {
              .content {
                :global(img) {
                  display: inline-block;
                }
              }
            }
          }
        }
        @media ${MediaInfo.tablet} {
          .refer {
            width: 464px;
            margin-top: 20px;
            .box-base {
              padding: 32px 30px;
            }
            .box-2 {
              .content {
                .list {
                  margin-left: 0;
                }
              }
            }
            .box-4 {
              :global(.b3) {
                height: 123px;
              }
            }
            .box-3 {
              .list {
                flex-direction: column;
                margin-top: 24px;
                > div {
                  width: 100%;
                  display: flex;
                  flex-direction: row;
                  justify-content: flex-start;
                  > div {
                    align-items: flex-start;
                    margin-left: 12px;
                    .text {
                      text-align: left;
                    }
                  }
                }
              }
            }
          }
        }
        @media ${MediaInfo.mobile} {
          .refer {
            width: 100%;
            border-top: 20px solid var(--theme-background-color-8);
            padding-top: 10px;
            .box-base {
              padding: 0 16px;
            }
            .box-1 {
              height: 99px;
              :global(img) {
                width: 76px;
                height: auto;
              }
              .name-info {
                margin-left: 18px;
                p:nth-child(1) {
                  flex-direction: column;
                  span:nth-child(2) {
                    margin-left: 0;
                  }
                }
                p:nth-child(2) {
                  font-size: 12px;
                }
              }
            }
            .box-2 {
              .content {
                .list {
                  margin-left: 0;
                  .item span {
                    font-size: 12px !important;
                  }
                }
              }
            }
            .box-3 {
              .title {
                span:nth-child(2) {
                  font-size: 12px !important;
                }
              }
              .list {
                flex-direction: column;
                margin-top: 24px;
                > div {
                  width: 100%;
                  display: flex;
                  flex-direction: row;
                  justify-content: flex-start;
                  > div {
                    align-items: flex-start;
                    margin-left: 12px;
                    .text {
                      text-align: left;
                      font-size: 12px;
                    }
                  }
                }
              }
            }
            .box-4 {
              padding-top: 0;
              padding-bottom: 0;
              padding-left: 16px;
              padding-right: 16px;
              :global(.b3) {
                height: 106px;
                margin-top: 24px;
              }
              .b2 {
                font-size: 18px;
              }
              .b4 {
                font-size: 12px;
              }
              .b5 {
                padding-bottom: 48px;
                > div {
                  span:nth-child(1) {
                    font-size: 24px;
                  }
                  span:nth-child(2) {
                    font-size: 12px;
                    white-space: nowrap;
                  }
                }
              }
            }
          }
        }
      `}</style>
    </>
  );
};
