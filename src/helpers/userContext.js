import React, { useReducer } from "react";
import ethersHelper from "./ethers.helper";

export const userContext = React.createContext();
export default function UserState({ children }) {
  const initialState = JSON.parse(window.localStorage.getItem('app'));

  const [state, dispatch] = useReducer(appReducer, initialState);

  const actions = {
    login: (payload) => dispatch({ type: 'LOGIN', payload }),
    register: (payload) => dispatch({ type: 'USER+', payload }),
    logout: (payload) => dispatch({ type: 'LOGOUT', payload }),
    createAccount: (payload) => dispatch({ type: 'CREATE', payload }),
    renameAccount: (payload) => dispatch({ type: 'RENAME', payload }),
    importAccount: (payload) => dispatch({ type: 'IMPORT+', payload }),
    removeAccount: (payload) => dispatch({ type: 'REMOVE_ACCOUNT-', payload }),
    switchAccounts: (payload) => dispatch({ type: 'ACCOUNT+-', payload }),
    switchNetworks: (payload) => dispatch({ type: 'SWITCH', payload }),
    importToken: (payload) => dispatch({ type: 'IMPORT-TOKEN', payload })
  }

  return (<userContext.Provider
    value={{ state, ...actions }}>{children}</userContext.Provider>)
}

function appReducer(state, action) {
  let storedPrefs = JSON.parse(window.localStorage.getItem('app'));
  switch (action.type) {
    case 'USER+':
      if (storedPrefs?.user) {
        storedPrefs.user.passKey = action.payload.passkey
        if (storedPrefs.user.accounts.length === 0) {
          storedPrefs.user.accounts[0] = action.payload.account;
          storedPrefs.user.accounts[0].selected = true;
        }
        storedPrefs.user.loggedIn = true;
        window.localStorage.setItem('app', JSON.stringify(storedPrefs));
        return { ...state, ...storedPrefs }
      }
      return state
    case 'LOGIN':
      if (storedPrefs?.user) {
        storedPrefs.user.loggedIn = true;
        window.localStorage.setItem('app', JSON.stringify(storedPrefs));
        return { ...state, ...storedPrefs }
      }
      return state;
    case 'LOGOUT':
      if (storedPrefs?.user) {
        storedPrefs.user.loggedIn = false;
        window.localStorage.setItem('app', JSON.stringify(storedPrefs));
        return { ...state, ...storedPrefs }
      }
      return state;
    case 'CREATE':
      if (storedPrefs.user?.accounts) {
        ethersHelper.createAccount(state).then(account => {
          storedPrefs.user.accounts[storedPrefs.user.accounts.length] = account;
          window.localStorage.setItem('app', JSON.stringify(storedPrefs));
          return { ...state, ...storedPrefs }
        })
      }
      return state;
    case 'RENAME':
      if (storedPrefs.user?.accounts) {
        let accounts = [...storedPrefs.user.accounts];
        let account = accounts.find(x => x.name === action.payload.account.name);
        if (account) {
          let index = accounts.map(x => x.name).indexOf(action.payload.account.name);
          account.name = action.payload.rename;
          accounts[index] = account;
          storedPrefs.user.accounts = accounts;
          window.localStorage.setItem('app', JSON.stringify(storedPrefs));
          return { ...state, ...storedPrefs };
        }
      }
      return state;
    case 'ACCOUNT+-':
      if (storedPrefs.user?.accounts) {
        let accounts = storedPrefs.user.accounts.map(x => ({ ...x, selected: false }));
        let index = accounts.map(x => x.name).indexOf(action.payload.name);
        if (index >= 0) {
          accounts[index] = { ...accounts[index], selected: true };
          storedPrefs.user.accounts = accounts;
          window.localStorage.setItem('app', JSON.stringify(storedPrefs));
          return { ...state, ...storedPrefs };
        }
      }
      return state;
    case 'IMPORT+':
      if (storedPrefs?.user) {
        let accounts = [...storedPrefs.user?.accounts];
        let y = action.payload;
        // eslint-disable-next-line eqeqeq
        if (!accounts.find(x => x.value === y.value)) {
          const { loginType, value, network, address } = action.payload;
          let nextNum = accounts.length + 1;
          accounts.push({ loginType, value, network, address, name: `Account ${nextNum}`, imported: true });
          storedPrefs.user.accounts = accounts;
          window.localStorage.setItem('app', JSON.stringify(storedPrefs));

          return { ...state, ...storedPrefs };
        }
      }
      return state;
    case 'IMPORT-TOKEN':
      let token = action.payload;
      if (storedPrefs?.user && storedPrefs?.networks) {
        let accounts = [...storedPrefs.user.accounts]
        let activeAccount = accounts.find(x => x.selected);
        // networks
        let networks = [...storedPrefs.networks]
        let activeNetwork = networks.find(x => x.selected);
        // token exists in networks
        let tokenExists = activeNetwork.tokens.find(x => String(x.symbol).toLowerCase() === String(action.payload).toLowerCase());
        if (!tokenExists) {
          let tokens = [...activeNetwork.tokens];
          tokens.push(token);
          activeNetwork.tokens = tokens;

          let networkIndex = networks.map(x => x.name).indexOf(activeNetwork.name);
          console.log(networkIndex);
          storedPrefs.networks[networkIndex] = activeNetwork;
        }
        activeAccount.tokens.push(action.payload);
        let accountIndex = accounts.map(x => x.name).indexOf(activeAccount.name);
        storedPrefs.user.accounts[accountIndex] = activeAccount;
        
        window.localStorage.setItem('app', JSON.stringify(storedPrefs));
        return { ...state, ...storedPrefs };
      }
      return state;
    case 'REMOVE_ACCOUNT-':
      if (storedPrefs?.user) {
        let accounts = [...storedPrefs.user?.accounts];
        let y = action.payload;
        // eslint-disable-next-line eqeqeq
        let removed = accounts.filter(x => x.value != y.value);
        removed[removed.length - 1].selected = true;
        storedPrefs.user.accounts = removed;
        window.localStorage.setItem('app', JSON.stringify(storedPrefs));

        return { ...state, ...storedPrefs };
      }
      return state;
    case 'SWITCH':
      if (storedPrefs?.networks) {
        let networks = storedPrefs.networks.map(x => ({ ...x, selected: false }));
        let index = networks.map(x => x.name).indexOf(action.payload.name);
        if (index >= 0) {
          networks[index] = { ...networks[index], selected: true };
          storedPrefs.networks = networks;
          window.localStorage.setItem('app', JSON.stringify(storedPrefs));
          return { ...state, ...storedPrefs };
        }
      }
      return state;
    default:
      return state;
  }
}