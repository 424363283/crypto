import { TrLink } from '@/core/i18n/src/components/tr-link';
import { LANG } from '@/core/i18n/src/page-lang';
import { ThirdPartBtns } from '../components/third-part-btns';

export const RegisterFooter = () => {
  return (
    <>
      <p className='register-footer'>
        {LANG('已经是YMEX用户？')}
        <TrLink href='/login'>&nbsp;&nbsp;{LANG('登录')}</TrLink>
        <style jsx>
          {`
            .register-footer {
              text-align: center;
              display: block;
              text-align: center;
              font-size: 14px;
              font-weight: 400;
              color: var(--theme-font-color-3);
              padding-top: 46px;
              :global(a) {
                font-size: 14px;
                font-weight: 700;
                color: var(--skin-primary-color);
              }
            }
          `}
        </style>
      </p>
    </>
  );
};

