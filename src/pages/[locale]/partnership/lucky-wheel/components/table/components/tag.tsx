import { InfoCircleFilled } from '@ant-design/icons';

type ColorMapType = Record<
  'success' | 'error' | 'warning' | 'stop',
  {
    defaultBg: string;
    defaultColor: string;
  }
>;

const ColorMap: ColorMapType = {
  success: {
    defaultBg: 'rgba(67, 188, 156, 0.10)',
    defaultColor: '#43BC9C',
  },
  error: {
    defaultBg: 'rgba(240, 78, 63, 0.10)',
    defaultColor: '#F04E3F',
  },
  warning: {
    defaultBg: 'rgba(255, 211, 15, 0.10)',
    defaultColor: '#FFD30F',
  },
  stop: {
    defaultBg: 'rgba(76, 82, 82, 1)',
    defaultColor: '#9E9E9D',
  },
};

interface P {
  children: React.ReactNode;
  tagType: keyof ColorMapType;
  isIcon?: boolean;
}

const Tag: React.FC<P> = (props) => {
  const { children, tagType, isIcon } = props;
  return (
    <div className='luck-tag'>
      {isIcon && <InfoCircleFilled size={12} className='luck-icon' />}
      {children}
      <style jsx>{`
        .luck-tag {
          min-with: 54px;
          min-height: 24px;
          border-radius: 4px;
          background-color: ${ColorMap[tagType].defaultBg};
          color: ${ColorMap[tagType].defaultColor};
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 0 6px;
        }

        :global(.luck-icon) {
          margin-right: 4px;
        }
      `}</style>
    </div>
  );
};

export default Tag;
