import React, { useReducer } from "react";

export const userContext = React.createContext();

export default function UserState({ children }) {
  const initialState = JSON.parse(window.localStorage.getItem('user'));

  const [state, dispatch] = useReducer(userReducer,  initialState);

  const login = (payload) => {
    dispatch({ type: 'USER+', payload })
  }

  const addWallet = (payload) => {
    dispatch({ type: 'WALLET+', payload })
  }

  return(<userContext.Provider value={{user: state, login, addWallet}}>
    {children}
  </userContext.Provider>)
}

function userReducer(state, action) {
  switch(action.type) {
    case 'USER+':
      window.localStorage.setItem('user', JSON.stringify({...state, ...action.payload}))
      return {...state, ...action.payload};
    case 'WALLET+':
      let user = state;
      user.wallets = [...user.wallets, ...action.payload];
      window.localStorage.setItem('user', JSON.stringify(user))
      return user;
    default:
      return state;
  }
}