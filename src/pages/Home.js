import React from "react";
import { NavLink, Tab } from "react-bootstrap";
import { useClipboard } from "use-clipboard-copy";
import Dropdown from "../components/Dropdown";
import { Dropdown as ReactDropdown } from "react-bootstrap";
import { ethers } from "ethers";
import AccountDetails from "../components/AccountDetails";
import Avatar from "react-avatar";
import useOnlineStatus from "../helpers/onlineStatus";
import ImportToken from "../components/ImportToken";

export default function Home({ value: appState }) {
  const isOnline = useOnlineStatus();
  const clipboard = useClipboard({ copiedTimeout: 2000 });
  const { user, networks } = appState.state;
  const [key, setKey] = React.useState('assets');
  const [accountBalance, setBalance] = React.useState(0);
  const [usdBalance, setUSDBalance] = React.useState(0.00);
  const [tokens, setTokens] = React.useState([]);
  const [viewAccount, toggleViewAccount] = React.useState(false);
  const [newToken, toggleNewToken] = React.useState(false);

  const activeNetwork = networks.find(x => x.selected);
  const activeAccount = user.accounts.find(x => x.selected);
  const wallet = new ethers.Wallet(activeAccount.value, new ethers.providers.JsonRpcProvider(activeNetwork.rpcProvider));

  React.useEffect(() => {
    // setInterval(() => {
    isOnline && wallet.getBalance().then(async function (balance) {
      let accountBalance = parseFloat(balance);
      setBalance(accountBalance > 0 ? accountBalance.toFixed(2) : 0);
      let url = `https://rest.coinapi.io/v1/exchangerate/${activeNetwork.symbol}/USD`;
      const response = await fetch(url, { method: 'GET', headers: { 'X-CoinAPI-Key': 'CB5B8570-893A-4ED6-A0FA-86746E7C6E4E' } })
      if (response.ok) {
        let body = await response.json();
        let usdBalance = parseFloat(body.rate) * parseFloat(balance)
        setUSDBalance(parseFloat(usdBalance).toFixed(2))
      }
    })
    // }, 5000);
  })

  React.useEffect(() => {
    let tokens = [...activeAccount.tokens]
    if (tokens.length > 0) {
      let provider = new ethers.providers.JsonRpcProvider(activeNetwork.rpcProvider);
      let compTokens = tokens.map(async (token, idx) => {
        try {
          const bscscanApiKey = 'Q7QXTMXCWNJ7HK742I6WG77VUNEIRH12UA';
          const params = new URLSearchParams('apiKey=' + bscscanApiKey);
          params.append('module', 'contract')
          params.append('action', 'getabi')
          params.append('address', token.contractAddress);
          let fetchData = await fetch(`https://api.bscscan.com/api?${params}`);
          let response = await fetchData.json();
          if (response.status === '1') {
            const abi = JSON.parse(response.result)
            let erc20 = new ethers.Contract(token.contractAddress, abi, provider)
            let balance = await erc20.balanceOf(activeAccount.address);
            return { index: idx, token, erc20, balance: balance || 0.01 };
          } else throw new Error(response.result)
        } catch (error) {
          alert(`Error occurred, could not load token: ${error.message}`)
          return null;
        }
      })
      setTokens(compTokens);
    }
  }, [activeAccount, activeNetwork])

  return (<React.Fragment>
    <div className="d-flex align-items-center justify-content-between">
      <div style={{ width: '65%' }} className="d-flex align-items-center justify-content-between">
        <p className="m-0" style={{ fontSize: 10 }}>{isOnline ? 'Connected' : 'Not connected'}</p>
        <div style={{ backgroundColor: clipboard.copied ? '#e3e3e3' : null }} onClick={() => clipboard.copy(activeAccount.address)} className="p-2 text-center">
          <h5 className="m-0">{activeAccount.name}</h5>
          <small>{clipboard.copied ? 'Copied' : `${activeAccount.address.substring(0, 10)}...`}<ion-icon name="copy-outline"></ion-icon></small>
        </div>
      </div>

      <Dropdown toggle={<ion-icon name="ellipsis-vertical" />}>
        <ReactDropdown.Item onClick={() => window.open(`${activeNetwork.scanner}address/${activeAccount.address}`, '_blank')}>
          <h6 className="d-flex align-items-center  gap-2">
            <ion-icon name="arrow-redo-outline"></ion-icon>
            View Account on {activeNetwork.name}
          </h6>
        </ReactDropdown.Item>
        <ReactDropdown.Item onClick={() => toggleViewAccount(true)}>
          <h6 className="d-flex align-items-center  gap-2">
            <ion-icon name="grid-outline"></ion-icon>
            Account Details
          </h6>
        </ReactDropdown.Item>
        <ReactDropdown.Item onClick={() => appState.removeAccount(activeAccount)}>
          <h6 className="d-flex align-items-center  gap-2">
            <ion-icon name="trash-outline"></ion-icon>
            Remove Account
          </h6>
        </ReactDropdown.Item>
      </Dropdown>
    </div>
    <hr />

    <section className="d-flex flex-column align-items-center">
      <div className="p-2 rounded-pill" style={{ border: '1px solid #e3e3e3' }}>
        <img src="favicon.png" width="25px" alt="coin logo" />
      </div>
      <h1>{accountBalance} {activeNetwork.symbol || 'ETH'}</h1>
      <h6>${usdBalance} USD</h6>

      <div className="mt-3 mb-5 d-flex flex-row align-items-center justify-content-between gap-4">
        {/* buy button */}
        <div className="d-flex flex-column align-items-center">
          <span className="p-2 bg-primary text-white text-center" style={{ borderRadius: '70%', height: '40px', width: '40px', fontSize: 18 }}>
            <ion-icon name="arrow-down-outline"></ion-icon>
          </span>
          <p className="text-primary">Buy</p>
        </div>
        {/* send button */}
        <div className="d-flex flex-column align-items-center">
          <span className="p-2 bg-primary text-white text-center" style={{ borderRadius: '70%', height: '40px', width: '40px', fontSize: 18 }}>
            <ion-icon name="arrow-up-outline"></ion-icon>
          </span>
          <p className="text-primary">Send</p>
        </div>
        {/* swap button */}
        <div className="d-flex flex-column align-items-center">
          <span className="p-2 bg-primary text-white text-center" style={{ borderRadius: '70%', height: '40px', width: '40px', fontSize: 18 }}>
            <ion-icon name="swap-horizontal-outline"></ion-icon>
          </span>
          <p className="text-primary">Swap</p>
        </div>
      </div>

    </section>

    <Tab.Container activeKey={key} onSelect={(k) => setKey(k)} className="mb-3">
      <div className="shadow-sm d-flex align-items-center justify-content-evenly" style={{ borderBottom: '1px solid #e3e3e3' }}>
        <NavLink eventKey="assets" style={{ borderBottom: key === 'assets' && '2px solid blue' }}>Assets</NavLink>
        <NavLink eventKey="activity" style={{ borderBottom: key === 'activity' && '2px solid blue' }}>Activity</NavLink>
      </div>
      <Tab.Content className="pt-3">
        <Tab.Pane eventKey="assets">
          <div className="d-flex align-items-center justify-content-between" style={{ padding: '5px 5px' }}>
            <div className="d-flex align-items-center gap-3">
              <Avatar value={activeNetwork.symbol} size="40px" className="rounded-pill" />
              <div className="d-block">
                <h6 className="m-0">{accountBalance} {activeNetwork.symbol}</h6>
                <p className="m-0">${usdBalance} USD</p>
              </div>
            </div>
            <ion-icon name="chevron-forward-outline"></ion-icon>
          </div>
          <hr className="m-1" />
          {tokens.map((item, idx) => item.index ? <React.Fragment key={idx}>
            <div className="d-flex align-items-center justify-content-between" style={{ padding: '10px 5px' }}>
              <div className="d-flex align-items-center gap-3">
                <Avatar value={item?.token?.symbol} size="40px" className="rounded-pill" />
                <div className="d-block">
                  <h6 className="m-0">{item?.balance} {item?.token?.symbol}</h6>
                </div>
              </div>
              <ion-icon name="chevron-forward-outline"></ion-icon>
            </div>
            <hr className="m-1" />
          </React.Fragment> : null)}
          <div className="pt-3 text-center">
            <p className="m-0">Don't see your token?</p>
            <p className="m-0"><strong className="text-primary" onClick={() => window.location.reload()}>Refresh List</strong> or <strong className="text-primary" onClick={() => toggleNewToken(true)}>import token</strong></p>
          </div>
        </Tab.Pane>
        <Tab.Pane eventKey="activity">
          <p className="text-center text-muted">You have no transactions</p>
        </Tab.Pane>
      </Tab.Content>
    </Tab.Container>
    {viewAccount && <AccountDetails state={appState} onHide={() => toggleViewAccount(false)} />}
    {newToken && <ImportToken state={appState} onHide={() => toggleNewToken(false)} />}
  </React.Fragment>)
}