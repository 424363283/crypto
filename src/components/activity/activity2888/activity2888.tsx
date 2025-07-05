import CommonIcon from '@/components/common-icon';
import { useResponsive, useRouter, useTheme } from '@/core/hooks';
import { resso, useResso } from '@/core/store';
import { preloadImg } from '@/core/utils';
import { useEffect } from 'react';

const store = resso(
  {
    visible: true,
  },
  { nameSpace: 'components_activity_activity2888' }
);

export const Activity2888 = () => {
  const { isMobile } = useResponsive();
  useResso(store);
  const router = useRouter();
  const { skin } = useTheme();

  const onClick = () => {
    router.push('/novice-task', undefined, { shallow: false });
  };
  const onClose = () => {
    store.visible = false;
  };

  useEffect(() => {
    // 移动端不加载图片
    if (!isMobile) {
      setTimeout(() => {
        ['/static/images/activity/activity2888_expand.png'].forEach((v) => {
          preloadImg(v, { cache: true });
        });
      }, 3000);
    }
  }, [isMobile]);

  if (!store.visible || isMobile) {
    return <></>;
  }
  return (
    <>
      <div className='activity2888'>
        {/* <div className='item'>
          <div className='bg' onClick={onClick}></div>
          <div className='close' onClick={onClose}>
            <CommonIcon name='common-active-close-0' size={8} enableSkin />
          </div>
        </div> */}
      </div>
      <style jsx>{`
        .activity2888 {
          cursor: pointer;
          position: fixed;
          left: -60px;
          bottom: 15%;
          z-index: 10;
          :global(.bg) {
            height: 60px;
            width: 80px;
            background-size: cover;
            background-position: 100% 100%;
            transition: all 0.1s;
            
          }
          &:hover {
            left:0;
            :global(.bg) {
              width: 153px;
              background: url('${skin === 'blue'
          ? '/static/images/activity/activity2888_expand-blue.png'
          : '/static/images/activity/activity2888_expand.png'}');
              background-size: cover;
              background-position: 100% 100%;
            }
          }
          :global(.close) {
            z-index: 1;
            position: absolute;
            right: -3px;
            bottom: 0;
            height: 16px;
            width: 16px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: var(--theme-primary-bg-color);
          }
        }
      `}</style>
    </>
  );
};

export default Activity2888;
