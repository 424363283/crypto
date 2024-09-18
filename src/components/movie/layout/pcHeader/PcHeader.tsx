import React, { FC, useEffect, useState } from 'react';
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";
import ClientConfig from "@/client.config";
import { useTranslation } from "next-i18next";
import Language from "@/components/layout/pcHeader/Language";
import useHiveLog from "@/hooks/useHiveLog";
import styles from '@/components/layout/pcHeader/PcHeader.module.scss';

interface IProps {

}

const PcHeader: FC<IProps> = () => {
  const router = useRouter();
  const { t } = useTranslation()
  const MenuData = [
    { id: 'index', label: t('home.home'), link: '/' },
    { id: 'browse', label: t('home.browse'), link: '/browse' },
    { id: 'App', label: t('home.app'), link: '/download' },
  ]

  const [isLanguageShow, setIsLanguageShow] = useState<boolean | false>(false);
  const HiveLog = useHiveLog()
  useEffect(() => {
    if(router && router.pathname) {
      setIsLanguageShow((router.pathname === '/'))
    }
  }, [router])

  return <>
    <div className={styles.navWrap}>
      <div className={styles.navContent}>
        <div className={styles.navLeft}>
          <Link href={'/'} className={styles.logoTxtBox} onClick={() => {
            HiveLog.track('Logo_click')
          }}>
            {/*<Image*/}
            {/*  className={styles.logoTxt}*/}
            {/*  width={168}*/}
            {/*  height={40}*/}
            {/*  src={'/images/home/logo-text.png'}*/}
            {/*  alt={ClientConfig.name}*/}
            {/*/>*/}
            <Image
              className={styles.logoIcon}
              width={40}
              height={40}
              src={'/images/logo.png'}
              alt={ClientConfig.name}
            />
            <span>DramaBox</span>
          </Link>
          <div className={styles.navBox}>
            { MenuData.map(val => {
              return <Link
                key={val.id}
                href={val.link}
                onClick={() => {
                  if (val.id === 'index') {
                    HiveLog.track('FirstPage_click')
                  } else if (val.id === "browse") {
                    HiveLog.track('TopClassify_click')
                  }
                }}
                className={(router.asPath === val.link || router.asPath.includes(val.id)) ? styles.navItemActive : styles.navItem}>
                <span className={styles.navItemLabel}>{val.label}</span>
              </Link>
            }) }
          </div>
        </div>
        {isLanguageShow ? <Language/> : null}
      </div>
    </div>
    <div className={styles.navOccupy}/>
  </>
}

export default PcHeader
