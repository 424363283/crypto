import { useCallback, useEffect, useState } from 'react';
import { post } from '../service';

export function usePost(init: {
  initData?: any;
  timeout?: number;
  payload?: any;
  options: any;
  status: string;
  url: string;
} = {
  initData: {},
  options: {},
  payload: {},
  status: 'loading',
  url: '',
}) {
  const { initData, status: initStatus, url, timeout, options, payload } = init;
  const [content, setContent] = useState<{
    data: any;
    error?: any;
    status: string;
    requested: boolean;
  }>({
    data: initData,
    status: initStatus,
    requested: false,
  });
  const retry = useCallback(() => {
    setContent((state) => ({ ...state, status: 'loading', requested: false }));
  }, []);

  useEffect(() => {
    if (url && !content.requested) {
      const controller = post(url, payload, timeout, options);

      controller.start()
        .then(response => {
          setContent({ data: response, requested: true, status: 'complete' });
        })
        .catch((error) => {
          setContent({ data: initData, error, requested: true, status: 'error' });
        });

      return () => {
        if (content.status === 'loading') {
          controller.abort();
        }
      };
    }
  }, [content, initData, options, payload, timeout, url]);


  if (!url) {
    return {
      url,
      retry,
      data: initData,
      error: 'invalid url',
      status: 'error',
    };
  }

  return {
    ...content, retry, url };
}
