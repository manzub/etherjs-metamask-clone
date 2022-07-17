import { ethers } from "ethers";
import React from "react";
import { Button, Modal } from "react-bootstrap";
import { dummyToken } from "../helpers/constants";
import Alert from "./Alert";

export default function ImportToken({ state, onHide }) {
  const appState = state;
  const [value, setValue] = React.useState('');
  const [token, setToken] = React.useState({});
  const [alert, setAlert] = React.useState('Anyone can create a token, including creating fake versions of an existing token');
  const activeNetwork = appState.state.networks.find(x => x.selected);

  React.useEffect(() => {
    if (String(value).length > 30) {
      try {
        let isAddress = ethers.utils.getAddress(value);
        if (isAddress) {
          const tokenExists = activeNetwork.tokens.find(x => x.address === value);
          if (tokenExists) {
            setToken(tokenExists);
          } else {
            setToken(dummyToken.result[0]);
            // proceed bscscan api
            // const bscscanApiKey = 'Q7QXTMXCWNJ7HK742I6WG77VUNEIRH12UA';
            // const params = new URLSearchParams('apiKey=' + bscscanApiKey);
            // params.append('module', 'contract')
            // params.append('action', 'tokeninfo')
            // params.append('contractaddress', value);
            // fetch(`https://api.bscscan.com/api?${params}`).then(async data => {
            //   let response = await data.json();
            //   console.log(response);
            // })
          }
        } else throw new Error('Invalid Token');
      } catch (error) {
        setAlert(error.message);
      }
    }
  }, [value, setAlert, setToken, activeNetwork])

  React.useEffect(() => {
    let tokens = activeNetwork.tokens.map(x => String(x.symbol).toLowerCase())
    if(tokens.find(x => x === String(token.symbol).toLowerCase())) {
      setAlert('Token imported Successfully')
    }
  }, [activeNetwork.tokens, setAlert, token])

  return (<div>
    <Modal show={true} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Import Token</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="form-group">
          <div className="mt-3">
            {alert && <div className="alert alert-warning border-warning">{alert}</div>}
            <div className="form-group mt-3">
              <p>Token Contract Address</p>
              <input value={value} onChange={e => setValue(e.target.value)} className="form-control" />
            </div>
            <div className="form-group mt-3">
              <p>Token Symbol</p>
              <input value={token.symbol || ''} disabled className="form-control" />
            </div>
            <div className="form-group mt-3">
              <p>Token Decimal</p>
              <input value={token.divisor || ''} disabled className="form-control" />
            </div>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button disabled={!token.symbol} onClick={() => token && appState.importToken(token)} className="rounded-pill" style={{ width: '100%' }} variant="primary">Add Custom Token</Button>
      </Modal.Footer>
    </Modal>
  </div>)
}