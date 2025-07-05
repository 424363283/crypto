import Image from '@/components/image';
import styles from './partner.module.scss';
import { LANG } from '@/core/i18n';
import { useResponsive, useRouter } from '@/core/hooks';
import { useTheme } from '@/core/hooks';
export default function partnerChoose() {
  const { isMobile } = useResponsive();
  const router = useRouter();
  const { isDark } = useTheme();
  const localLang = router.query.locale || 'en';
  const chooseList = [
    {
      url: `/static/images/partner/partner-value-activity${isDark?'-dark':''}.svg`,
      title: LANG('丰富的线下活动'),
      subTitle: LANG('7*Ymex内部见面会，业内顶级峰会门票，各种体育于娱乐赛事。')
    },
    {
      url: `/static/images/partner/partner-value-support${isDark?'-dark':''}.svg`,
      title: LANG('内容素材支持'),
      subTitle: LANG('提供多样的内容素材，助力您的推广宣传。')
    },
    {
      url: `/static/images/partner/partner-value-operation${isDark?'-dark':''}.svg`,
      title: LANG('配备专属运营人员'),
      subTitle: LANG('提供专属服务，协助您成为顶级合伙人。')
    },
    {
      url: `/static/images/partner/partner-value-welfare${isDark?'-dark':''}.svg`,
      title: LANG('合伙人专属福利'),
      subTitle: LANG('丰富的代币、卡券等福利，协助您更好的维护粉丝。')
    }
  ];
  return (
    <div className={styles.partnerValueAdded}>
      <p className={`${styles.partnerSecTitle} ${styles.flexDCenter}`}>{LANG('合伙人计划增值服务')}</p>
      <p className={`${styles.partnerSubTitle} ${styles.flexDCenter}`}>
        {LANG('YMEX多维度，全方位扶持每一位合伙人，帮其提升被动收益')}
      </p>
      <div className={`${styles.partnerValueAddedBox}`}>
        {chooseList.map((item, idx) => {
          return (
            <div className={`${localLang === 'en' ? styles.partnerValueItemEn : styles.partnerValueItem}`} key={idx}>
              <p className={`${styles.chooseValueTitle} ${localLang === 'en' && styles.chooseTitleEn}`}>{item.title}</p>
              <p className={`${styles.chooseSubTitle} ${styles.mb16} ${localLang === 'en' && styles.chooseSubTitleEn}`}>
                {item.subTitle}
              </p>
              <Image src={item.url} alt="" width={isMobile ? 100 : 120} height={isMobile ? 100 : 120} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
