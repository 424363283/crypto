import React, { FC, useEffect, useState } from "react";
import Link from "next/link";
import ImagePline from "@/components/common/image/ImagePline";
import styles from '@/components/common/paginationCom/index.module.scss';

/** 参考文献https://www.jianshu.com/p/ec9aca4764cf*/

interface IProps {
  path: string;
  totalPage: number; // 总页数
  pageNo: number; // 当前页码
  showLength?: number; // 最大长度
  groupCount?: number; // 页码分组，显示6个页码，其余用省略号显示
  isScroll?: boolean; // 是否滚动到顶部
  query?: string;
}

const PaginationCom: FC<IProps> = (
  {
    path,
    totalPage,
    pageNo,
    showLength = 6,
    groupCount = 5,
    isScroll = false,
    query =  ''
  }
) => {
  const [currentPage, setCurrentPage] = useState(1); //当前页码
  const [startPage, setStartPage] = useState(1);  // 分组开始页码

  useEffect(() => {
    const _startPage = Number(pageNo) - 2 > 0
      ? Number(pageNo) - 2
      : Number(pageNo);
    setStartPage(_startPage);
    setCurrentPage(pageNo)
  }, [pageNo]);

  const CreatePage = () => {
    const pageLength = groupCount + startPage > totalPage ? totalPage : groupCount + startPage;
    return (<>
      {currentPage === 1 ? <div className={styles.activePage}>1</div> :
        <Link scroll={isScroll} href={path + query} className={styles.normalLi}>1</Link>}
      {/*前面省略号(当当前页码比分组的页码大时显示省略号)*/}
      {currentPage >= groupCount && <div className={styles.omission}>…</div>}
      {/*非第一页和最后一页显示*/}
      {Array.from({ length: pageLength }, (v, i) => {
        if (i < startPage) return null;
        if (i <= totalPage - 1 && i > 1) {
          return currentPage === i ? <div className={styles.activePage} key={i}>{i}</div> :
            <Link key={i} scroll={isScroll} href={path + i + query} className={styles.normalLi}>{i}</Link>
        }
        return null;
      })}
      {/*后面省略号*/}
      {totalPage - startPage >= groupCount + 1 && <div className={styles.omission}>…</div>}
      {/*最后一页*/}
      {currentPage === totalPage ? <div className={styles.activePage}>{totalPage}</div> :
        <Link scroll={isScroll} href={path + totalPage + query} className={styles.normalLi}>{totalPage}</Link>}
    </>)
  }

  return (
    <div className={styles.pageContent}>
      {currentPage === 1 ?
        <div className={styles.prevNoMore}>
          <ImagePline
            className={styles.prevNextIcon}
            width={14}
            height={14}
            src={'/images/pline/next_2.png'}
            alt={'prev'}
          />
        </div> :
        <Link scroll={isScroll} href={path + (currentPage === 2 ? '' : (currentPage - 1)) + query} className={styles.prevBtn}>
          <ImagePline
            className={styles.prevNextIcon}
            width={14}
            height={14}
            src={'/images/pline/next_1.png'}
            alt={'prev'}
          />
        </Link>
      }
      {/*总页码小于等于showLength时，全部显示出来*/}
      {totalPage <= showLength ?
        Array.from({ length: totalPage }, (v, i) => {
          if (currentPage === i + 1) {
            return <div key={i + 1} className={styles.activePage}>{i + 1}</div>;
          }
          return <Link key={i + 1} scroll={isScroll} href={path + (i === 0 ? '' : (i + 1)) + query} className={styles.normalLi}>
            {i + 1}
          </Link>
        }) :
        <CreatePage/>
      }
      {currentPage === totalPage ? <div className={styles.nextNoMore}>
          <ImagePline
            className={styles.prevNextIcon}
            width={14}
            height={14}
            src={'/images/pline/next_2.png'}
            alt={'next'}
          />
        </div> :
        <Link scroll={isScroll} href={path + `${currentPage + 1}` + query} className={styles.nextBtn}>
          <ImagePline
            className={styles.prevNextIcon}
            width={14}
            height={14}
            src={'/images/pline/next_1.png'}
            alt={'next'}
          />
        </Link>
      }
    </div>
  );
}

export default PaginationCom;
