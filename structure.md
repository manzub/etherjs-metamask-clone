localStorage structure:

user: - {
  passKey: string,
  loggedIn: boolean
  accounts: [ account: -{
    name: string,
    loginType: enum { privateKey/mnemonic },
    value: string,
    network: Networks.name,
    tokens: [ ...Tokens.name ]
  } ]
}
networks: - {
  rpcProvider: string,
  name: string,
  scanner: string,
  tokens: [ token: - {
    address: string,
    abi: JSON string,
    provider: this.network
  } ]
}
