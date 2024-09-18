/* Lint Data Feeds  */
import CoinLogo from '@/components/coin-logo';
import SponsorsLogo from '@/components/sponsors';
import { MediaInfo, message } from '@/core/utils';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import css from 'styled-jsx/css';
import { store } from '../../../store';
import { CURRENT_VIEW } from '../../../types';
const chainLink = require('./chainLink.json');

let timer: ReturnType<typeof setInterval> = setInterval(() => {});
interface FeedsProps {
  search?: string;
}
const Feeds = (props: FeedsProps) => {
  const { search = '' } = props;
  const { currentView } = store;
  const showFeeds = currentView === CURRENT_VIEW.FEEDS;
  const [linkData, setLinkData] = useState<any[]>([]);

  const _getLinkData = () => {
    fetch(`/api/public/chainlink/price`)
      .then((response) => response.json())
      .then(({ code, data = {}, message: errorMsg }) => {
        if (code === 200) {
          const remoteLinkData = Object.keys(data).map((key) => {
            let sort = 99;
            switch (key) {
              case 'BTC/USD':
                sort = 0;
                break;
              case 'ETH/USD':
                sort = 1;
                break;
            }
            return {
              name: key,
              price: data[key],
              sort,
              ...chainLink[key],
            };
          });
          setLinkData(remoteLinkData);
        } else {
          message.error(errorMsg);
        }
      });
  };

  useEffect(() => {
    _getLinkData();
    timer = setInterval(() => {
      _getLinkData();
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  const _filterLinkData = (linkData: any = []) => {
    return linkData
      .filter((item: any) => item.name?.search(new RegExp(search, 'i')) !== -1)
      .sort((a: any, b: any) => a.sort - b.sort);
  };
  const filterLinkData = _filterLinkData(linkData);

  return (
    <div className='link-data-box' style={{ display: showFeeds ? 'grid' : 'none' }}>
      {filterLinkData?.map(({ name, price, digit = 2, sponsors }: any) => {
        return (
          <div className='item' key={name}>
            <p className='name'>
              <CoinLogo width={24} height={24} className='coin-logo' coin={name.replace('/USD', '')} />
              {name}
            </p>
            <p className='price'>${price?.toFormat(digit)}</p>
            <div className='footer'>
              <div className='status area'>
                <p className='first'>Status</p>
                <p className='last'>
                  <Image
                    alt=''
                    src='/static/images/common/success.png'
                    style={{ marginRight: '6px' }}
                    width='20'
                    height='20'
                  />
                  Active
                </p>
              </div>
              {!!sponsors?.length && (
                <div className='sponsors area'>
                  <p className='first'>Sponsors</p>
                  <p className='last'>
                    {sponsors?.map((item: string, i: number) => {
                      return <SponsorsLogo className='sponsors-logo' name={item} key={i} />;
                    })}
                  </p>
                </div>
              )}
            </div>
          </div>
        );
      })}

      <style jsx>{styles}</style>
    </div>
  );
};
export default Feeds;

const styles = css`
  .link-data-box {
    display: grid;
    grid-gap: 20px;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    margin-top: 30px;
    @media ${MediaInfo.tablet} {
      grid-template-columns: 1fr 1fr;
      grid-gap: 24px;
    }
    @media ${MediaInfo.mobile} {
      grid-template-columns: 1fr;
      grid-gap: 10px;
    }
    .item {
      background: #f9f9f9;
      border-radius: 10px;
      width: 100%;
      height: 148px;
      padding: 18px;
      p {
        margin-bottom: 0;
      }
      .name {
        margin: 0;
        display: flex;
        align-items: center;
        font-size: 16px;
        font-weight: 500;
        color: #1e2329;
        :global(.coin-logo) {
          width: 24px;
          height: 24px;
          margin-right: 8px;
          border-radius: 50%;
        }
      }
      .price {
        font-size: 20px;
        font-weight: 500;
        color: #1e2329;
        padding: 4px 0;
        margin: 0;
      }
      .footer {
        display: flex;
        align-items: center;
        .area {
          flex: 1 1;
          .first {
            font-size: 12px;
            font-weight: 500;
            color: #838c9a;
          }
          .last {
            font-size: 14px;
            font-weight: 500;
            color: #333;
            display: -webkit-flex;
            display: flex;
            align-items: center;
            height: 26px;
            margin-top: 6px;
          }
        }
        .sponsors {
          .last {
            :global(img) {
              width: 16px;
              height: 16px;
              border-radius: 50%;
              margin-right: 6px;
            }
          }
        }
      }
    }
  }
`;
