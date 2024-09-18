import React, { FC } from "react";
import Link from "next/link";
import MorePagination from "@/components/more/pagination/MorePagination";
import { IKeywordItem } from "typings/book.interface";
import { MEmpty } from "@/components/common/empty";
import Breadcrumb, { IBreadcrumb } from "@/components/common/breadcrumb";
import styles from '@/components/keywords/index.module.scss';

interface IProps {
  breadData: IBreadcrumb[];
  keywordList: IKeywordItem[];
  pageNo: number;
  totalPage: number;
  keywordClick: (item: IKeywordItem) => void;
}

const MKeywords: FC<IProps> = ({ breadData, pageNo, totalPage, keywordList, keywordClick }) => {

  return <div className={styles.keywordsWrap}>
    <div className={styles.keywordsHeader}>
      <Breadcrumb data={breadData} isWap={true}/>
    </div>
    { keywordList.length === 0 ?
      <MEmpty message={"No Keywords"}/> :
      <>
        <div className={styles.keywordBox}>
          {keywordList.map(val => {
            return <Link key={val.id} href={`/tag/${val.id}`} onClick={() => keywordClick(val)} className={styles.keywordItem}>
              {val.name}
            </Link>
          })}
        </div>
        {totalPage && totalPage > 1 ? <MorePagination
          prevPath={'/keywords/'}
          page={pageNo}
          totalPage={totalPage}
        /> : null}
      </>
    }

  </div>
}

export default MKeywords;
