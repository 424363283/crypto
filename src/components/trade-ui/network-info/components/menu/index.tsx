import Link from 'next/link';
import { useHover } from 'react-use';
import { Content } from './context';

export const Menu = ({
  label,
  onClick,
  icon,
  href,
  newest,
  last,
}: {
  label: string;
  onClick?: any;
  icon: string[];
  href?: string;
  newest?: boolean;
  last?: boolean;
}) => {
  const [content, hovered] = useHover((hovered) => (
    <Content hovered={hovered} label={label} onClick={onClick} icon={icon} newest={newest} last={last} />
  ));

  return href ? (
    <Link href={href} target='__blank'>
      {content}
    </Link>
  ) : (
    content
  );
};
