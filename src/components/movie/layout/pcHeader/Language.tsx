import React, { useMemo, useState } from "react";
import { Popover } from "antd-mobile";
import { LanguageActions } from "@/typings/home.interface";
import { Action } from "antd-mobile/2x/es/components/popover";
import { useRouter } from "next/router";
import ImagePline from "@/components/common/image/ImagePline";
import styles from "@/components/layout/pcHeader/PcHeader.module.scss";

const Language = () => {
  const router = useRouter();

  const language = useMemo(() => {
    const ind = LanguageActions.findIndex(val => val.key === router.locale);
    return ind !== -1 ? LanguageActions[ind].text : LanguageActions[0].text;
  }, [router.locale]);

  const [visible, setVisible] = useState(false);
  // 切换语言
  const changeLanguage = (item: Action) => {
    router.replace(router.asPath, router.asPath, { locale: item.key as string })
    // if (router.pathname.includes('/browse/[typeTwoId]')) {
    //   router.replace('/browse', undefined, { locale: item.key as string })
    // } else {
    //   router.replace(router.asPath, router.asPath, { locale: item.key as string })
    // }
  }

  const _LanguageActions = useMemo(() => {
    return LanguageActions.map(item => {
      return {
        key: item.key,
        text: <span style={ router.locale === item.key ? { color: "#FF375F", fontWeight: 500 } : {}}>{item.text}</span>
      }
    })
  }, [router.locale]);

  return <div className={styles.language}>
    <Popover.Menu
      visible={visible}
      actions={_LanguageActions}
      getContainer={null}
      onVisibleChange={(visible) => setVisible(visible)}
      onAction={(item) => changeLanguage(item)}
      trigger='click'
      placement='bottom'
      defaultVisible={false}
    >
      <div className={visible ? styles.languageBoxActive : styles.languageBox}>
        <span className={styles.navItemTxt}>{language}</span>
        <ImagePline
          className={styles.navItemIcon}
          width={12}
          height={12}
          src={visible ? '/images/layout/arrow-up.png' : '/images/pline/arrow-down.png'}
          alt={''}
        />
      </div>
    </Popover.Menu>
  </div>
}

export default Language;
