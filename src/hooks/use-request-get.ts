import { useCallback, useEffect, useState } from 'react';
import { get } from '../service';

export function useGet(init: {
  data?: any;
  timeout?: number;
  options?: any;
  status?: string;
  url: string;
} = {
  data: {},
  options: {},
  status: 'loading',
  url: '',
}) {
  const { data: initData, status: initStatus, url, timeout, options } = init;
  const [content, setContent] = useState<{ data: any; error?: any; status: string; requested: boolean; }>({
    data: initData,
    status: initStatus || 'loading',
    requested: false,
  });
  const retry = useCallback(() => {
    setContent((state) => ({ ...state, status: 'loading', requested: false }));
  }, []);

  useEffect(() => {
    if (url && !content.requested) {
      const controller = get(url, timeout, options);

      controller.start()
        .then(response => {
          setContent({ data: response, requested: true, status: 'complete' });
        })
        .catch((error) => {
          setContent({ data: initData, error, requested: true, status: 'error' });
        });
    }
  }, [content, initData, options, timeout, url]);

  if (!url) {
    return {
      url,
      retry,
      data: initData,
      error: 'invalid url',
      status: 'error',
    };
  }

  return { ...content, retry, url };
}
