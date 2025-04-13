'use client';
import Radio from '@/components/Radio';
import styles from './follow-btn.module.scss';
import { Button } from '@/components/button';
import CommonIcon from '@/components/common-icon';
import { useEffect, useState } from 'react';
import { LANG } from '@/core/i18n';

const FollowButton = ({ status, onClick }: { status: boolean, onClick: (id: number) => void }) => {
  const [isFollowing, setIsFollowing] = useState(status);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    setIsFollowing(status);
  }, [status]);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };
  const toggleStatus = () => {
    setIsFollowing(!isFollowing);
  };
  const onClickHandler = () => {
    toggleStatus();
    if(onClick) {
      onClick(1);
    }
  }
  const renderContent = () => {
    if (!isFollowing) {
      return <>
        <CommonIcon name='common-add-round-brand-0' size={16} />
        <span>{LANG('关注')}</span>
      </>

    } else if (!isHovered) {
      return <>
        <Radio label='' checked={isFollowing} size={16} />
        <span>{LANG('已关注')}</span>
      </>

    } else {
      return <>
        <CommonIcon name='common-delete-0' size={16} />
        <span>{LANG('取消关注')}</span>
      </>
    }

  }
  return (
    <>
      <div className={styles.followButton}>
        <Button
          rounded
          className={(isFollowing && isHovered) ? styles.cancelFollowing : ''}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={onClickHandler}
        >
          <div className={styles.commonButtonContent}>
            {renderContent()}
          </div>
        </Button>
      </div>
    </>
  );
};

export default FollowButton;
