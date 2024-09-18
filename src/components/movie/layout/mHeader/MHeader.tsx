import React, { FC, useState } from "react";
import MNav from "@/components/layout/mHeader/mNav";
import MLanguage from "@/components/layout/mHeader/mLanguage/MLanguage";
import ClientConfig from "@/client.config";
import { useRouter } from "next/router";
import Link from "next/link";
import useHiveLog from "@/hooks/useHiveLog";
import ImagePline from "@/components/common/image/ImagePline";
import HeaderAd from "@/components/layout/headerAd";
import classNames from "classnames";
import { useTranslation } from "next-i18next";
import styles from "@/components/layout/mHeader/MHeader.module.scss";

interface IProps {}

const MHeader: FC<IProps> = () => {
  const [visible, setVisible] = useState(false);
  const router = useRouter();
  const { t } = useTranslation();

  const HiveLog = useHiveLog()

  const navIconClick = () => {
    if (visible) {
      setVisible(false)
      document.body.style.overflow = ''
    } else {
      setVisible(true)
      document.body.style.overflow = 'hidden'
    }
  }

  return (<div className={styles.headerWrap}>
    <HeaderAd />
    {(router.pathname === '/' || router.pathname.includes('/browse')) ?
      <div className={styles.homeHeaderBox}>
        <div className={styles.navMenu}>
          <Link
            href={'/'}
            className={classNames(styles.navItem, router.pathname === '/' && styles.active)}>
            {t('home.recommend')}
          </Link>

          <Link
            href={'/browse'}
            className={classNames(styles.navItem, router.pathname !== '/' && styles.active)}>
            {t('home.browse')}
          </Link>
        </div>
        { router.pathname === '/' ? <MLanguage/> : null}
      </div> :

      <div className={styles.headerContent}>
        <ImagePline
          onClick={() => navIconClick()}
          className={styles.navMenuIcon}
          width={48}
          height={48}
          src={'/images/pline/m-menu.png'}
          alt={''}
        />
        <Link href={'/'} className={styles.logoBox} onClick={() => {
          HiveLog.track('Logo_click')
        }}>
          <ImagePline
            className={styles.logo}
            width={181}
            height={40}
            src={'/images/pline/m-logo.png'}
            alt={ClientConfig.name}
          />
        </Link>

        <MNav visible={visible} cancel={() => navIconClick()}/>
      </div>
    }
  </div>)
}

export default MHeader;
