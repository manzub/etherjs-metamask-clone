import React from "react"
import Alert from "../components/Alert";
import ethersHelper from "../helpers/ethers.helper";

export default function Register({ value: {state, register} }) {
  const { user } = state;
  const [passKey, setPassKey] = React.useState('');
  const [alert, setAlert] = React.useState(null);

  async function processSubmit() {
    if(user?.accounts.length === 0 && !user.passKey) {
      if(passKey.length > 3) {
        let _passKey = { pos: Math.floor((Math.random() * 2) + 1), value:`${passKey}` };
        let newAccount = await ethersHelper.createAccount(state);
        if(newAccount.value) {
          register({account: newAccount, passkey:_passKey})
        } else setAlert({ variant:'danger', message:'Error occurred' })
      } else setAlert({ variant:'danger', message:'Length must be > 3' })
    }else {
      window.localStorage.removeItem('app')
      window.location.reload();
    }
  }

  return(<div style={{height:'632px'}} className="d-flex flex-column align-items-center justify-content-between">
    <div className="p-2" style={{width:'100%'}}>
      <div className="info">
        <h1 style={{fontFamily:'monospace',fontWeight:'800'}}>Welcome,</h1>
        <h5 className="text-muted" style={{fontSize:'15px'}}>Strata.ly Wallet is a simple and secure wallet to manage your rewards and other wallet functions</h5>
      </div>

      {/* form */}
      <div className="mt-2">
        { alert && <Alert onClick={() => setAlert(null)} variant={alert.variant}>{alert.message}</Alert>}
        <div className="form-group mt-5">
          <h6>Let's get you started</h6>
          <p>Create a <code>PassKey</code> To secure your account</p>
          <div className="form-group mt-2">
            <input
            value={passKey}
            onChange={(e) => setPassKey(e.target.value)}
            className="form-control"
            style={{
              width:'100%',
              padding:'5px',
              border:'none',
              borderRadius:'0px',
              textAlign:"center",
              borderBottom: '1px solid #444'
            }} 
            placeholder="Enter passKey" 
            type={"password"} />
          </div>
          <button disabled={!(passKey.length > 3)} onClick={processSubmit} style={{width:'100%'}} className="mt-2 btn btn-primary">Submit</button>
        </div>
      </div>
    </div>
  </div>)
}