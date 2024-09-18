import React, { FC } from "react";
import Link from "next/link";
import PaginationCom from "@/components/common/paginationCom";
import { IKeywordItem } from "@/typings/book.interface";
import { PcEmpty } from "@/components/common/empty";
import Breadcrumb, { IBreadcrumb } from "@/components/common/breadcrumb";
import styles from '@/components/pcKeywords/index.module.scss';

interface IProps {
  keywordList: IKeywordItem[]
  pageNo: number;
  totalPage: number;
  keywordClick: (item: IKeywordItem) => void;
  breadData: IBreadcrumb[];
}

const PcKeywords: FC<IProps> = ({ pageNo, totalPage, keywordList, keywordClick, breadData }) => {

  return <main className={styles.keywordsWrap}>
    <div className={styles.keywordsHeader}>
      <Breadcrumb data={breadData}/>
    </div>

    { keywordList.length > 0 ? <>
      <div className={styles.keywordBox}>
        {keywordList.map(val => {
          return <Link
            key={val.id}
            href={`/tag/${val.id}`}
            onClick={() => keywordClick(val)}
            className={styles.keywordItem}>
            {val.name}
          </Link>
        })}
      </div>
      {totalPage && totalPage > 1 ? <PaginationCom
        path={'/keywords/'}
        pageNo={pageNo}
        totalPage={totalPage}
        isScroll={true}
      /> : null}
    </>: <PcEmpty message={'No keywords'}/> }
  </main>
}

export default PcKeywords;
