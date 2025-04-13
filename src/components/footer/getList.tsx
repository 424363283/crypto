import { LANG, Lang } from '@/core/i18n';

export const getList = (locale: string) => {
  const lang = locale;
  const language = Lang.getLanguageHelp(lang);
  // 获取环境变量
  const enableLite = process.env.NEXT_PUBLIC_LITE_ENABLE === 'true';
  const list: { label: string; children: { label: string; href: string; blank?: boolean; tooltip?: boolean }[] }[] = [
    {
      label: process.env.NEXT_PUBLIC_APP_NAME,
      children: [
        // {
        //   label: LANG('关于我们'),
        //   href: `/about`,
        // },
        // {
        //   label: LANG('工作机会'),
        //   href: `/recruit `,
        // },
        // {
        //   label: LANG('全球社群'),
        //   href: `/community`,
        // },
        // {
        //   label: LANG('媒体工具包'),
        //   href: `/brand`,
        // },
        // {
        //   label: LANG('Announcements'),
        //   href: `https://ymex.zendesk.com/hc/${language}/categories/5708257368591-Announcements`,
        //   blank: true,
        // },
        // {
        //   label: LANG('Press and media'),
        //   href: `/news`,
        // },
        // {
        //   label: LANG('官方博客'),
        //   href: `https://www.y-mex.com/blog`,
        //   blank: true,
        // },
        // {
        //   label: LANG('Partners Program'),
        //   href: `/partners`,
        // },
        {
          label: LANG('举报通道'),
          href: ``,
          tooltip: true,
        },
        {
          label: LANG('隐私协议'),
          href: `https://ymex.zendesk.com/hc/${ language }/articles/11321192583311-%E9%9A%B1%E7%A7%81%E6%94%BF%E7%AD%96`,
          blank: true,
        },
        // {
        //   label: LANG('意见反馈____1'),
        //   href: `/feedback`,
        // },
      ],
    },
    {
      label: LANG('Products'),
      children: [
        // {
        //   label: LANG('Spot'),
        //   href: `/spot/btc_usdt`,
        // },
        // {
        //   label: LANG('Inverse Perpetual'),
        //   href: `/swap/btc-usd`,
        // },
        {
          label: LANG('U本位合约'),
          href: `/swap/btc-usdt`,
        },
        // {
        //   label: LANG('Lite Futures'),
        //   href: `/lite/btcusdt`,
        // },
      ].filter((item) => {
        if (item.label === LANG('Lite Futures')) {
          return enableLite;
        }
        return true;
      }),
    },
    {
      label: LANG('Support'),
      children: [
        {
          label: LANG('Help Center'),
          href: `https://ymex.zendesk.com/hc/${language}`,
          blank: true,
        },
        // {
        //   label: LANG('官方验证渠道'),
        //   href: `/official-verification`,
        // },
        {
          label: LANG('FAQ'),
          href: `  https://ymex.zendesk.com/hc/${language}/categories/11306769511567-YMEX-FAQ`,
          blank: true,
        },
        // {
        //   label: LANG('Trading Fees'),
        //   href: `https://ymex.zendesk.com/hc/${language}/articles/5699103361551-Transaction-Fee-Calculation`,
        //   blank: true,
        // },
        // {
        //   label: LANG('User Feedback'),
        //   href: `https://ymex.zendesk.com/hc/${language}/requests/new`,
        //   blank: true,
        // },
        // {
        //   label: LANG('Contact Us'),
        //   href: `https://ymex.zendesk.com/hc/${language}/sections/5754801031951-Contact-Us`,
        //   blank: true,
        // },
      ],
    },
    {
      label: LANG('Services'),
      children: [
        // {
        //   label: LANG('Buy Crypto'),
        //   href: `/fiat-crypto`,
        // },
        // {
        //   label: LANG('Affiliate Program'),
        //   href: `/partnership/affiliate`,
        // },
        // {
        //   label: LANG('Affiliate Center'),
        //   href: `/${lang}/affiliate/dashboard`,
        //   blank: true,
        // },
        // {
        //   label: LANG('vip服务'),
        //   href: `/vip`,
        // },
        // {
        //   label: LANG('Listing Application'),
        //   href: `https://ymex.zendesk.com/hc/en-us/articles/5990396901647`,
        //   blank: true,
        // },
        // {
        //   label: 'API',
        //   href: `https://ymexcryptoexchange.github.io/apidoc/docs/zh/futures/base-info.html`,
        //   blank: true,
        // },
        // {
        //   label: LANG('Cooperation'),
        //   href: `https://forms.gle/9BPk7fCN8YxSBepT8`,
        //   blank: true,
        // },
        {
          label: LANG('浏览器'),
          href: 'https://blockchair.com/bitcoin/transaction/2006061a239c140fbe1e995d10f7144a86615b6b3746a48ba9434a9e493c0e9f?from=y-mex',
          blank: true,
        },
        // {
        //   label: LANG('网站地图'),
        //   href: `/sitemap`,
        //   blank: false,
        // },
        // {
        //   label: LANG('在线状态'),
        //   href: `/online-status`,
        //   blank: false,
        // },
      ],
    },
    // {
    //   label: LANG('买币'),
    //   children: [
    //     {
    //       label: LANG('买币指南'),
    //       href: `/how-to-buy`,
    //       blank: false,
    //     },
    //     {
    //       label: LANG('加密货币价格'),
    //       href: `/price`,
    //       blank: false,
    //     },
    //     {
    //       label: `BTC ${LANG('价格')}`,
    //       href: `/price/btc`,
    //       blank: false,
    //     },
    //     {
    //       label: `ETH ${LANG('价格')}`,
    //       href: `/price/eth`,
    //       blank: false,
    //     },
    //     {
    //       label: `XRP ${LANG('价格')}`,
    //       href: `/price/xrp`,
    //       blank: false,
    //     },
    //     {
    //       label: `${LANG('如何购买')} BTC`,
    //       href: `/how-to-buy/btc`,
    //       blank: false,
    //     },
    //     {
    //       label: `${LANG('如何购买')} ETH`,
    //       href: `/how-to-buy/eth`,
    //       blank: false,
    //     },
    //     {
    //       label: `${LANG('如何购买')} XRP`,
    //       href: `/how-to-buy/xrp`,
    //       blank: false,
    //     },
    //     {
    //       label: `${LANG('如何购买')} DOGE`,
    //       href: `/how-to-buy/doge`,
    //       blank: false,
    //     },
    //     {
    //       label: `${LANG('如何购买')} SHIB`,
    //       href: `/how-to-buy/shib`,
    //       blank: false,
    //     },
    //     {
    //       label: `${LANG('加密公告')}`,
    //       href: `/notices`,
    //       blank: false,
    //     },
    //   ],
    // },
  ];
  return list;
};
