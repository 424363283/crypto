import CommonIcon from '@/components/common-icon';
import { GuideMenu as GuideMenuWrap } from '@/components/trade-ui/trade-view/swap/components/guide-menu';

export const GuideMenu = () => {
  return (
    <>
      <GuideMenuWrap>
        {(visible) => {
          return (
            <div className={'book-icon'}>
              <CommonIcon size={24} name='common-info-book-0' />
            </div>
          );
        }}
      </GuideMenuWrap>
      <style jsx>
        {`
          .book-icon {
            cursor: pointer;
            line-height: 0;
          }
        `}
      </style>
    </>
  );
};
