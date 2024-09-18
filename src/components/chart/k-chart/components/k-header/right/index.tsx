import { Desktop, MobileOrTablet } from '@/components/responsive';
import { useRouter } from 'next/router';
import { DesktopLayout } from './media/desktop';
import { MobileLayout } from './media/mobile';

export const Right = ({ id, qty }: any) => {
  const { query = {} } = useRouter();
  const isTypeKline = query.type === 'kline';
  if (isTypeKline) {
    return <MobileLayout id={id} qty={qty} />;
  }
  return (
      <>
        <Desktop>
          <DesktopLayout id={id} qty={qty} />
        </Desktop>
        <MobileOrTablet>
          <MobileLayout id={id} qty={qty} />
        </MobileOrTablet>
      </>
  );
};
