import React, { FC } from "react";
import Link from "next/link";
import styles from "@/components/common/typeTwoTag/index.module.scss";

interface IProps {
  typeTwoList: { id: number; name: string; }[]
}
const TypeTwoTag: FC<IProps> = ({ typeTwoList }) => {

  return <div className={styles.typeTagBox}>
    {
      typeTwoList.map((item, itemIndex) => (
        <Link
          href={`/browse/${item.id}`} key={item.id + '_' + itemIndex}
          className={styles.leftTag}>{item.name}</Link>
      ))
    }
  </div>
}

export default TypeTwoTag;
