type ExternalLinkProps = {
    children: React.ReactNode;
    href: string;
    className?: string;
  };
  export const ExternalLink = (props: ExternalLinkProps) => {
    const { href, children, ...rest } = props;
    return (
      <a href={href} target='_blank' {...rest} rel='noopener nofollow'>
        {children}
      </a>
    );
  };
  