import React, { FC } from "react";
import PaginationCom from "@/components/common/paginationCom";
import Link from "next/link";
import TagBookList from "@/components/pcTag/tagBookList/TagBookList";
import { ITagBookItem, IKeywordItem } from "@/typings/book.interface";
import { useTranslation } from "next-i18next";
import Breadcrumb, { IBreadcrumb } from "@/components/common/breadcrumb";
import { PcEmpty } from "@/components/common/empty";
import styles from "@/components/pcTag/index.module.scss";

interface IProps {
  bookList: ITagBookItem[];
  relationKeywords: IKeywordItem[];
  pageNo: number;
  totalPage: number;
  keywordId: string;
  keyword: string;
  breadData: IBreadcrumb[];
  onBookClick: (book: ITagBookItem) => void;
}

const PcTag: FC<IProps> = (
  {
    pageNo,
    totalPage,
    keywordId,
    bookList,
    keyword,
    relationKeywords,
    breadData,
    onBookClick
  }) => {
  const { t } = useTranslation();
  return <main className={styles.tagWrap}>

    <div className={styles.container}>
      <div className={styles.tagHeader}>
        <Breadcrumb data={breadData}/>
      </div>
      {keyword ? <div className={styles.keywordBox}>
        <h1 className={styles.title}>{keyword}</h1>
        <p className={styles.sub}>
          {t('tag.relation1')}<span>{keyword} &nbsp;</span>
          {t('tag.relation2')}<span>{keyword}</span>
          {t('tag.relation3')}<span>{keyword} &nbsp;</span>
          {t('tag.relation4')}
        </p>
        <div className={styles.keywordConnect}>
          {relationKeywords.length > 0 ? <>
            <p className={styles.keywordConnectTitle}>{t('tag.relevant')}：</p>
            {relationKeywords.map(val => {
              return <Link key={val.id} href={`/tag/${val.id}`} replace className={styles.keywordConnectItem}>
                {val.name}
              </Link>
            })}
          </> : null}
        </div>
      </div> : null}
      {bookList.length > 0 ? <div className={styles.tagListBox}>
        <TagBookList dataSource={bookList} keyword={keyword} onBookClick={onBookClick}/>
        {totalPage && totalPage > 1 ? <PaginationCom
          path={`/tag/${keywordId}/`}
          pageNo={pageNo}
          totalPage={totalPage}
          isScroll={true}
        /> : null}
      </div> : <PcEmpty />}
    </div>


  </main>
}

export default PcTag
