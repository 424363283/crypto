import { clsx } from '../switch';

export const BounsAvatar = ({ size, url, className }: { size: number; url?: string; className?: string }) => {
  return (
    <>
      <div className={clsx('bouns-avatar', className)} style={{ backgroundImage: `url(${url})` }}></div>
      <style jsx>{`
        .bouns-avatar {
          height: ${size}px;
          width: ${size}px;
          border-radius: 50%;
          background-size: 100% 100%;
          background-position: center;
        }
      `}</style>
    </>
  );
};
