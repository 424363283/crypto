interface BlockExplorer {
    explorer: string;
    url: string;
  }
  
  interface Item {
    chain?: string;
    address?: string;
    txid: string;
  }
  
  type BlockExplorerMap = {
    [key: string]: BlockExplorer;
  };
  const explorerMap = require('./json/block-explorer.json');
  
  const blockExplorer: BlockExplorerMap = {
    btc: { explorer: 'https://blockchair.com/zh/bitcoin/transaction', url: 'Blockchair.com' },
    bitcoin: { explorer: 'https://blockchair.com/zh/bitcoin/transaction', url: 'Blockchair.com' },
    bsc: { explorer: 'https://bscscan.com/tx', url: 'Bscscan.com' },
    dogecoin: { explorer: 'https://dogechain.info/tx', url: 'Dogechain.info' },
    eosio: { explorer: 'https://eosflare.io/tx', url: 'Eosflare.io' },
    omni: { explorer: 'https://omniexplorer.info/tx', url: 'Omniexplorer.info' },
    trc20: { explorer: 'https://tronscan.org/#/transaction', url: 'Tronscan.org' },
    tron: { explorer: 'https://tronscan.org/#/transaction', url: 'Tronscan.org' },
    trx: { explorer: 'https://tronscan.org/#/transaction', url: 'Tronscan.org' },
  };
  export const switchBlockUrl = (item: Item) => {
    let key = item.chain && item.address ? item.chain.toLowerCase() : '';
    let web = '';
    let url = '';
    if (explorerMap[key] && item.txid) {
      web = explorerMap[key].explorer + `/${item.txid}`;
      url = explorerMap[key].url;
    } else if (blockExplorer[key]) {
      const explorer = blockExplorer[key];
      web = `${explorer.explorer}/${item.txid}`;
      url = explorer.url;
    } else if (key.toUpperCase() === 'ERC20' || key.toUpperCase() === 'ETHER') {
      web = `https://etherscan.io/tx/${item.txid}`;
      url = 'Etherscan.io';
    } else if (key.toUpperCase() === 'RIPPLE' || key.toUpperCase() === 'XRP') {
      web = `https://livenet.xrpl.org/transactions/${item.txid}`;
      url = 'Livenet.xrpl.org';
    }
    return {
      web,
      url,
    };
  };
  