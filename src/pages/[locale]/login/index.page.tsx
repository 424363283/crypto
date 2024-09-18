import LoginCommonLayout from '@/components/layouts/login';
import { Lang } from '@/core/i18n';

function Login() {
  return  <LoginCommonLayout />;
}
export default Lang.SeoHead(Login);
export const getStaticPaths = Lang.getStaticPaths;
export const getStaticProps = Lang.getStaticProps({ key: 'login' });
