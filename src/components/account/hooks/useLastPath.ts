import { useRouter } from '@/core/hooks/src/use-router';

export const useLastPath = () => {
  const router = useRouter();
  const pathname = router.pathname;
  const match = pathname?.match(/\/([\w-]+)$/);
  const lastPath = (match && match[1]) || 'login';
  return lastPath;
};
