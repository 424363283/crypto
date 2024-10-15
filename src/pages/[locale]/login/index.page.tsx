import LoginCommonLayout, { Login as LoginPage } from '@/components/layouts/login';
import { Lang } from '@/core/i18n';

function Login() {
  return  <LoginPage />;
}
export default Lang.SeoHead(Login);
export const getStaticPaths = Lang.getStaticPaths;
export const getStaticProps = Lang.getStaticProps({ key: 'login' });
