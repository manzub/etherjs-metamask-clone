import { QRCodeSVG } from "qrcode.react";
import React from "react";
import { Button, Modal } from "react-bootstrap";
import { useClipboard } from "use-clipboard-copy";
import Alert from "./Alert";

export default function AccountDetails({ state, onHide }) {
  const clipboard = useClipboard({ copiedTimeout: 600 })
  const renameDif = React.useRef(null);
  const appState = state;

  const [editing, setEditing] = React.useState(false);
  const [show, setShow] = React.useState(false);
  const [showPrivate, setShowPrivate] = React.useState(false);

  const [alert, setAlert] = React.useState(null);
  const [newname, setAccountName] = React.useState('');
  const [passKey, setPassKey] = React.useState('');

  const activeAccount = appState.state.user.accounts.find(x => x.selected);
  const activeNetwork = appState.state.networks.find(x => x.selected);

  const complete = () => {
    setEditing(false);
    appState.renameAccount({ account: activeAccount, rename: newname })
    setAlert({ variant: 'success', message: 'Account Renamed' })
  }

  function showPrivateKey() {
    if (passKey.length > 3) {
      let user = appState.state.user;
      if (user.passKey.value === passKey) {
        setShowPrivate(true);
      }
    }
  }

  React.useEffect(() => {
    if (editing) {
      renameDif.current.focus();
    }
  }, [editing])

  return (<div>
    <Modal show={true} onHide={onHide}>
      <Modal.Body>
        <div className="d-flex align-items-center justify-content-between">
          <div onClick={() => setEditing(true)} className="d-flex align-items-center gap-2" style={{ fontSize: 20, fontWeight: '600' }}>
            <div onInput={(e) => setAccountName(e.currentTarget.textContent)} contentEditable={editing} ref={renameDif} className="m-0">{activeAccount.name}</div>
            {!editing ? <ion-icon name="create-outline"></ion-icon> : <div className="btn btn-primary p-0" onClick={complete}>
              <ion-icon name="checkmark-outline"></ion-icon>
            </div>}
          </div>
          <span onClick={onHide} style={{ fontSize: 30, fontWeight: '800' }}>&times;</span>
        </div>
        <hr />
        {alert && <Alert onClick={() => setAlert(null)} variant={alert.variant}>{alert.message}</Alert>}
        {show ? <React.Fragment>
          <div className="d-flex align-items-center justify-content-between">
            <span onClick={() => setShow(false)} className="d-flex align-items-center gap-1" style={{ fontWeight: '600' }}><ion-icon name="chevron-back-outline"></ion-icon>Back</span>
            <h6 className="m-0">Show Private Keys</h6>
            <div>&nbsp;</div>
          </div>
          <div className="form-group mt-5">
            {showPrivate ? <React.Fragment>
              <p>This is your private key ({clipboard.copied ? 'copied' : 'click to copy'})</p>
              <div onClick={clipboard.copy(activeAccount.value)} className="p-2" style={{ border: '1px solid #e3e3e3' }}>
                <p style={{ wordWrap: "break-word", color: 'red' }}>{activeAccount.value}</p>
              </div>
            </React.Fragment> : <React.Fragment>
              <p>Type your wallet <code>passKey</code></p>
              <input value={passKey} onChange={(e) => setPassKey(e.target.value)} type={"password"} className="form-control" />
            </React.Fragment>}
            <div className="mt-2 p-2 alert alert-danger">
              Warning: Never disclose your privateKey, anyone with this key can steal any assets held in your account
            </div>
            {showPrivate ? <React.Fragment>
              <Button onClick={() => {
                  setPassKey('');
                  setShow(false);
                  onHide();
                }} style={{width:"100%"}} size="lg" variant="primary">Done</Button>
            </React.Fragment> : <React.Fragment>
              <div className="d-flex align-items-center justify-content-evenly">
                <Button onClick={() => {
                  setPassKey('');
                  setShow(false)
                }} variant="outline-secondary" size="lg">Cancel</Button>
                <Button onClick={showPrivateKey} disabled={passKey == null || passKey.length < 3} variant="outline-primary" size="lg">Confirm</Button>
              </div>
            </React.Fragment>}
          </div>
        </React.Fragment> : <React.Fragment>
          <div style={{ width: '100%' }} className="d-flex flex-column align-items-center justify-content-between">
            <QRCodeSVG value={activeAccount.address} />
            <div className="p-3 d-flex align-items-center justify-content-evenly">
              <div style={{ width: '80%', backgroundColor: '#e3e3e3' }} className="text-center p-2">
                <p style={{ wordWrap: 'break-word', fontSize: 12, margin: 0, fontWeight: '500' }}>{activeAccount.address}</p>
              </div>
              <span onClick={() => clipboard.copy(activeAccount.address)}>{clipboard.copied ? 'copied' : <ion-icon name="copy-outline"></ion-icon>}</span>
            </div>
          </div>
          <hr />
          <Button onClick={() => window.open(`${activeNetwork.scanner}address/${activeAccount.address}`, '_blank')} variant="outline-primary" size="lg" style={{ width: '100%' }}>View on {activeNetwork.name}</Button>
          <div className="m-3" />
          <Button onClick={() => setShow(true)} variant="outline-primary" size="lg" style={{ width: '100%' }}>Export Private Key</Button>
        </React.Fragment>}
      </Modal.Body>
    </Modal>
  </div>);
}