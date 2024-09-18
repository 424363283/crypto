import { ImageHover } from '@/components/image';
import { useTheme } from '@/core/hooks';
import { clsx } from '@/core/utils';

const EditButton = ({ onClick, className, hovered }: { onClick?: any; className?: string; hovered?: boolean }) => {
  const { isDark } = useTheme();

  // useEffect(() => {
  //   ['/static/images/trade/position/edit_light.svg'].forEach((v) => {
  //     preloadImg(v, { cache: true });
  //   });
  // }, []);

  return (
    <>
      <div onClick={onClick} className={clsx('button', className, !isDark && 'light')}>
        <ImageHover
          src='common-edit-pen-0'
          hovered={hovered}
          hoverSrc={'common-edit-pen-active-0'}
          height={25}
          width={25}
          enableSkin
        />
      </div>
      <style jsx>{`
        .button {
          width: 25px;
          height: 25px;
          display: flex;
          justify-content: center;
          align-items: center;
          cursor: pointer;
        }
      `}</style>
    </>
  );
};

export default EditButton;
