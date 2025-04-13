import CommonIcon from '@/components/common-icon';
import css from 'styled-jsx/css';
import { LANG } from '@/core/i18n';
import { useRouter, useTheme, useKycState, useResponsive } from '@/core/hooks';
import { SENCE } from '@/core/shared';
import { useEffect, useState } from 'react';
import { useLoginUser } from '@/core/store';
import { Svg } from '@/components/svg';
import { Button } from '@/components/button';
import { Size } from '@/components/constants';
import { MediaInfo } from '@/core/utils';
import YIcon from '@/components/YIcons';


interface GuideProps {
  showCardPop:() => void;
  kycState:any;
}


const Guide = (props:GuideProps) => {
  const kycState = props?.kycState
  const { kyc,last } = kycState;
  const [step, setStep] = useState(1);
  const router = useRouter();
  const { user } = useLoginUser();
  const { isDark } = useTheme();
  const kycString = [LANG('去认证'), LANG('审核中'), LANG('认证失败'), LANG('认证成功')];
  const { isMobile } = useResponsive();

  const onIdCardClick = (evt: any) => {
    evt.preventDefault();
    evt.stopPropagation();
    props?.showCardPop()
  };


  useEffect(() => {
    const { bindGoogle } = user || {};
    if (kyc < 3) {
      return setStep(2);
    } else if (bindGoogle) {
      return setStep(4);
    } else {
      setStep(3);
    }
  }, [user, kyc]);

  //绑定google
  const bindGoogle = () => {
    router.push({
      pathname: '/account/dashboard',
      query: {
        type: 'security-setting',
        option: 'google-verify'
      },
      state: {
        sence: SENCE.BIND_GA
      }
    });
  };

  const depositCoin = () => {
    router.push({
      pathname: '/account/fund-management/asset-account/recharge'
    });
  };

  return (
    <>
      <div className="guide-box">
        <div className="title">{LANG('账户流程')}</div>
        <div className="step-box">
          <div className={`stepContainer stepOne ${isDark ? 'isDark' : ''}`}>
            <div className='stepWrap'>
              <CommonIcon size={16} className="" name="common-done-0" />
              <span>1.{LANG('注册')}</span>
            </div>
          </div>
          <div className={`stepContainer stepTwo  ${isDark ? 'isDark' : ''} ${step == 2 ? 'active' : ''} ${step < 2 ? 'gray' : ''}`}>
            <div className='stepWrap'>
              {step > 2 && <CommonIcon size={16} className="" name="common-done-0" />}
              <span>2.{LANG('KYC认证')}</span>
            </div>
          </div>
          <div className={`stepContainer stepTwo  ${isDark ? 'isDark' : ''} ${step == 3 ? 'active' : ''} ${step < 3 ? 'gray' : ''}`}>
            <div className='stepWrap'>
              {step > 3 && <CommonIcon size={16} className="" name="common-done-0" />}
              <span>3.{LANG('身份验证器')}</span>
            </div>
          </div>
          <div className={`stepContainer stepThree ${isDark ? 'isDark' : ''} ${step == 4 ? 'active' : ''} ${step < 4 ? 'gray' : ''}`}>
            {/* <CommonIcon size={14} className='' name='common-done-0' /> */}
            <div className='stepWrap'>
              <span>4.{LANG('充币')}</span>
            </div>
          </div>
        </div>
        <div className="step-detail-box">
          {step == 2 && (
            <div className="box">
              <div className="title">{LANG('认证要求')}</div>
              <div className="requirement">
                <div className="requirement-item">
                  <div className="desc">
                    {LANG('仅需 1 分钟，完成实名认证，即刻解锁 YMEX 的充值、提现和交易等全方位服务。')}
                  </div>

                  {!isMobile ?
                    <div className="btn">
                      <div className="kyc-status">
                        <div className="kyc-status-icon">
                         
                          {kyc == 2 ? <YIcon.errorIcon /> : null}
                          {kyc == 2 ? kycString[kyc] || '--' : ''}
                        </div>
                      </div>
                      {kyc == 0 || kyc == 2 ? (
                        <Button type="primary" size={Size.SM} rounded onClick={onIdCardClick}>
                          {LANG(kyc == 2 ? '重新认证' : '去认证')}
                        </Button>
                      ) : null}
                    </div>
                    :""
                  }
                </div>
                <div className="requirement-item">
                  <div className="requirement-kyc">
                    {LANG('LV1认证要求')}:
                    <div className='requirement-condition-list'>
                    <div className="requirement-condition">
                      <YIcon.worldIcon />
                      {LANG('国家地区')}
                    </div>
                    <div className="requirement-condition">
                      <YIcon.userIcon /> {LANG('真实姓名')}
                    </div>
                    </div>
                  </div>
                </div>
              </div>
              <div>
              {isMobile ?
                    <div className="btn">
                      <div className="kyc-status">
                        <div className="kyc-status-icon">
                          {kyc == 2 ? <YIcon.errorIcon /> : null}
                          {kyc == 2 ? kycString[kyc] || '--' : ''}
                        </div>
                      </div>
                      {kyc == 0 || kyc == 2 ? (
                        <Button type="primary" size={Size.SM} rounded onClick={onIdCardClick}>
                          {LANG(kyc == 2 ? '重新认证' : '去认证')}
                        </Button>
                      ) : null}
                    </div>
                    :""
                  }
              </div>
            </div>
          )}
          {step == 3 && (
            <div className="box">
              <div className="title">{LANG('验证器')}</div>
              <div className="detail-box">
                <div className="detail">
                  <div className="icon">
                    <Svg
                      src={`/static/icons/primary/common/ga.svg`}
                      width={isMobile ? 30 : 20}
                      height={isMobile ? 30 : 20}
                      color={'var(--text-primary)'}
                    />
                  </div>
                  <div className="des">
                    <div>{LANG('谷歌验证')}</div>
                    <span>{LANG('用于登录、提币、找回密码、修改安全设置、管理API时进行安全验证。')}</span>
                  </div>
                </div>
                <div className="btn">
                  <Button type="primary" size={Size.SM} rounded onClick={() => bindGoogle()}>
                    {LANG('去绑定')}
                  </Button>
                </div>
              </div>
            </div>
          )}
          {step == 4 && (
            <div className="box">
              <div className="title">{LANG('充值方式')}</div>
              <div className="detail-box">
                <div className="detail">
                  <div className="icon">
                    <Svg
                      src={`/static/icons/primary/common/deposit-coin.svg`}
                      width={isMobile ? 30 : 20}
                      height={isMobile ? 30 : 20}
                      color={'var(--text-primary)'}
                    />
                  </div>
                  <div className="des">
                    <div>{LANG('链上充币')}</div>
                    <span>{LANG('如果您在其他平台已经有数字货币，可以直接充值到YMEX。')}</span>
                  </div>
                </div>
                <div className="btn">
                  <Button type="primary" size={Size.SM} rounded onClick={() => depositCoin()}>
                    {LANG('充币')}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <style jsx>{guideStyle}</style>
    </>
  );
};

const guideStyle = css`
  .guide-box {
    flex: 1;
    display: flex;
    flex-direction: column;
    border: 1px solid var(--fill-3);
    border-radius: 8px;
    padding: 20px;
    background-color: var(--bg-1);
    @media ${MediaInfo.mobileOrTablet} {
      padding: 10px;
    }
    .title {
      font-size: 16px;
      font-weight: 600;
      color: var(--text-primary);
    }
    .step-box {
      display: flex;
      margin: 20px 0;
      .stepContainer {
        position: relative;
        flex: 1;
        height: 80px;
        margin-right: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        @media ${MediaInfo.mobileOrTablet} {
          height: 50px;
        }
        &.stepOne {
          height: 80px;
          position: relative;
          background-color: var(--fill-3);
          color: var(--text-primary);
          border-radius: 8px 0 0 8px;
          clip-path: polygon(0 0, calc(100% - 13.44px) 0, 100% 50%, calc(100% - 13.44px) 100%, 0 100%, 0 0);
        }

        &.stepTwo {
          height: 80px;
          align-items: center;
          clip-path: polygon(0 0, 90% 0, 100% 50%, 90% 100%, 0 100%, 10% 50%);
          cursor: pointer;
          display: -moz-box;
          display: -ms-flexbox;
          display: -webkit-box;
          display: flex;
          flex: 1 1;
          background: var(--fill-3);
          color: var(--text-primary);
          &.active {
            background-color: var(--brand);
            span {
              color: #ffffff;
            }
          }
          &.gray {
            color: var(--text-tertiary);
            font-size: 16px;
            font-style: normal;
            font-weight: 500;
            line-height: 16px; /* 100% */
          }
        }

        &.stepThree {
          height: 80px;
          align-items: center;
          border-bottom-right-radius: 10px;
          border-top-right-radius: 10px;
          clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%, 10% 50%);
          display: flex;
          flex: 1 1;
          background: var(--fill-3);
          color: var(--text-primary);
          &.active {
            background-color: var(--brand);
            span {
              color: #ffffff;
            }
          }
          &.gray {
            color: var(--text-tertiary);
            font-size: 16px;
            font-style: normal;
            font-weight: 500;
            line-height: 16px; /* 100% */
          }
        }
        &:last-child {
          margin: 0;
        }
        .stepWrap{
          max-width: 80%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          span {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            max-width: 100%;
          }
        }
        span {
          padding-left: 5px;
          font-weight: 600;
          font-size: 16px;
          @media ${MediaInfo.desktop} {
            font-size: 14px;
          }
          @media ${MediaInfo.mobileOrTablet} {
            font-size: 12px;
          }
        }
      }
    }
    .step-detail-box {
      border: 1px solid var(--fill-3);
      border-radius: 8px;
      flex: 1;
      padding: 20px;
      @media ${MediaInfo.mobileOrTablet} {
        padding: 10px;
      }
      .box {
        .detail-box {
          display: flex;
          justify-content: space-between;
          margin-top: 24px;
          align-items: center;
          @media ${MediaInfo.mobileOrTablet} {
            display: block;
          }
          .detail {
            display: flex;
            align-items: center;
            .icon {
              width: 32px;
              height: 32px;
              background-color: var(--fill-3);
              border-radius: 4px;
              padding: 6px;
              margin-right: 15px;
            }
            .des {
              display: flex;
              flex-direction: column;
              color: var(--text-primary);
              gap: 4px;
              div:first-child {
                color: var(--text-primary);
                font-size: 14px;
                font-style: normal;
                font-weight: 500;
                line-height: 14px; /* 100% */
              }
            }
          }
          .btn {
            @media ${MediaInfo.mobileOrTablet} {
              margin: 10px 0 0 47px;
            }
          }
        }
      }
      :global(.btn) {
        position: relative;
        @media ${MediaInfo.mobileOrTablet} {
          padding: 12px 0 8px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        :global(.common-button) {
          border-radius: 4px;
        }
      }
    }
    .requirement {
      display: flex;
      gap: 20px;
      flex-direction: column;
      padding: 20px 0 0;
      &-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        @media ${MediaInfo.mobileOrTablet} {
          &:last-child{
            border-top: 1px solid var(--line-1);
            border-bottom: 1px solid var(--line-1);
            padding: 10px 0;
          }
        }
      }
      &-kyc {
        display: flex;
        flex-direction: row;
        gap: 24px;
        color: var(--text-tertiary);
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: 14px; /* 100% */
        @media ${MediaInfo.mobileOrTablet} {
            flex-direction: column;
            gap: 8px;
            width: 100%;
        }
      }
      .requirement-condition-list{
        display: flex;
        flex-direction: row;
        align-items: center;
        gap:24px;
        @media ${MediaInfo.mobileOrTablet} {
            width: 100%;
        }
      }
      &-condition {
        display: flex;
        align-items: center;
        gap: 8px;
        color: var(--text-primary);
        font-size: 14px;
        font-style: normal;
        font-weight: 500;
        line-height: 14px; /* 100% */
        @media ${MediaInfo.mobileOrTablet} {
            width: 100%;
        }
      }
      .desc {
        color: var(--text-secondary);
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: 18px; /* 100% */
      }
    }
    .kyc-status {
      position: absolute;
      top: -20px;
      left: 0;
      right: 0;
      color: var(--red);
      font-size: 14px;
      font-style: normal;
      font-weight: 400;
      line-height: 14px; /* 100% */
      display: flex;
      align-items: center;
      justify-content: center;
      white-space: nowrap;
      gap: 8px;

      @media ${MediaInfo.mobileOrTablet} {
         position: inherit;
         top: inherit;
         right: inherit;
         order: 2;
      }
      &-icon {
        display: flex;
        align-items: center;
        gap: 4px;
      }
    }
  }
`;
export default Guide;
