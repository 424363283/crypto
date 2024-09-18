import Link from "next/link";
import React, { CSSProperties, FC } from "react";
import classNames from "classnames";
import useHiveLog from "@/hooks/useHiveLog";
import ImagePline from "@/components/common/image/ImagePline";
import styles from "@/components/common/breadcrumb/index.module.scss";

export interface IBreadcrumb {
  title: string | number;
  link?: string;
}

interface IProps {
  data: IBreadcrumb[];
  style?: CSSProperties | undefined;
  isWap?: boolean;
}

const Breadcrumb: FC<IProps> = ({ data, isWap }) => {
  const HiveLog = useHiveLog()
  return <div className={classNames(styles.crumbsWrap, isWap && styles.crumbsWrapWap)}>
    {data.map((item, itemIndex) => {
      return <div key={itemIndex + String(item.title)} className={styles.crumbItem}>
        { item?.link
          ? <Link
            href={item.link}
            onClick={() => {
              HiveLog.track('Navigation_click', { navigationName: item.title })
            }}>{item.title}</Link>
          : <div className={styles.lastTxt}>{item.title}</div> }
        {data.length - 1 !== itemIndex ? <ImagePline
          className={styles.crumbIcon}
          width={isWap ? 24 : 16}
          height={isWap ? 24 : 16}
          src={'/images/pline/crumbs.png'}
          alt={'>'}
        /> : null}
      </div>
    }) }
  </div>
}

export default Breadcrumb;
