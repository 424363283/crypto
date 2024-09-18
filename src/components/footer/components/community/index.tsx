import CommonIcon from '@/components/common-icon';
import { ExternalLink } from '@/components/link';
import { FACEBOOK, TELEGRAM } from '@/core/shared';
import { useAppContext } from '@/core/store';
import { MediaInfo } from '@/core/utils';
import css from 'styled-jsx/css';

export const CommunityLogo = () => {
  const { locale } = useAppContext();
  const telegram = TELEGRAM[locale] || TELEGRAM['en'];
  const _facebook = FACEBOOK[locale] || FACEBOOK['en'];
  const server = [
    {
      url: 'https://coinmarketcap.com/exchanges/y-mex/',
      logo: 'external-coinmarketcap-grey-0',
    },
    {
      url: 'https://twitter.com/YMEX',
      logo: 'external-twitter-grey-0',
    },
    {
      url: telegram,
      logo: 'external-telegram-grey-0',
    },
    {
      url: _facebook,
      logo: 'external-facebook-grey-0',
    },
    {
      url: 'https://www.instagram.com/y-mex_official/',
      logo: 'external-insgram-grey-0',
    },
    {
      url: 'https://www.linkedin.com/company/y-mex',
      logo: 'external-linkedin-grey-0',
    },
    {
      url: 'https://www.youtube.com/@YMEXOfficial',
      logo: 'external-youtube-grey-0',
    },
    {
      url: 'https://discord.gg/VJjYhsWegV',
      logo: 'external-discord-0',
    },
    {
      url: 'https://medium.com/y-mex',
      logo: 'external-medium-grey-0',
    },
    {
      url: 'https://www.coingecko.com/en/exchanges/y-mex',
      logo: 'external-coingecko-grey-0',
    },
    {
      url: 'https://www.reddit.com/r/XKCryptoExchange/',
      logo: 'external-reddit-grey-0',
    },
  ];
  return (
    <>
      {server?.map((item, key) => {
        return (
          <ExternalLink href={item.url} key={key} className='community-logo'>
            <CommonIcon name={item.logo} size={25} />
            <style jsx>{styles}</style>
          </ExternalLink>
        );
      })}
    </>
  );
};
const styles = css`
  :global(.community-logo) {
    margin-right: 24px;
    :global(img) {
      @media ${MediaInfo.mobile} {
        margin-top: 10px;
      }
    }
    @media ${MediaInfo.mobile} {
      line-height: 20px;
    }
    @media ${MediaInfo.tablet} {
      line-height: 40px;
    }
  }
`;
