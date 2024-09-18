import { useTheme } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { clsx } from '@/core/utils';
import { Empty } from 'antd';
import type { EmptyProps } from 'antd/es/empty';
import css from 'styled-jsx/css';

type Props = {
  active?: boolean;
  image?: string;
  text?: string;
  className?: string;
  size?: 'small' | 'large' | 'default';
} & EmptyProps;

export const EmptyComponent = ({
                                 active,
                                 image,
                                 text = LANG('无此资料'),
                                 className,
                                 size,
                                 prefixCls,
                                 rootClassName,
                                 style,
                                 imageStyle,
                                 description,
                                 children,
                               }: Props) => {
  const props = {
    prefixCls,
    rootClassName,
    style,
    imageStyle,
    description: text || description,
    children,
  };
  const { isDark } = useTheme();

  const _image = isDark ? '/static/images/common/empty-dark.svg' : '/static/images/common/empty.svg';

  return (
      <Empty
          className={clsx('empty-img-wrapper', size, className)}
          {...props}
          description={<span>{text}</span>}
          image={image || _image}
      >
        <style jsx>{styles}</style>
      </Empty>
  );
};
const styles = css`
  :global(.empty-img-wrapper) {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    margin: 30px auto;
    :global(.ant-empty-image) {
      height: 48px;
      margin-bottom: 5px;
      :global(img) {
        width: 48px;
        height: 48px;
      }
    }
    :global(.ant-empty-description) {
      font-size: 12px;
      font-weight: 300;
      color: #798296;
    }
    &.md {
      :global(.ant-empty-image) {
        height: 68px;
        margin-bottom: 16px;
        :global(img) {
          width: 68px;
          height: 68px;
        }
      }
      :global(.ant-empty-description) {
        font-size: 14px;
        font-weight: 300;
      }
    }
    &.lg {
      :global(.ant-empty-image) {
        height: 80px;
        margin-bottom: 20px;
        :global(img) {
          width: 80px;
          height: 80px;
        }
      }
      :global(.ant-empty-description) {
        font-size: 16px;
        font-weight: 300;
      }
    }
  }
`;
