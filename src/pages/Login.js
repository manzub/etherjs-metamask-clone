import React from "react";
import { NavLink } from "react-router-dom";

export default function Login({ value: {user, login} }) {
  const [form, updateForm] = React.useState({ password: '' })

  // TODO: get user from localstorage and get wallets
  const loginUser = () => {
    if(form.password.trim() != '') {
      if(String(user.password) === form.password) {
        login({ loggedIn: true })
      }
    }
  }

  return(<div style={{width:'100%',height:'100%',padding:'50px 10px'}}>
    <img src="/favicon.png" alt="favicon" />
    <h1>Welcome Back</h1>
    <p>The decentralized web awaits</p>
    <div className="form-group">
      <label>Password</label>
      <input value={form.password} onChange={e => updateForm({...form, password: e.target.value})} className="form-control mb-2" />
      <button onClick={loginUser} style={{width:'100%'}} className="btn btn-primary rounded-pill">Unlock</button>
    </div>
    <NavLink to="/forgot">Forgot Password?</NavLink>
  </div>)
}