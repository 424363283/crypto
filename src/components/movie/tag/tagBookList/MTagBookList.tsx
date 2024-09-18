import React, { FC } from 'react';
import Link from "next/link";
import { ITagBookItem } from "@/typings/book.interface";
import { printKeyword } from "@/components/pcTag/tagBookList/TagBookList";
import { ELanguage } from "@/typings/home.interface";
import { ImageCover } from "@/components/common/image/ImageCover";
import styles from '@/components/tag/tagBookList/MTagBookList.module.scss';

interface IProps {
  dataSource: ITagBookItem[];
  keyword: string;
  onBookClick?: (book: ITagBookItem) => void;
}

const MTagBookList: FC<IProps> = ({dataSource, keyword, onBookClick}) => {

  return <div className={styles.listBox}>
    {dataSource && dataSource.length > 0 ? dataSource.map((book, bookInd) => {
      const { bookId, bookName, introduction, cover, typeTwoList = [], bookNameEn = '' } = book;
      const bookNameDom = printKeyword(bookName, keyword)
      const introDom = printKeyword(introduction, keyword)
      const routerToBookInfo = process.env.Platform === 'dramabox' ? `/drama/${bookId}/${bookNameEn}` : `/film/${bookId}`;
      const simpleLanguage = Object.values(ELanguage).includes(book.simpleLanguage) ? book.simpleLanguage : ELanguage.English;

      return <div key={bookId + bookInd} className={styles.listItem}>
        <ImageCover
          onClick={() => onBookClick && onBookClick(book)}
          locale={simpleLanguage}
          href={routerToBookInfo}
          className={styles.bookImage}
          src={cover}
          width={165}
          height={220}
          alt={bookName}
        />

        <div className={styles.bookInfo}>
          <Link
            href={routerToBookInfo}
            locale={simpleLanguage}
            onClick={() => onBookClick && onBookClick(book)}
            className={styles.bookName}
            dangerouslySetInnerHTML={{__html: bookNameDom}}
          />

          {
            typeTwoList && typeTwoList.length > 0 ? <div className={styles.bookLabels}>
              {
                typeTwoList.map((item, itemIndex) => (
                  <Link
                    key={item.id + '_browse_' + itemIndex}
                    href={`/browse/${item.id || 0}/`}
                    locale={simpleLanguage}
                    className={styles.bookLabel}
                    dangerouslySetInnerHTML={{__html: printKeyword(item.name, keyword)}}
                  />
                ))
              }
            </div> : null
          }

          <Link
            className={styles.intro}
            dangerouslySetInnerHTML={{__html: introDom}}
            onClick={() => onBookClick && onBookClick(book)}
            href={routerToBookInfo}
            locale={simpleLanguage} />
        </div>

      </div>
    }) : null}
  </div>
}

export default MTagBookList;
