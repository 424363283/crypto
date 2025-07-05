import { useTheme } from '@/core/hooks';
import { LANG } from '@/core/i18n';
import { clsx } from '@/core/utils';
import { Empty } from 'antd';
import type { EmptyProps } from 'antd/es/empty';
import css from 'styled-jsx/css';
import { Layer } from '../constants';

type Props = {
  active?: boolean;
  image?: string;
  text?: string;
  imagestyle?: any,
  className?: string;
  size?: 'small' | 'large' | 'default';
  layer?: Layer
} & EmptyProps;

export const EmptyComponent = ({
  active,
  image,
  text = LANG('暂无数据'),
  className,
  size,
  prefixCls,
  rootClassName,
  style,
  imagestyle,
  description,
  children,
  layer=Layer.Default
}: Props) => {
  const props = {
    prefixCls,
    rootClassName,
    style,
    imagestyle,
    description: text || description,
    children,
  };
  const { isDark } = useTheme();
  const isDefaultLayer = layer === Layer.Default;
  const lightIcon = isDefaultLayer ? '/static/icons/primary/common/empty-1.svg' : '/static/icons/primary/common/empty-2.svg'
  const darkIcon = isDefaultLayer ? '/static/icons/primary/common/dark/empty-1.svg' : '/static/icons/primary/common/dark/empty-2.svg'
  const _image = isDark ? darkIcon : lightIcon;

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
      height: 80px;
      margin-bottom: 8px;
      :global(img) {
        width: 80px;
        height: 80px;
      }
    }
    :global(.ant-empty-description) {
      font-size: 12px;
      color: var(--text_3);
      font-weight: 400;
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
  :global(.empty-img-wrapper.small) {
    margin: 16px auto;
    :global(.ant-empty-image) {
      height: 50px;
      margin-bottom: 16px;
      :global(img) {
        width: 50px;
        height: 50px;
      }
    }
    :global(.ant-empty-description) {
      font-size: 14px;
      font-weight: 300;
    }
  }
`;
