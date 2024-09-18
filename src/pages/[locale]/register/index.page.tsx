import RegisterPage from '@/components/layouts/register';
import { Lang } from '@/core/i18n/src/page-lang';

function Register() {
  return <RegisterPage />;
}
export default Lang.SeoHead(Register);
export const getStaticPaths = Lang.getStaticPaths;
export const getStaticProps = Lang.getStaticProps({ key: 'register' });
