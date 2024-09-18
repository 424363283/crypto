import React, { useMemo } from "react";
import { Popover } from "antd-mobile";
import { LanguageActions } from "@/typings/home.interface";
import { Action } from "antd-mobile/2x/es/components/popover";
import { useRouter } from "next/router";
import ImagePline from "@/components/common/image/ImagePline";
import { useAppDispatch } from "@/store";
import { setIsPopChange } from "@/store/modules/app.module";
import styles from "@/components/layout/mHeader/mLanguage/MLanguage.module.scss";

const MLanguage = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const language = useMemo(() => {
    const ind = LanguageActions.findIndex(val => val.key === router.locale);
    return ind !== -1 ? LanguageActions[ind].label : LanguageActions[0].label
  }, [router.locale]);

  const _LanguageActions = useMemo(() => {
    return LanguageActions.map(item => {
      return {
        key: item.key,
        text: <span style={ router.locale === item.key ? { color: "#FF375F", fontWeight: 500 } : {}}>{item.text}</span>
      }
    })
  }, [router.locale]);

  // 切换语言
  const changeLanguage = (item: Action) => {
    router.replace(router.asPath, router.asPath, { locale: item.key as string })
  }

  return <div className={styles.language} onClick={() => dispatch(setIsPopChange(false))}>
    <Popover.Menu
      actions={_LanguageActions}
      getContainer={null}
      onAction={(item) => changeLanguage(item)}
      trigger='click'
      placement='bottom'
      defaultVisible={false}
    >
      <div className={styles.rightBox}>
        <ImagePline
          className={styles.languageIcon}
          width={32}
          height={32}
          src={'/images/pline/language.png'}
          alt={'language'}
        />
        <span>{language}</span>
      </div>
    </Popover.Menu>
  </div>
}

export default MLanguage;
