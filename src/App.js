import React from "react";
import Home from "./pages/Home";
import { userContext } from "./helpers/userContext";
import Login from "./pages/Login";
import Avatar from "react-avatar";
import Dropdown from "./components/Dropdown";
import { Dropdown as ReactDropdown } from "react-bootstrap";
import Register from "./pages/Register";
import Confirm from "./components/Confirm";
import ExtAccount from "./components/ImportAccount";

function App() {
  const [confirm, setConfirm] = React.useState(null);
  const [importModal, showImportModal] = React.useState(false);
  const appState = React.useContext(userContext);
  const { user, networks } = appState.state;
  const activeNetwork = networks.find(x => x.selected);

  return (<div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '650px', overflowY:'scroll' }}>
    <section className="body">
      {/* header */}
      <div className="d-flex align-items-center justify-content-between" style={{ backgroundColor: '#f2f4f6', padding: '1rem' }}>
        <img width={30} src="favicon.png" alt="favicon" />

        <section className="d-flex align-items-center gap-2">
          <Dropdown toggle={<React.Fragment>
            <div className="p-2 rounded-pill d-flex align-items-center gap-2" style={{ border: "1px solid #444", background: 'none !important' }}>
              <span className="badge bg-success rounded-pill">&nbsp;</span>
              <small>{activeNetwork.name}</small>
              <ion-icon name="chevron-down-outline"></ion-icon>
            </div>
          </React.Fragment>}>
            {networks.map((x, idx) => (<React.Fragment key={idx}>
              <ReactDropdown.Item onClick={() => appState.switchNetworks(x)} active={!!x?.selected}>{x.name}</ReactDropdown.Item>
            </React.Fragment>))}
          </Dropdown>
          
          { user?.loggedIn && <React.Fragment>
            <Dropdown toggle={<React.Fragment>
              <div className="d-flex align-items-center">
                <div className="rounded-pill" style={{ border: "2px solid orange" }}>
                  <Avatar color={Avatar.getRandomColor('sitebase', ['red', 'green'])} round={true} size={30} name="user" />
                </div>
              </div>
            </React.Fragment>}>
              <div className="p-2" style={{backgroundColor:'#e3e3e3',width:'200px'}}>
                {user.accounts.map((x, idx) => (<React.Fragment key={idx}>
                  <div onClick={() => {
                    if(user.accounts.length > 1) {
                      appState.switchAccounts(x)
                    }
                  }} className="rounded bg-white p-2" style={{border:'1px solid #e3e3e3'}}>
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="rounded-pill" style={{ border: "2px solid wheat" }}>
                        <Avatar color={Avatar.getRandomColor('sitebase', [])} round={true} size={30} name={x.name} />
                      </div>

                      <div className="d-flex align-items-center gap-2">
                        <h6 className="m-0" style={{color: x.selected ? 'teal' : null}}>{x.name}</h6>
                        { (user.accounts.length > 1 && !x.selected) && <ion-icon name="shuffle-outline"></ion-icon>}
                        { x.imported && <ion-icon name="download-outline"></ion-icon>}
                      </div>
                    </div>
                  </div>
                </React.Fragment>))}
              </div>
              <hr/>
              <ReactDropdown.Item onClick={() => {
                setConfirm({ message: `Create account: Account ${user.accounts.length + 1}`, onClick: () => {
                  appState.createAccount()
                  setTimeout(() => {
                    window.location.reload();
                  }, 2000);
                } })
              }}>
                <h6 className="d-flex align-items-center  gap-2">
                  <ion-icon name="add-outline"></ion-icon>
                  Create Account
                </h6>
              </ReactDropdown.Item>
              <ReactDropdown.Item onClick={() => showImportModal(true)}>
                <h6 className="d-flex align-items-center  gap-2">
                  <ion-icon name="download-outline"></ion-icon>
                  Import Account
                </h6>
              </ReactDropdown.Item>
              <ReactDropdown.Item onClick={() => {
                setConfirm({ message: 'Are you sure?', onClick: () => appState.logout() })
              }}>
                <h6 className="d-flex align-items-center  gap-2">
                  <ion-icon name="log-out-outline"></ion-icon>
                  Logout
                </h6>
              </ReactDropdown.Item>
            </Dropdown>
          </React.Fragment>}
        </section>
      </div>

      {/* body */}
      <div className="container" style={{ margin: '10px 0px' }}>
        {user.loggedIn ? <React.Fragment>
          <Home value={appState} />
        </React.Fragment> : <React.Fragment>
          {user.passKey ? 
            <Login value={{ user, login: appState.login }} /> : 
            <Register 
            value={{ 
            state: { user, networks }, 
            register: appState.register }} />
          }
        </React.Fragment>}
      </div>
    </section>
    {/* footer */}
    <div className="d-flex align-items-center justify-content-center" style={{ bottom: 0 }}>
      <p>Need help? Contact <a href="https://strata.ly" target="_blank" rel="noreferrer">Strata.ly Support</a></p>
    </div>
    { confirm && <Confirm onClick={() => confirm.onClick()} onHide={() => setConfirm(null)}>{confirm.message}</Confirm>}
    { importModal && <ExtAccount state={appState} onHide={() => showImportModal(false)} /> }
  </div>);
}

export default App;
