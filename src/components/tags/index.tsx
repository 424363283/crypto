import { Group } from '@/core/shared';
import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';
import css from 'styled-jsx/css';

const Tags = ({ id, showNew, showHot }: { id: string; showNew?: boolean; showHot?: boolean }) => {
  const ref = useRef<Group>();
  const [isNew, setIsNew] = useState<boolean | undefined>(false);
  const [isHot, setIsHot] = useState<boolean | undefined>(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      ref.current = await Group.getInstance();
      if (mounted) {
        setIsNew(ref.current?.getIsNewCoin(id) || showNew);
        setIsHot(ref.current?.getIsHotCoin(id) || showHot);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [id, showNew, showHot]);

  return (
    <>
      {isNew && <Image src='/static/images/common/new.svg' alt='' height='14' width='23' className='new-icon' />}
      {isHot && <Image src='/static/images/common/hot.svg' width='16' height='16' alt='hot' className='hot-icon' />}
      <style jsx>{styles}</style>
    </>
  );
};
const styles = css`
  .tag {
    margin: -10px 0 0 4px;
    height: 13px;
    width: auto;
  }
  :global(.new-icon),
  :global(.hot-icon) {
    margin-left: 4px;
  }
`;

export default React.memo(Tags, (prevProps, nextProps) => prevProps.id !== nextProps.id);
