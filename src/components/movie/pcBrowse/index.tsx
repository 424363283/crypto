import React, { FC } from "react";
import Link from "next/link";
import { IBookItem } from "@/typings/home.interface";
import { useTranslation } from "next-i18next";
import PaginationCom from "@/components/common/paginationCom";
import { IBrowseTypes } from "@/typings/browse.interface";
import { PcEmpty } from "@/components/common/empty";
import SecondList from "@/components/pcHome/secondList/SecondList";
import styles from "@/components/pcBrowse/index.module.scss";

interface IProps {
  bookList: IBookItem[];
  types: IBrowseTypes[];
  pageNo: number;
  pages: number;
  typeTwoId: number;
  typeTwoName: string;
}

const PcBrowse: FC<IProps> = ({ bookList, pageNo, pages, typeTwoId, typeTwoName, types }) => {
  const { t } = useTranslation();

  return <main className={styles.browseWrap}>
    <div className={styles.container}>
      <div className={styles.browseHeader}>
        {/*<div className={styles.tabBox}>*/}
        {/*  <Tabs*/}
        {/*    className={styles.tabContent}*/}
        {/*    activeLineMode={'fixed'}*/}
        {/*    activeKey={String(typeTwoId)}*/}
        {/*  >*/}
        {/*    {types.map((item) => {*/}
        {/*      const typeName = item.id === 0 ? t('browse.all') : item.name;*/}
        {/*      return <Tabs.Tab title={<Link href={`/browse/${item.id}`}>*/}
        {/*        {typeName}*/}
        {/*      </Link>} key={item.id}/>*/}
        {/*    })}*/}
        {/*  </Tabs>*/}
        {/*</div>*/}

        <div className={styles.tabsBox}>
          {types.map((item) => {
            const typeName = item.id === 0 ? t('browse.all') : item.name;
            const linkHref = item.id === 0 ? '/browse' : `/browse/${item.id}`;
            if (item.id === typeTwoId) {
              return <div key={item.id} className={styles.tabItemActive}>{typeName}</div>
            }
            return <Link href={linkHref} key={item.id}
                         className={styles.tabItem}>
              {typeName}
            </Link>
          })}
        </div>
      </div>

      <div className={styles.browseContent}>
        {bookList.length === 0 ? <PcEmpty/> :
          <SecondList dataSource={bookList} />}

        {pages && pages > 1 ?
          <PaginationCom
            path={`/browse/${typeTwoId}/`}
            pageNo={pageNo}
            totalPage={pages}
            isScroll={true}/> : null}
      </div>
    </div>
  </main>
}

export default PcBrowse;
