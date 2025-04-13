export type Object = { [key: string]: any };
export type ObjectType = { [key: string]: any };
export type ObjectArray = Object[];

export type LongShortType = { long: string; short: string };

export type AgentExperienceMoneyType = {
  data: {
    experienceMoney: {
      id: string;
      title: string;
      condition: any;
      amount: string;
      startTime: number;
      endTime: number;
      status: string;
    };
    isValid: boolean;
  };
};

export type AdvertiseWindowType = {
  data: {
    banners: [
      {
        title: '';
        subTitle: '';
        text: '';
        targetLink: '';
        imageUrl: '';
        bgImageUrl: '';
        titleStyle: {
          size: 11;
          color: '1235';
        };
        subtitleStyle: {
          size: 11;
          color: '1235';
        };
      },
    ];
    menus: [
      {
        title: '';
        subTitle: '';
        tag: '';
        targetLink: '';
        imageUrl: '';
      },
    ];
    tradeFixed: [
      {
        title: '';
        subTitle: '';
        tag: '';
        targetLink: '';
        imageUrl: '';
      },
    ];
    tradeUSDTFixed: [
      {
        title: '';
        subTitle: '';
        tag: '';
        targetLink: '';
        imageUrl: '';
      },
    ];
    tradeOmniFixed: [
      {
        title: '';
        subTitle: '';
        tag: '';
        targetLink: '';
        imageUrl: '';
      },
    ];
    tradeUSDCFixed: [
      {
        title: '';
        subTitle: '';
        tag: '';
        targetLink: '';
        imageUrl: '';
      },
    ];
    tradeNotificationArea: [
      {
        title: '';
        text: '';
        subTitle: '';
        tag: '';
        targetLink: '';
        imageUrl: '';
      },
    ];
  };
};
