import { getPaymentsApi, getSupportsApi, renderPaymentApi } from '@/core/api';

let bankOptions: any = {
  usd: [
    {
      code: 'BBL',
      name: 'Bangkok Bank',
    },
    {
      code: 'BOA',
      name: 'Bank of Ayudhya (Krungsri)',
    },
    {
      code: 'KKR',
      name: 'Kasikorn Bank',
    },
    {
      code: 'KTB',
      name: 'Krung Thai Bank',
    },
    {
      code: 'SCB',
      name: 'Siam Commercial Bank',
    },
    {
      code: 'TMB',
      name: 'TMB Bank',
    },
  ],
  idr: [
    {
      code: 'BCA',
      name: 'Bank Central Asia',
    },
    {
      code: 'BNI',
      name: 'Bank Negara Indonesia',
    },
    {
      code: 'BRI',
      name: 'Bank Rakyat Indonesia',
    },
    {
      code: 'MDR',
      name: 'Mandiri Bank',
    },
    {
      code: 'CIMBN',
      name: 'CIMB Niaga',
    },
  ],
  vnd: [
    {
      code: 'ACB',
      name: 'Asia Commercial Bank',
    },
    {
      code: 'BIDV',
      name: 'Bank for Investment and Development of Vietnam',
    },
    {
      code: 'DAB',
      name: 'DongA Bank',
    },
    {
      code: 'EXIM',
      name: 'Exim Bank',
    },
    {
      code: 'SACOM',
      name: 'Sacom Bank',
    },
    {
      code: 'TCB',
      name: 'Techcom Bank',
    },
    {
      code: 'VCB',
      name: 'Vietcom Bank',
    },
    {
      code: 'VTB',
      name: 'Vietin Bank',
    },
  ],
  thb: [
    {
      code: 'BBL',
      name: 'Bangkok Bank',
    },
    {
      code: 'BOA',
      name: 'Bank of Ayudhya',
    },
    {
      code: 'KKR',
      name: 'Kasikorn Bank',
    },
    // {
    //   code: 'KTB',
    //   name: 'Krung Thai Bank',
    // },
    // {
    //   code: 'SCB',
    //   name: 'Siam Commercial Bank',
    // },
    {
      code: 'TMB',
      name: 'TMB Bank',
    },
  ],
};

export class FiatCrypto {
  // 图片地址
  public static imgUrl = '/static/images/fiat-crypto';

  // 支付logo地址
  public static bankImages: any = {
    idr: {
      bca: this.imgUrl + '/banks/idr/bca.png',
      bni: this.imgUrl + '/banks/idr/bni.png',
      bri: this.imgUrl + '/banks/idr/bri.png',
      cimbn: this.imgUrl + '/banks/idr/cimbn.png',
      mdr: this.imgUrl + '/banks/idr/mdr.png',
    },
    methods: {
      bank: this.imgUrl + '/banks/methods/bank.png',
      momo: this.imgUrl + '/banks/methods/momo.png',
      viettel: this.imgUrl + '/banks/methods/viettel.png',
      zalo: this.imgUrl + '/banks/methods/zalo.png',
    },
    thb: {
      bbl: this.imgUrl + '/banks/thb/bbl.png',
      boa: this.imgUrl + '/banks/thb/boa.png',
      kkr: this.imgUrl + '/banks/thb/kkr.png',
      ktb: this.imgUrl + '/banks/thb/ktb.png',
      scb: this.imgUrl + '/banks/thb/scb.png',
      tmb: this.imgUrl + '/banks/thb/tmb.png',
    },
    usd: {
      bank: this.imgUrl + '/banks/usd/bank.png',
      boa: this.imgUrl + '/banks/usd/boa.png',
      kkr: this.imgUrl + '/banks/usd/kkr.png',
      ktb: this.imgUrl + '/banks/usd/ktb.png',
      scb: this.imgUrl + '/banks/usd/scb.png',
      tmb: this.imgUrl + '/banks/usd/tmb.png',
    },
    vnd: {
      acb: this.imgUrl + '/banks/vnd/acb.png',
      bidv: this.imgUrl + '/banks/vnd/bidv.png',
      dab: this.imgUrl + '/banks/vnd/dab.png',
      exb: this.imgUrl + '/banks/vnd/exb.png',
      exim: this.imgUrl + '/banks/vnd/exim.png',
      sacom: this.imgUrl + '/banks/vnd/sacom.png',
      vcb: this.imgUrl + '/banks/vnd/vcb.png',
      vtb: this.imgUrl + '/banks/vnd/vtb.png',
      tcb: this.imgUrl + '/banks/vnd/tcb.svg',
    },
  };

  // 格式化银行卡选项
  public static formatGetBankOptions = (next: any) => {
    return Object.keys(next).reduce((all, key) => {
      const newGroup = next[key].map((group: any) => {
        return { ...group, icon: this.bankImages[key]?.[group.code.toLowerCase()] };
      });
      return { ...all, [key]: newGroup };
    }, {});
  };

  // 银行卡对象
  public static BankOptions: any = this.formatGetBankOptions(bankOptions);

  // 获取支付对象
  public static getBankOptions = (currency: string) => {
    return this.BankOptions[currency?.toLowerCase()] || this.BankOptions['usd'];
  };

  // 选择固定金额的支付方式
  public static AMOUNT_CODES = ['VNMOMO'];

  // 判断是否为固定金额支付
  public static isAmountCode = (code: string) => this.AMOUNT_CODES.includes(code);

  // 选择银行卡的支付方式
  public static BANK_CODES: any = ['VNPAY', 'MONEY'];
  public static isBankCode = (code: string) => this.BANK_CODES.includes(code) || this.BANK_CODES.some((v: string) => code.includes(v));
  public static formatBankCode = (method: any, code: string, currency: string) => {
    const isMethod = (val: string) => method === val || method.includes(val);
    const isVNPAY = isMethod(this.BANK_CODES[0]);
    switch (currency.toLowerCase()) {
      case 'vnd':
        if (isVNPAY) {
          if (code === 'SACOM') {
            return 'SAC';
          } else if (code === 'EXIM') {
            return 'EXB';
          }
        }
    }

    return code;
  };
  // 固定金额选项
  public static AmountOptions = [200000, 300000, 500000, 1000000, 2000000, 5000000];

  // 获取商家
  public static getPayments(data: { target: string; source: string; amount: number | string }): Promise<{
    data: [];
  }> {
    return new Promise(async (resolve, reject) => {
      try {
        let result = await getPaymentsApi(data);
        resolve({
          data: result?.data,
        });
      } catch (err) {
        reject(err);
      }
    });
  }

  // 获取商家
  public static getSupports(type?: number): Promise<{ data: {} }> {
    return new Promise(async (resolve, reject) => {
      try {
        let result = await getSupportsApi(type);
        resolve({
          data: result?.data,
        });
      } catch (err) {
        reject(err);
      }
    });
  }

  // 交易
  public static renderPayment(data: any, srcCurrency: string, currency: string, money: any = 1): Promise<{}> {
    return new Promise(async (resolve, reject) => {
      try {
        let obj: any = {};
        for (let o of data) {
          let [key, val] = o.split('=');
          obj[key] = val;
        }
        obj.amount = money;
        obj.target = currency;
        obj.source = srcCurrency;
        obj.payment = obj.type;
        let result = await renderPaymentApi(obj);
        resolve(result?.data || {});
      } catch (err) {
        reject(err);
      }
    });
  }
}
