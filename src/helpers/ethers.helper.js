import { ethers } from "ethers";


const ethersHelper = {
  async createAccount(state) {
    const { user, networks } = state;
    let selected = networks.find(x => x.selected);
    let nextAcct = user?.accounts.length;
    let mnemonic, wallet;
    
    let response = await fetch('http://localhost:5001/mnemonic')
    if(response.ok) {
      mnemonic = await response.text();
      wallet = ethers.Wallet.fromMnemonic(mnemonic);
      const privateKey = wallet.privateKey;
      return { name: `Account ${nextAcct + 1}`, network: selected.name, loginType: 'privateKey', value: privateKey, address: wallet.address, tokens: [] }
    }

    return null;
  }
};

export default ethersHelper;