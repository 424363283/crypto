import React, { FC } from 'react';
import Link from "next/link";
import { useTranslation } from "next-i18next";
import { Popup } from "antd-mobile";
import { useRouter } from "next/router";
import ImagePline from "@/components/common/image/ImagePline";
import useHiveLog from "@/hooks/useHiveLog";
import classNames from "classnames";
import styles from '@/components/layout/mHeader/mNav/index.module.scss';

interface IProps {
  visible: boolean;
  cancel: () => void;
}

const MNav: FC<IProps> = ({ visible, cancel }) => {
  const { t } = useTranslation();
  const MenuData = [
    { id: 'index', label: t('home.home'), link: '/' },
    { id: 'browse', label: t('home.browse'), link: '/browse' },
    { id: 'App', label: t('home.app'), link: '/download' },
  ]
  const router = useRouter();
  const HiveLog = useHiveLog()

  return <Popup
    visible={visible}
    position={'left'}
    onMaskClick={() => {
      cancel()
    }}
    onClose={() => {
      cancel()
    }}
    bodyStyle={{
      backgroundColor: process.env.Platform === 'dramabox' ? '#FFFFFF' : '#1C1C1E',
      padding: 0,
      width: '3.75rem'
    }}
  >
    <div className={styles.navHead}>
      <ImagePline
        onClick={() => cancel()}
        className={styles.navClose}
        width={48}
        height={48}
        src={'/images/pline/nav-cancel.png'}
        alt={'x'}
      />
    </div>

    <div className={styles.navMenu}>
      {MenuData.map(val => {
        return <Link
          key={val.id}
          href={val.link}
          className={classNames(styles.navItem, router.pathname === val.link && styles.navItemActive)}
          onClick={() => {
            if (val.id === 'index') {
              HiveLog.track('FirstPage_click')
            } else if (val.id === "browse") {
              HiveLog.track('TopClassify_click')
            }
            cancel()
          }}
        >
          <span className={styles.navItemTxt}>{val.label}</span>
        </Link>
      })}
    </div>
  </Popup>
}

export default MNav
