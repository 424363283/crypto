import Image from '@/components/image';
import styles from './partner.module.scss';
import { LANG } from '@/core/i18n';
export default function partnerChoose() {
  const chooseList = [
    {
      url: '/static/images/partner/partner-choose-serve.svg',
      title: LANG('专属服务'),
      subTitle: LANG('7*24小时客服服务，提供全年支持')
    },
    {
      url: '/static/images/partner/partner-choose-trade.svg',
      title: LANG('多元化交易'),
      subTitle: LANG('玩转交易，轻松躺赢，理财，合约，跟单交易')
    },
    {
      url: '/static/images/partner/partner-choose-security.svg',
      title: LANG('资金安全保障'),
      subTitle: LANG('7*100%平台透明和先进的安全功能')
    }
  ];
  return (
   <div className={styles.partnerChooseModule}>
     <div className={styles.partnerChoose}>
      <p className={`${styles.partnerTitle} ${styles.flexDCenter}`}>{LANG('为什么选择YMEX？')}</p>
      <div className={`${styles.partnerChooseBox}`}>
        {chooseList.map((item, idx) => {
          return (
            <div className={styles.flexColCenter} key={idx}>
              <Image src={item.url} alt="" width={80} height={80} />
              <p className={styles.chooseTitle}>{item.title}</p>
              <p className={styles.chooseSubTitle}>{item.subTitle}</p>
            </div>
          );
        })}
      </div>
    </div>
   </div>
  );
}
