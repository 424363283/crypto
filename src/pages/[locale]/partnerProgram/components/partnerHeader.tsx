'use client';
import { Button } from '@/components/button';
import Image from '@/components/image';
import { useResponsive, useRouter } from '@/core/hooks';
import styles from './partner.module.scss';
import { useAppContext } from '@/core/store';
import ApplyPartnerModal from './applyPartnerModal';
import { useEffect, useState } from 'react';
import { Lang, LANG } from '@/core/i18n';
import { Size } from '@/components/constants';
import { PartnerProgram } from '@/core/shared';
export default function partnerHeader() {
const { isLogin } = useAppContext();
  const { isMobile } = useResponsive();
  const router = useRouter();
  const [applyPartnerShow, setApplyPartnerShow] = useState(false);
  const partnerList = [
    {
      id: 1,
      url: '/static/images/partner/partner-coin.svg'
    },
    {
      id: 2,
      url: '/static/images/partner/partner-asset.svg'
    },
    {
      id: 3,
      url: '/static/images/affiliate/avatar.svg'
    },
    {
      id: 4,
      url: '/static/images/affiliate/avatar.svg'
    },
    {
      id: 5,
      url: '/static/images/affiliate/avatar.svg'
    }
  ];

  const JoinPartnerModule = () => {
    return (
      <div className={`${styles.flexCenter} ${styles.joinPartner}`}>
        {partnerList.map((item, idx) => {
          return (
            <Image
              key={item.id}
              className={`${idx && styles.moveLeft}`}
              src={item.url}
              alt=""
              width={38}
              height={38}
              enableSkin
            />
          );
        })}
      </div>
    );
  };
  const handleApply = () => {
    if (isLogin) {
      setApplyPartnerShow(true);
    } else {
      router.push('/login');
    }
  };
  const gotoAgent = () => {
    if (process.env.NODE_ENV === 'development' || window.location?.pathname.indexOf('webdev')>-1) {
      window.open('https://dev-agent.83uvgv.com','_self');
    } else if (process.env.NODE_ENV === 'test'|| window.location?.pathname.indexOf('webuat')>-1) {
      window.open('https://webuat-agent.83uvgv.com/agent/home','_self');
    } else {
      window.open('https://webuat-agent.83uvgv.com/agent/home','_self');
    }
  };

  const fetchApplyStatus = async () => {
    const res: any = await PartnerProgram.partnerApplyStatus();
    if (res.code === 200)
      if (res.data.agent) {
        gotoAgent();
      } else {
        if (res?.data?.status === 2) {
          gotoAgent();
        }
      }
  };
  useEffect(() => {
    if (isLogin) {
      fetchApplyStatus()
    }
  }, [isLogin]);
  return (
    <div className={styles.partnerHeader}>
      <div className={`${styles.flexSpace} ${styles.partnerHeaderBox}`}>
        <div className={styles.partnerHeaderLeft}>
          <div className={styles.partnerTitle}>
            {LANG('欢迎加入')} Y-MEX <br />
            {LANG('官方平台')}
          </div>
          <div className={styles.reward}>
            <span>{LANG('最高可得')}</span>
            <span className={styles.colorBrand}> 80% </span>
            <span>{LANG('交易手续费返佣')}</span>
          </div>
          <div className={`${styles.flexSpace} ${styles.gap16}`}>
            <Button
              type="primary"
              size={Size.XS}
              className={styles.applyBtn}
              height={isMobile ? 28 : 48}
              rounded={true}
              style={{ width: isMobile ? '104px' : '256px', fontSize: isMobile ? '14px' : '16px' }}
              onClick={handleApply}
            >
              {!isLogin ? LANG('登录') : LANG('立即申请')}
            </Button>
            {/* <div className={`${styles.flexCenter} ${styles.gap16}`}>
                            <JoinPartnerModule />
                            <div className={styles.partnerMore}>更多+</div>
                        </div> */}
          </div>
          <div className={`${styles.flexSpace} ${styles.partnerTrade}`}>
            <div className={styles.partnerTradeItem}>
              <Image
                src="/static/images/partner/partner-coin.svg"
                alt=""
                width={isMobile ? 24 : 61}
                height={isMobile ? 24 : 60}
              />
              <div>
                <p className={styles.partnerTradeNum}>600+</p>
                <p className={styles.partnerTradeName}>{LANG('交易币种')}</p>
              </div>
            </div>
            <div className={styles.partnerTradeItem}>
              <Image
                src="/static/images/partner/partner-asset.svg"
                alt=""
                width={isMobile ? 24 : 61}
                height={isMobile ? 24 : 60}
              />
              <div>
                <p className={styles.partnerTradeNum}>100%</p>
                <p className={styles.partnerTradeName}>{LANG('储备金证明')}</p>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.partnerHeaderRight}>
          <Image
            src="/static/images/partner/partner-pogram.png"
            alt=""
            width={isMobile ? 175 : 560}
            height={isMobile ? 125 : 400}
          />
        </div>
        <ApplyPartnerModal isOpen={applyPartnerShow} close={() => setApplyPartnerShow(false)} />
      </div>
    </div>
  );
}
