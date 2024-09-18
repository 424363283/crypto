import LoginCommonLayout from '@/components/layouts/login';
import { Lang } from '@/core/i18n';

function Forget() {
  return <LoginCommonLayout />;
}
export default Lang.SeoHead(Forget);
export const getStaticPaths = Lang.getStaticPaths;
export const getStaticProps = Lang.getStaticProps({ key: 'login' });
