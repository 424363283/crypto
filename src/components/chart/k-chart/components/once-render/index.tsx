import { useEffect, useState } from 'react';

export const OnceRender = ({ children, render }: any) => {
  const [rendered, setRendered] = useState<boolean>(render);
  const [display, setDisplay] = useState<boolean>(render);
  useEffect(() => {
    if (render) setRendered(render);
    setDisplay(render);
  }, [render]);

  return (
    <div
      style={{
        zIndex: display ? 1 : -1,
        position: 'absolute',
        top: 0,
        left: 0,
        height: '100%',
        width: '100%',
        display: 'flex',
      }}
    >
      {rendered && children}
    </div>
  );
};
