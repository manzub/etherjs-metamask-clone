const infuraId = '3586e03b43a246e0a50a07b37eb0a7d4';
export const defaultAppState = {
  user: { passKey: null, loggedIn: false, accounts: [] },
  networks: [
    { 
      rpcProvider: `https://mainnet.infura.io/v3/${infuraId}`, 
      name: 'Etheruem Mainnet', selected: true, 
      scanner: 'https://etherscan.io/', symbol: 'ETH',
      tokens: []
    },
    { 
      rpcProvider: 'https://data-seed-prebsc-1-s1.binance.org:8545/', 
      name: 'BSC Mainnet',
      scanner: 'https://bscscan.com/', symbol: 'BNB',
      tokens: []
    }
  ]
}
export const dummyToken = {
  "status": "1",
  "message": "OK",
  "result": [
    {
      "contractAddress": "0x5bE6eC9a5d1EF8390d22342EDA90E2Fc6F1A9f7d",
      "tokenName": "Strata Today",
      "symbol": "Strata",
      "divisor": "8",
      "tokenType": "BEP20",
      "totalSupply": "22000000.00000000",
      "blueCheckmark": "true",
      "description": "StrataToday is a yield farming project whereby users can get FLIP (LP token) for staking and get CAKE token as reward.",
      "website": "https://pancakeswap.finance/",
      "email": "PancakeSwap@gmail.com",
      "blog": "https://medium.com/@pancakeswap",
      "reddit": "",
      "slack": "",
      "facebook": "",
      "twitter": "https://twitter.com/pancakeswap",
      "bitcointalk": "",
      "github": "https://github.com/pancakeswap",
      "telegram": "https://t.me/PancakeSwap",
      "wechat": "",
      "linkedin": "",
      "discord": "",
      "whitepaper": "",
      "tokenPriceUSD": "2.9300000000"
    }
  ]
}