import { VerifyForm } from '@/components/account/verify';
import { LANG } from '@/core/i18n';
import { SENCE } from '@/core/shared';
import { MainContent } from './main-content';

export const BindGaVerify = ({ prev, secret }: { prev: (num?: number) => void; secret: string }) => {
  return (
    <MainContent className='ga-verify-container' title={LANG('步骤4')}>
      <VerifyForm prev={prev} secret={secret} modelSence={SENCE.BIND_GA} />
    </MainContent>
  );
};
