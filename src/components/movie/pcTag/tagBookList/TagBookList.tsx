import React, { FC } from 'react';
import Link from "next/link";
import { ITagBookItem } from "@/typings/book.interface";
import { useTranslation } from "next-i18next";
import { ELanguage } from "@/typings/home.interface";
import Image from "next/image";
import ClientConfig from "@/client.config";
import { ImageCover } from "@/components/common/image/ImageCover";
import styles from '@/components/pcTag/tagBookList/TagBookList.module.scss';

interface IProps {
  dataSource: ITagBookItem[];
  keyword: string;
  onBookClick?: (book: ITagBookItem) => void;
}

export const printKeyword = (content: string, keyword: string) => {
  if (!keyword || !content) return content;
  const index = content.indexOf(keyword);
  const c = index > -1 ? content.substr(index, keyword.length) : '';
  const res = `<span style="color: #FF375F">${c}</span>`
  const regS = new RegExp(keyword, 'gi')
  return content.replace(regS, res) || content
}

const TagBookList: FC<IProps> = ({ dataSource, keyword, onBookClick }) => {
  const { t } = useTranslation();

  return <div className={styles.tagBookBox}>
    {dataSource.map((book) => {

      const {
        bookId,
        bookName,
        introduction,
        typeTwoList = [],
        firstChapterId,
        bookNameEn = '',
      } = book;
      const bookNameDom = printKeyword(bookName, keyword)
      const introDom = printKeyword(introduction, keyword)

      const routerToBookInfo = process.env.Platform === 'dramabox' ? `/drama/${bookId}/${bookNameEn}` : `/film/${bookId}`;

      const simpleLanguage = Object.values(ELanguage).includes(book.simpleLanguage) ? book.simpleLanguage : ELanguage.English;

      return <div key={bookId} className={styles.listItem}>

        <ImageCover
          scale={true}
          onClick={() => onBookClick && onBookClick(book)}
          href={routerToBookInfo}
          locale={simpleLanguage}
          className={styles.bookImageBox}
          width={150}
          height={200}
          src={book.cover}
          alt={book.bookName}
        />

        <div className={styles.bookInfo}>
          <Link
            onClick={() => onBookClick && onBookClick(book)}
            href={routerToBookInfo}
            locale={simpleLanguage}
            className={styles.bookName}
            dangerouslySetInnerHTML={{ __html: bookNameDom }}
          />

          {
            !!(typeTwoList && typeTwoList.length) && <div className={styles.bookLabelBox}>
              {
                typeTwoList.map((item, itemIndex) => (
                  <Link
                    key={item.id + '_browse_' + itemIndex}
                    href={`/browse/${item.id || 0}/`}
                    locale={simpleLanguage}
                    className={styles.bookLabel}
                    dangerouslySetInnerHTML={{ __html: printKeyword(item.name, keyword) }}/>
                ))
              }
            </div>
          }

          <Link
            onClick={() => onBookClick && onBookClick(book)}
            href={routerToBookInfo}
            locale={simpleLanguage}
            className={styles.intro}
            dangerouslySetInnerHTML={{ __html: introDom }}
          />
        </div>

        {
          firstChapterId ? <Link
            href={`/episode/${bookId}/${firstChapterId}`}
            locale={simpleLanguage}
            className={styles.readBtn}
          >
            <Image
              className={styles.playBtnImage}
              width={28}
              height={28}
              src={'/images/book/bookinfo_play.png'}
              alt={ClientConfig.name}
            />
            {t("bookInfo.playNow")}
          </Link> : null
        }
      </div>
    })}
  </div>
}

export default TagBookList;
