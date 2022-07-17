import React from "react";
import { NavLink } from "react-router-dom";
import Alert from "../components/Alert";

export default function Login({ value: {user, login} }) {

  const [passKey, setPassKey] = React.useState('');
  const [alert, setAlert] = React.useState(null);

  function processSubmit() {
    if(user?.accounts.length > 0 && user.passKey) {
      if(passKey.length > 3) {
        if(user.passKey.value === passKey) {
          login()
        } else setAlert({ variant:'danger', message:'Incorrect PassKey' })
      } else setAlert({ variant:'danger', message:'Length must be > 3' })
    }else {
      window.localStorage.removeItem('app')
      window.location.reload();
    }
  }

  return(<div style={{height:"632px", paddingTop:"50px"}} className="d-flex flex-column align-items-center justify-content-betwenn">
    <div style={{width:'100%'}} className="text-center">
      <h1 style={{fontWeight:"900", color: '#444', textAlign:'center'}}>Welcome Back!</h1>
      <p>The decentralized web awaits</p>
    </div>

    {/* form */}
    <div className="text-left" style={{width:'100%',padding:'20px',marginTop:'50px'}}>
      { alert && <Alert onClick={() => setAlert(null)} variant={alert.variant}>{alert.message}</Alert>}
      <div className="form-group">
        <p className="m-0">PassKey</p>
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

        <button disabled={!(passKey.length > 3)} style={{width:'100%'}} className="mt-2 btn btn-primary" onClick={processSubmit}>Unlock</button>
      </div>
    </div>

    <NavLink to="/">Forgot Password?</NavLink>
  </div>)
}