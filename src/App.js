import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import { userContext } from "./context/userContext";
import Login from "./pages/Login";
import Avatar from "react-avatar";
import Dropdown from "./components/Dropdown";

function App() {
  const { user, login } = React.useContext(userContext);

  return (<div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100vh', overflow: 'hidden' }}>
    <section className="body">
      {/* navbar */}
      <div className="d-flex align-items-center justify-content-between" style={{ backgroundColor: '#f2f4f6', padding: '1rem' }}>
        <img width={30} src="/favicon.png" alt="favicon" />

        <section className="d-flex align-items-center gap-2">
          <Dropdown
            toggle={<div className="p-2 rounded-pill d-flex align-items-center gap-2" style={{ border: "1px solid #444", background: 'none !important' }}>
              <span className="badge bg-success rounded-pill">&nbsp;</span>
              <small>Etheruem Mainnet</small>
              <ion-icon name="chevron-down-outline"></ion-icon>
            </div>}
            items={[
              { value: 'Etheruem Mainnet', onClick: () => console.log('etheruem')},
              { value: 'BSC Mainnet', onClick: () => console.log('bsc')}
            ]} />

          {/* user actions */}
          <Dropdown
            toggle={<div className="d-flex align-items-center">
              <div className="rounded-pill" style={{ border: "2px solid orange" }}>
                <Avatar color={Avatar.getRandomColor('sitebase', ['red', 'green'])} round={true} size={30} name="user" />
              </div>
            </div>}
            items={[
              { value: 'Import Account', onClick: () => console.log('import')},
              { value: 'Logout', onClick: () => console.log('logout')}
            ]} />
        </section>
      </div>

      {/* body */}
      <div className="container" style={{ margin: '10px 0px' }}>
        {user?.loggedIn ? <Routes>
          <Route exact path="/" element={<Home />} />
        </Routes> : <Login value={{ user, login }} />}
      </div>
    </section>
    {/* footer */}
    <div className="d-flex align-items-center justify-content-center" style={{ bottom: 0 }}>
      <p>Need help? Contact <a href="https://strata.ly" target="_blank" rel="noreferrer">Strata.ly Support</a></p>
    </div>
  </div>);
}

export default App;
