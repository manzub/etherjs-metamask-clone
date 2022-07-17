import { ethers } from "ethers";
import React from "react";
import { Button, Modal } from "react-bootstrap";
import Alert from "./Alert";

export default function ExtAccount({ state, onHide }) {
  const appState = state;
  const [alert, setAlert] = React.useState(null);
  const [form, updateForm] = React.useState({ type: 1, value: '' });
  const activeNetwork = appState.state.networks.find(x => x.selected);

  function submit() {
    if(form.value !== '' && form.type) {
      if(form.type === 1) {
        try {
          const provider = new ethers.providers.JsonRpcProvider(activeNetwork.rpcProvider);
          let wallet = new ethers.Wallet(form.value, provider);
          let account = { loginType: 'privateKey', value: wallet.privateKey, address: wallet.address, network: activeNetwork.name };
          appState.importAccount(account);
          appState.switchAccounts(account);
          setAlert({ variant: 'success', message: 'Account Imported' })
          updateForm({ type: 1, value: '' });
          setTimeout(() => {
            onHide();
          }, 2000);
        } catch (error) {
          setAlert({ variant: 'danger', message: error.message})
        }
      }
    }
  }

  return(<div>
    <Modal show={true} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Import Account</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="form-group">
          { alert && <Alert onClick={() => setAlert(null)} variant={alert.variant}>{alert.message}</Alert>}
          <p style={{fontWeight:'500',fontSize:15}}>Imported Accounts will not be associated with your originally created account secret key.</p>
          <hr/>
          <div className="d-flex align-items-center justify-content-between">
            <h6 className="text-muted">Select Type</h6>
            <div className="form-group">
              <select value={1} onChange={(e) => updateForm({ ...form, type: e.target.value })} className="form-control">
                <option value={1}>Private Key</option>
                <option value={2} disabled>JSON File</option>
              </select>
            </div>
          </div>

          <div className="mt-4">
            <h6 className="text-muted">Enter your {form.type === 1 ? 'Private Key' : 'JSON File'} string here:</h6>
            <div className="form-group">
              <input onChange={(e) => updateForm({ ...form, value: e.target.value })} className="form-control p-2" />
            </div>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Cancel</Button>
        <Button onClick={submit} disabled={(!form.type || form.value === '')} variant="primary">Submit</Button>
      </Modal.Footer>
    </Modal>
  </div>)
}