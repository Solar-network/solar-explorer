import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useParams,
  BrowserRouter,
  Navigate
} from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Wallets from "./pages/Wallets";
import Tokens from "./pages/Tokens";
import Delegates from "./pages/Delegates";
import WalletView from "./pages/WalletView";
import { TransactionView } from "./pages/TransactionView";
import TokenView from "./pages/TokenView";
import BlockView from "./pages/BlockView";

if (localStorage.theme === 'dark') {
  document.documentElement.classList.add('dark')
}

const rootElement = document.getElementById("root");
ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
      <Route path="/" element={<Navigate replace to="/dsxp/home" />} />
        <Route path="/:blockchain/" element={<App />}>
          <Route path="home" element={<Dashboard />}/>
          <Route path="transactions" element={<Transactions />}/>
          <Route path="transactions/:tx_id" element={<TransactionView />}/>
          <Route path="blocks/:block_id" element={<BlockView />}/>
          
          <Route path="wallets" element={<Wallets />}/>
          <Route path="tokens" element={<Tokens />}/>
          <Route path="tokens/:token_address" element={<TokenView />}/>
          <Route path="delegates" element={<Delegates />}/>
          <Route path="wallet/:wallet_address" element={<WalletView />}/>
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
  rootElement
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
