import React from "react";
import { NavLink, Tab } from "react-bootstrap";
import Dropdown from "../components/Dropdown";

export default function Home() {
  const [key, setKey] = React.useState('assets');


  return (<React.Fragment>
    <div className="d-flex align-items-center justify-content-between">
      <div style={{width:'65%'}} className="d-flex align-items-center justify-content-between">
        <p className="m-0" style={{ fontSize: 10 }}>Connected</p>
        <div className="text-center">
          <h5 className="m-0">Account 4</h5>
          <small>05ee..3433dx<ion-icon name="copy-outline"></ion-icon></small>
        </div>
      </div>

      <Dropdown 
      toggle={<ion-icon name="ellipsis-vertical" />} 
      items={[
        {value:'Account Details', onClick: () => console.log('sdsdsds')},
        {value:'Remove Account', onClick: () => console.log('23232')},
      ]} />
    </div>
    <hr />

    <section className="d-flex flex-column align-items-center">
      <div className="p-2 rounded-pill" style={{ border: '1px solid #e3e3e3' }}>
        <img src="/favicon.png" width="25px" />
      </div>
      <h1>0 ETH</h1>
      <h6>$0.00 USD</h6>

      <div className="mt-3 mb-5 d-flex flex-row align-items-center justify-content-between gap-4">
        <button>Buy</button>
        <button>Send</button>
        <button>Swap</button>
      </div>

    </section>

    <Tab.Container activeKey={key} onSelect={(k) => setKey(k)} className="mb-3">
      <div className="shadow-sm d-flex align-items-center justify-content-evenly" style={{borderBottom:'1px solid #e3e3e3'}}>
        <NavLink eventKey="assets" style={{borderBottom:'2px solid blue'}}>Assets</NavLink>
        <NavLink eventKey="activity">Activity</NavLink>
      </div>
      <Tab.Content className="pt-3">
        <Tab.Pane eventKey="assets">
          <div className="d-flex align-items-center justify-content-between" style={{padding:'10px 5px'}}>
            <div className="d-flex align-items-center gap-3">
              <img src="/favicon.png" width="25px" />
              <div className="d-block">
                <h6 className="m-0">0 ETH</h6>
                <p className="m-0">$0.00 USD</p>
              </div>
            </div>
            <ion-icon name="chevron-forward-outline"></ion-icon>
          </div>
          <hr />
          <div className="pt-3 text-center">
            <p className="m-0">Don't see your token?</p>
            <p className="m-0"><a>Refresh List</a> or <a>import token</a></p>
          </div>
        </Tab.Pane>
        <Tab.Pane eventKey="activity">
          <p className="text-center text-muted">You have no transactions</p>
        </Tab.Pane>
      </Tab.Content>
    </Tab.Container>
  </React.Fragment>)
}