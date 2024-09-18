import React, { FC, useEffect, useRef, useState } from "react";
import { Dropdown, DropdownRef } from "antd-mobile";
import Link from "next/link";
import { IBrowseTypes } from "@/typings/browse.interface";
import { useTranslation } from "next-i18next";
import ImagePline from "@/components/common/image/ImagePline";
import { useAppSelector } from "@/store";
import styles from "@/components/browse/detail/DropMenu.module.scss";

interface IProps {
  types: IBrowseTypes[];
  typeTwoId: number;
}

const DropMenu: FC<IProps> = ({ types, typeTwoId }) => {
  const { t } = useTranslation()
  const dropdownRef = useRef<DropdownRef>(null);
  const activeRef = useRef<HTMLDivElement>(null);
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const isPopChange = useAppSelector(state => state.app.isPopChange)

  useEffect(() => {
    if (dropdownRef.current) {
      dropdownRef.current?.close()
    }
  }, [isPopChange]);

  useEffect(() => {
    if (activeRef.current && activeKey) {
      setTimeout(() => {
        activeRef.current?.scrollIntoView({ block: "start", behavior: "smooth", inline: "center" })
      }, 300)
    }
  }, [activeKey]);

  return (<Dropdown
    getContainer={() => document.getElementById('browse_box') as HTMLElement}
    ref={dropdownRef}
    arrow={null}
    onChange={(key) => {
      setActiveKey(key)
    }}
    className={styles.dropdownBox}
  >
    <Dropdown.Item
      forceRender
      key='sorter'
      title={
        <ImagePline
          className={styles.menuTitleIcon}
          width={40}
          height={40}
          src={'/images/pline/browser-more.png'}
          alt={''}
        />
      }>
      <div className={styles.menuBox}>

        <div className={styles.menuHead}>
          <span>{t('home.browse')}</span>
          <ImagePline
            onClick={() => {
              dropdownRef.current?.close()
            }}
            className={styles.menuHeadIcon}
            width={40}
            height={40}
            src={'/images/pline/browser-more.png'}
            alt={''}
          />
        </div>

        <div className={styles.menuContent}>
          {types.map((item) => {
            const typeName = item.id === 0 ? t('browse.all') : item.name;
            if (typeTwoId === item.id) {
              return <div key={item.id} ref={activeRef} className={styles.menuActiveItem}
                          onClick={() => dropdownRef.current?.close()}>{typeName}</div>
            }
            return <Link key={item.id} href={`/browse/${item.id}`}
                         className={styles.menuItem} onClick={() => dropdownRef.current?.close()}>
              {typeName}
            </Link>
          })}
        </div>
      </div>
    </Dropdown.Item>
  </Dropdown>)
}

export default DropMenu;
