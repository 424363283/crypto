import { useEffect } from 'react';

/**
 * Description:
 * @param {event} callback:(event:MouseEvent)
 * @returns {void}
 */
const useDocumentClick = (callback: (event: MouseEvent) => void) => {
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (callback && typeof callback === 'function') {
        callback(event);
      }
    };

    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, [callback]);
};

export { useDocumentClick };
